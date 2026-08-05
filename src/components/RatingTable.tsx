import Link from "next/link";
import type { Rating } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

const medal = (i: number) =>
  i === 0 ? "bg-accent text-white" : i === 1 ? "bg-slate-400 text-white" : i === 2 ? "bg-amber-700 text-white" : "bg-muted text-fg/60";

export function RatingTable({ ratings, t }: { ratings: Rating[]; t: Dict }) {
  if (ratings.length === 0)
    return <p className="text-fg/60 py-8 text-center">{t.noData}</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-fg/50 border-b border-line">
            <th className="p-3 w-12">#</th>
            <th className="p-3">{t.player}</th>
            <th className="p-3 text-right">{t.ratingCol}</th>
            <th className="p-3 text-right hidden sm:table-cell">{t.matches}</th>
            <th className="p-3 text-right hidden sm:table-cell">{t.wins}</th>
            <th className="p-3 text-right hidden md:table-cell">{t.winrate}</th>
            <th className="p-3 hidden md:table-cell">{t.city}</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r, i) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-muted/60 transition-colors duration-150"
            >
              <td className="p-3">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${medal(i)}`}
                >
                  {i + 1}
                </span>
              </td>
              <td className="p-3">
                <Link
                  href={`/players/${r.player_id}`}
                  className="font-semibold hover:text-primary transition-colors duration-150 cursor-pointer"
                >
                  {r.players?.full_name ?? "—"}
                </Link>
              </td>
              <td className="p-3 text-right font-bold text-primary display text-lg">
                {r.rating}
              </td>
              <td className="p-3 text-right hidden sm:table-cell">{r.matches_played}</td>
              <td className="p-3 text-right hidden sm:table-cell text-green-700">{r.wins}</td>
              <td className="p-3 text-right hidden md:table-cell">
                {r.matches_played > 0
                  ? Math.round((r.wins / r.matches_played) * 100) + "%"
                  : "—"}
              </td>
              <td className="p-3 hidden md:table-cell text-fg/60">
                {r.players?.city ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
