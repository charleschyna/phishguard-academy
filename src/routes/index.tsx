import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Briefcase,
  Database,
  Info,
  Layers,
  Play,
  Server,
  Shield,
  Target,
  Terminal,
  Trophy,
  User,
  Wallet,
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
      {
        name: "description",
        content:
          "Spot phishing, social engineering, and online scams in realistic gamified scenarios with instant feedback.",
      },
    ],
  }),
});

// ── Data ──────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "Finance Employee",
    label: "Finance Team",
    icon: Wallet,
    desc: "Invoices · payments · wire transfers",
  },
  {
    id: "IT Administrator",
    label: "IT Admin",
    icon: Server,
    desc: "Credentials · systems · remote access",
  },
  {
    id: "General Employee",
    label: "General Staff",
    icon: User,
    desc: "Email · files · daily workflow",
  },
  {
    id: "Executive",
    label: "Executive",
    icon: Briefcase,
    desc: "High-value target · spear phishing",
  },
] as const;

const FEED = [
  { time: "09:41:22", label: "Phishing Email — Bank Notice", tag: "BLOCKED", ok: true },
  { time: "09:41:18", label: "BEC — Wire Transfer Request", tag: "FLAGGED", ok: false },
  { time: "09:41:15", label: "Vishing — IT Support Call", tag: "BLOCKED", ok: true },
  { time: "09:41:09", label: "Malicious Attachment .docm", tag: "QUARANTINED", ok: false },
  { time: "09:41:03", label: "Credential Phishing — Slack Bot", tag: "BLOCKED", ok: true },
  { time: "09:40:57", label: "Quishing — Parking Meter QR", tag: "DETECTED", ok: true },
  { time: "09:40:51", label: "Fake Login Page — Google SSO", tag: "BLOCKED", ok: true },
  { time: "09:40:44", label: "USB Baiting — Parking Lot", tag: "FLAGGED", ok: false },
  { time: "09:40:39", label: "Malvertising — Browser Update", tag: "BLOCKED", ok: true },
  { time: "09:40:33", label: "Rogue Wi-Fi — Airport AP", tag: "BLOCKED", ok: true },
];

const STATS = [
  { icon: Shield, value: "10", label: "Scenarios" },
  { icon: Target, value: "5", label: "Attack vectors" },
  { icon: Layers, value: "4", label: "Feedback layers" },
  { icon: Database, value: "MITRE", label: "ATT&CK mapped" },
];

