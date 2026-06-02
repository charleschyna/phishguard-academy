import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  Flame,
  RotateCcw,
  Star,
  Trophy,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useGame, getVulnerabilityProfile, getPatternInsights } from "@/lib/game-store";
import { SCENARIOS, getLevel } from "@/lib/scenarios";
import { ACHIEVEMENTS, getUnlockedAchievements } from "@/lib/achievements";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Mission Debrief — PhishGuard" },
      { name: "description", content: "See your final cybersecurity awareness score, risk rating, and personalized recommendations." },
    ],
  }),
});

// ── Radar chart helpers ────────────────────────────────────────────────────────

const CX = 130;
const CY = 130;
const R = 95;
const N = 5;

function radarPt(idx: number, value: number) {
  const angle = (idx / N) * Math.PI * 2 - Math.PI / 2;
  const r = (value / 100) * R;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function gridPt(idx: number, pct: number) {
  const angle = (idx / N) * Math.PI * 2 - Math.PI / 2;
  const r = pct * R;
  return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
}

function gridPoly(pct: number) {
  return Array.from({ length: N }, (_, i) => gridPt(i, pct)).join(" ");
}

function labelPos(idx: number) {
  const angle = (idx / N) * Math.PI * 2 - Math.PI / 2;
  const r = R + 22;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function textAnchor(idx: number): "middle" | "end" | "start" {
  const cos = Math.cos((idx / N) * Math.PI * 2 - Math.PI / 2);
  if (Math.abs(cos) < 0.25) return "middle";
  return cos < 0 ? "end" : "start";
}

// ── Component ─────────────────────────────────────────────────────────────────

function ResultsPage() {
  const { state, startSession, reset } = useGame();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [debriefOpen, setDebriefOpen] = useState<string | null>(null);

  const total = state.attempts.length;
  const correct = state.attempts.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const avgTime = total
    ? Math.round(state.attempts.reduce((s, a) => s + a.timeMs, 0) / total / 100) / 10
    : 0;
  const { current } = getLevel(state.xp);

  const risk = accuracy >= 85 ? "Low" : accuracy >= 60 ? "Moderate" : "High";
  const riskColor =
    risk === "Low" ? "text-success" : risk === "Moderate" ? "text-warning" : "text-destructive";

  const weakCats = (() => {
    const map: Record<string, { c: number; t: number }> = {};
    for (const a of state.attempts) {
      const s = SCENARIOS.find((x) => x.id === a.scenarioId);
      if (!s) continue;
      map[s.category] ??= { c: 0, t: 0 };
      map[s.category].t += 1;
      if (a.correct) map[s.category].c += 1;
    }
    return Object.entries(map)
      .map(([k, v]) => ({ cat: k, pct: v.t ? v.c / v.t : 0 }))
      .filter((x) => x.pct < 0.7)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3);
  })();

  // Vulnerability radar
  const profile = getVulnerabilityProfile(state.attempts, SCENARIOS);
  const axisLabels = ["Urgency", "Authority", "Technical", "Social", "Process"];
  const axisValues = [
    profile.urgency,
    profile.authority,
    profile.technical,
    profile.social,
    profile.process,
  ];
  const dataPoints = axisValues.map((v, i) => radarPt(i, v));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Pattern insights
  const insights = getPatternInsights(state.attempts, SCENARIOS);

  // Achievements
  const unlockedIds = new Set(getUnlockedAchievements(state).map((a) => a.id));

  // Wrong attempts for debrief
  const wrongAttempts = state.attempts.filter((a) => !a.correct);

  // Copy report
  const copyReport = () => {
    const lines = [
      "PhishGuard Academy — Training Report",
      "=====================================",
      `Trainee    : ${state.username || "Anonymous"}`,
      `Role       : ${state.role || "Not specified"}`,
      `Date       : ${new Date().toLocaleDateString()}`,
      "",
      "PERFORMANCE",
      `  Scenarios  : ${total}`,
      `  Correct    : ${correct}/${total}`,
      `  Accuracy   : ${accuracy}%`,
      `  Risk Rating: ${risk}`,
      `  Final XP   : ${state.xp}`,
      `  Best Streak: ${state.bestStreak}x`,
      `  Avg Time   : ${avgTime}s`,
      `  Rank       : ${current.name}`,
      "",
      "VULNERABILITY PROFILE",
      `  Urgency Resistance    : ${profile.urgency}%`,
      `  Authority Resistance  : ${profile.authority}%`,
      `  Technical Awareness   : ${profile.technical}%`,
      `  Social Vigilance      : ${profile.social}%`,
      `  Process Discipline    : ${profile.process}%`,
      "",
      weakCats.length > 0
        ? [
            "AREAS FOR IMPROVEMENT",
            ...weakCats.map((w) => `  ${w.cat}: ${Math.round(w.pct * 100)}% accuracy`),
          ].join("\n")
        : "STRENGTHS\n  Excellent performance across all categories.",
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const replay = () => {
    startSession();
    navigate({ to: "/play" });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-neon/40 bg-cardx shadow-glow p-8 text-center"
        >
          <div className="mx-auto h-20 w-20 rounded-full bg-neon-gradient grid place-items-center animate-pulse-ring">
            <Award className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="mt-4 font-mono text-[11px] uppercase text-neon">Mission Debrief</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">
            You identified <span className="text-neon">{correct}</span> of {total} threats correctly.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Final XP: <span className="text-foreground font-semibold">{state.xp}</span> · Rank:{" "}
            <span className="text-foreground font-semibold">{current.name}</span>
          </p>

          <div className="mt-8 grid sm:grid-cols-4 gap-3">
            <Stat label="Accuracy" value={`${accuracy}%`} />
            <Stat label="Risk Level" value={risk} valueClass={riskColor} />
            <Stat label="Best Streak" value={`${state.bestStreak}x`} />
            <Stat label="Avg Time" value={`${avgTime}s`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 rounded-xl bg-neon-gradient px-5 py-3 font-semibold text-primary-foreground shadow-neon"
            >
              <RotateCcw className="h-4 w-4" /> Replay Training
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 hover:bg-secondary"
            >
              <BarChart3 className="h-4 w-4" /> Dashboard
            </Link>
            <button
              onClick={copyReport}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 hover:bg-secondary text-sm"
            >
              <ClipboardCopy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Report"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 hover:bg-secondary text-sm text-muted-foreground"
            >
              Reset progress
            </button>
          </div>
        </motion.div>

        {/* ── Vulnerability radar + pattern insights ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-cardx p-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-neon" />
              <h3 className="font-semibold">Vulnerability Profile</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Resistance score per attack vector (higher = stronger)
            </p>

            <svg viewBox="0 0 260 260" className="w-full max-w-[260px] mx-auto">
              {/* Grid rings */}
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <polygon
                  key={pct}
                  points={gridPoly(pct)}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeWidth={1}
                  className="text-foreground"
                />
              ))}

              {/* Axis lines */}
              {Array.from({ length: N }, (_, i) => {
                const tip = radarPt(i, 100);
                return (
                  <line
                    key={i}
                    x1={CX}
                    y1={CY}
                    x2={tip.x}
                    y2={tip.y}
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    strokeWidth={1}
                    className="text-foreground"
                  />
                );
              })}

              {/* Data polygon */}
              <polygon
                points={dataPolygon}
                fill="oklch(0.86 0.22 145 / 0.18)"
                stroke="oklch(0.86 0.22 145)"
                strokeWidth={2}
                strokeLinejoin="round"
              />

              {/* Data dots */}
              {dataPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill="oklch(0.86 0.22 145)" />
              ))}

              {/* Axis labels */}
              {axisLabels.map((label, i) => {
                const pos = labelPos(i);
                return (
                  <text
                    key={i}
                    x={pos.x}
                    y={pos.y}
                    textAnchor={textAnchor(i)}
                    dominantBaseline="middle"
                    fontSize={9}
                    fill="currentColor"
                    fillOpacity={0.6}
                    className="font-mono uppercase tracking-wider"
                  >
                    {label}
                  </text>
                );
              })}

              {/* Value labels on dots */}
              {dataPoints.map((p, i) => (
                <text
                  key={`v${i}`}
                  x={p.x}
                  y={p.y - 9}
                  textAnchor="middle"
                  fontSize={8}
                  fill="oklch(0.86 0.22 145)"
                  fontWeight="bold"
                >
                  {axisValues[i]}%
                </text>
              ))}
            </svg>
          </motion.div>

          {/* Pattern insights + weak categories */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-cardx p-6 space-y-4"
          >
            <h3 className="font-semibold">Behavioural Analysis</h3>

            {insights.length === 0 && weakCats.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete a training session to see personalised insights.
              </p>
            ) : (
              <>
                {insights.map((ins, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                      ins.type === "warning"
                        ? "border-destructive/30 bg-destructive/5"
                        : ins.type === "success"
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-secondary/30"
                    }`}
                  >
                    {ins.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    )}
                    <p className="text-muted-foreground leading-relaxed">{ins.message}</p>
                  </div>
                ))}

                {weakCats.length > 0 && (
                  <div className="rounded-lg border border-border bg-background/40 p-4">
                    <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2">
                      Focus areas
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                      {weakCats.map((w) => (
                        <li key={w.cat}>
                          <span className="text-foreground font-medium">{w.cat}</span> —{" "}
                          {Math.round(w.pct * 100)}% accuracy
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* ── Achievements ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="rounded-2xl border border-border bg-cardx p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-warning" />
            <h3 className="font-semibold">Achievements</h3>
            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              {unlockedIds.size} / {ACHIEVEMENTS.length} unlocked
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Earned by demonstrating specific skills across training sessions.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = unlockedIds.has(ach.id);
              const RarityIcon =
                ach.rarity === "epic" ? Flame : ach.rarity === "rare" ? Zap : Star;
              const rarityColor =
                ach.rarity === "epic"
                  ? "text-orange-400"
                  : ach.rarity === "rare"
                  ? "text-warning"
                  : "text-muted-foreground";
              return (
                <div
                  key={ach.id}
                  className={`rounded-xl border p-4 transition ${
                    unlocked
                      ? ach.rarity === "epic"
                        ? "border-orange-500/40 bg-orange-500/8"
                        : ach.rarity === "rare"
                        ? "border-warning/40 bg-warning/8"
                        : "border-border bg-secondary/40"
                      : "border-border bg-background/30 opacity-40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <RarityIcon className={`h-4 w-4 ${unlocked ? rarityColor : "text-muted-foreground"}`} />
                    <span className={`font-mono text-[9px] uppercase ${rarityColor}`}>
                      {ach.rarity}
                    </span>
                  </div>
                  <div className={`text-sm font-semibold ${unlocked ? "" : "text-muted-foreground"}`}>
                    {ach.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    {ach.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Structured debrief (wrong answers) ── */}
        {wrongAttempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-cardx p-6"
          >
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-destructive" />
              Decisions to Review
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Step through each unsafe decision — understand what to look for next time.
            </p>

            <div className="space-y-3">
              {wrongAttempts.map((attempt) => {
                const scenario = SCENARIOS.find((s) => s.id === attempt.scenarioId);
                if (!scenario) return null;
                const chosenChoice = scenario.choices.find((c) => c.id === attempt.choiceId);
                const correctChoice = scenario.choices.find((c) => c.correct);
                const isOpen = debriefOpen === attempt.scenarioId;

                return (
                  <div
                    key={attempt.scenarioId}
                    className="rounded-xl border border-border overflow-hidden"
                  >
                    {/* Header row */}
                    <button
                      onClick={() => setDebriefOpen(isOpen ? null : attempt.scenarioId)}
                      className="w-full flex items-center justify-between gap-3 p-4 hover:bg-secondary/40 transition text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <XCircle className="h-5 w-5 text-destructive shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{scenario.title}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">
                            {scenario.category} · {scenario.difficulty} ·{" "}
                            {Math.round(attempt.timeMs / 100) / 10}s
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="border-t border-border p-4 space-y-3 text-sm">
                        {/* What they chose */}
                        {chosenChoice && (
                          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                            <div className="font-mono text-[10px] uppercase text-destructive mb-1">
                              Your choice
                            </div>
                            <div className="font-medium">{chosenChoice.label}</div>
                            <p className="mt-1 text-muted-foreground">{chosenChoice.explanation}</p>
                          </div>
                        )}

                        {/* Correct action */}
                        {correctChoice && (
                          <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                            <div className="font-mono text-[10px] uppercase text-success mb-1">
                              Correct action
                            </div>
                            <div className="font-medium">{correctChoice.label}</div>
                            <p className="mt-1 text-muted-foreground">{correctChoice.explanation}</p>
                          </div>
                        )}

                        {/* Red flags */}
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                          <div className="font-mono text-[10px] uppercase text-amber-400 mb-2">
                            Red flags you should have spotted
                          </div>
                          <ul className="space-y-1.5">
                            {scenario.redFlags.map((flag, i) => (
                              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-amber-500/60 bg-amber-500/10 grid place-items-center font-mono text-[9px] text-amber-400">
                                  {i + 1}
                                </span>
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mental model */}
                        <p className="text-muted-foreground border-l-2 border-neon/40 pl-3 italic">
                          {scenario.bestPractice}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="font-mono text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${valueClass ?? ""}`}>{value}</div>
    </div>
  );
}
