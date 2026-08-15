/**
 * Фирменный знак Rally: теннисная ракетка (бордовая) и падел-ракетка (зелёная)
 * скрещены крест-накрест за одним мячом — символ единства двух культур.
 */
export function Emblem({
  size = 40,
  padel = "var(--color-green)",
  tennis = "var(--color-burgundy)",
  hole = "var(--color-cream)",
  ball = "#e7efe3",
  seam = "var(--color-green)",
  className = "",
}: {
  size?: number;
  padel?: string;
  tennis?: string;
  hole?: string;
  ball?: string;
  seam?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label="Rally"
    >
      {/* Теннисная ракетка (бордовая) */}
      <g transform="rotate(-30 50 50)">
        <rect x="47" y="50" width="6" height="34" rx="3" fill={tennis} />
        <path
          d="M50 47c-4 0-7-2-8-5"
          stroke={tennis}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M50 47c4 0 7-2 8-5"
          stroke={tennis}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <ellipse
          cx="50"
          cy="27"
          rx="15"
          ry="20"
          stroke={tennis}
          strokeWidth="4.5"
        />
        <g stroke={tennis} strokeWidth="1.2" opacity="0.55">
          <line x1="44" y1="12" x2="44" y2="42" />
          <line x1="50" y1="9" x2="50" y2="45" />
          <line x1="56" y1="12" x2="56" y2="42" />
          <line x1="37" y1="21" x2="63" y2="21" />
          <line x1="35" y1="27" x2="65" y2="27" />
          <line x1="37" y1="33" x2="63" y2="33" />
        </g>
      </g>

      {/* Падел-ракетка (зелёная, перфорированная) */}
      <g transform="rotate(30 50 50)">
        <rect x="47" y="48" width="6" height="36" rx="3" fill={padel} />
        <rect x="35" y="12" width="30" height="38" rx="15" fill={padel} />
        <g fill={hole}>
          <circle cx="50" cy="24" r="2.4" />
          <circle cx="43" cy="30" r="2.4" />
          <circle cx="57" cy="30" r="2.4" />
          <circle cx="50" cy="36" r="2.4" />
          <circle cx="43" cy="42" r="2.2" />
          <circle cx="57" cy="42" r="2.2" />
          <circle cx="50" cy="16" r="2.2" />
        </g>
      </g>

      {/* Мяч на скрещении */}
      <circle cx="50" cy="52" r="11" fill={ball} />
      <path
        d="M41 47c4 2 4 8 0 10M59 47c-4 2-4 8 0 10"
        stroke={seam}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
