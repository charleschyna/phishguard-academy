import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from "lucide-react";
import type { Choice, Scenario } from "@/lib/scenarios";

export function FeedbackOverlay({
  scenario,
  chosen,
  delta,
  onNext,
  isLast,
}: {
  scenario: Scenario;
  chosen: Choice | null;
  delta: number;
  onNext: () => void;
  isLast: boolean;
}) {
  const correct = !!chosen?.correct;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          className={`relative w-full max-w-lg rounded-2xl border p-6 bg-cardx shadow-glow ${
            correct ? "border-success/60" : "border-destructive/60"
          }`}
        >
          <div className="flex items-start gap-3">
            {correct ? (
              <CheckCircle2 className="h-8 w-8 text-success" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive" />
            )}
            <div className="flex-1">
              <div className="font-mono text-[11px] uppercase text-muted-foreground">
                {correct ? "Secure decision" : "Unsafe decision"}
              </div>
              <h3 className="text-xl font-bold mt-1">
                {correct ? "Excellent choice!" : "Watch out — that was risky."}
              </h3>
            </div>
            <div
              className={`font-mono text-lg font-bold ${
                delta >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {delta} XP
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {chosen && (
              <div className="rounded-lg bg-secondary/50 border border-border p-3 text-sm">
                <div className="font-mono text-[10px] uppercase text-muted-foreground mb-1">
                  Your choice
                </div>
                <div>{chosen.label}</div>
                <p className="mt-2 text-muted-foreground text-sm">{chosen.explanation}</p>
              </div>
            )}

            <div className="rounded-lg bg-neon/5 border border-neon/30 p-3">
              <div className="flex items-center gap-2 text-neon font-mono text-[11px] uppercase">
                <Lightbulb className="h-4 w-4" /> Best Practice
              </div>
              <p className="mt-1 text-sm text-foreground/90">{scenario.bestPractice}</p>
            </div>
          </div>

          <button
            onClick={onNext}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-gradient px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {isLast ? "View Results" : "Next Scenario"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
