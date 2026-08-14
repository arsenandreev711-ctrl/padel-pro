import type { Sport } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

export function SportBadge({ sport, t }: { sport: Sport; t: Dict }) {
  const isPadel = sport === "padel";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
        isPadel
          ? "bg-green/10 text-green"
          : "bg-burgundy/10 text-burgundy"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPadel ? "bg-green" : "bg-burgundy"
        }`}
      />
      {isPadel ? t.padel : t.tennis}
    </span>
  );
}
