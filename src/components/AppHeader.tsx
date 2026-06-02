import { Link, useRouterState } from "@tanstack/react-router";
import { FlaskConical, Shield } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { getLevel } from "@/lib/scenarios";
import { useResearchMode } from "@/lib/research-mode";

export function AppHeader() {
  const { state } = useGame();
  const { current } = getLevel(state.xp);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { on: researchOn, toggle: toggleResearch } = useResearchMode();

  const links = [
    { to: "/", label: "Home" },
    { to: "/play", label: "Train" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
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
              v2.0 / cyber-defense
            </div>
          </div>
        </Link>

        {/* Nav */}
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Research Mode toggle */}
          <button
            onClick={toggleResearch}
            title={researchOn ? "Research Mode ON — click to disable" : "Research Mode OFF — click to enable"}
            className={`h-8 w-8 rounded-lg grid place-items-center transition ${
              researchOn
                ? "bg-neon/15 text-neon border border-neon/40"
                : "text-muted-foreground hover:bg-secondary border border-transparent"
            }`}
          >
            <FlaskConical className="h-4 w-4" />
          </button>

          {/* User info */}
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

      {/* Research Mode banner */}
      {researchOn && (
        <div className="border-t border-neon/20 bg-neon/5 px-4 py-1.5 text-center font-mono text-[11px] text-neon uppercase tracking-widest">
          ⚗ Research Mode active — psychological mechanisms visible in feedback
        </div>
      )}
    </header>
  );
}
