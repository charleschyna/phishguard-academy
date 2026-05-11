import { useEffect, useState, useCallback } from "react";

export type Attempt = {
  scenarioId: string;
  choiceId: string;
  correct: boolean;
  timeMs: number;
  pointsDelta: number;
  at: number;
};

export type GameState = {
  username: string;
  xp: number;
  attempts: Attempt[];
  streak: number;
  bestStreak: number;
  startedAt: number | null;
};

const KEY = "phishguard:state:v1";

const initial: GameState = {
  username: "",
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
    return { ...initial, ...JSON.parse(raw) };
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

  const startSession = useCallback(() => {
    persist({ ...memory, attempts: [], xp: 0, streak: 0, bestStreak: 0, startedAt: Date.now() });
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

  return { state, setUsername, startSession, recordAttempt, reset };
}
