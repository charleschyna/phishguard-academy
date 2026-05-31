import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Flag,
  Globe,
  XCircle,
} from "lucide-react";
import type { Choice, Scenario } from "@/lib/scenarios";

export function FeedbackOverlay({
  scenario,
  chosen,
  delta,
  onNext,
  isLast,
  patternNote,
}: {
  scenario: Scenario;
  chosen: Choice | null;
  delta: number;
  onNext: () => void;
  isLast: boolean;
  patternNote?: string;
}) {
  const correct = !!chosen?.correct;
  const timedOut = chosen === null;
  const correctChoice = scenario.choices.find((c) => c.correct);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.92, y: 18 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className={`relative w-full max-w-xl rounded-2xl border bg-cardx shadow-glow flex flex-col max-h-[90vh] overflow-hidden ${
            correct
              ? "border-success/60"
              : "border-destructive/60"
          }`}
        >
          {/* ── Header ── */}
          <div className="flex items-start gap-3 p-6 pb-4 shrink-0">
            {correct ? (
              <CheckCircle2 className="h-8 w-8 text-success shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[11px] uppercase text-muted-foreground">
                {timedOut ? "Time expired" : correct ? "Secure decision" : "Unsafe decision"}
              </div>
              <h3 className="text-xl font-bold mt-0.5">
                {timedOut
                  ? "Clock ran out — that's a real-world fail."
                  : correct
                  ? "Excellent call."
                  : "That was risky."}
              </h3>
            </div>
            <div
              className={`font-mono text-lg font-bold shrink-0 ${
                delta >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {delta} XP
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-6 pb-2 space-y-3">

            {/* Layer 1 — Your choice */}
            {chosen && (
              <Section
                color={correct ? "success" : "destructive"}
                label="Your choice"
              >
                <div className="font-medium text-sm">{chosen.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{chosen.explanation}</p>
              </Section>
            )}

            {/* Correct answer reveal (only when wrong) */}
            {!correct && correctChoice && (
              <Section color="success" label="Correct action">
                <div className="font-medium text-sm text-success">{correctChoice.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{correctChoice.explanation}</p>
              </Section>
            )}

            {/* Layer 2 — Red flags */}
            <Section color="warning" label={<><Flag className="h-3.5 w-3.5" /> Red flags in this scenario</>}>
              <ul className="space-y-1.5">
                {scenario.redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-amber-500/60 bg-amber-500/10 grid place-items-center">
                      <span className="font-mono text-[9px] text-amber-400">{i + 1}</span>
                    </span>
                    {flag}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Layer 3 — Threat intelligence */}
            <Section color="neon" label={<><Globe className="h-3.5 w-3.5" /> Threat intelligence</>}>
              <p className="text-sm text-muted-foreground leading-relaxed">{scenario.realWorldExample}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">MITRE ATT&CK</span>
                <span className="font-mono text-[11px] rounded border border-neon/30 bg-neon/5 px-2 py-0.5 text-neon">
                  {scenario.mitreId}
                </span>
              </div>
              <p className="mt-2 text-sm italic text-muted-foreground border-l-2 border-neon/30 pl-3">
                {scenario.bestPractice}
              </p>
            </Section>

            {/* Layer 4 — Pattern note (only if attacker pattern detected) */}
            {patternNote && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-destructive">Pattern detected — </span>
                  {patternNote}
                </p>
              </div>
            )}
          </div>

          {/* ── CTA ── */}
          <div className="p-6 pt-4 shrink-0">
            <button
              onClick={onNext}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-gradient px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {isLast ? "View Mission Debrief" : "Next Scenario"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

import type { ReactNode } from "react";

const borderColor = {
  success: "border-success/30 bg-success/5",
  destructive: "border-destructive/30 bg-destructive/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  neon: "border-neon/30 bg-neon/5",
};

const labelColor = {
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-amber-400",
  neon: "text-neon",
};

function Section({
  color,
  label,
  children,
}: {
  color: keyof typeof borderColor;
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-lg border p-3 ${borderColor[color]}`}>
      <div className={`flex items-center gap-1.5 font-mono text-[10px] uppercase mb-2 ${labelColor[color]}`}>
        {label}
      </div>
      {children}
    </div>
  );
}
