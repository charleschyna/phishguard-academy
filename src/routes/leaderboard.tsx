import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudOff,
  Crown,
  HardDrive,
  Loader2,
  Medal,
  Play,
  RefreshCw,
  Shield,
  Timer,
  TrendingUp,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useGame } from "@/lib/game-store";
import {
  loadLeaderboard,
  loadFromCloud,
  isSupabaseConfigured,
  type LeaderboardEntry,
} from "@/lib/leaderboard-store";
import { getLevel } from "@/lib/scenarios";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "Leaderboard — PhishGuard" },
      {
        name: "description",
        content: "Hall of Defenders — ranked by XP, accuracy, and decision speed.",
      },
    ],
  }),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function rankMedal(i: number) {
  if (i === 0) return <Crown className="h-4 w-4 text-yellow-400" />;
  if (i === 1) return <Medal className="h-4 w-4 text-slate-300" />;
  if (i === 2) return <Medal className="h-4 w-4 text-amber-600" />;
  return <span className="font-mono text-sm text-muted-foreground">{i + 1}</span>;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

function LeaderboardPage() {
  const { state } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"cloud" | "local">("local");
  const [error, setError] = useState<string | null>(null);

  const { current } = getLevel(state.xp);

  async function fetchEntries() {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        const cloud = await loadFromCloud();
        setEntries(cloud);
        setSource("cloud");
      } else {
        setEntries(loadLeaderboard());
        setSource("local");
      }
    } catch (err) {
      setError("Could not reach the cloud leaderboard. Showing local sessions.");
      setEntries(loadLeaderboard());
      setSource("local");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const isEmpty = !loading && entries.length === 0;
  const myBest = entries
    .filter((e) => e.username === state.username && state.username !== "")
    .sort((a, b) => b.xp - a.xp)[0];

  const accuracyFor = (e: LeaderboardEntry) =>
    e.accuracy >= 80 ? "text-success" : e.accuracy >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[11px] uppercase text-muted-foreground">
              Hall of Defenders
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">Leaderboard</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Every completed session is ranked by XP, accuracy, and decision speed.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1">
            {/* Cloud status badge */}
            {isSupabaseConfigured ? (
              <div className="flex items-center gap-1.5 rounded-full border border-success/40 bg-success/8 px-3 py-1.5 font-mono text-[10px] uppercase text-success">
                <Cloud className="h-3 w-3" />
                Global · Supabase
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                <HardDrive className="h-3 w-3" />
                Local only
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={fetchEntries}
              disabled={loading}
              className="h-8 w-8 rounded-lg border border-border grid place-items-center text-muted-foreground hover:bg-secondary transition disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Not configured notice */}
        {!isSupabaseConfigured && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3 text-sm">
            <CloudOff className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-400">Local mode — </span>
              <span className="text-muted-foreground">
                Only sessions from this device appear here. Add{" "}
                <code className="font-mono text-[11px] bg-white/8 px-1 rounded">
                  VITE_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="font-mono text-[11px] bg-white/8 px-1 rounded">
                  VITE_SUPABASE_ANON_KEY
                </code>{" "}
                to your <code className="font-mono text-[11px] bg-white/8 px-1 rounded">.env</code>{" "}
                file to enable the global shared leaderboard.
              </span>
            </div>
          </div>
        )}

        {/* Error notice */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-muted-foreground">
            {error}
          </div>
        )}

        {/* Current session strip */}
        {state.xp > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-neon/40 bg-neon/5 p-5"
          >
            <div className="font-mono text-[11px] uppercase text-neon mb-3">
              Your current session
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SessionStat label="XP" value={String(state.xp)} />
              <SessionStat
                label="Accuracy"
                value={`${
                  state.attempts.length
                    ? Math.round(
                        (state.attempts.filter((a) => a.correct).length /
                          state.attempts.length) *
                          100,
                      )
                    : 0
                }%`}
              />
              <SessionStat label="Best Streak" value={`${state.bestStreak}×`} />
              <SessionStat label="Rank" value={current.name} />
            </div>
          </motion.div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">
              {isSupabaseConfigured ? "Loading global leaderboard…" : "Loading…"}
            </span>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-cardx p-12 text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-secondary grid place-items-center mb-4">
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No sessions recorded yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Complete a training session to appear here. Every session is automatically
              saved{isSupabaseConfigured ? " to the global leaderboard" : ""}.
            </p>
            <Link
              to="/play"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neon-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-neon"
            >
              <Play className="h-4 w-4" /> Start Training
            </Link>
          </motion.div>
        )}

        {/* Main table */}
        {!loading && entries.length > 0 && (
          <>
            {/* Top 3 podium */}
            {entries.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-3 gap-3"
              >
                {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
                  if (!entry) return null;
                  const realRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                  const isMe = entry.username === state.username;
                  const styles = [
                    { pt: "pt-6", border: "border-slate-400/40", bg: "bg-slate-400/5" },
                    { pt: "pt-0", border: "border-yellow-400/50", bg: "bg-yellow-400/8" },
                    { pt: "pt-8", border: "border-amber-600/40", bg: "bg-amber-600/5" },
                  ][podiumIdx];
                  return (
                    <div
                      key={entry.sessionId}
                      className={`${styles.pt} rounded-2xl border ${styles.border} ${styles.bg} p-4 text-center flex flex-col items-center gap-2`}
                    >
                      {rankMedal(realRank - 1)}
                      <div className="h-10 w-10 rounded-full bg-neon-gradient grid place-items-center font-bold text-primary-foreground text-sm mt-1">
                        {entry.username.slice(0, 1).toUpperCase()}
                      </div>
                      <div className={`text-sm font-semibold truncate max-w-full ${isMe ? "text-neon" : ""}`}>
                        {entry.username}
                        {isMe && (
                          <span className="ml-1 font-mono text-[9px] text-neon/70">YOU</span>
                        )}
                      </div>
                      {entry.role && (
                        <div className="font-mono text-[9px] uppercase text-muted-foreground">
                          {entry.role.split(" ")[0]}
                        </div>
                      )}
                      <div className="font-mono text-lg font-bold text-neon">{entry.xp} XP</div>
                      <div className={`font-mono text-[11px] ${accuracyFor(entry)}`}>
                        {entry.accuracy}% acc
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Full table */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-cardx overflow-hidden"
            >
              <div className="grid grid-cols-12 px-4 py-3 font-mono text-[10px] uppercase text-muted-foreground border-b border-border bg-secondary/30">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Operator</div>
                <div className="col-span-2 text-center hidden sm:block">Role</div>
                <div className="col-span-2 text-center">Rank</div>
                <div className="col-span-1 text-right">XP</div>
                <div className="col-span-1 text-right">Acc</div>
                <div className="col-span-1 text-right hidden md:block">
                  <Timer className="h-3 w-3 ml-auto" />
                </div>
              </div>

              {entries.map((entry, i) => {
                const isMe = entry.username === state.username;
                const avgTimeSec = Math.round(entry.avgTimeMs / 100) / 10;
                return (
                  <motion.div
                    key={entry.sessionId}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.025 }}
                    className={`grid grid-cols-12 items-center px-4 py-3 text-sm border-b border-border last:border-0 transition ${
                      isMe ? "bg-neon/8 hover:bg-neon/12" : "hover:bg-secondary/30"
                    }`}
                  >
                    <div className="col-span-1 grid place-items-start">{rankMedal(i)}</div>

                    <div className="col-span-4 flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 shrink-0 rounded-full bg-neon-gradient grid place-items-center font-bold text-primary-foreground text-xs">
                        {entry.username.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className={`truncate font-medium ${isMe ? "text-neon" : ""}`}>
                          {entry.username}
                          {isMe && (
                            <span className="ml-1.5 font-mono text-[9px] uppercase text-neon/60">
                              you
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[9px] text-muted-foreground">
                          {timeAgo(entry.completedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center hidden sm:block">
                      {entry.role ? (
                        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase text-muted-foreground">
                          {entry.role.split(" ")[0]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </div>

                    <div className="col-span-2 text-center font-mono text-[10px] text-muted-foreground">
                      {entry.rankName}
                    </div>

                    <div className="col-span-1 text-right font-mono font-semibold text-neon">
                      {entry.xp}
                    </div>

                    <div className={`col-span-1 text-right font-mono text-[12px] ${accuracyFor(entry)}`}>
                      {entry.accuracy}%
                    </div>

                    <div className="col-span-1 text-right font-mono text-[11px] text-muted-foreground hidden md:block">
                      {avgTimeSec}s
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* My best */}
            {myBest && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-neon/30 bg-neon/5 p-5 flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-neon" />
                  <span className="font-semibold text-sm">Your best session</span>
                </div>
                <div className="flex flex-wrap gap-6 ml-auto">
                  <Pill label="XP" value={String(myBest.xp)} />
                  <Pill label="Accuracy" value={`${myBest.accuracy}%`} />
                  <Pill label="Streak" value={`${myBest.bestStreak}×`} />
                  <Pill label="Rank" value={myBest.rankName} />
                </div>
              </motion.div>
            )}

            {/* Footer legend */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {source === "cloud" ? (
                  <Cloud className="h-3.5 w-3.5 text-success" />
                ) : (
                  <HardDrive className="h-3.5 w-3.5" />
                )}
                {source === "cloud" ? "Global · Supabase" : "Local device only"}
              </span>
              <span className="ml-auto">
                {entries.length} session{entries.length !== 1 ? "s" : ""} recorded
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SessionStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-0.5">{value}</div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-[9px] uppercase text-muted-foreground">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}
