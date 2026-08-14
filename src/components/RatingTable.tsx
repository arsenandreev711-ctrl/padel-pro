import Link from "next/link";
import type { Rating } from "@/lib/types";
import type { Dict } from "@/lib/i18n";
import { grade } from "@/lib/grading";

function rankStyle(i: number) {
  if (i === 0) return "bg-green text-white";
  if (i === 1) return "bg-green/15 text-green";
  if (i === 2) return "bg-burgundy/12 text-burgundy";
  return "text-ink-soft";
}

export function RatingTable({ ratings, t }: { ratings: Rating[]; t: Dict }) {
  if (ratings.length === 0)
    return (
      <p className="text-ink-soft py-10 text-center border border-dashed border-line rounded-2xl">
        {t.noData}
      </p>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-soft/70 border-b border-line-soft text-xs uppercase tracking-wide">
            <th className="p-4 w-14 font-medium">#</th>
            <th className="p-4 font-medium">{t.player}</th>
            <th className="p-4 font-medium">Уровень</th>
            <th className="p-4 text-right font-medium">{t.ratingCol}</th>
            <th className="p-4 text-right hidden sm:table-cell font-medium">{t.matches}</th>
            <th className="p-4 text-right hidden sm:table-cell font-medium">{t.wins}</th>
            <th className="p-4 text-right hidden md:table-cell font-medium">{t.winrate}</th>
            <th className="p-4 hidden md:table-cell font-medium">{t.city}</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r, i) => (
            <tr
              key={r.id}
              className="border-b border-line-soft last:border-0 hover:bg-cream/60 transition-colors duration-150"
            >
              <td className="p-4">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankStyle(i)}`}
                >
                  {i + 1}
                </span>
              </td>
              <td className="p-4">
                <Link
                  href={`/players/${r.player_id}`}
                  className="font-semibold hover:text-green transition-colors duration-150 cursor-pointer"
                >
                  {r.players?.full_name ?? "—"}
                </Link>
              </td>
              <td className="p-4">
                {(() => {
                  const g = grade(r.sport, r.rating);
                  return (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: g.tier.color }}
                    >
                      {r.sport === "padel"
                        ? `${g.tier.label} · ${g.level.toFixed(1)}`
                        : g.level.toFixed(1)}
                    </span>
                  );
                })()}
              </td>
              <td className="p-4 text-right font-bold text-ink display text-lg tabular-nums">
                {r.rating}
              </td>
              <td className="p-4 text-right hidden sm:table-cell text-ink-soft tabular-nums">
                {r.matches_played}
              </td>
              <td className="p-4 text-right hidden sm:table-cell text-green tabular-nums">
                {r.wins}
              </td>
              <td className="p-4 text-right hidden md:table-cell text-ink-soft tabular-nums">
                {r.matches_played > 0
                  ? Math.round((r.wins / r.matches_played) * 100) + "%"
                  : "—"}
              </td>
              <td className="p-4 hidden md:table-cell text-ink-soft">
                {r.players?.city ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
