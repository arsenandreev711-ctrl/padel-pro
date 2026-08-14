import { getLang } from "@/lib/lang";
import { getTournaments } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";
import { Reveal } from "@/components/Reveal";

export const revalidate = 60;

export default async function TournamentsPage() {
  const { lang, t } = await getLang();
  const tournaments = await getTournaments();

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl font-bold display">{t.tournamentsTitle}</h1>
        <p className="text-ink-soft">{t.tournamentsText}</p>
      </div>
      {tournaments.length === 0 ? (
        <p className="text-ink-soft py-8">{t.noData}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {tournaments.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 60}>
              <TournamentCard tournament={tr} t={t} lang={lang} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
