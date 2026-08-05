import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getLang } from "@/lib/lang";
import {
  getPlayer,
  getPlayerRatings,
  getPlayerMatches,
  getPlayersMap,
} from "@/lib/data";
import { SportBadge } from "@/components/SportBadge";
import { fmtDate } from "@/components/GameCard";

export const revalidate = 60;

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { lang, t } = await getLang();
  const player = await getPlayer(id);
  if (!player) notFound();

  const [ratings, matches] = await Promise.all([
    getPlayerRatings(id),
    getPlayerMatches(id),
  ]);
  const allIds = [...new Set(matches.flatMap((m) => [...m.team1, ...m.team2]))];
  const names = await getPlayersMap(allIds);

  const initials = player.full_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-3xl font-bold display">
          {initials}
        </div>
        <div>
          <h1 className="text-4xl font-bold display">{player.full_name}</h1>
          <p className="text-fg/60 flex items-center gap-1.5 mt-1">
            <MapPin size={15} /> {player.city}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 max-w-xl">
        {ratings.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-2"
          >
            <SportBadge sport={r.sport} t={t} />
            <span className="text-4xl font-extrabold text-primary display">
              {r.rating}
            </span>
            <span className="text-sm text-fg/60">
              {t.matches}: {r.matches_played} · {t.wins}:{" "}
              <span className="text-green-700 font-semibold">{r.wins}</span> ·{" "}
              {t.losses}:{" "}
              <span className="text-danger font-semibold">{r.losses}</span>
            </span>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold display">{t.profileMatches}</h2>
        {matches.length === 0 ? (
          <p className="text-fg/60">{t.noData}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {matches.map((m) => {
              const inTeam1 = m.team1.includes(id);
              const won = (m.winner === 1) === inTeam1;
              const delta = m.rating_deltas[id] ?? 0;
              const name = (pid: string) => names[pid]?.full_name ?? "?";
              return (
                <div
                  key={m.id}
                  className="rounded-2xl border border-line bg-white p-4 flex flex-wrap items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        won
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {won ? t.winner : t.loss}
                    </span>
                    <SportBadge sport={m.sport} t={t} />
                    <span className="text-sm text-fg/60">
                      {fmtDate(m.played_at, lang)}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {m.team1.map(name).join(" / ")}{" "}
                    <span className="text-fg/40">{t.vs}</span>{" "}
                    {m.team2.map(name).join(" / ")}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold display text-lg">{m.score}</span>
                    <span
                      className={`text-sm font-bold ${
                        delta >= 0 ? "text-green-700" : "text-danger"
                      }`}
                    >
                      {delta >= 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
