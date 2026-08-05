// Elo-система рейтинга Padel-PRO
// Стартовый рейтинг 1000, K-фактор 32 (24 после 30 матчей)

const START_RATING = 1000;

export function kFactor(matchesPlayed: number): number {
  return matchesPlayed < 30 ? 32 : 24;
}

export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Считает дельты рейтинга для матча.
 * team1/team2 — массивы {playerId, rating, matchesPlayed}.
 * Для пар берётся средний рейтинг команды.
 * winner: 1 или 2.
 */
export function calcDeltas(
  team1: { playerId: string; rating: number; matchesPlayed: number }[],
  team2: { playerId: string; rating: number; matchesPlayed: number }[],
  winner: 1 | 2
): Record<string, number> {
  const avg = (t: { rating: number }[]) =>
    t.reduce((s, p) => s + p.rating, 0) / t.length;
  const r1 = avg(team1);
  const r2 = avg(team2);
  const e1 = expectedScore(r1, r2);
  const s1 = winner === 1 ? 1 : 0;

  const deltas: Record<string, number> = {};
  for (const p of team1) {
    deltas[p.playerId] = Math.round(kFactor(p.matchesPlayed) * (s1 - e1));
  }
  for (const p of team2) {
    deltas[p.playerId] = Math.round(kFactor(p.matchesPlayed) * (1 - s1 - (1 - e1)));
  }
  return deltas;
}

export { START_RATING };
