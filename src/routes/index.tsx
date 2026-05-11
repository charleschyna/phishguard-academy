import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Zap, Trophy, BookOpen, Play, Info } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useGame } from "@/lib/game-store";
import { SCENARIOS } from "@/lib/scenarios";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "PhishGuard — Train your cyber defense reflexes" },
      { name: "description", content: "Spot phishing, social engineering, and online scams in realistic gamified scenarios with instant feedback." },
    ],
  }),
});

function HomePage() {
  const { state, setUsername, startSession } = useGame();
  const [name, setName] = useState(state.username);
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const start = () => {
    setUsername(name.trim());
    startSession();
    navigate({ to: "/play" });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 opacity-30 animate-grid"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.86 0.22 145 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.86 0.22 145 / 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 font-mono text-[11px] uppercase text-neon">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              Serious game · cybersecurity training
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
              Train your instincts.
              <br />
              <span className="bg-neon-gradient bg-clip-text text-transparent">
                Defeat phishing in real time.
              </span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              PhishGuard turns cybersecurity awareness into a game. Read realistic
              scenarios, decide under pressure, and learn from instant gamified feedback —
              built for students, employees, and beginners.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a username (optional)"
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-neon transition"
              />
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon-gradient px-6 py-3 font-semibold text-primary-foreground shadow-neon transition hover:scale-[1.02]"
              >
                <Play className="h-4 w-4" />
                Start Training
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <button
                onClick={() => setShowInstructions((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition"
              >
                <Info className="h-4 w-4" /> Instructions
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition"
              >
                <Trophy className="h-4 w-4" /> View Dashboard
              </Link>
            </div>

            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 rounded-xl border border-border bg-cardx p-5 text-sm"
              >
                <h3 className="font-semibold text-neon mb-2">How to play</h3>
                <ol className="space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>You&apos;ll face {SCENARIOS.length} realistic threat scenarios.</li>
                  <li>Read the message, attachment, or alert carefully.</li>
                  <li>Pick the safest response before the timer runs out.</li>
                  <li>Earn XP, build streaks, and climb security ranks.</li>
                  <li>Review your performance dashboard to spot weaknesses.</li>
                </ol>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: "Realistic scenarios", body: "Phishing emails, vishing calls, fake popups, USB drops, QR scams, and more." },
            { icon: Zap, title: "Instant feedback", body: "Every choice triggers an explanation rooted in cybersecurity best practice." },
            { icon: BookOpen, title: "Track progress", body: "Score, XP, levels, streaks, and analytics show how your defenses improve." },
          ].map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-cardx p-6 shadow-cardx"
            >
              <div className="h-10 w-10 rounded-lg bg-neon/15 grid place-items-center text-neon">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground font-mono uppercase flex justify-between">
          <span>PhishGuard · educational simulation</span>
          <span>Stay vigilant.</span>
        </div>
      </footer>
    </div>
  );
}
