import { Calendar, MapPin, Users, Banknote, Gauge, Phone, Gift } from "lucide-react";
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
  const accent = tr.sport === "padel" ? "text-green" : "text-burgundy";
  return (
    <div className="lift rounded-2xl border border-line bg-surface p-6 flex flex-col gap-3.5 hover:shadow-[0_16px_40px_-16px_rgba(22,36,29,0.2)]">
      <div className="flex items-center justify-between gap-2">
        <SportBadge sport={tr.sport} t={t} />
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cream border border-line-soft text-ink-soft">
          {t.statusMap[tr.status]}
        </span>
      </div>

      <h3 className="text-2xl font-bold display leading-tight">{tr.name}</h3>

      <div className="flex flex-col gap-2 text-sm text-ink-soft">
        <span className="flex items-center gap-2.5">
          <Calendar size={15} className={accent} />
          {fmtDate(tr.starts_at, lang)}
        </span>
        {tr.courts && (
          <span className="flex items-center gap-2.5">
            <MapPin size={15} className={accent} />
            {tr.courts.name}
          </span>
        )}
        <span className="flex items-center gap-2.5">
          <Users size={15} className={accent} />
          {joined}/{tr.max_players} {t.players}
        </span>
        {tr.level && (
          <span className="flex items-center gap-2.5">
            <Gauge size={15} className={accent} />
            {tr.level}
          </span>
        )}
        {tr.price_som != null && (
          <span className="flex items-center gap-2.5">
            <Banknote size={15} className={accent} />
            {t.create.entryFee}: {tr.price_som} {t.som}
          </span>
        )}
        {tr.prizes && (
          <span className="flex items-start gap-2.5">
            <Gift size={15} className={`${accent} mt-0.5`} />
            {tr.prizes}
          </span>
        )}
        {tr.organizer_contact && (
          <span className="flex items-center gap-2.5">
            <Phone size={15} className={accent} />
            {tr.organizer_name ? `${tr.organizer_name} · ` : ""}
            {tr.organizer_contact}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-ink-soft">{t.format}</span>
        <span className="font-semibold px-2 py-0.5 rounded-full bg-cream border border-line-soft">
          {tr.format}
        </span>
      </div>

      {tr.description && (
        <p className="text-sm text-ink-soft/80">{tr.description}</p>
      )}
    </div>
  );
}
