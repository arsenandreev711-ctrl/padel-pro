import Link from "next/link";
import {
  UserPlus,
  Gauge,
  Plus,
  Users,
  Swords,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { getLang } from "@/lib/lang";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const steps = [
  {
    icon: UserPlus,
    title: "Зарегистрируйся по номеру",
    text: "Имя, фамилия и фото — за десять секунд. Вход по телефону, без паролей.",
  },
  {
    icon: Gauge,
    title: "Определи свой уровень",
    text: "Короткая анкета рассчитает стартовый рейтинг: падел (D–A) и теннис (NTRP 1–7). Дальше он уточняется по матчам.",
  },
  {
    icon: Plus,
    title: "Создай игру или турнир",
    text: "Выбери корт, время, уровень и цену. Ссылку на игру кинь в WhatsApp или Telegram — развернётся аккуратной карточкой.",
  },
  {
    icon: Users,
    title: "Записывайся к другим",
    text: "Нашёл открытую игру — жми «Записаться». Собирай пару 2×2 в паделе или соперника 1×1 в теннисе.",
  },
  {
    icon: Swords,
    title: "Играй и записывай результат",
    text: "После матча внеси счёт. Соперник подтверждает — и рейтинг Elo всех участников пересчитывается автоматически.",
  },
  {
    icon: Trophy,
    title: "Расти в рейтинге",
    text: "Побеждай, поднимайся в таблице, участвуй в турнирах и собирай награды за призовые места.",
  },
];

export default async function HowPage() {
  await getLang();
  const me = await currentUser();

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div className="flex flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-green" /> Падел × Теннис
          <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold display">Как это работает</h1>
        <p className="text-ink-soft text-lg">
          Rally объединяет падел- и теннис-сообщество Кыргызстана: находи партнёров,
          играй на кортах Бишкека и следи за своим рейтингом.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-green/10 text-green flex items-center justify-center shrink-0">
                <s.icon size={18} />
              </span>
              <span className="text-xs font-bold text-ink-soft/60 tabular-nums">
                Шаг {i + 1}
              </span>
            </div>
            <h2 className="font-bold display text-lg leading-tight">{s.title}</h2>
            <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-ink text-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <p className="display text-xl font-semibold max-w-md">
          {me ? "Готов играть? Создай первую игру." : "Присоединяйся — это бесплатно."}
        </p>
        <Link
          href={me ? "/create" : "/login?tab=register"}
          className="inline-flex items-center gap-2 bg-cream text-ink font-semibold px-6 py-3 rounded-full hover:bg-white transition-colors shrink-0"
        >
          {me ? "Создать игру" : "Зарегистрироваться"} <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
