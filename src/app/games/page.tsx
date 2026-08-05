import { getLang } from "@/lib/lang";
import { getGames } from "@/lib/data";
import { GameCard } from "@/components/GameCard";

export const revalidate = 30;

export default async function GamesPage() {
  const { lang, t } = await getLang();
  const games = await getGames();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold display">{t.gamesTitle}</h1>
        <p className="text-fg/60">{t.gamesText}</p>
      </div>
      {games.length === 0 ? (
        <p className="text-fg/60 py-8">{t.noData}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((g) => (
            <GameCard key={g.id} game={g} t={t} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
