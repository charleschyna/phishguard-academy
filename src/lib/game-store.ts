import { useEffect, useState, useCallback } from "react";
import type { Scenario } from "./scenarios";

export type Attempt = {
  scenarioId: string;
  choiceId: string;
  correct: boolean;
  timeMs: number;
  timerPct: number; // 0–1: fraction of timer remaining when answered (1 = instant, 0 = timed out)
  pointsDelta: number;
  at: number;
};

export type GameState = {
  username: string;
  role: string;
  xp: number;
  attempts: Attempt[];
  streak: number;
  bestStreak: number;
  startedAt: number | null;
};

// --- Analytics (pure functions, no hooks) ---

export type VulnerabilityProfile = {
  urgency: number;
  authority: number;
  technical: number;
  social: number;
  process: number;
};

export const VECTOR_LABELS: Record<string, string> = {
  urgency: "urgency-based pressure",
  authority: "authority impersonation",
  technical: "technical deception (fake domains & pages)",
  social: "social engineering & baiting",
  process: "procedure bypass tactics",
};

export function getVulnerabilityProfile(
  attempts: Attempt[],
  scenarios: Scenario[],
): VulnerabilityProfile {
  const axes: (keyof VulnerabilityProfile)[] = [
    "urgency",
    "authority",
    "technical",
    "social",
    "process",
  ];
  const result: VulnerabilityProfile = {
    urgency: 50,
    authority: 50,
    technical: 50,
    social: 50,
    process: 50,
  };

  for (const axis of axes) {
    const relevant = attempts.filter(
      (a) => scenarios.find((s) => s.id === a.scenarioId)?.attackVector === axis,
    );
    if (relevant.length > 0) {
      result[axis] = Math.round(
        (relevant.filter((a) => a.correct).length / relevant.length) * 100,
      );
    }
  }
  return result;
}

export type PatternInsight = {
  type: "warning" | "success" | "info";
  message: string;
};

export function getPatternInsights(
  attempts: Attempt[],
  scenarios: Scenario[],
): PatternInsight[] {
  if (attempts.length < 2) return [];
  const insights: PatternInsight[] = [];

  // Repeated failure on same attack vector
  const vectorFailures: Record<string, number> = {};
  for (const a of attempts) {
    if (!a.correct) {
      const s = scenarios.find((x) => x.id === a.scenarioId);
      if (s) vectorFailures[s.attackVector] = (vectorFailures[s.attackVector] ?? 0) + 1;
    }
  }
  for (const [vector, count] of Object.entries(vectorFailures)) {
    if (count >= 2) {
      insights.push({
        type: "warning",
        message: `You fell for ${VECTOR_LABELS[vector] ?? vector} ${count} times this session. Attackers rely on this pattern — recognising it is your strongest counter.`,
      });
    }
  }

  // Panic decisions: wrong answer with <25% timer remaining
  const timerPctSafe = (a: Attempt) => a.timerPct ?? 0.5;
  const panicWrong = attempts.filter((a) => !a.correct && timerPctSafe(a) < 0.25).length;
  if (panicWrong >= 2) {
    insights.push({
      type: "warning",
      message: `${panicWrong} of your wrong answers came under severe time pressure. Attackers engineer urgency deliberately — when the clock is low, that's when to slow down, not speed up.`,
    });
  }

  // Strength: fast correct decisions
  const fastCorrect = attempts.filter((a) => a.correct && timerPctSafe(a) > 0.6).length;
  if (fastCorrect >= 3) {
    insights.push({
      type: "success",
      message: `Strong threat recognition: you identified ${fastCorrect} attacks quickly and correctly. Your decision reflexes are well ahead of the average user.`,
    });
  }

  return insights;
}

// --- State management ---

const KEY = "phishguard:state:v1";

const initial: GameState = {
  username: "",
  role: "",
  xp: 0,
  attempts: [],
  streak: 0,
  bestStreak: 0,
  startedAt: null,
};

function load(): GameState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    // Migrate old attempts that lack timerPct
    const attempts = ((parsed.attempts as Attempt[]) ?? []).map((a) => ({
      ...a,
      timerPct: a.timerPct ?? 0.5,
    }));
    return { ...initial, ...parsed, attempts };
  } catch {
    return initial;
  }
}

let memory: GameState = initial;
let listeners: Array<() => void> = [];

function emit() {
  listeners.forEach((l) => l());
}

function persist(s: GameState) {
  memory = s;
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
  emit();
}

export function useGame() {
  const [state, setState] = useState<GameState>(memory);

  useEffect(() => {
    memory = load();
    setState(memory);
    const l = () => setState({ ...memory });
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  const setUsername = useCallback((username: string) => {
    persist({ ...memory, username });
  }, []);

  const setRole = useCallback((role: string) => {
    persist({ ...memory, role });
  }, []);

  const startSession = useCallback(() => {
    persist({
      ...memory,
      attempts: [],
      xp: 0,
      streak: 0,
      bestStreak: 0,
      startedAt: Date.now(),
    });
  }, []);

  const recordAttempt = useCallback((a: Omit<Attempt, "at">) => {
    const newStreak = a.correct ? memory.streak + 1 : 0;
    const bonus = a.correct && newStreak >= 3 ? 5 : 0;
    const delta = a.pointsDelta + bonus;
    persist({
      ...memory,
      xp: Math.max(0, memory.xp + delta),
      streak: newStreak,
      bestStreak: Math.max(memory.bestStreak, newStreak),
      attempts: [...memory.attempts, { ...a, pointsDelta: delta, at: Date.now() }],
    });
  }, []);

  const reset = useCallback(() => {
    persist({ ...initial, username: memory.username });
  }, []);

  return { state, setUsername, setRole, startSession, recordAttempt, reset };
}
