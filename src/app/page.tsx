import Link from "next/link";
import { ArrowRight, TrendingUp, CalendarPlus, Trophy } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getRatings, getGames, getTournaments } from "@/lib/data";
import { RatingTable } from "@/components/RatingTable";
import { GameCard } from "@/components/GameCard";
import { TournamentCard } from "@/components/TournamentCard";

export const revalidate = 60;

export default async function Home() {
  const { lang, t } = await getLang();
  const [padel, tennis, games, tournaments] = await Promise.all([
    getRatings("padel", 5),
    getRatings("tennis", 5),
    getGames(),
    getTournaments(),
  ]);

  return (
    <div className="flex flex-col gap-14">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary text-on-primary p-8 sm:p-14 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl flex flex-col gap-5">
          <span className="text-sm font-bold uppercase tracking-widest opacity-80">
            {t.tagline}
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight display">
            {t.heroTitle}
          </h1>
          <p className="text-lg opacity-90">{t.heroText}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/rating"
              className="inline-flex items-center gap-2 bg-accent text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all duration-200 cursor-pointer"
            >
              <TrendingUp size={18} /> {t.nav.rating}
            </Link>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur font-bold px-6 py-3 rounded-xl hover:bg-white/25 transition-all duration-200 cursor-pointer"
            >
              <CalendarPlus size={18} /> {t.gamesTitle}
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute right-24 -top-10 w-40 h-40 rounded-full bg-accent/30" />
      </section>

      {/* Top ratings */}
      <section className="grid md:grid-cols-2 gap-8">
        {[
          { sport: "padel" as const, data: padel, label: t.padel },
          { sport: "tennis" as const, data: tennis, label: t.tennis },
        ].map((b) => (
          <div key={b.sport} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold display">
                {t.topPlayers}: {b.label}
              </h2>
              <Link
                href={`/rating?sport=${b.sport}`}
                className="text-primary font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 cursor-pointer"
              >
                {t.fullRating} <ArrowRight size={15} />
              </Link>
            </div>
            <RatingTable ratings={b.data} t={t} />
          </div>
        ))}
      </section>

      {/* Upcoming games */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold display">{t.upcomingGames}</h2>
          <Link
            href="/games"
            className="text-primary font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 cursor-pointer"
          >
            {t.all} <ArrowRight size={15} />
          </Link>
        </div>
        {games.length === 0 ? (
          <p className="text-fg/60">{t.noData}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.slice(0, 3).map((g) => (
              <GameCard key={g.id} game={g} t={t} lang={lang} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming tournaments */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold display flex items-center gap-2">
            <Trophy className="text-accent" /> {t.upcomingTournaments}
          </h2>
          <Link
            href="/tournaments"
            className="text-primary font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 cursor-pointer"
          >
            {t.all} <ArrowRight size={15} />
          </Link>
        </div>
        {tournaments.length === 0 ? (
          <p className="text-fg/60">{t.noData}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {tournaments.slice(0, 2).map((tr) => (
              <TournamentCard key={tr.id} tournament={tr} t={t} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
