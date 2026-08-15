import Link from "next/link";
import { Plus, Clock, Check, X } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getRecentMatches, getPendingMatchesFor, getPlayersMap } from "@/lib/data";
import { currentUser } from "@/lib/auth";
import { confirmMatch, rejectMatch } from "@/app/matches/actions";
import { SportBadge } from "@/components/SportBadge";
import { fmtDate } from "@/components/GameCard";
import { Reveal } from "@/components/Reveal";
import type { Match } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ recorded?: string; pending?: string; confirmed?: string; rejected?: string }>;
}) {
  const { lang, t } = await getLang();
  const [matches, me, params] = await Promise.all([
    getRecentMatches(40),
    currentUser(),
    searchParams,
  ]);
  const pending = me ? await getPendingMatchesFor(me.id) : [];

  const ids = [
    ...new Set([...matches, ...pending].flatMap((m) => [...m.team1, ...m.team2])),
  ];
  const names = await getPlayersMap(ids);
  const name = (pid: string) => names[pid]?.full_name ?? "Игрок";

  const teams = (m: Match, highlightWinner: boolean) => {
    const t1won = m.winner === 1;
    return (
      <div className="flex items-center gap-3 text-sm font-medium">
        <span className={highlightWinner && t1won ? "text-green font-semibold" : "text-ink-soft"}>
          {m.team1.map(name).join(" / ")}
        </span>
        <span className="text-ink-soft/50">{t.vs}</span>
        <span className={highlightWinner && !t1won ? "text-green font-semibold" : "text-ink-soft"}>
          {m.team2.map(name).join(" / ")}
        </span>
      </div>
    );
  };

  const banner =
    params.confirmed
      ? "Матч подтверждён — рейтинг обновлён."
      : params.pending
      ? "Матч записан и отправлен сопернику на подтверждение."
      : params.rejected
      ? "Матч отклонён и удалён."
      : params.recorded
      ? "Матч записан."
      : null;

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

      {banner && <p className="bg-green/10 text-green rounded-xl p-4 text-sm">{banner}</p>}

      {/* Ожидают подтверждения */}
      {pending.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold display flex items-center gap-2">
            <Clock size={18} className="text-burgundy" /> На подтверждении
          </h2>
          {pending.map((m) => {
            const canConfirm = me && m.created_by !== me.id;
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-burgundy/25 bg-burgundy/5 p-4 flex flex-wrap items-center gap-x-4 gap-y-3 justify-between"
              >
                <div className="flex items-center gap-3">
                  <SportBadge sport={m.sport} t={t} />
                  {teams(m, true)}
                  <span className="font-bold display text-lg tabular-nums">{m.score}</span>
                </div>
                {canConfirm ? (
                  <div className="flex items-center gap-2">
                    <form action={confirmMatch}>
                      <input type="hidden" name="match_id" value={m.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 bg-green text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
                      >
                        <Check size={15} /> Подтвердить
                      </button>
                    </form>
                    <form action={rejectMatch}>
                      <input type="hidden" name="match_id" value={m.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 border border-line text-ink-soft text-sm font-medium px-4 py-2 rounded-full hover:border-burgundy hover:text-burgundy transition-colors cursor-pointer"
                      >
                        <X size={15} /> Отклонить
                      </button>
                    </form>
                  </div>
                ) : (
                  <span className="text-xs text-ink-soft font-medium">Ждёт подтверждения соперника</span>
                )}
              </div>
            );
          })}
        </section>
      )}

      {matches.length === 0 ? (
        <p className="text-ink-soft py-8">Пока нет подтверждённых матчей. Запиши первый!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((m, i) => (
            <Reveal key={m.id} delay={Math.min(i, 8) * 40}>
              <div className="rounded-2xl border border-line bg-surface p-4 flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
                <div className="flex items-center gap-3">
                  <SportBadge sport={m.sport} t={t} />
                  <span className="text-sm text-ink-soft">{fmtDate(m.played_at, lang)}</span>
                </div>
                {teams(m, true)}
                <span className="font-bold display text-lg tabular-nums">{m.score}</span>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
