import { getLang } from "@/lib/lang";
import { getTournaments } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";

export const revalidate = 60;

export default async function TournamentsPage() {
  const { lang, t } = await getLang();
  const tournaments = await getTournaments();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold display">{t.tournamentsTitle}</h1>
        <p className="text-fg/60">{t.tournamentsText}</p>
      </div>
      {tournaments.length === 0 ? (
        <p className="text-fg/60 py-8">{t.noData}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {tournaments.map((tr) => (
            <TournamentCard key={tr.id} tournament={tr} t={t} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
