import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Banknote,
  Gauge,
  Gift,
  ArrowLeft,
  MessageSquare,
  UserPlus,
  LogOut,
  Check,
  Trophy,
} from "lucide-react";
import { getLang } from "@/lib/lang";
import { getTournament } from "@/lib/data";
import { currentUser } from "@/lib/auth";
import { joinTournament, leaveTournament } from "@/app/tournaments/actions";
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
  const tr = await getTournament(id);
  if (!tr) return { title: "Турнир — Rally" };
  const sport = tr.sport === "padel" ? "Падел" : "Теннис";
  const when = new Date(tr.starts_at).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const title = `${tr.name} · ${sport} — Rally`;
  const desc = `Турнир ${tr.format} · ${when}${tr.courts ? " · " + tr.courts.name : ""}${
    tr.price_som != null ? " · взнос " + tr.price_som + " сом" : ""
  }. Регистрируйся!`;
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

export default async function TournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { lang, t } = await getLang();
  const { id } = await params;
  const { created } = await searchParams;
  const [tr, me] = await Promise.all([getTournament(id), currentUser()]);
  if (!tr) notFound();

  const participants = tr.tournament_players ?? [];
  const joined = participants.length;
  const free = tr.max_players - joined;
  const iJoined = me ? participants.some((p) => p.player_id === me.id) : false;
  const accent = tr.sport === "padel" ? "text-green" : "text-burgundy";
  const shareText = `Турнир «${tr.name}» · ${fmtDate(tr.starts_at, lang)} — регистрируйся на Rally`;
  const cHref = tr.organizer_contact ? contactHref(tr.organizer_contact) : null;

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Все турниры
      </Link>

      {created && (
        <p className="bg-green/10 text-green rounded-xl p-4 text-sm">
          Турнир создан! Отправь ссылку игрокам — ниже кнопка «Поделиться».
        </p>
      )}

      <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <SportBadge sport={tr.sport} t={t} />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cream border border-line-soft text-ink-soft">
            {t.statusMap[tr.status]}
          </span>
        </div>

        <h1 className="text-3xl font-bold display leading-tight">{tr.name}</h1>

        <div className="flex flex-col gap-2.5 text-[15px] text-ink-soft">
          <span className="flex items-center gap-2.5">
            <Calendar size={17} className={accent} />
            {fmtDate(tr.starts_at, lang)}
          </span>
          {tr.courts && (
            <span className="flex items-center gap-2.5">
              <MapPin size={17} className={accent} />
              {tr.courts.name}
              {tr.courts.address ? `, ${tr.courts.address}` : ""}
            </span>
          )}
          <span className="flex items-center gap-2.5">
            <Trophy size={17} className={accent} />
            {t.format}: {tr.format}
          </span>
          {tr.level && (
            <span className="flex items-center gap-2.5">
              <Gauge size={17} className={accent} />
              {tr.level}
            </span>
          )}
          {tr.price_som != null && (
            <span className="flex items-center gap-2.5">
              <Banknote size={17} className={accent} />
              {t.create.entryFee}: {tr.price_som} {t.som}
            </span>
          )}
          {tr.prizes && (
            <span className="flex items-start gap-2.5">
              <Gift size={17} className={`${accent} mt-0.5`} />
              {tr.prizes}
            </span>
          )}
        </div>

        {tr.description && (
          <p className="text-[15px] text-ink-soft/90 bg-cream rounded-xl p-3.5">{tr.description}</p>
        )}

        {tr.organizer_contact && (
          <div className="flex flex-col gap-2 border-t border-line-soft pt-4">
            <span className="text-sm font-medium text-ink">Организатор</span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink-soft">
                {tr.organizer_name ? `${tr.organizer_name} · ` : ""}
                {tr.organizer_contact}
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

      {/* Участники + регистрация */}
      <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink flex items-center gap-2">
            <Users size={16} className={accent} /> Участники {joined}/{tr.max_players}
          </span>
          {free > 0 ? (
            <span className="text-xs text-green font-semibold">{free} мест</span>
          ) : (
            <span className="text-xs text-ink-soft font-semibold">Мест нет</span>
          )}
        </div>

        {participants.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <PlayerChip key={p.player_id} player={p.players} you={me?.id === p.player_id} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">Пока никто не зарегистрирован — стань первым!</p>
        )}

        {!me ? (
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors"
          >
            <UserPlus size={18} /> Войти и зарегистрироваться
          </Link>
        ) : iJoined ? (
          <form action={leaveTournament}>
            <input type="hidden" name="tournament_id" value={tr.id} />
            <div className="flex items-center gap-2">
              <span className="flex-1 inline-flex items-center justify-center gap-2 bg-green/10 text-green font-semibold px-4 py-3 rounded-full">
                <Check size={18} /> Ты зарегистрирован
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-line text-ink-soft font-medium px-4 py-3 rounded-full hover:border-burgundy hover:text-burgundy transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Отменить
              </button>
            </div>
          </form>
        ) : free > 0 ? (
          <form action={joinTournament}>
            <input type="hidden" name="tournament_id" value={tr.id} />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
            >
              <UserPlus size={18} /> Зарегистрироваться
            </button>
          </form>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 bg-line-soft text-ink-soft font-semibold px-6 py-3 rounded-full">
            Мест нет
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <ShareButton title="Rally — турнир" text={shareText} />
      </div>
    </div>
  );
}
