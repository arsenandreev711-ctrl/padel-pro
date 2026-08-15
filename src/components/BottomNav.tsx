"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Plus, CalendarDays, User } from "lucide-react";

type NavUser = { id: string } | null;

export function BottomNav({ user }: { user: NavUser }) {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/rating", label: "Рейтинг", icon: Trophy },
    { href: "/create", label: "Создать", icon: Plus, center: true },
    { href: "/games", label: "Игры", icon: CalendarDays },
    {
      href: user ? `/players/${user.id}` : "/login",
      label: user ? "Профиль" : "Войти",
      icon: User,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur-md border-t border-line"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-end">
        {items.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          if (it.center) {
            return (
              <Link
                key={it.href}
                href={it.href}
                className="flex flex-col items-center justify-center -mt-4"
                aria-label={it.label}
              >
                <span className="w-12 h-12 rounded-2xl bg-green text-white flex items-center justify-center shadow-lg shadow-green/30 active:scale-95 transition-transform">
                  <it.icon size={24} />
                </span>
                <span className="text-[10px] font-medium text-ink-soft mt-0.5">{it.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-1 py-2.5 ${
                active ? "text-green" : "text-ink-soft"
              }`}
            >
              <it.icon size={21} />
              <span className="text-[10px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
