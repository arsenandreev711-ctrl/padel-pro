"use client";

import { useState } from "react";
import { Share2, Check, Copy, Send, MessageCircle } from "lucide-react";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  function currentUrl() {
    if (typeof window === "undefined") return "";
    return window.location.href.split("?")[0];
  }

  async function nativeShare() {
    const url = currentUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* пользователь отменил */
      }
    } else {
      copy();
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const url = currentUrl();
  const msg = encodeURIComponent(`${text} ${url}`);
  const wa = `https://wa.me/?text=${msg}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={nativeShare}
        className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
      >
        <Share2 size={18} /> Поделиться игрой
      </button>
      <div className="flex items-center gap-2">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 border border-line rounded-full px-4 py-2.5 text-sm font-medium hover:border-green transition-colors"
        >
          <MessageCircle size={16} className="text-green" /> WhatsApp
        </a>
        <a
          href={tg}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 border border-line rounded-full px-4 py-2.5 text-sm font-medium hover:border-green transition-colors"
        >
          <Send size={16} className="text-green" /> Telegram
        </a>
        <button
          onClick={copy}
          aria-label="Скопировать ссылку"
          className="inline-flex items-center justify-center gap-2 border border-line rounded-full px-4 py-2.5 text-sm font-medium hover:border-green transition-colors cursor-pointer"
        >
          {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
          {copied ? "Готово" : "Ссылка"}
        </button>
      </div>
    </div>
  );
}
