import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getGames } from "@/lib/data";
import { GameCard } from "@/components/GameCard";
import { FilterBar } from "@/components/FilterBar";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; sport?: string; level?: string }>;
}) {
  const { lang, t } = await getLang();
  const [games, params] = await Promise.all([getGames(), searchParams]);

  let list = games;
  if (params.sport === "padel" || params.sport === "tennis")
    list = list.filter((g) => g.sport === params.sport);
  if (params.level && params.level !== "all")
    list = list.filter((g) => g.level === params.level);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-5xl font-bold display">{t.gamesTitle}</h1>
          <p className="text-ink-soft">{t.gamesText}</p>
        </div>
        <Link
          href="/create?tab=game"
          className="inline-flex items-center gap-2 bg-green text-white font-semibold px-5 py-2.5 rounded-full hover:bg-green-deep transition-colors cursor-pointer shrink-0"
        >
          <Plus size={17} /> {t.create.cta}
        </Link>
      </div>

      {params.created && (
        <p className="bg-green/10 text-green rounded-xl p-4 text-sm">{t.createdBanner}</p>
      )}

      <Suspense>
        <FilterBar levels={t.create.levels} />
      </Suspense>

      {list.length === 0 ? (
        <p className="text-ink-soft py-8">
          {games.length === 0 ? t.noData : "Нет игр по этому фильтру — создай свою!"}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((g, i) => (
            <Reveal key={g.id} delay={i * 60}>
              <GameCard game={g} t={t} lang={lang} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
