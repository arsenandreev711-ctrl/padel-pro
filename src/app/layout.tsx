import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { getDict, type Lang } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { isDemo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Padel-PRO — рейтинг падела и тенниса в Кыргызстане",
  description:
    "Рейтинг игроков, запись на игры, турниры по паделу и теннису в Бишкеке и Кыргызстане",
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
          <div className="bg-accent/15 text-fg text-center text-sm py-2 px-4 border-b border-line">
            {t.demoBanner}
          </div>
        )}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-line bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-fg/60 flex flex-wrap gap-2 justify-between">
            <span>© {new Date().getFullYear()} {t.footer}</span>
            <span>Бишкек, Кыргызстан 🇰🇬</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
