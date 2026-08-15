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
  UserPlus,
  LogOut,
  Check,
} from "lucide-react";
import { getLang } from "@/lib/lang";
import { getGame } from "@/lib/data";
import { currentUser } from "@/lib/auth";
import { joinGame, leaveGame } from "@/app/games/actions";
import { fmtDate } from "@/components/GameCard";
import { SportBadge } from "@/components/SportBadge";
import { ShareButton } from "@/components/ShareButton";
import { PlayerChip } from "@/components/PlayerChip";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) return { title: "Игра — Padel-PRO" };
  const sport = game.sport === "padel" ? "Падел" : "Теннис";
  const when = new Date(game.starts_at).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const title = `${sport} · ${when}${game.courts ? " · " + game.courts.name : ""} — Padel-PRO`;
  const lvl = game.level && game.level !== "Любой уровень" ? ", уровень " + game.level : "";
  const desc = `Открытая игра${lvl} · до ${game.max_players} игроков${
    game.price_som != null ? " · " + game.price_som + " сом" : ""
  }. Присоединяйся!`;
  return {
    title,
    description: desc,
    openGraph: { type: "website", title, description: desc, images: ["/og.png"] },
    twitter: { card: "summary_large_image", title, description: desc, images: ["/og.png"] },
  };
}

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
  const [game, me] = await Promise.all([getGame(id), currentUser()]);
  if (!game) notFound();

  const participants = game.game_players ?? [];
  const joined = participants.length;
  const free = game.max_players - joined;
  const iJoined = me ? participants.some((p) => p.player_id === me.id) : false;
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

      {/* Участники + запись */}
      <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink flex items-center gap-2">
            <Users size={16} className={accent} /> Игроки {joined}/{game.max_players}
          </span>
          {free > 0 ? (
            <span className="text-xs text-green font-semibold">{free} {t.freeSlots}</span>
          ) : (
            <span className="text-xs text-ink-soft font-semibold">{t.statusMap.full}</span>
          )}
        </div>

        {participants.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <PlayerChip key={p.player_id} player={p.players} you={me?.id === p.player_id} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">Пока никто не записан — будь первым!</p>
        )}

        {!me ? (
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors"
          >
            <UserPlus size={18} /> Войти и записаться
          </Link>
        ) : iJoined ? (
          <form action={leaveGame}>
            <input type="hidden" name="game_id" value={game.id} />
            <div className="flex items-center gap-2">
              <span className="flex-1 inline-flex items-center justify-center gap-2 bg-green/10 text-green font-semibold px-4 py-3 rounded-full">
                <Check size={18} /> Ты записан
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-line text-ink-soft font-medium px-4 py-3 rounded-full hover:border-burgundy hover:text-burgundy transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Выйти
              </button>
            </div>
          </form>
        ) : free > 0 ? (
          <form action={joinGame}>
            <input type="hidden" name="game_id" value={game.id} />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
            >
              <UserPlus size={18} /> Записаться
            </button>
          </form>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 bg-line-soft text-ink-soft font-semibold px-6 py-3 rounded-full">
            Мест нет
          </span>
        )}

        {me && (
          <Link
            href="/matches/new"
            className="text-sm text-ink-soft hover:text-green transition-colors text-center"
          >
            Уже сыграли? Записать результат →
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <ShareButton title="Padel-PRO — открытая игра" text={shareText} />
      </div>
    </div>
  );
}
