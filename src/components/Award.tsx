import type { PlayerAward } from "@/lib/types";

const METALS: Record<number, { face: string; edge: string; ink: string; name: string }> = {
  1: { face: "#e8bd45", edge: "#b8891f", ink: "#6b4e12", name: "Золото" },
  2: { face: "#cfd4da", edge: "#a1a7ad", ink: "#474d54", name: "Серебро" },
  3: { face: "#d08a55", edge: "#a5652f", ink: "#5a3618", name: "Бронза" },
};

function Medal({ place, size }: { place: number; size: number }) {
  const m = METALS[place];
  return (
    <svg width={size} height={(size * 56) / 48} viewBox="0 0 48 56" fill="none" aria-hidden>
      <path d="M15 2 22 24 17 28 9 7Z" fill="#8f2740" />
      <path d="M33 2 39 7 31 28 26 24Z" fill="#16653f" />
      <circle cx="24" cy="39" r="15" fill={m.face} stroke={m.edge} strokeWidth="2" />
      <circle cx="24" cy="39" r="10.5" fill="none" stroke={m.edge} opacity="0.45" />
      <text
        x="24"
        y="44"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill={m.ink}
        fontFamily="Bricolage Grotesque, sans-serif"
      >
        {place}
      </text>
    </svg>
  );
}

/** Утешительный зелёный венок с номером места (для мест после 3-го) */
function Wreath({ place, size }: { place: number; size: number }) {
  const green = "#16653f";
  const leaf = (cx: number, cy: number, rot: number, mirror = false) => (
    <ellipse
      key={`${cx}-${cy}-${mirror}`}
      cx={cx}
      cy={cy}
      rx="3.4"
      ry="1.7"
      fill={green}
      transform={`rotate(${mirror ? -rot : rot} ${cx} ${cy})`}
      opacity="0.92"
    />
  );
  // позиции листьев вдоль левой ветви (зеркалятся направо)
  const leaves = [
    [17, 44, 35],
    [13, 37, 20],
    [11, 29, 5],
    [12, 21, -18],
    [16, 14, -38],
  ] as const;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M28 50 C16 48 10 38 11 27 12 20 15 15 19 11" stroke={green} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 50 C40 48 46 38 45 27 44 20 41 15 37 11" stroke={green} strokeWidth="2" fill="none" strokeLinecap="round" />
      {leaves.map(([x, y, r]) => leaf(x, y, r))}
      {leaves.map(([x, y, r]) => leaf(56 - x, y, r, true))}
      <path d="M24 50h8l-4 4Z" fill={green} />
      <text
        x="28"
        y="34"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill={green}
        fontFamily="Bricolage Grotesque, sans-serif"
      >
        {place}
      </text>
    </svg>
  );
}

export function AwardIcon({ place, size = 44 }: { place: number; size?: number }) {
  return place <= 3 ? <Medal place={place} size={size} /> : <Wreath place={place} size={size} />;
}

export function AwardCard({ award }: { award: PlayerAward }) {
  const accent = award.sport === "padel" ? "text-green" : "text-burgundy";
  const label =
    award.place === 1
      ? "1 место"
      : award.place === 2
      ? "2 место"
      : award.place === 3
      ? "3 место"
      : `${award.place}-е место`;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 lift hover:shadow-[0_10px_26px_-14px_rgba(22,36,29,0.25)]">
      <AwardIcon place={award.place} size={44} />
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate">{award.tournament_name}</p>
        <p className="text-xs text-ink-soft">
          <span className={accent}>{label}</span> ·{" "}
          {new Date(award.date).toLocaleDateString("ru-RU", {
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
