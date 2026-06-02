import { supabaseSelect, supabaseInsert, isSupabaseConfigured } from "./supabase";

export { isSupabaseConfigured };

// ── Types ────────────────────────────────────────────────────────────────────

export type LeaderboardEntry = {
  sessionId: string; // unique per session — String(startedAt)
  username: string;
  role: string;
  xp: number;
  accuracy: number; // 0–100
  bestStreak: number;
  rankName: string;
  avgTimeMs: number;
  completedAt: number; // unix ms
};

// Supabase row shape (snake_case)
type CloudRow = {
  session_id: string;
  username: string;
  role: string;
  xp: number;
  accuracy: number;
  best_streak: number;
  rank_name: string;
  avg_time_ms: number;
  completed_at: string;
};

// ── localStorage (local fallback) ────────────────────────────────────────────

const LOCAL_KEY = "phishguard:leaderboard:v1";

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry: LeaderboardEntry): void {
  if (typeof window === "undefined") return;
  const existing = loadLeaderboard();
  if (existing.find((e) => e.sessionId === entry.sessionId)) return;
  const updated = [...existing, entry]
    .sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy)
    .slice(0, 100);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
}

// ── Supabase cloud ────────────────────────────────────────────────────────────

export async function saveToCloud(entry: LeaderboardEntry): Promise<void> {
  await supabaseInsert("leaderboard", {
    session_id: entry.sessionId,
    username: entry.username || "Anonymous",
    role: entry.role || "",
    xp: entry.xp,
    accuracy: entry.accuracy,
    best_streak: entry.bestStreak,
    rank_name: entry.rankName,
    avg_time_ms: entry.avgTimeMs,
    completed_at: new Date(entry.completedAt).toISOString(),
  });
}

export async function loadFromCloud(): Promise<LeaderboardEntry[]> {
  const rows = await supabaseSelect<CloudRow>(
    "leaderboard",
    "select=session_id,username,role,xp,accuracy,best_streak,rank_name,avg_time_ms,completed_at&order=xp.desc,accuracy.desc&limit=100",
  );
  return rows.map((r) => ({
    sessionId: r.session_id,
    username: r.username,
    role: r.role,
    xp: r.xp,
    accuracy: r.accuracy,
    bestStreak: r.best_streak,
    rankName: r.rank_name,
    avgTimeMs: Number(r.avg_time_ms),
    completedAt: new Date(r.completed_at).getTime(),
  }));
}
