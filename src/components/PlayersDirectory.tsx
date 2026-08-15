"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";

export type DirRow = {
  id: string;
  name: string;
  city: string;
  avatar: string | null;
  padel: { text: string; color: string } | null;
  tennis: { text: string; color: string } | null;
};

function Avatar({ name, src }: { name: string; src: string | null }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-green to-burgundy text-white flex items-center justify-center text-sm font-bold shrink-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials || "•"
      )}
    </span>
  );
}

export function PlayersDirectory({ rows }: { rows: DirRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(s) || r.city.toLowerCase().includes(s)
    );
  }, [q, rows]);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по имени или городу"
          className="w-full rounded-full border border-line bg-cream pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-soft py-8">Никого не нашлось.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/players/${r.id}`}
              className="lift rounded-2xl border border-line bg-surface p-4 flex items-center gap-3 hover:border-ink-soft cursor-pointer"
            >
              <Avatar name={r.name} src={r.avatar} />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-semibold truncate">{r.name}</span>
                <span className="text-xs text-ink-soft flex items-center gap-1">
                  <MapPin size={11} /> {r.city}
                </span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {r.padel && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: r.padel.color }}
                    >
                      Падел {r.padel.text}
                    </span>
                  )}
                  {r.tennis && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: r.tennis.color }}
                    >
                      Теннис {r.tennis.text}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
