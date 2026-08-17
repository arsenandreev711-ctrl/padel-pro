import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("/root/promo", { recursive: true });

const GREEN = "#16653f", GREEN2 = "#0f4c30";
const BURG = "#7a1f3d", BURG2 = "#5e162e";
const CREAM = "#f5f2ea";
const INK = "#16241d";

function emblem(color) {
  // одноцветная эмблема-водяной знак
  return `
  <g transform="rotate(-22 50 50)">
    <rect x="47" y="50" width="6" height="34" rx="3" fill="${color}"/>
    <ellipse cx="50" cy="27" rx="15" ry="20" stroke="${color}" stroke-width="5" fill="none"/>
  </g>
  <g transform="rotate(22 50 50)">
    <rect x="47" y="48" width="6" height="36" rx="3" fill="${color}"/>
    <rect x="35" y="12" width="30" height="38" rx="15" fill="none" stroke="${color}" stroke-width="4"/>
  </g>
  <circle cx="50" cy="53" r="11" fill="${color}"/>`;
}

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

function poster({ sport, big, date, time, court, addr, format, level, price }) {
  const isPadel = sport === "padel";
  const c1 = isPadel ? GREEN : BURG;
  const c2 = isPadel ? GREEN2 : BURG2;
  const W = 1080, H = 1350;
  const F = "DejaVu Sans, sans-serif";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>

    <!-- крупный мяч-мотив -->
    <circle cx="${W - 40}" cy="130" r="230" fill="${CREAM}" opacity="0.06"/>
    <circle cx="60" cy="${H - 120}" r="180" fill="${CREAM}" opacity="0.05"/>

    <!-- водяной знак эмблемы -->
    <g transform="translate(${W - 340} ${H - 470}) scale(3.2)" opacity="0.10">${emblem(CREAM)}</g>

    <!-- верх: бренд -->
    <g transform="translate(80 96)">
      <g transform="scale(0.62)">${emblem(CREAM)}</g>
      <text x="78" y="44" font-family="${F}" font-size="42" font-weight="800" fill="${CREAM}">MatePoint</text>
    </g>

    <!-- кикер -->
    <text x="80" y="300" font-family="${F}" font-size="34" font-weight="700" letter-spacing="6" fill="${CREAM}" opacity="0.85">ОТКРЫТАЯ ИГРА · БИШКЕК</text>

    <!-- крупный спорт -->
    <text x="76" y="470" font-family="${F}" font-size="168" font-weight="800" fill="${CREAM}">${esc(big)}</text>
    <text x="80" y="545" font-family="${F}" font-size="46" font-weight="700" fill="${CREAM}" opacity="0.9">${esc(date)} · ${esc(time)}</text>

    <!-- карточка деталей -->
    <g transform="translate(64 640)">
      <rect width="952" height="470" rx="40" fill="${CREAM}"/>
      <text x="56" y="110" font-family="${F}" font-size="34" font-weight="700" fill="#8a8578">КОРТ</text>
      <text x="56" y="162" font-family="${F}" font-size="52" font-weight="800" fill="${INK}">${esc(court)}</text>
      <text x="56" y="208" font-family="${F}" font-size="32" font-weight="500" fill="#5b6a61">${esc(addr)}</text>

      <line x1="56" y1="248" x2="896" y2="248" stroke="#e2ddd1" stroke-width="2"/>

      <text x="56" y="316" font-family="${F}" font-size="30" font-weight="700" fill="#8a8578">ФОРМАТ</text>
      <text x="56" y="366" font-family="${F}" font-size="46" font-weight="800" fill="${c1}">${esc(format)}</text>

      <text x="520" y="316" font-family="${F}" font-size="30" font-weight="700" fill="#8a8578">УРОВЕНЬ</text>
      <text x="520" y="366" font-family="${F}" font-size="46" font-weight="800" fill="${INK}">${esc(level)}</text>

      <text x="56" y="430" font-family="${F}" font-size="34" font-weight="700" fill="${INK}">${esc(price)}</text>
    </g>

    <!-- CTA -->
    <text x="80" y="1200" font-family="${F}" font-size="40" font-weight="800" fill="${CREAM}">Записывайся на MatePoint →</text>
    <text x="80" y="1252" font-family="${F}" font-size="34" font-weight="600" fill="${CREAM}" opacity="0.85">padel-pro-bay.vercel.app/games</text>
  </svg>`;
}

const games = [
  { file: "padel-1", sport: "padel", big: "ПАДЕЛ", date: "20 августа", time: "18:00",
    court: "Mr. Padel", addr: "ул. Токомбаева 52в", format: "2 × 2", level: "Новичкам ок", price: "≈ 700 сом с человека" },
  { file: "tennis-1", sport: "tennis", big: "ТЕННИС", date: "20 августа", time: "18:30",
    court: "T-club", addr: "ул. Токтогула 75/3", format: "1 × 1", level: "Средний", price: "Аренда корта пополам" },
  { file: "padel-2", sport: "padel", big: "ПАДЕЛ", date: "20 августа", time: "20:00",
    court: "Mr. Padel", addr: "ул. Токомбаева 52в", format: "2 × 2", level: "Уверенный", price: "≈ 700 сом с человека" },
  { file: "tennis-2", sport: "tennis", big: "ТЕННИС", date: "20 августа", time: "20:30",
    court: "Ervin Tennis School", addr: "ул. Ахунбаева 97Б", format: "1×1 / 2×2", level: "Любой", price: "Аренда корта пополам" },
];

for (const g of games) {
  await sharp(Buffer.from(poster(g))).png().toFile(`/root/promo/${g.file}.png`);
  console.log("wrote", g.file);
}
console.log("done");
