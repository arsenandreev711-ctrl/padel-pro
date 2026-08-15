import Link from "next/link";
import type { Player } from "@/lib/types";

/** Аватар+имя игрока, ведёт в профиль. size: sm | md */
export function PlayerChip({
  player,
  you = false,
  size = "md",
}: {
  player?: Player | null;
  you?: boolean;
  size?: "sm" | "md";
}) {
  const name = player?.full_name ?? "Игрок";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const av = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";

  const inner = (
    <span className="inline-flex items-center gap-2 rounded-full border border-line-soft bg-cream pl-1 pr-3 py-1">
      <span
        className={`${av} rounded-full overflow-hidden bg-gradient-to-br from-green to-burgundy text-white flex items-center justify-center font-bold shrink-0`}
      >
        {player?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.avatar_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          initials || "•"
        )}
      </span>
      <span className="text-sm font-medium truncate max-w-[8rem]">
        {name}
        {you && <span className="text-ink-soft"> · ты</span>}
      </span>
    </span>
  );

  if (player?.id) {
    return (
      <Link href={`/players/${player.id}`} className="hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    );
  }
  return inner;
}
