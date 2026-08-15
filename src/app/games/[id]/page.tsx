import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Banknote,
  Gauge,
  BadgeCheck,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { getLang } from "@/lib/lang";
import { getGame } from "@/lib/data";
import { fmtDate } from "@/components/GameCard";
import { SportBadge } from "@/components/SportBadge";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-dynamic";

function contactHref(contact: string): string | null {
  const c = contact.trim();
  if (c.startsWith("@")) return `https://t.me/${c.slice(1)}`;
  const digits = c.replace(/[^0-9]/g, "");
  if (digits.length >= 9) return `https://wa.me/${digits}`;
  return null;
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { lang, t } = await getLang();
  const { id } = await params;
  const { created } = await searchParams;
  const game = await getGame(id);
  if (!game) notFound();

  const joined = game.game_players?.length ?? 0;
  const free = game.max_players - joined;
  const accent = game.sport === "padel" ? "text-green" : "text-burgundy";
  const sportLabel = game.sport === "padel" ? t.padel : t.tennis;
  const shareText = `${sportLabel} · ${fmtDate(game.starts_at, lang)}${
    game.courts ? " · " + game.courts.name : ""
  } — присоединяйся на Padel-PRO`;

  const cHref = game.organizer_contact ? contactHref(game.organizer_contact) : null;

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Все игры
      </Link>

      {created && (
        <p className="bg-green/10 text-green rounded-xl p-4 text-sm">
          Игра создана! Отправь ссылку друзьям в мессенджерах — ниже кнопка «Поделиться».
        </p>
      )}

      <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SportBadge sport={game.sport} t={t} />
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              free > 0 ? "bg-green/10 text-green" : "bg-line-soft text-ink-soft"
            }`}
          >
            {free > 0 ? `${free} ${t.freeSlots}` : t.statusMap.full}
          </span>
        </div>

        <h1 className="text-3xl font-bold display leading-tight">
          {sportLabel} · {game.level || "любой уровень"}
        </h1>

        <div className="flex flex-col gap-2.5 text-[15px] text-ink-soft">
          <span className="flex items-center gap-2.5">
            <Calendar size={17} className={accent} />
            {fmtDate(game.starts_at, lang)}
          </span>
          {game.courts && (
            <span className="flex items-center gap-2.5">
              <MapPin size={17} className={accent} />
              {game.courts.name}
              {game.courts.address ? `, ${game.courts.address}` : ""}
            </span>
          )}
          <span className="flex items-center gap-2.5">
            <Users size={17} className={accent} />
            {joined}/{game.max_players} {t.players}
          </span>
          {game.level && (
            <span className="flex items-center gap-2.5">
              <Gauge size={17} className={accent} />
              {game.level}
            </span>
          )}
          {game.price_som != null && (
            <span className="flex items-center gap-2.5">
              <Banknote size={17} className={accent} />
              {game.price_som} {t.som}
            </span>
          )}
          {game.court_booked && (
            <span className="flex items-center gap-2.5 text-green">
              <BadgeCheck size={17} />
              {t.create.booked}
            </span>
          )}
        </div>

        {game.comment && (
          <p className="text-[15px] text-ink-soft/90 bg-cream rounded-xl p-3.5">{game.comment}</p>
        )}

        {game.organizer_contact && (
          <div className="flex flex-col gap-2 border-t border-line-soft pt-4">
            <span className="text-sm font-medium text-ink">Организатор</span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink-soft">
                {game.organizer_name ? `${game.organizer_name} · ` : ""}
                {game.organizer_contact}
              </span>
              {cHref && (
                <a
                  href={cHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-deep transition-colors shrink-0"
                >
                  <MessageSquare size={15} /> Написать
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <ShareButton title="Padel-PRO — открытая игра" text={shareText} />
      </div>
    </div>
  );
}
