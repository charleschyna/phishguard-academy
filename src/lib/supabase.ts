/**
 * Supabase REST client — no npm package required.
 *
 * Setup (run once in Supabase SQL Editor):
 * ─────────────────────────────────────────
 * CREATE TABLE leaderboard (
 *   id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
 *   session_id   text        UNIQUE NOT NULL,
 *   username     text        NOT NULL DEFAULT 'Anonymous',
 *   role         text        DEFAULT '',
 *   xp           integer     NOT NULL DEFAULT 0,
 *   accuracy     integer     NOT NULL DEFAULT 0,
 *   best_streak  integer     NOT NULL DEFAULT 0,
 *   rank_name    text        NOT NULL DEFAULT 'Beginner',
 *   avg_time_ms  numeric     NOT NULL DEFAULT 0,
 *   completed_at timestamptz NOT NULL DEFAULT now(),
 *   created_at   timestamptz NOT NULL DEFAULT now()
 * );
 *
 * ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "public_read"   ON leaderboard FOR SELECT USING (true);
 * CREATE POLICY "public_insert" ON leaderboard FOR INSERT WITH CHECK (true);
 * ─────────────────────────────────────────
 *
 * Then add to your .env file:
 *   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJ...
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(
  /\/+$/,
  "",
);
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

function headers(extra?: Record<string, string>) {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
    ...extra,
  };
}

export async function supabaseSelect<T>(table: string, query = ""): Promise<T[]> {
  if (!isSupabaseConfigured) return [];
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase SELECT failed: ${await res.text()}`);
  return res.json() as Promise<T[]>;
}

export async function supabaseInsert(
  table: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(data),
  });
  // 409 = duplicate session_id (unique constraint) — safe to ignore
  if (!res.ok && res.status !== 409) {
    throw new Error(`Supabase INSERT failed: ${await res.text()}`);
  }
}
