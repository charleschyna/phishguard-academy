import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { ScenarioPreview } from "@/components/ScenarioPreview";
import { CountdownTimer } from "@/components/CountdownTimer";
import { FeedbackOverlay } from "@/components/FeedbackOverlay";
import { SCENARIOS, getLevel, type Choice } from "@/lib/scenarios";
import { useGame } from "@/lib/game-store";
import { ShieldAlert, Flame, Trophy } from "lucide-react";

export const Route = createFileRoute("/play")({
  component: PlayPage,
  head: () => ({
    meta: [
      { title: "Training Session — PhishGuard" },
      { name: "description", content: "Active cybersecurity training session: react to phishing attacks under timer pressure." },
    ],
  }),
});

function PlayPage() {
  const { state, recordAttempt } = useGame();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [delta, setDelta] = useState(0);
  const [startedAt, setStartedAt] = useState(Date.now());
  const navigate = useNavigate();

  const scenario = SCENARIOS[index];
  const total = SCENARIOS.length;
  const { current, next } = getLevel(state.xp);
  const progressToNext = next
    ? Math.min(100, ((state.xp - current.min) / (next.min - current.min)) * 100)
    : 100;

  const submit = useCallback(
    (choice: Choice | null) => {
      if (chosen) return;
      const timeMs = Date.now() - startedAt;
      const points = choice?.correct ? 10 : choice ? -5 : -3;
      setChosen(choice);
      setDelta(points);
      recordAttempt({
        scenarioId: scenario.id,
        choiceId: choice?.id ?? "timeout",
        correct: !!choice?.correct,
        timeMs,
        pointsDelta: points,
      });
    },
    [chosen, recordAttempt, scenario.id, startedAt],
  );

  const next_ = () => {
    if (index + 1 >= total) {
      navigate({ to: "/results" });
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setDelta(0);
    setStartedAt(Date.now());
  };

  const difficultyColor = useMemo(() => {
    return scenario.difficulty === "Easy"
      ? "text-success border-success/40 bg-success/10"
      : scenario.difficulty === "Medium"
      ? "text-warning border-warning/40 bg-warning/10"
      : "text-destructive border-destructive/40 bg-destructive/10";
  }, [scenario.difficulty]);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* HUD */}
        <div className="grid sm:grid-cols-4 gap-3 mb-6">
          <Stat icon={Trophy} label="XP" value={`${state.xp}`} accent />
          <Stat icon={ShieldAlert} label="Rank" value={current.name} />
          <Stat icon={Flame} label="Streak" value={`${state.streak}x`} />
          <div className="rounded-xl border border-border bg-cardx p-3">
            <div className="font-mono text-[10px] uppercase text-muted-foreground">
              Scenario {index + 1} / {total}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-neon-gradient transition-all"
                style={{ width: `${((index) / total) * 100}%` }}
              />
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              Next rank: {next ? `${Math.round(progressToNext)}%` : "MAX"}
            </div>
          </div>
        </div>

        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-5 gap-6"
        >
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-mono text-[10px] uppercase border rounded-full px-2 py-0.5 ${difficultyColor}`}>
                {scenario.difficulty}
              </span>
              <span className="font-mono text-[10px] uppercase text-muted-foreground border border-border rounded-full px-2 py-0.5">
                {scenario.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{scenario.title}</h2>
            <p className="text-muted-foreground">{scenario.description}</p>
            <ScenarioPreview scenario={scenario} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <CountdownTimer
              seconds={scenario.timer}
              paused={!!chosen}
              onExpire={() => submit(null)}
            />

            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase text-muted-foreground">
                Choose the safest action
              </div>
              {scenario.choices.map((c, i) => (
                <motion.button
                  key={c.id}
                  whileHover={{ x: 2 }}
                  disabled={!!chosen}
                  onClick={() => submit(c)}
                  className="w-full text-left rounded-xl border border-border bg-cardx p-4 text-sm transition hover:border-neon disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 shrink-0 rounded-md border border-border grid place-items-center font-mono text-xs text-muted-foreground group-hover:border-neon group-hover:text-neon transition">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span>{c.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {(chosen || delta !== 0) && (
        <FeedbackOverlay
          scenario={scenario}
          chosen={chosen}
          delta={delta}
          isLast={index + 1 >= total}
          onNext={next_}
        />
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-cardx p-3 flex items-center gap-3">
      <div className={`h-9 w-9 rounded-lg grid place-items-center ${accent ? "bg-neon/15 text-neon" : "bg-secondary text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="font-mono text-[10px] uppercase text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
