import Link from "next/link";
import { Calendar, MapPin, Users, Banknote, Gauge, Phone, BadgeCheck } from "lucide-react";
import type { Game } from "@/lib/types";
import type { Dict, Lang } from "@/lib/i18n";
import { gameTimeStatus } from "@/lib/gameStatus";
import { SportBadge } from "./SportBadge";

export function fmtDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleString(lang === "ky" ? "ky-KG" : "ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GameCard({ game, t, lang }: { game: Game; t: Dict; lang: Lang }) {
  const joined = game.game_players?.length ?? 0;
  const free = game.max_players - joined;
  const accent = game.sport === "padel" ? "text-green" : "text-burgundy";
  const ts = gameTimeStatus(game.starts_at);
  return (
    <Link
      href={`/games/${game.id}`}
      className="lift block rounded-2xl border border-line bg-surface p-5 flex flex-col gap-3.5 hover:shadow-[0_12px_30px_-12px_rgba(22,36,29,0.18)] hover:border-line cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <SportBadge sport={game.sport} t={t} />
        {ts === "live" ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-burgundy/10 text-burgundy">
            <span className="w-1.5 h-1.5 rounded-full bg-burgundy animate-pulse" /> Идёт
          </span>
        ) : ts === "finished" ? (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-line-soft text-ink-soft">
            Завершена
          </span>
        ) : (
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              free > 0 ? "bg-green/10 text-green" : "bg-line-soft text-ink-soft"
            }`}
          >
            {free > 0 ? `${free} ${t.freeSlots}` : t.statusMap.full}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-ink-soft">
        <span className="flex items-center gap-2.5">
          <Calendar size={15} className={accent} />
          {fmtDate(game.starts_at, lang)}
        </span>
        {game.courts && (
          <span className="flex items-center gap-2.5">
            <MapPin size={15} className={accent} />
            {game.courts.name}
          </span>
        )}
        <span className="flex items-center gap-2.5">
          <Users size={15} className={accent} />
          {joined}/{game.max_players} {t.players}
        </span>
        {game.level && (
          <span className="flex items-center gap-2.5">
            <Gauge size={15} className={accent} />
            {game.level}
          </span>
        )}
        {game.price_som != null && (
          <span className="flex items-center gap-2.5">
            <Banknote size={15} className={accent} />
            {game.price_som} {t.som}
          </span>
        )}
        {game.court_booked && (
          <span className="flex items-center gap-2.5 text-green">
            <BadgeCheck size={15} />
            {t.create.booked}
          </span>
        )}
        {game.organizer_contact && (
          <span className="flex items-center gap-2.5">
            <Phone size={15} className={accent} />
            {game.organizer_name ? `${game.organizer_name} · ` : ""}
            {game.organizer_contact}
          </span>
        )}
      </div>

      {game.comment && <p className="text-sm text-ink-soft/80">{game.comment}</p>}

      {(game.game_players?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {game.game_players!.map((gp) => (
            <span
              key={gp.player_id}
              className="text-xs bg-cream border border-line-soft rounded-full px-2.5 py-1 font-medium text-ink-soft"
            >
              {gp.players?.full_name ?? "?"}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