// Inline gradient text style — more reliable than bg-clip-text utility
const gradientText: React.CSSProperties = {
  background: "linear-gradient(135deg, oklch(0.86 0.22 145), oklch(0.7 0.18 220))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ── Threat Monitor ────────────────────────────────────────────────────────────

function ThreatMonitor() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neon/25 bg-[#080812] shadow-glow">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d0d1e] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/80" />
        </div>
        <Terminal className="h-3.5 w-3.5 text-neon ml-1" />
        <span className="font-mono text-[11px] text-neon/80">// threat-intercept.live</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
          <span className="font-mono text-[10px] text-neon/50 uppercase">Live</span>
        </div>
      </div>

      {/* status bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="font-mono text-[10px] text-success">
          ● ACTIVE — 0 compromises detected
        </span>
        <span className="font-mono text-[10px] text-white/25">MONITORING</span>
      </div>

      {/* scrolling feed */}
      <div className="relative h-72 overflow-hidden">
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        >
          {[...FEED, ...FEED].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-white/4 px-4 py-2.5"
            >
              <span className="shrink-0 font-mono text-[10px] text-white/25">{item.time}</span>
              <span className="flex-1 truncate font-mono text-[11px] text-white/55">
                {item.label}
              </span>
              <span
                className={`shrink-0 font-mono text-[10px] font-bold ${
                  item.ok ? "text-success" : "text-warning"
                }`}
              >
                {item.tag}
              </span>
            </div>
          ))}
        </motion.div>

        {/* fade edges */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{ background: "linear-gradient(to bottom, #080812, transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{ background: "linear-gradient(to top, #080812, transparent)" }}
        />
      </div>

      {/* bottom stats */}
      <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
        {[
          { label: "All-time", value: "2,847" },
          { label: "Today", value: "341" },
          { label: "Missed", value: "0" },
        ].map((s) => (
          <div key={s.label} className="py-3 text-center">
            <div className="font-mono text-sm font-bold text-neon">{s.value}</div>
            <div className="font-mono text-[9px] uppercase text-white/30">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────

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

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-hero">
        {/* animated grid */}
        <div
          className="absolute inset-0 animate-grid"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.86 0.22 145 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.86 0.22 145 / 0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* glow orbs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-neon/6 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyber/6 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-5 gap-16 items-center">

            {/* LEFT — copy + onboarding */}
            <div className="lg:col-span-3 space-y-8">

              {/* badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/8 px-4 py-1.5 font-mono text-[11px] uppercase text-neon tracking-widest"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                Serious Game &nbsp;·&nbsp; Cybersecurity Training
              </motion.div>

              {/* headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                  Build the reflexes
                  <br />
                  <span style={gradientText}>attackers fear.</span>
                </h1>
              </motion.div>

              {/* stats strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-neon" />
                    <span className="font-bold">{value}</span>
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                Face realistic phishing attacks, make decisions under pressure, and receive
                4-layer feedback grounded in MITRE ATT&CK and learning science — no experience
                needed.
              </motion.p>

              {/* onboarding */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="space-y-5"
              >
                {/* username */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase text-muted-foreground tracking-wider">
                    Your name (optional)
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && start()}
                    placeholder="Enter a callsign..."
                    className="w-full max-w-sm rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon transition"
                  />
                </div>

                {/* role selection */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] uppercase text-muted-foreground tracking-wider">
                    Your role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl">
                    {ROLES.map(({ id, label, icon: Icon, desc }) => {
                      const active = selectedRole === id;
                      return (
                        <motion.button
                          key={id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedRole(active ? "" : id)}
                          className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all ${
                            active
                              ? "border-neon/70 bg-neon/10 shadow-neon"
                              : "border-border bg-card hover:border-neon/30 hover:bg-secondary/50"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-lg grid place-items-center ${
                              active
                                ? "bg-neon/20 text-neon"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div
                              className={`text-xs font-semibold leading-tight ${
                                active ? "text-neon" : "text-foreground"
                              }`}
                            >
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

                {/* CTA row */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={start}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-neon-gradient px-7 py-3.5 font-semibold text-primary-foreground shadow-neon transition"
                  >
                    <Play className="h-4 w-4" />
                    Start Training
                  </motion.button>

                  <button
                    onClick={() => setShowInstructions((s) => !s)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                  >
                    <Info className="h-4 w-4" />
                    How it works
                  </button>

                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                  >
                    <Trophy className="h-4 w-4" />
                    Dashboard
                  </Link>
                </div>

                {/* instructions */}
                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl border border-border bg-cardx p-5 text-sm max-w-xl"
                  >
                    <p className="font-semibold text-neon mb-2">How it works</p>
                    <ol className="space-y-1.5 list-decimal list-inside text-muted-foreground">
                      <li>Choose a role — sets context for your session.</li>
                      <li>
                        Face {SCENARIOS.length} realistic threats in adaptive
                        Easy→Medium→Hard order.
                      </li>
                      <li>Decide before the timer runs out.</li>
                      <li>
                        Every answer unlocks 4-layer feedback: explanation, red flags,
                        real-world threat intel, and a pattern note.
                      </li>
                      <li>
                        Review your vulnerability radar and full decision debrief at the
                        end.
                      </li>
                    </ol>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* RIGHT — threat monitor */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="lg:col-span-2 hidden lg:block"
            >
              <ThreatMonitor />

              {/* mini trust strip below monitor */}
              <div className="mt-4 flex items-center justify-center gap-6 text-center">
                {[
                  { value: "91%", label: "attacks start with phishing" },
                  { value: "3.4B", label: "phishing emails per day" },
                  { value: "$4.9M", label: "avg BEC loss (2023)" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-sm font-bold text-neon">{s.value}</div>
                    <div className="font-mono text-[9px] uppercase text-white/30 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="font-mono text-[11px] uppercase text-neon tracking-widest mb-3">
            What makes it different
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Not a quiz. A simulation.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Evidence-based design grounded in Hattie & Timperley's feedback model, Kolb's
            experiential learning cycle, and real MITRE ATT&CK intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Shield,
              badge: "Simulation fidelity",
              title: "Renders like the real thing",
              body: "Full Gmail-style email client, Slack/SMS thread, browser chrome with address bar, OS-style popups, and USB device scenarios — not cards with text.",
              color: "text-neon",
              bg: "bg-neon/8",
              border: "border-neon/20",
            },
            {
              icon: Layers,
              badge: "4-Layer feedback",
              title: "Every answer teaches",
              body: "Your choice → Red flags in this scenario → Real-world incident reference → MITRE ATT&CK technique ID. Turn on Research Mode to see the cognitive bias being exploited.",
              color: "text-cyber",
              bg: "bg-cyber/8",
              border: "border-cyber/20",
            },
            {
              icon: Target,
              badge: "Behavioural analytics",
              title: "Knows your weak spots",
              body: "5-axis vulnerability radar, panic-decision analysis, and a full structured debrief of every wrong choice — so you understand how you think, not just what you got wrong.",
              color: "text-warning",
              bg: "bg-warning/8",
              border: "border-warning/20",
            },
          ].map(({ icon: Icon, badge, title, body, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border ${border} bg-cardx p-6 shadow-cardx`}
            >
              <div className={`h-11 w-11 rounded-xl ${bg} grid place-items-center ${color} mb-5`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className={`font-mono text-[10px] uppercase tracking-wider ${color} mb-1`}>
                {badge}
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-mono uppercase">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-neon" />
            <span>PhishGuard · Serious Game · Cybersecurity Awareness</span>
          </div>
          <span>Stay vigilant. Stay trained.</span>
        </div>
      </footer>
    </div>
  );
}
