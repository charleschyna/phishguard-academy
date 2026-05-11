import { Link, useRouterState } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { getLevel } from "@/lib/scenarios";

export function AppHeader() {
  const { state } = useGame();
  const { current } = getLevel(state.xp);
  const path = useRouterState({ select: (r) => r.location.pathname });

  const links = [
    { to: "/", label: "Home" },
    { to: "/play", label: "Train" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="h-7 w-7 text-neon" />
            <div className="absolute inset-0 blur-lg bg-neon/40 group-hover:bg-neon/60 transition" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">
              Phish<span className="text-neon">Guard</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase">
              v1.0 / cyber-defense
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  active
                    ? "bg-neon/15 text-neon"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              {state.username || "guest"}
            </span>
            <span className="text-xs text-neon font-semibold">
              {current.name} · {state.xp} XP
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-neon-gradient grid place-items-center font-bold text-primary-foreground text-sm">
            {(state.username || "G").slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
