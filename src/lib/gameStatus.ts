export type TimeStatus = "upcoming" | "live" | "finished";

/** Статус игры по времени: скоро / идёт (в пределах 3 часов от старта) / завершена. */
export function gameTimeStatus(startsAt: string): TimeStatus {
  const t = new Date(startsAt).getTime();
  const now = Date.now();
  const LIVE_WINDOW = 3 * 60 * 60 * 1000;
  if (now > t + LIVE_WINDOW) return "finished";
  if (now >= t) return "live";
  return "upcoming";
}
