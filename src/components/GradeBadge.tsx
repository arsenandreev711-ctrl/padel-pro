import type { Sport } from "@/lib/types";
import { grade } from "@/lib/grading";

/** Значок уровня игрока: буква+уровень (падел) или NTRP (теннис) + шкала 1–7 */
export function GradeBadge({
  sport,
  elo,
  showScale = true,
}: {
  sport: Sport;
  elo: number;
  showScale?: boolean;
}) {
  const g = grade(sport, elo);
  const isPadel = sport === "padel";
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white font-extrabold text-xl display shrink-0"
          style={{ backgroundColor: g.tier.color }}
        >
          {isPadel ? g.tier.label : g.level.toFixed(1)}
        </span>
        <div className="leading-tight">
          <p className="font-bold display text-lg">
            {isPadel ? `Уровень ${g.level.toFixed(1)}` : `NTRP ${g.level.toFixed(1)}`}
          </p>
          <p className="text-sm text-ink-soft">{g.tier.name}</p>
        </div>
      </div>

      {showScale && (
        <div className="flex flex-col gap-1">
          <div className="relative h-2 rounded-full bg-line-soft overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${g.progress * 100}%`,
                backgroundColor: g.tier.color,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-ink-soft/70 font-medium tabular-nums">
            <span>1.0</span>
            <span>4.0</span>
            <span>7.0</span>
          </div>
        </div>
      )}
    </div>
  );
}
