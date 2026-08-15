import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus, Users, CalendarDays, Swords, Trophy } from "lucide-react";
import { getLang } from "@/lib/lang";
import {
  getRatings,
  getGames,
  getTournaments,
  getRecentMatches,
  getPlayersMap,
  getCounts,
} from "@/lib/data";
import { RatingTable } from "@/components/RatingTable";
import { GameCard, fmtDate } from "@/components/GameCard";
import { TournamentCard } from "@/components/TournamentCard";
import { SportBadge } from "@/components/SportBadge";
import { Reveal } from "@/components/Reveal";

export const revalidate = 30;

export default async function Home() {
  const { lang, t } = await getLang();
  const [padel, tennis, games, tournaments, recentMatches, counts] = await Promise.all([
    getRatings("padel", 5),
    getRatings("tennis", 5),
    getGames(),
    getTournaments(),
    getRecentMatches(5),
    getCounts(),
  ]);
  const stats = [
    { icon: Users, value: counts.players, label: "Игроков" },
    { icon: CalendarDays, value: counts.games, label: "Открытых игр" },
    { icon: Swords, value: counts.matches, label: "Матчей" },
    { icon: Trophy, value: counts.tournaments, label: "Турниров" },
  ];
  const matchIds = [
    ...new Set(recentMatches.flatMap((m) => [...m.team1, ...m.team2])),
  ];
  const matchNames = await getPlayersMap(matchIds);
  const pname = (pid: string) => matchNames[pid]?.full_name ?? "Игрок";

  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center pt-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold leading-[1.02] display">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-ink-soft max-w-xl leading-relaxed">
            {t.heroText}
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors duration-200 cursor-pointer"
            >
              <Plus size={18} /> {t.create.cta}
            </Link>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 border border-line text-ink font-semibold px-6 py-3 rounded-full hover:border-ink-soft transition-colors duration-200 cursor-pointer"
            >
              {t.gamesTitle}
            </Link>
            <Link
              href="/rating"
              className="inline-flex items-center gap-2 border border-line text-ink font-semibold px-6 py-3 rounded-full hover:border-ink-soft transition-colors duration-200 cursor-pointer"
            >
              {t.nav.rating} <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Фото — единство двух ракеток */}
        <div className="relative">
          <div className="max-w-md mx-auto rounded-[2rem] border border-line bg-cream overflow-hidden">
            <div className="h-1 flex">
              <span className="flex-1 bg-green" />
              <span className="flex-1 bg-burgundy" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-rackets.jpg"
              alt="Падел-ракетка и теннисная ракетка"
              width={1572}
              height={1422}
              className="w-full h-auto"
            />
            <div className="flex items-center justify-center gap-3 text-sm font-semibold py-4 border-t border-line-soft">
              <span className="text-green">{t.padel}</span>
              <span className="text-ink-soft/40">×</span>
              <span className="text-burgundy">{t.tennis}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Полоса единства */}
      <Reveal className="-mt-8 sm:-mt-14">
        <div className="rounded-2xl bg-ink text-cream px-6 sm:px-10 py-6 flex flex-wrap items-center gap-4 justify-between">
          <p className="display text-xl sm:text-2xl font-semibold max-w-2xl">
            {t.union}
          </p>
          <div className="flex items-center gap-2 text-sm text-cream/70">
            <span className="w-2 h-2 rounded-full bg-[#3fae74]" /> {t.padel}
            <span className="w-2 h-2 rounded-full bg-[#c86b86] ml-3" /> {t.tennis}
          </div>
        </div>
      </Reveal>

      {/* Живые счётчики */}
      <Reveal className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 -mt-6 sm:-mt-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-surface p-4 sm:p-5 flex flex-col gap-1"
          >
            <s.icon size={18} className="text-green" />
            <span className="text-2xl sm:text-3xl font-extrabold display tabular-nums leading-none mt-1">
              {s.value}
            </span>
            <span className="text-xs sm:text-sm text-ink-soft">{s.label}</span>
          </div>
        ))}
      </Reveal>

      {/* Топ рейтинги */}
      <section className="grid md:grid-cols-2 gap-10">
        {[
          { sport: "padel" as const, data: padel, label: t.padel, dot: "bg-green" },
          { sport: "tennis" as const, data: tennis, label: t.tennis, dot: "bg-burgundy" },
        ].map((b, idx) => (
          <Reveal key={b.sport} delay={idx * 80} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold display flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${b.dot}`} />
                {t.topPlayers}: {b.label}
              </h2>
              <Link
                href={`/rating?sport=${b.sport}`}
                className="text-ink-soft font-medium text-sm inline-flex items-center gap-1 hover:text-ink transition-colors duration-200 cursor-pointer"
              >
                {t.fullRating} <ArrowUpRight size={15} />
              </Link>
            </div>
            <RatingTable ratings={b.data} t={t} />
          </Reveal>
        ))}
      </section>

      {/* Ближайшие игры */}
      <section className="flex flex-col gap-6">
        <Reveal className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl sm:text-4xl font-bold display">{t.upcomingGames}</h2>
            <p className="text-ink-soft">{t.gamesText}</p>
          </div>
          <Link
            href="/games"
            className="text-ink-soft font-medium text-sm inline-flex items-center gap-1 hover:text-ink transition-colors duration-200 cursor-pointer shrink-0"
          >
            {t.all} <ArrowUpRight size={15} />
          </Link>
        </Reveal>
        {games.length === 0 ? (
          <p className="text-ink-soft">{t.noData}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.slice(0, 3).map((g, i) => (
              <Reveal key={g.id} delay={i * 70}>
                <GameCard game={g} t={t} lang={lang} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Ближайшие турниры */}
      <section className="flex flex-col gap-6">
        <Reveal className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl sm:text-4xl font-bold display">{t.upcomingTournaments}</h2>
            <p className="text-ink-soft">{t.tournamentsText}</p>
          </div>
          <Link
            href="/tournaments"
            className="text-ink-soft font-medium text-sm inline-flex items-center gap-1 hover:text-ink transition-colors duration-200 cursor-pointer shrink-0"
          >
            {t.all} <ArrowUpRight size={15} />
          </Link>
        </Reveal>
        {tournaments.length === 0 ? (
          <p className="text-ink-soft">{t.noData}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {tournaments.slice(0, 2).map((tr, i) => (
              <Reveal key={tr.id} delay={i * 70}>
                <TournamentCard tournament={tr} t={t} lang={lang} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Последние матчи */}
      {recentMatches.length > 0 && (
        <section className="flex flex-col gap-6">
          <Reveal className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl sm:text-4xl font-bold display">{t.recentMatches}</h2>
              <p className="text-ink-soft">Результаты игр сообщества</p>
            </div>
            <Link
              href="/matches"
              className="text-ink-soft font-medium text-sm inline-flex items-center gap-1 hover:text-ink transition-colors duration-200 cursor-pointer shrink-0"
            >
              {t.all} <ArrowUpRight size={15} />
            </Link>
          </Reveal>
          <div className="flex flex-col gap-3">
            {recentMatches.map((m, i) => {
              const t1won = m.winner === 1;
              return (
                <Reveal key={m.id} delay={i * 60}>
                  <div className="rounded-2xl border border-line bg-surface p-4 flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
                    <div className="flex items-center gap-3">
                      <SportBadge sport={m.sport} t={t} />
                      <span className="text-sm text-ink-soft">{fmtDate(m.played_at, lang)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <span className={t1won ? "text-green font-semibold" : "text-ink-soft"}>
                        {m.team1.map(pname).join(" / ")}
                      </span>
                      <span className="text-ink-soft/50">{t.vs}</span>
                      <span className={!t1won ? "text-green font-semibold" : "text-ink-soft"}>
                        {m.team2.map(pname).join(" / ")}
                      </span>
                    </div>
                    <span className="font-bold display text-lg tabular-nums">{m.score}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
