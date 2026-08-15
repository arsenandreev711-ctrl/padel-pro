import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { getDict, type Lang } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Emblem } from "@/components/Emblem";
import { isDemo } from "@/lib/data";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  metadataBase: new URL("https://padel-pro-bay.vercel.app"),
  applicationName: "MatePoint",
  title: "MatePoint — рейтинг падела и тенниса в Кыргызстане",
  description:
    "Единая платформа падел- и теннис-сообщества Кыргызстана: рейтинг игроков, запись на игры, турниры и результаты матчей.",
  openGraph: {
    type: "website",
    siteName: "MatePoint",
    locale: "ru_RU",
    title: "MatePoint — падел и теннис Кыргызстана",
    description:
      "Рейтинг игроков, открытые игры на кортах Бишкека, турниры и результаты матчей.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MatePoint — падел и теннис Кыргызстана",
    description:
      "Рейтинг игроков, открытые игры на кортах Бишкека, турниры и результаты матчей.",
    images: ["/og.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MatePoint",
    statusBarStyle: "default",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icons/mark-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/mark.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: ["/icons/mark.png"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ea",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value === "ky" ? "ky" : "ru") as Lang;
  const t = getDict(lang);
  const user = await currentUser();

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        <Header
          lang={lang}
          user={
            user
              ? { id: user.id, full_name: user.full_name, avatar_url: user.avatar_url ?? null }
              : null
          }
        />
        {isDemo() && (
          <div className="bg-burgundy/8 text-burgundy text-center text-xs sm:text-sm py-2 px-4 border-b border-line">
            {t.demoBanner}
          </div>
        )}
        <main className="flex-1 w-full max-w-6xl mx-auto px-5 py-8 sm:py-14 pb-24 md:pb-14">
          {children}
        </main>
        <footer className="border-t border-line pb-20 md:pb-0">
          <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-5">
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
              <a href="/how" className="hover:text-ink transition-colors">Как это работает</a>
              <a href="/rating" className="hover:text-ink transition-colors">{t.nav.rating}</a>
              <a href="/players" className="hover:text-ink transition-colors">Игроки</a>
              <a href="/games" className="hover:text-ink transition-colors">{t.nav.games}</a>
              <a href="/matches" className="hover:text-ink transition-colors">{t.nav.matches}</a>
              <a href="/tournaments" className="hover:text-ink transition-colors">{t.nav.tournaments}</a>
              <a href="/courts" className="hover:text-ink transition-colors">{t.nav.courts}</a>
              <a href="/privacy" className="hover:text-ink transition-colors">Конфиденциальность</a>
            </nav>
            <div className="flex flex-wrap gap-4 items-center justify-between text-sm text-ink-soft border-t border-line-soft pt-5">
              <span className="flex items-center gap-2">
                <Emblem size={22} /> © {new Date().getFullYear()} {t.footer}
              </span>
              <span>Бишкек · Кыргызстан</span>
            </div>
          </div>
        </footer>
        <InstallPrompt />
        <BottomNav user={user ? { id: user.id } : null} />
      </body>
    </html>
  );
}
