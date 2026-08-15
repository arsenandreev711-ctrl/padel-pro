import Link from "next/link";
import { Emblem } from "@/components/Emblem";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <Emblem size={56} />
      <h1 className="text-4xl sm:text-5xl font-bold display">Страница не найдена</h1>
      <p className="text-ink-soft max-w-sm">
        Похоже, такой страницы нет или она была удалена.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors"
      >
        На главную
      </Link>
    </div>
  );
}
