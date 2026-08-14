"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";
import { Emblem } from "./Emblem";

export function Header({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/rating", label: t.nav.rating },
    { href: "/games", label: t.nav.games },
    { href: "/tournaments", label: t.nav.tournaments },
    { href: "/courts", label: t.nav.courts },
  ];

  const other: Lang = lang === "ru" ? "ky" : "ru";

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Emblem size={34} className="transition-transform duration-300 group-hover:rotate-[8deg]" />
          <span className="display text-xl font-bold tracking-tight">
            Padel<span className="text-green">·</span>PRO
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  active ? "text-green" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-green" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`/api/lang?to=${other}&back=${encodeURIComponent(pathname)}`}
            className="text-xs font-semibold border border-line rounded-full px-3 py-1.5 text-ink-soft hover:text-ink hover:border-ink-soft transition-colors duration-200 cursor-pointer uppercase tracking-wide"
            title={other === "ky" ? "Кыргызча" : "Русский"}
          >
            {other === "ky" ? "KY" : "RU"}
          </a>
          <button
            className="md:hidden p-2 rounded-full hover:bg-line-soft cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line bg-cream px-5 py-2 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-2 py-3 rounded-lg font-medium ${
                pathname === l.href ? "text-green" : "text-ink/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
