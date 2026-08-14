import type { Sport } from "./types";

/**
 * Единая шкала уровня 1.0–7.0 (как в паделе и в теннисном NTRP).
 * Внутренний Elo (старт ~1000) переводится в понятный уровень.
 *   Elo 800  → 1.0   Elo 1500 → 7.0
 */
export function eloToLevel(elo: number): number {
  const raw = 1 + ((elo - 800) / 700) * 6;
  const clamped = Math.max(1, Math.min(7, raw));
  return Math.round(clamped * 2) / 2; // до 0.5
}

export function levelToElo(level: number): number {
  return Math.round(800 + ((level - 1) / 6) * 700);
}

export interface Tier {
  key: string;
  label: string; // буква (падел) или уровень
  name: string;
  min: number; // уровень
  max: number;
  color: string;
  desc: string;
}

/** Падел: буквенные категории D→A поверх уровня 1.0–7.0 */
export const PADEL_TIERS: Tier[] = [
  {
    key: "D",
    label: "D",
    name: "Новичок",
    min: 1.0,
    max: 2.0,
    color: "#94a39a",
    desc: "Учится попадать по мячу, знает правила, розыгрыши короткие.",
  },
  {
    key: "C",
    label: "C",
    name: "Любитель",
    min: 2.5,
    max: 3.5,
    color: "#4f9e6f",
    desc: "Держит розыгрыш, играет от задней стенки, выходит к сетке.",
  },
  {
    key: "B",
    label: "B",
    name: "Продвинутый",
    min: 4.0,
    max: 5.0,
    color: "#16653f",
    desc: "Контролирует сетку, играет от стен, тактически грамотен, бандехи.",
  },
  {
    key: "A",
    label: "A",
    name: "Мастер",
    min: 5.5,
    max: 7.0,
    color: "#0f4c30",
    desc: "Полный арсенал ударов, минимум ошибок, соревновательный уровень.",
  },
];

/** Теннис: шкала NTRP 1.0–7.0 (без букв) */
export const TENNIS_TIERS: Tier[] = [
  {
    key: "beginner",
    label: "1–2",
    name: "Новичок",
    min: 1.0,
    max: 2.0,
    color: "#c58aa0",
    desc: "Осваивает удары и подачу, короткие розыгрыши.",
  },
  {
    key: "improver",
    label: "2.5–3",
    name: "Начинающий",
    min: 2.5,
    max: 3.0,
    color: "#a8577a",
    desc: "Стабильные несложные розыгрыши, контроль направления.",
  },
  {
    key: "intermediate",
    label: "3.5–4",
    name: "Средний",
    min: 3.5,
    max: 4.0,
    color: "#7a1f3d",
    desc: "Уверенные удары с обеих сторон, работает над глубиной и вращением.",
  },
  {
    key: "advanced",
    label: "4.5–5",
    name: "Продвинутый",
    min: 4.5,
    max: 5.0,
    color: "#5e162e",
    desc: "Мощная точная игра, тактика, стабильность под давлением.",
  },
  {
    key: "expert",
    label: "5.5–7",
    name: "Эксперт",
    min: 5.5,
    max: 7.0,
    color: "#43101f",
    desc: "Турнирный и профессиональный уровень.",
  },
];

export function tiersFor(sport: Sport): Tier[] {
  return sport === "padel" ? PADEL_TIERS : TENNIS_TIERS;
}

export function tierForLevel(sport: Sport, level: number): Tier {
  const tiers = tiersFor(sport);
  return (
    tiers.find((t) => level >= t.min && level <= t.max) ??
    tiers[tiers.length - 1]
  );
}

export interface Grade {
  level: number;
  tier: Tier;
  /** прогресс внутри уровня 0..1 (для шкалы) */
  progress: number;
}

export function grade(sport: Sport, elo: number): Grade {
  const level = eloToLevel(elo);
  const tier = tierForLevel(sport, level);
  const progress = Math.max(0, Math.min(1, (level - 1) / 6));
  return { level, tier, progress };
}

/** Короткая подпись уровня: падел — "B · 4.5", теннис — "NTRP 4.5" */
export function gradeLabel(sport: Sport, elo: number): string {
  const g = grade(sport, elo);
  return sport === "padel"
    ? `${g.tier.label} · ${g.level.toFixed(1)}`
    : `NTRP ${g.level.toFixed(1)}`;
}
