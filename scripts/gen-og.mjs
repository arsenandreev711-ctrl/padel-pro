import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public", { recursive: true });

const GREEN = "#16653f";
const BURGUNDY = "#7a1f3d";
const CREAM = "#f5f2ea";
const BALL = "#e7efe3";
const INK = "#16241d";
const INKSOFT = "#4b5a52";

function emblem() {
  return `
  <g transform="rotate(-30 50 50)">
    <rect x="47" y="50" width="6" height="34" rx="3" fill="${BURGUNDY}"/>
    <path d="M50 47c-4 0-7-2-8-5" stroke="${BURGUNDY}" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 47c4 0 7-2 8-5" stroke="${BURGUNDY}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="50" cy="27" rx="15" ry="20" stroke="${BURGUNDY}" stroke-width="4.5" fill="none"/>
    <g stroke="${BURGUNDY}" stroke-width="1.2" opacity="0.55">
      <line x1="44" y1="12" x2="44" y2="42"/><line x1="50" y1="9" x2="50" y2="45"/>
      <line x1="56" y1="12" x2="56" y2="42"/><line x1="37" y1="21" x2="63" y2="21"/>
      <line x1="35" y1="27" x2="65" y2="27"/><line x1="37" y1="33" x2="63" y2="33"/>
    </g>
  </g>
  <g transform="rotate(30 50 50)">
    <rect x="47" y="48" width="6" height="36" rx="3" fill="${GREEN}"/>
    <rect x="35" y="12" width="30" height="38" rx="15" fill="${GREEN}"/>
    <g fill="${CREAM}">
      <circle cx="50" cy="24" r="2.4"/><circle cx="43" cy="30" r="2.4"/><circle cx="57" cy="30" r="2.4"/>
      <circle cx="50" cy="36" r="2.4"/><circle cx="43" cy="42" r="2.2"/><circle cx="57" cy="42" r="2.2"/>
      <circle cx="50" cy="16" r="2.2"/>
    </g>
  </g>
  <circle cx="50" cy="52" r="11" fill="${BALL}"/>
  <path d="M41 47c4 2 4 8 0 10M59 47c-4 2-4 8 0 10" stroke="${GREEN}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

const W = 1200, H = 630;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${CREAM}"/>
  <rect x="0" y="0" width="${W/2}" height="10" fill="${GREEN}"/>
  <rect x="${W/2}" y="0" width="${W/2}" height="10" fill="${BURGUNDY}"/>
  <g transform="translate(120 165) scale(3.0)">${emblem()}</g>
  <text x="470" y="300" font-family="'DejaVu Sans', sans-serif" font-size="96" font-weight="800" fill="${INK}">Padel<tspan fill="${GREEN}">·</tspan>PRO</text>
  <text x="474" y="360" font-family="'DejaVu Sans', sans-serif" font-size="36" font-weight="600" fill="${INKSOFT}">Падел и теннис Кыргызстана</text>
  <text x="474" y="410" font-family="'DejaVu Sans', sans-serif" font-size="32" font-weight="500" fill="${GREEN}">Рейтинг · Игры · Турниры</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("wrote public/og.png");
