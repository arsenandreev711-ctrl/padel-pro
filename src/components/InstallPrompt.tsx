"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

const DISMISS_KEY = "padelpro_a2hs_dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [iosTip, setIosTip] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* ignore */
    }
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari не поддерживает beforeinstallprompt
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|chrome/i.test(ua);
    if (isIOS && isSafari) {
      setIosTip(true);
      setShow(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (!show) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-[68px] z-30 px-3">
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface shadow-[0_10px_30px_-10px_rgba(22,36,29,0.25)] p-3 flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-green/10 text-green flex items-center justify-center shrink-0">
          <Download size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Установи приложение</p>
          {iosTip ? (
            <p className="text-xs text-ink-soft flex items-center gap-1 flex-wrap">
              Нажми <Share size={12} className="inline" /> «Поделиться» → «На экран „Домой“»
            </p>
          ) : (
            <p className="text-xs text-ink-soft">Быстрый доступ с главного экрана телефона</p>
          )}
        </div>
        {!iosTip && (
          <button
            onClick={install}
            className="bg-green text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-deep transition-colors cursor-pointer shrink-0"
          >
            Установить
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Закрыть"
          className="p-1.5 text-ink-soft hover:text-ink cursor-pointer shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
