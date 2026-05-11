import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { useGame } from "@/lib/game-store";
import { SCENARIOS, getLevel } from "@/lib/scenarios";
import { Activity, Award, Target, Timer, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Performance Dashboard — PhishGuard" },
      { name: "description", content: "Track your cybersecurity training progress: scores, accuracy, streaks, and category strengths." },
    ],
  }),
});

function DashboardPage() {
  const { state } = useGame();
  const total = state.attempts.length;
  const correct = state.attempts.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const avgTime = total
    ? Math.round(state.attempts.reduce((s, a) => s + a.timeMs, 0) / total / 100) / 10
    : 0;
  const { current, next } = getLevel(state.xp);

  const byCategory = SCENARIOS.reduce<Record<string, { total: number; correct: number }>>(
    (acc, s) => {
      acc[s.category] = { total: 0, correct: 0 };
      return acc;
    },
    {},
  );
  for (const a of state.attempts) {
    const s = SCENARIOS.find((x) => x.id === a.scenarioId);
    if (!s) continue;
    byCategory[s.category].total += 1;
    if (a.correct) byCategory[s.category].correct += 1;
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase text-muted-foreground">
              Performance Overview
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              Welcome back, <span className="text-neon">{state.username || "Agent"}</span>
            </h1>
          </div>
          <Link
            to="/play"
            className="rounded-xl bg-neon-gradient px-5 py-2.5 font-semibold text-primary-foreground shadow-neon"
          >
            Continue Training
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={Award} label="Total XP" value={`${state.xp}`} sub={current.name} />
          <Card icon={Target} label="Accuracy" value={`${accuracy}%`} sub={`${correct}/${total} correct`} />
          <Card icon={TrendingUp} label="Best Streak" value={`${state.bestStreak}x`} sub="Stay sharp" />
          <Card icon={Timer} label="Avg Decision" value={`${avgTime}s`} sub="per scenario" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-cardx p-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-neon" /> Strengths by Category
            </h3>
            <div className="mt-4 space-y-3">
              {Object.entries(byCategory).map(([cat, v]) => {
                const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm">
                      <span>{cat}</span>
                      <span className="font-mono text-muted-foreground">
                        {v.correct}/{v.total} · {pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          pct >= 75 ? "bg-success" : pct >= 40 ? "bg-warning" : "bg-destructive"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-cardx p-6">
            <h3 className="font-semibold">Recent Decisions</h3>
            <div className="mt-4 space-y-2 max-h-80 overflow-auto pr-1">
              {state.attempts.length === 0 && (
                <div className="text-sm text-muted-foreground">No attempts yet. Start training to populate your history.</div>
              )}
              {[...state.attempts].reverse().map((a, i) => {
                const s = SCENARIOS.find((x) => x.id === a.scenarioId);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{s?.title || a.scenarioId}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {Math.round(a.timeMs / 100) / 10}s · {s?.category}
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs ${
                        a.correct ? "text-success" : "text-destructive"
                      }`}
                    >
                      {a.correct ? "SAFE" : "RISK"} {a.pointsDelta >= 0 ? "+" : ""}
                      {a.pointsDelta}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neon/30 bg-neon/5 p-6">
          <div className="font-mono text-[11px] uppercase text-neon">Rank progression</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{current.name}</span>
            {next && (
              <span className="text-sm text-muted-foreground">
                → {next.name} at {next.min} XP
              </span>
            )}
          </div>
          {next && (
            <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-gradient"
                style={{
                  width: `${Math.min(
                    100,
                    ((state.xp - current.min) / (next.min - current.min)) * 100,
                  )}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-cardx p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-cyber" />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
