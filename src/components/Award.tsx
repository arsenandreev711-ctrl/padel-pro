import type { PlayerAward } from "@/lib/types";

/** Места, для которых есть готовая картинка-награда в /public/awards */
const IMAGE_PLACES = new Set([1, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

/** Утешительный зелёный венок с номером места (запасной вариант для мест без картинки) */
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
  if (IMAGE_PLACES.has(place)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/awards/place-${place}.png`}
        alt={`${place} место`}
        width={size}
        height={size}
        className="object-contain shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return <Wreath place={place} size={size} />;
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
      <AwardIcon place={award.place} size={48} />
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
