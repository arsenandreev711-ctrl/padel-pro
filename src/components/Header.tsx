"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Trophy } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export function Header({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/rating", label: t.nav.rating },
    { href: "/games", label: t.nav.games },
    { href: "/tournaments", label: t.nav.tournaments },
  ];

  const other: Lang = lang === "ru" ? "ky" : "ru";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="bg-primary text-on-primary rounded-lg p-1.5 group-hover:bg-secondary transition-colors duration-200">
            <Trophy size={20} />
          </span>
          <span className="display text-2xl font-bold tracking-tight">
            Padel<span className="text-primary">-PRO</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                pathname === l.href
                  ? "bg-primary text-on-primary"
                  : "text-fg/70 hover:bg-muted hover:text-fg"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`/api/lang?to=${other}&back=${encodeURIComponent(pathname)}`}
            className="text-xs font-bold border border-line rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors duration-200 cursor-pointer uppercase"
            title={other === "ky" ? "Кыргызча" : "Русский"}
          >
            {other === "ky" ? "KY" : "RU"}
          </a>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line bg-white px-4 py-2 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-3 rounded-lg font-semibold ${
                pathname === l.href ? "text-primary" : "text-fg/80"
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
