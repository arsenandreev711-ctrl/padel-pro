import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const GREEN = "#16653f";
const BURGUNDY = "#7a1f3d";
const CREAM = "#f5f2ea";
const BALL = "#e7efe3";

// Фирменный знак (100x100), цвета захардкожены
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

// bg: 'cream' | 'green'
function iconSvg(size, padRatio, bg = "cream") {
  const pad = size * padRatio;
  const inner = size - pad * 2;
  const scale = inner / 100;
  const bgFill = bg === "green" ? GREEN : CREAM;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgFill}"/>
    <g transform="translate(${pad} ${pad}) scale(${scale})">${emblem()}</g>
  </svg>`;
}

async function png(svg, out, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log("wrote", out);
}

await png(iconSvg(512, 0.14), "public/icons/icon-192.png", 192);
await png(iconSvg(512, 0.14), "public/icons/icon-512.png", 512);
await png(iconSvg(512, 0.2), "public/icons/icon-maskable-512.png", 512);
await png(iconSvg(512, 0.12), "public/icons/apple-touch-icon.png", 180);
await png(iconSvg(512, 0.28, "green"), "public/icons/favicon-96.png", 96);
console.log("done");
