"use client";

import { useState } from "react";
import type { CourtSide, Sport } from "@/lib/types";

const OPTIONS: { key: CourtSide; label: string; hint: string }[] = [
  { key: "L", label: "L", hint: "Левая" },
  { key: "R", label: "R", hint: "Правая" },
  { key: "both", label: "Оба", hint: "Универсал" },
];

/** Выбор стороны корта (лево/право/оба) для падела и тенниса. */
export function SideControl({
  sport,
  initial,
  editable = true,
}: {
  sport: Sport;
  initial?: CourtSide | null;
  editable?: boolean;
}) {
  const [side, setSide] = useState<CourtSide | null>(initial ?? null);
  const activeBg = sport === "padel" ? "bg-green" : "bg-burgundy";
  const label = sport === "padel" ? "Падел" : "Теннис";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Сторона корта · {label}
      </span>
      <div className="inline-flex rounded-full border border-line bg-cream p-1 self-start">
        {OPTIONS.map((o) => {
          const on = side === o.key;
          return (
            <button
              key={o.key}
              type="button"
              disabled={!editable}
              onClick={() => editable && setSide(o.key)}
              title={o.hint}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                editable ? "cursor-pointer" : "cursor-default"
              } ${on ? `${activeBg} text-white` : "text-ink-soft hover:text-ink"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {side && (
        <span className="text-[11px] text-ink-soft">
          {OPTIONS.find((o) => o.key === side)?.hint} сторона
        </span>
      )}
    </div>
  );
}
