import { Calendar, MapPin, Users, Banknote, Medal } from "lucide-react";
import type { Tournament } from "@/lib/types";
import type { Dict, Lang } from "@/lib/i18n";
import { SportBadge } from "./SportBadge";
import { fmtDate } from "./GameCard";

export function TournamentCard({
  tournament: tr,
  t,
  lang,
}: {
  tournament: Tournament;
  t: Dict;
  lang: Lang;
}) {
  const joined = tr.tournament_players?.length ?? 0;
  return (
    <div className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-3 hover:shadow-lg hover:border-secondary/40 transition-all duration-200">
      <div className="flex items-center justify-between gap-2">
        <SportBadge sport={tr.sport} t={t} />
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
          {t.statusMap[tr.status]}
        </span>
      </div>

      <h3 className="text-2xl font-bold display flex items-center gap-2">
        <Medal size={20} className="text-accent" />
        {tr.name}
      </h3>

      <div className="flex flex-col gap-1.5 text-sm text-fg/80">
        <span className="flex items-center gap-2">
          <Calendar size={15} className="text-secondary" />
          {fmtDate(tr.starts_at, lang)}
        </span>
        {tr.courts && (
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-secondary" />
            {tr.courts.name}
          </span>
        )}
        <span className="flex items-center gap-2">
          <Users size={15} className="text-secondary" />
          {joined}/{tr.max_players} {t.players}
        </span>
        {tr.price_som != null && (
          <span className="flex items-center gap-2">
            <Banknote size={15} className="text-secondary" />
            {tr.price_som} {t.som}
          </span>
        )}
        <span className="text-fg/60">
          {t.format}: <b>{tr.format}</b>
        </span>
      </div>

      {tr.description && <p className="text-sm text-fg/60">{tr.description}</p>}
    </div>
  );
}
