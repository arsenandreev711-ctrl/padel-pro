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
  const tabs: { key: Sport; label: string }[] = [
    { key: "padel", label: t.padel },
    { key: "tennis", label: t.tennis },
  ];
  return (
    <div className="inline-flex rounded-xl bg-muted p-1 border border-line">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`${base}?sport=${tab.key}`}
          className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors duration-200 cursor-pointer ${
            active === tab.key
              ? "bg-primary text-on-primary shadow"
              : "text-fg/60 hover:text-fg"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
