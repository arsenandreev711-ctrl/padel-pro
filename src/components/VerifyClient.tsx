"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send, Check, Loader2 } from "lucide-react";

export function VerifyClient({
  token,
  link,
  playerId,
}: {
  token: string;
  link: string | null;
  playerId: string;
}) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) return;
    let stop = false;
    const tick = async () => {
      try {
        const r = await fetch(`/api/telegram/status?token=${token}`, { cache: "no-store" });
        const j = await r.json();
        if (j.verified && !stop) setVerified(true);
      } catch {
        /* ignore */
      }
    };
    tick();
    const id = setInterval(() => {
      if (!stop && !verified) tick();
    }, 3000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [token, verified]);

  if (verified) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-green/30 bg-green/5 p-8 text-center max-w-md">
        <span className="w-14 h-14 rounded-2xl bg-green text-white flex items-center justify-center">
          <Check size={28} />
        </span>
        <h2 className="text-2xl font-bold display">Номер подтверждён!</h2>
        <p className="text-ink-soft">Теперь у тебя в профиле стоит галочка подтверждения.</p>
        <Link
          href={`/players/${playerId}`}
          className="inline-flex items-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors"
        >
          В профиль
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 max-w-md">
      <ol className="flex flex-col gap-2 text-sm text-ink-soft list-decimal pl-5">
        <li>Открой нашего бота в Telegram.</li>
        <li>Нажми «📱 Поделиться номером».</li>
        <li>Вернись сюда — статус обновится сам.</li>
      </ol>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors"
        >
          <Send size={18} /> Открыть Telegram
        </a>
      ) : (
        <p className="text-sm text-burgundy">Бот пока не настроен. Попробуй позже.</p>
      )}

      <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
        <Loader2 size={15} className="animate-spin" /> Ждём подтверждение…
      </span>
    </div>
  );
}
