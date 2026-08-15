import { notFound } from "next/navigation";
import { MapPin, Trophy, Swords, Medal } from "lucide-react";
import { getLang } from "@/lib/lang";
import {
  getPlayer,
  getPlayerRatings,
  getPlayerMatches,
  getPlayersMap,
  getPlayerAwards,
  getTournamentsPlayed,
  getRatingHistory,
  getPlayerGames,
  getPlayerUpcomingTournaments,
} from "@/lib/data";
import { SportBadge } from "@/components/SportBadge";
import { GameCard, fmtDate } from "@/components/GameCard";
import { TournamentCard } from "@/components/TournamentCard";
import { AvatarBox } from "@/components/AvatarBox";
import { GradeBadge } from "@/components/GradeBadge";
import { RatingChart } from "@/components/RatingChart";
import { SideControl } from "@/components/SideControl";
import { AwardCard } from "@/components/Award";
import type { RatingPoint } from "@/lib/types";

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

  const [ratings, matches, awards, tournamentsPlayed, myGames, myTournaments] =
    await Promise.all([
      getPlayerRatings(id),
      getPlayerMatches(id),
      getPlayerAwards(id),
      getTournamentsPlayed(id),
      getPlayerGames(id),
      getPlayerUpcomingTournaments(id),
    ]);

  const histories: Record<string, RatingPoint[]> = {};
  await Promise.all(
    ratings.map(async (r) => {
      histories[r.sport] = await getRatingHistory(id, r.sport, r.rating);
    })
  );

  const allIds = [...new Set(matches.flatMap((m) => [...m.team1, ...m.team2]))];
  const names = await getPlayersMap(allIds);
  const totalMatches = ratings.reduce((s, r) => s + r.matches_played, 0);

  const stats = [
    { icon: Trophy, label: "Турниры", value: tournamentsPlayed },
    { icon: Swords, label: "Матчи", value: totalMatches },
    { icon: Medal, label: "Награды", value: awards.length },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Шапка профиля */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <AvatarBox name={player.full_name} src={player.avatar_url} />
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold display">{player.full_name}</h1>
            <p className="text-ink-soft flex items-center gap-1.5 mt-1">
              <MapPin size={15} /> {player.city}
            </p>
          </div>
          <div className="flex gap-2.5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2"
              >
                <s.icon size={16} className="text-green" />
                <span className="font-bold tabular-nums">{s.value}</span>
                <span className="text-xs text-ink-soft">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ближайшие игры игрока */}
      {myGames.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold display">Ближайшие игры</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myGames.map((g) => (
              <GameCard key={g.id} game={g} t={t} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Турниры игрока */}
      {myTournaments.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold display">Турниры</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {myTournaments.map((tr) => (
              <TournamentCard key={tr.id} tournament={tr} t={t} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Сторона корта */}
      <div className="flex flex-wrap gap-8">
        <SideControl sport="padel" initial={player.side_padel} />
        <SideControl sport="tennis" initial={player.side_tennis} />
      </div>

      {/* Уровень + график по каждому виду спорта */}
      {ratings.map((r) => (
        <section key={r.id} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SportBadge sport={r.sport} t={t} />
            <span className="text-sm text-ink-soft">
              {r.matches_played} матчей · {r.wins}
              <span className="text-green">W</span> / {r.losses}
              <span className="text-burgundy">L</span>
            </span>
          </div>
          <div className="grid md:grid-cols-[minmax(0,260px)_1fr] gap-5 items-start">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <GradeBadge sport={r.sport} elo={r.rating} />
            </div>
            <RatingChart data={histories[r.sport] ?? []} sport={r.sport} />
          </div>
        </section>
      ))}

      {/* Награды */}
      {awards.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold display">Награды</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((a, i) => (
              <AwardCard key={`${a.tournament_id}-${i}`} award={a} />
            ))}
          </div>
        </section>
      )}

      {/* История матчей */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold display">{t.profileMatches}</h2>
        {matches.length === 0 ? (
          <p className="text-ink-soft">{t.noData}</p>
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
                  className="rounded-2xl border border-line bg-surface p-4 flex flex-wrap items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        won ? "bg-green/10 text-green" : "bg-burgundy/10 text-burgundy"
                      }`}
                    >
                      {won ? t.winner : t.loss}
                    </span>
                    <SportBadge sport={m.sport} t={t} />
                    <span className="text-sm text-ink-soft">
                      {fmtDate(m.played_at, lang)}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {m.team1.map(name).join(" / ")}{" "}
                    <span className="text-ink-soft/50">{t.vs}</span>{" "}
                    {m.team2.map(name).join(" / ")}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold display text-lg tabular-nums">
                      {m.score}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        delta >= 0 ? "text-green" : "text-burgundy"
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
