"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterBar({
  levels,
  showLevel = true,
}: {
  levels: readonly string[];
  showLevel?: boolean;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();
  const sport = sp.get("sport") || "all";
  const level = sp.get("level") || "all";

  function withParam(key: string, val: string) {
    const p = new URLSearchParams(sp.toString());
    if (val === "all") p.delete(key);
    else p.set(key, val);
    p.delete("created");
    const q = p.toString();
    return pathname + (q ? `?${q}` : "");
  }

  const sports = [
    { v: "all", l: "Все" },
    { v: "padel", l: "Падел" },
    { v: "tennis", l: "Теннис" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 p-1 rounded-full border border-line bg-cream">
        {sports.map((s) => (
          <Link
            key={s.v}
            href={withParam("sport", s.v)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              sport === s.v ? "bg-green text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {s.l}
          </Link>
        ))}
      </div>
      {showLevel && (
        <select
          value={level}
          onChange={(e) => router.push(withParam("level", e.target.value))}
          className="rounded-full border border-line bg-cream px-4 py-2 text-sm outline-none focus:border-green cursor-pointer"
        >
          <option value="all">Любой уровень</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
