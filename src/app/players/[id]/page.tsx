import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Trophy, Swords, Medal, Gauge, BadgeCheck, Send } from "lucide-react";
import { getLang } from "@/lib/lang";
import { currentUser } from "@/lib/auth";
import { startTelegramVerify } from "@/app/players/actions";
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
import { ShareButton } from "@/components/ShareButton";
import { gradeLabel } from "@/lib/grading";
import type { RatingPoint } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayer(id);
  if (!player) return { title: "Игрок — MatePoint" };
  const ratings = await getPlayerRatings(id);
  const parts = ratings.map(
    (r) => `${r.sport === "padel" ? "Падел" : "Теннис"} ${gradeLabel(r.sport, r.rating)}`
  );
  const title = `${player.full_name} — MatePoint`;
  const desc = parts.length
    ? `${parts.join(" · ")} · ${player.city}. Профиль игрока на MatePoint.`
    : `Игрок из города ${player.city} на MatePoint.`;
  return {
    title,
    description: desc,
    openGraph: { type: "profile", title, description: desc, images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description: desc, images: ["/og.png"] },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { lang, t } = await getLang();
  const [player, me] = await Promise.all([getPlayer(id), currentUser()]);
  if (!player) notFound();
  const isOwner = me?.id === player.id;

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
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold display">{player.full_name}</h1>
              {player.phone_verified && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold text-green bg-green/10 rounded-full px-2.5 py-1"
                  title="Номер подтверждён через Telegram"
                >
                  <BadgeCheck size={14} /> Номер подтверждён
                </span>
              )}
              {isOwner && (
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft border border-line rounded-full px-3 py-1 hover:border-ink-soft hover:text-ink transition-colors"
                >
                  Редактировать
                </Link>
              )}
            </div>
            {isOwner && !player.phone_verified && (
              <form action={startTelegramVerify}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green border border-green/30 bg-green/5 rounded-full px-3 py-1.5 hover:bg-green/10 transition-colors cursor-pointer"
                >
                  <Send size={14} /> Подтвердить номер через Telegram
                </button>
              </form>
            )}
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

      {/* Призыв пройти анкету — если это твой профиль и уровень не задан */}
      {isOwner && ratings.length === 0 && (
        <Link
          href="/join"
          className="flex items-center justify-between gap-3 rounded-2xl border border-green/30 bg-green/5 p-5 hover:bg-green/10 transition-colors"
        >
          <span className="flex items-center gap-3">
            <Gauge size={22} className="text-green shrink-0" />
            <span className="flex flex-col">
              <span className="font-semibold">Определи свой уровень</span>
              <span className="text-sm text-ink-soft">
                Пройди короткую анкету — попадёшь в рейтинг и получишь стартовый уровень.
              </span>
            </span>
          </span>
          <span className="text-green font-semibold text-sm shrink-0">Пройти →</span>
        </Link>
      )}

      {/* Поделиться своим профилем — позвать друзей */}
      {isOwner && (
        <div className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-3">
          <span className="font-semibold display">Позови друзей в MatePoint</span>
          <ShareButton
            title={`${player.full_name} — MatePoint`}
            text="Мой профиль на MatePoint — залетай играть в падел и теннис"
            label="Поделиться профилем"
          />
        </div>
      )}

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
