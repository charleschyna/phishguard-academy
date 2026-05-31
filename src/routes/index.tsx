import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Info,
  Play,
  Server,
  Shield,
  Trophy,
  User,
  Wallet,
  Zap,
} from "lucide-react";
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

const ROLES = [
  {
    id: "Finance Employee",
    label: "Finance Team",
    icon: Wallet,
    desc: "Invoices, wire transfers, payment requests",
  },
  {
    id: "IT Administrator",
    label: "IT Admin",
    icon: Server,
    desc: "Credentials, systems, remote access",
  },
  {
    id: "General Employee",
    label: "General Staff",
    icon: User,
    desc: "Email, everyday files, daily workflow",
  },
  {
    id: "Executive",
    label: "Executive",
    icon: Briefcase,
    desc: "High-value target, spear phishing, BEC",
  },
] as const;

function HomePage() {
  const { state, setUsername, setRole, startSession } = useGame();
  const [name, setName] = useState(state.username);
  const [selectedRole, setSelectedRole] = useState(state.role || "");
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const start = () => {
    setUsername(name.trim());
    setRole(selectedRole);
    startSession();
    navigate({ to: "/play" });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <section className="relative overflow-hidden bg-hero">
        <div
          className="absolute inset-0 opacity-30 animate-grid"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.86 0.22 145 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.86 0.22 145 / 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

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
              scenarios, decide under pressure, and get layered gamified feedback —
              built on evidence-based learning science.
            </p>

            {/* Username */}
            <div className="mt-8 max-w-xl">
              <label className="block font-mono text-[11px] uppercase text-muted-foreground mb-2">
                Your name (optional)
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a username"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-neon transition"
              />
            </div>

            {/* Role selection */}
            <div className="mt-5 max-w-2xl">
              <label className="block font-mono text-[11px] uppercase text-muted-foreground mb-2">
                Choose your role — scenarios are ordered for your context
              </label>
              <div className="grid sm:grid-cols-4 gap-2">
                {ROLES.map(({ id, label, icon: Icon, desc }) => {
                  const active = selectedRole === id;
                  return (
                    <motion.button
                      key={id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedRole(active ? "" : id)}
                      className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-neon/60 bg-neon/10 shadow-neon"
                          : "border-border bg-cardx hover:border-neon/40"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-lg grid place-items-center ${
                          active ? "bg-neon/20 text-neon" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${active ? "text-neon" : ""}`}>
                          {label}
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                          {desc}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon-gradient px-6 py-3 font-semibold text-primary-foreground shadow-neon transition hover:scale-[1.02]"
              >
                <Play className="h-4 w-4" />
                Start Training
              </button>
              <button
                onClick={() => setShowInstructions((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition text-sm"
              >
                <Info className="h-4 w-4" /> How it works
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition text-sm"
              >
                <Trophy className="h-4 w-4" /> Dashboard
              </Link>
            </div>

            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 rounded-xl border border-border bg-cardx p-5 text-sm"
              >
                <h3 className="font-semibold text-neon mb-2">How to play</h3>
                <ol className="space-y-1.5 list-decimal list-inside text-muted-foreground">
                  <li>Choose a role — it sets context for your session.</li>
                  <li>You&apos;ll face {SCENARIOS.length} realistic threat scenarios in adaptive order.</li>
                  <li>Read the message, attachment, or alert carefully.</li>
                  <li>Pick the safest response before the timer runs out.</li>
                  <li>Every answer unlocks 4-layer feedback: explanation, red flags, threat intel, and a pattern note if you keep falling for the same attack type.</li>
                  <li>Review your vulnerability profile and decision debrief at the end.</li>
                </ol>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: "Simulation fidelity",
              body: "Realistic email clients, SMS threads, browser chrome, popups, and device scenarios — not just text cards.",
            },
            {
              icon: Zap,
              title: "4-layer feedback",
              body: "Every decision surfaces: your explanation, the specific red flags, real-world threat intel, and behavioural pattern detection.",
            },
            {
              icon: BookOpen,
              title: "Behavioural analytics",
              body: "Vulnerability radar, panic-decision analysis, and a full debrief of every unsafe choice — grounded in learning science.",
            },
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
          <span>PhishGuard · serious game · cybersecurity awareness</span>
          <span>Stay vigilant.</span>
        </div>
      </footer>
    </div>
  );
}
