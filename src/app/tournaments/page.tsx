import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getTournaments } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";
import { FilterBar } from "@/components/FilterBar";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; sport?: string }>;
}) {
  const { lang, t } = await getLang();
  const [tournaments, params] = await Promise.all([getTournaments(), searchParams]);

  let list = tournaments;
  if (params.sport === "padel" || params.sport === "tennis")
    list = list.filter((tr) => tr.sport === params.sport);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-5xl font-bold display">{t.tournamentsTitle}</h1>
          <p className="text-ink-soft">{t.tournamentsText}</p>
        </div>
        <Link
          href="/create?tab=tournament"
          className="inline-flex items-center gap-2 bg-green text-white font-semibold px-5 py-2.5 rounded-full hover:bg-green-deep transition-colors cursor-pointer shrink-0"
        >
          <Plus size={17} /> {t.create.tabTournament}
        </Link>
      </div>

      {params.created && (
        <p className="bg-green/10 text-green rounded-xl p-4 text-sm">{t.createdBanner}</p>
      )}

      <Suspense>
        <FilterBar levels={t.create.levels} showLevel={false} />
      </Suspense>

      {list.length === 0 ? (
        <p className="text-ink-soft py-8">
          {tournaments.length === 0 ? t.noData : "Нет турниров по этому фильтру."}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {list.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 60}>
              <TournamentCard tournament={tr} t={t} lang={lang} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
