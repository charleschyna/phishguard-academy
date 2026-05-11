import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, RotateCcw, BarChart3 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useGame } from "@/lib/game-store";
import { SCENARIOS, getLevel } from "@/lib/scenarios";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Mission Debrief — PhishGuard" },
      { name: "description", content: "See your final cybersecurity awareness score, risk rating, and personalized recommendations." },
    ],
  }),
});

function ResultsPage() {
  const { state, startSession, reset } = useGame();
  const navigate = useNavigate();

  const total = state.attempts.length;
  const correct = state.attempts.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
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

  const replay = () => {
    startSession();
    navigate({ to: "/play" });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-12">
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

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            <Stat label="Accuracy" value={`${accuracy}%`} />
            <Stat label="Risk Awareness" value={risk} valueClass={riskColor} />
            <Stat label="Best Streak" value={`${state.bestStreak}x`} />
          </div>

          <div className="mt-8 text-left rounded-2xl border border-border bg-background/40 p-5">
            <h3 className="font-semibold mb-2">Personalized recommendations</h3>
            {weakCats.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Strong performance across categories. Keep practicing to maintain your reflexes.
              </p>
            ) : (
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {weakCats.map((w) => (
                  <li key={w.cat}>
                    Review <span className="text-foreground font-medium">{w.cat}</span> scenarios — accuracy {Math.round(w.pct * 100)}%.
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
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
              <BarChart3 className="h-4 w-4" /> View Dashboard
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 hover:bg-secondary text-sm text-muted-foreground"
            >
              Reset progress
            </button>
          </div>
        </motion.div>
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
