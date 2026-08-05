import type { Sport } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

export function SportBadge({ sport, t }: { sport: Sport; t: Dict }) {
  return (
    <span
      className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
        sport === "padel"
          ? "bg-primary/10 text-primary"
          : "bg-secondary/10 text-secondary"
      }`}
    >
      {sport === "padel" ? t.padel : t.tennis}
    </span>
  );
}
