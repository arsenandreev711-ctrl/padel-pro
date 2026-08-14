import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { getDict, type Lang } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Emblem } from "@/components/Emblem";
import { isDemo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Padel-PRO — рейтинг падела и тенниса в Кыргызстане",
  description:
    "Единая платформа падел- и теннис-сообщества Кыргызстана: рейтинг игроков, запись на игры, турниры и результаты матчей.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value === "ky" ? "ky" : "ru") as Lang;
  const t = getDict(lang);

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header lang={lang} />
        {isDemo() && (
          <div className="bg-burgundy/8 text-burgundy text-center text-xs sm:text-sm py-2 px-4 border-b border-line">
            {t.demoBanner}
          </div>
        )}
        <main className="flex-1 w-full max-w-6xl mx-auto px-5 py-10 sm:py-14">
          {children}
        </main>
        <footer className="border-t border-line">
          <div className="max-w-6xl mx-auto px-5 py-8 flex flex-wrap gap-4 items-center justify-between text-sm text-ink-soft">
            <span className="flex items-center gap-2">
              <Emblem size={22} /> © {new Date().getFullYear()} {t.footer}
            </span>
            <span>Бишкек · Кыргызстан</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
