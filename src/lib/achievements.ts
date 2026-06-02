import type { Attempt, GameState } from "./game-store";

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  rarity: "common" | "rare" | "epic";
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_session",
    title: "First Contact",
    desc: "Complete your first training session.",
    rarity: "common",
  },
  {
    id: "perfect",
    title: "Perfect Defence",
    desc: "100% accuracy across all 10 scenarios.",
    rarity: "epic",
  },
  {
    id: "streak5",
    title: "Streak Lord",
    desc: "Achieve 5 consecutive correct decisions.",
    rarity: "rare",
  },
  {
    id: "quick_draw",
    title: "Quick Draw",
    desc: "Identify 5 threats with >70% timer remaining.",
    rarity: "rare",
  },
  {
    id: "no_panic",
    title: "Ice Veins",
    desc: "No wrong decisions under severe time pressure.",
    rarity: "rare",
  },
  {
    id: "cyber_defender",
    title: "Cyber Defender",
    desc: "Reach Cyber Defender rank (110+ XP).",
    rarity: "epic",
  },
  {
    id: "comeback",
    title: "Pattern Breaker",
    desc: "Recover with 3+ correct answers after 2 consecutive failures.",
    rarity: "rare",
  },
  {
    id: "speed_run",
    title: "Speed Runner",
    desc: "Complete a full 10-scenario session in under 5 minutes.",
    rarity: "common",
  },
];

function timerPctOf(a: Attempt) {
  return a.timerPct ?? 0.5;
}

export function getUnlockedAchievements(state: GameState): Achievement[] {
  const a = state.attempts;
  if (a.length === 0) return [];

  const unlocked = new Set<string>();

  // first_session
  if (a.length > 0) unlocked.add("first_session");

  // perfect — 100% on a full session
  if (a.length >= 10 && a.every((x) => x.correct)) unlocked.add("perfect");

  // streak5
  if (state.bestStreak >= 5) unlocked.add("streak5");

  // quick_draw — 5+ correct with >70% timer remaining
  if (a.filter((x) => x.correct && timerPctOf(x) > 0.7).length >= 5) unlocked.add("quick_draw");

  // no_panic — 0 wrong answers under severe time pressure (in a completed session)
  if (
    a.length >= 10 &&
    a.filter((x) => !x.correct && timerPctOf(x) < 0.25).length === 0
  )
    unlocked.add("no_panic");

  // cyber_defender
  if (state.xp >= 110) unlocked.add("cyber_defender");

  // comeback — 3+ correct after 2 consecutive failures
  let wrongRun = 0;
  let inComeback = false;
  let comebacking = 0;
  for (const attempt of a) {
    if (!attempt.correct) {
      if (wrongRun >= 2) inComeback = false; // reset
      wrongRun++;
      comebacking = 0;
    } else {
      if (wrongRun >= 2) {
        inComeback = true;
        wrongRun = 0;
      }
      if (inComeback) {
        comebacking++;
        if (comebacking >= 3) {
          unlocked.add("comeback");
          inComeback = false;
          comebacking = 0;
        }
      }
    }
  }

  // speed_run — full session under 5 minutes
  if (state.startedAt && a.length >= 10) {
    const lastAt = Math.max(...a.map((x) => x.at));
    if (lastAt - state.startedAt < 300_000) unlocked.add("speed_run");
  }

  return ACHIEVEMENTS.filter((ach) => unlocked.has(ach.id));
}

export function checkNewAchievement(
  prevState: GameState,
  nextState: GameState,
): Achievement | null {
  const prev = new Set(getUnlockedAchievements(prevState).map((a) => a.id));
  const next = getUnlockedAchievements(nextState);
  const newOnes = next.filter((a) => !prev.has(a.id));
  return newOnes[0] ?? null;
}
