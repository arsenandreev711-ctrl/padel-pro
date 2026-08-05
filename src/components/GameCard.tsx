import { Calendar, MapPin, Users, Banknote } from "lucide-react";
import type { Game } from "@/lib/types";
import type { Dict } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
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
  return (
    <div className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-3 hover:shadow-lg hover:border-primary/40 transition-all duration-200">
      <div className="flex items-center justify-between">
        <SportBadge sport={game.sport} t={t} />
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            game.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-muted text-fg/60"
          }`}
        >
          {t.statusMap[game.status]}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-fg/80">
        <span className="flex items-center gap-2">
          <Calendar size={15} className="text-primary" />
          {fmtDate(game.starts_at, lang)}
        </span>
        {game.courts && (
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-primary" />
            {game.courts.name}
            {game.courts.address ? `, ${game.courts.address}` : ""}
          </span>
        )}
        <span className="flex items-center gap-2">
          <Users size={15} className="text-primary" />
          {joined}/{game.max_players} {t.players}
          {free > 0 && (
            <span className="text-green-700 font-semibold">
              · {free} {t.freeSlots}
            </span>
          )}
        </span>
        {game.price_som != null && (
          <span className="flex items-center gap-2">
            <Banknote size={15} className="text-primary" />
            {game.price_som} {t.som}
          </span>
        )}
      </div>

      {game.comment && <p className="text-sm text-fg/60">{game.comment}</p>}

      {(game.game_players?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {game.game_players!.map((gp) => (
            <span
              key={gp.player_id}
              className="text-xs bg-muted rounded-full px-2.5 py-1 font-medium"
            >
              {gp.players?.full_name ?? "?"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
