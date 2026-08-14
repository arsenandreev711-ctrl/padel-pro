import Link from "next/link";
import type { Sport } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

export function SportTabs({
  active,
  base,
  t,
}: {
  active: Sport;
  base: string;
  t: Dict;
}) {
  const tabs: { key: Sport; label: string; color: string }[] = [
    { key: "padel", label: t.padel, color: "text-green" },
    { key: "tennis", label: t.tennis, color: "text-burgundy" },
  ];
  return (
    <div className="inline-flex rounded-full bg-surface p-1 border border-line">
      {tabs.map((tab) => {
        const on = active === tab.key;
        return (
          <Link
            key={tab.key}
            href={`${base}?sport=${tab.key}`}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-200 cursor-pointer ${
              on
                ? tab.key === "padel"
                  ? "bg-green text-white"
                  : "bg-burgundy text-white"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
