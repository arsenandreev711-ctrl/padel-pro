import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const GREEN = "#16653f";
const BURGUNDY = "#7a1f3d";
const CREAM = "#f5f2ea";
const BALL = "#e7efe3";

// Компактная эмблема: ракетки сведены ближе (меньший угол), крупнее в кадре
function emblem(angle) {
  return `
  <g transform="rotate(-${angle} 50 50)">
    <rect x="47" y="50" width="6" height="34" rx="3" fill="${BURGUNDY}"/>
    <ellipse cx="50" cy="27" rx="15" ry="20" stroke="${BURGUNDY}" stroke-width="5" fill="none"/>
    <g stroke="${BURGUNDY}" stroke-width="1.4" opacity="0.55">
      <line x1="44" y1="12" x2="44" y2="42"/><line x1="50" y1="9" x2="50" y2="45"/>
      <line x1="56" y1="12" x2="56" y2="42"/><line x1="37" y1="21" x2="63" y2="21"/>
      <line x1="35" y1="27" x2="65" y2="27"/><line x1="37" y1="33" x2="63" y2="33"/>
    </g>
  </g>
  <g transform="rotate(${angle} 50 50)">
    <rect x="47" y="48" width="6" height="36" rx="3" fill="${GREEN}"/>
    <rect x="35" y="12" width="30" height="38" rx="15" fill="${GREEN}"/>
    <g fill="${CREAM}">
      <circle cx="50" cy="24" r="2.4"/><circle cx="43" cy="30" r="2.4"/><circle cx="57" cy="30" r="2.4"/>
      <circle cx="50" cy="36" r="2.4"/><circle cx="43" cy="42" r="2.2"/><circle cx="57" cy="42" r="2.2"/>
      <circle cx="50" cy="16" r="2.2"/>
    </g>
  </g>
  <circle cx="50" cy="53" r="11" fill="${BALL}"/>
  <path d="M41 48c4 2 4 8 0 10M59 48c-4 2-4 8 0 10" stroke="${GREEN}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

function svg(size, pad, angle, bg) {
  const inner = size - pad * 2;
  const scale = inner / 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/>
    <g transform="translate(${pad} ${pad}) scale(${scale})">${emblem(angle)}</g>
  </svg>`;
}

// более плотный угол (16°) и меньше отступа
await sharp(Buffer.from(svg(256, 20, 22, CREAM))).resize(96, 96).png().toFile("public/icons/favicon-96.png");
await sharp(Buffer.from(svg(256, 16, 22, CREAM))).resize(180, 180).png().toFile("public/icons/apple-touch-icon.png");
await sharp(Buffer.from(svg(512, 34, 22, CREAM))).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg(512, 34, 22, CREAM))).png().toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg(512, 64, 22, CREAM))).png().toFile("public/icons/icon-maskable-512.png");
console.log("favicons regenerated (tighter emblem)");
