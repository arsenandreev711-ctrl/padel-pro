import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const GREEN = "#16653f";
const CREAM = "#f5f2ea";

// Простой знак для вкладки: зелёный квадрат + крупная «M»
function markSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${GREEN}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
      font-family="'DejaVu Sans', sans-serif" font-weight="800"
      font-size="${size * 0.66}" fill="${CREAM}">M</text>
  </svg>`;
}

await sharp(Buffer.from(markSvg(256))).png().toFile("public/icons/mark.png");
await sharp(Buffer.from(markSvg(256))).resize(32, 32).png().toFile("public/icons/mark-32.png");
console.log("wrote mark.png (favicon)");
