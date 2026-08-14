import type { Sport } from "@/lib/types";
import { tiersFor } from "@/lib/grading";

/** Понятная легенда уровней: падел D→A, теннис NTRP 1–7 */
export function RatingScale({ sport }: { sport: Sport }) {
  const tiers = tiersFor(sport);
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            sport === "padel" ? "bg-green" : "bg-burgundy"
          }`}
        />
        <h3 className="font-bold display text-lg">
          {sport === "padel"
            ? "Уровни падела · D → A (1.0–7.0)"
            : "Уровни тенниса · NTRP 1.0–7.0"}
        </h3>
      </div>
      <div className="flex flex-col divide-y divide-line-soft">
        {tiers.map((tr) => (
          <div key={tr.key} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span
              className="shrink-0 w-11 h-11 rounded-xl text-white font-extrabold display flex items-center justify-center text-sm"
              style={{ backgroundColor: tr.color }}
            >
              {tr.label}
            </span>
            <div>
              <p className="font-semibold text-sm">
                {tr.name}{" "}
                <span className="text-ink-soft font-normal">
                  · {tr.min.toFixed(1)}–{tr.max.toFixed(1)}
                </span>
              </p>
              <p className="text-sm text-ink-soft">{tr.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
