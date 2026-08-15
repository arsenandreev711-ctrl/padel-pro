import Link from "next/link";
import { Plus } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getRecentMatches, getPlayersMap } from "@/lib/data";
import { SportBadge } from "@/components/SportBadge";
import { fmtDate } from "@/components/GameCard";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ recorded?: string }>;
}) {
  const { lang, t } = await getLang();
  const [matches, params] = await Promise.all([getRecentMatches(40), searchParams]);
  const ids = [...new Set(matches.flatMap((m) => [...m.team1, ...m.team2]))];
  const names = await getPlayersMap(ids);
  const name = (pid: string) => names[pid]?.full_name ?? "Игрок";

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-5xl font-bold display">Матчи</h1>
          <p className="text-ink-soft">Результаты игр сообщества и пересчёт рейтинга</p>
        </div>
        <Link
          href="/matches/new"
          className="inline-flex items-center gap-2 bg-green text-white font-semibold px-5 py-2.5 rounded-full hover:bg-green-deep transition-colors cursor-pointer shrink-0"
        >
          <Plus size={17} /> Записать матч
        </Link>
      </div>

      {params.recorded && (
        <p className="bg-green/10 text-green rounded-xl p-4 text-sm">
          Матч записан — рейтинг участников обновлён.
        </p>
      )}

      {matches.length === 0 ? (
        <p className="text-ink-soft py-8">
          Пока нет сыгранных матчей. Запиши первый!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((m, i) => {
            const t1won = m.winner === 1;
            return (
              <Reveal key={m.id} delay={Math.min(i, 8) * 40}>
                <div className="rounded-2xl border border-line bg-surface p-4 flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
                  <div className="flex items-center gap-3">
                    <SportBadge sport={m.sport} t={t} />
                    <span className="text-sm text-ink-soft">{fmtDate(m.played_at, lang)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span className={t1won ? "text-green font-semibold" : "text-ink-soft"}>
                      {m.team1.map(name).join(" / ")}
                    </span>
                    <span className="text-ink-soft/50">{t.vs}</span>
                    <span className={!t1won ? "text-green font-semibold" : "text-ink-soft"}>
                      {m.team2.map(name).join(" / ")}
                    </span>
                  </div>
                  <span className="font-bold display text-lg tabular-nums">{m.score}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
