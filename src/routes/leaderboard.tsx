import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useGame } from "@/lib/game-store";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "Leaderboard — PhishGuard" },
      { name: "description", content: "Top cybersecurity defenders ranked by XP, accuracy, and decision speed." },
    ],
  }),
});

// Local-only seeded leaderboard with current user injected
const SEED = [
  { name: "n0va", xp: 180, accuracy: 95 },
  { name: "byteshield", xp: 155, accuracy: 92 },
  { name: "phantom", xp: 140, accuracy: 88 },
  { name: "0xharden", xp: 120, accuracy: 84 },
  { name: "redwall", xp: 95, accuracy: 80 },
  { name: "sentinel", xp: 75, accuracy: 76 },
  { name: "trustno1", xp: 60, accuracy: 70 },
];

function LeaderboardPage() {
  const { state } = useGame();
  const total = state.attempts.length;
  const correct = state.attempts.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const me = { name: state.username || "you", xp: state.xp, accuracy, isMe: true };

  const rows = [...SEED.map((s) => ({ ...s, isMe: false })), me]
    .sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="font-mono text-[11px] uppercase text-muted-foreground">Hall of Defenders</div>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Top operators ranked by XP and decision accuracy.</p>

        <div className="mt-6 rounded-2xl border border-border bg-cardx overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 font-mono text-[10px] uppercase text-muted-foreground border-b border-border">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Operator</div>
            <div className="col-span-3 text-right">XP</div>
            <div className="col-span-2 text-right">Acc</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className={`grid grid-cols-12 items-center px-4 py-3 text-sm border-b border-border last:border-0 ${
                r.isMe ? "bg-neon/10" : ""
              }`}
            >
              <div className="col-span-1 font-mono text-muted-foreground">
                {i === 0 ? <Crown className="h-4 w-4 text-warning" /> : i + 1}
              </div>
              <div className="col-span-6 flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-neon-gradient grid place-items-center font-bold text-primary-foreground text-xs">
                  {r.name.slice(0, 1).toUpperCase()}
                </div>
                <span className={r.isMe ? "text-neon font-semibold" : ""}>
                  {r.name}
                  {r.isMe && <span className="ml-2 font-mono text-[10px] uppercase">you</span>}
                </span>
              </div>
              <div className="col-span-3 text-right font-mono">{r.xp}</div>
              <div className="col-span-2 text-right font-mono">{r.accuracy}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
