"use client";

import { useRef, useState } from "react";
import type { RatingPoint } from "@/lib/types";
import type { Sport } from "@/lib/types";

export function RatingChart({
  data,
  sport,
  height = 190,
}: {
  data: RatingPoint[];
  sport: Sport;
  height?: number;
}) {
  const color = sport === "padel" ? "#16653f" : "#7a1f3d";
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-10 text-center text-ink-soft text-sm">
        История рейтинга появится после первых матчей.
      </div>
    );
  }

  const VW = 640;
  const VH = height;
  const padL = 10;
  const padR = 10;
  const padT = 16;
  const padB = 22;
  const n = data.length;

  const ratings = data.map((d) => d.rating);
  const lo = Math.min(...ratings) - 12;
  const hi = Math.max(...ratings) + 12;
  const span = Math.max(1, hi - lo);

  const xFor = (i: number) => padL + (i / (n - 1)) * (VW - padL - padR);
  const yFor = (r: number) => padT + (1 - (r - lo) / span) * (VH - padT - padB);

  const linePts = data.map((d, i) => `${xFor(i)},${yFor(d.rating)}`);
  const linePath = "M" + linePts.join(" L");
  const areaPath =
    `M${xFor(0)},${VH - padB} L` +
    linePts.join(" L") +
    ` L${xFor(n - 1)},${VH - padB} Z`;

  const grid = [0.5, 0.75, 1.0].map((f) => padT + f * (VH - padT - padB));
  const gid = `rc-${sport}`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(x * (n - 1)))));
  }

  const last = data[n - 1];
  const delta = last.rating - data[0].rating;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-sm font-semibold text-ink-soft">
          Текущий:{" "}
          <span className="font-bold" style={{ color }}>
            {last.rating}
          </span>
        </span>
        <span
          className={`text-xs font-semibold ${
            delta >= 0 ? "text-green" : "text-burgundy"
          }`}
        >
          {delta >= 0 ? "▲ +" : "▼ "}
          {Math.abs(delta)} за период
        </span>
      </div>
      <div
        ref={wrapRef}
        className="relative"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height={VH} className="block">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {grid.map((y, i) => (
            <line
              key={i}
              x1={padL}
              x2={VW - padR}
              y1={y}
              y2={y}
              stroke="#ece8de"
              strokeWidth="1"
            />
          ))}
          <path d={areaPath} fill={`url(#${gid})`} />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx={xFor(n - 1)} cy={yFor(last.rating)} r="4.5" fill={color} />
          {hover !== null && (
            <>
              <line
                x1={xFor(hover)}
                x2={xFor(hover)}
                y1={padT}
                y2={VH - padB}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
              <circle
                cx={xFor(hover)}
                cy={yFor(data[hover].rating)}
                r="5"
                fill="#fff"
                stroke={color}
                strokeWidth="2.4"
              />
            </>
          )}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -top-1 bg-ink text-cream text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg"
            style={{ left: `${(hover / (n - 1)) * 100}%` }}
          >
            <span className="font-bold">{data[hover].rating}</span>{" "}
            <span className="opacity-70">
              ур. {data[hover].level.toFixed(1)}
            </span>
            <div className="opacity-60">
              {new Date(data[hover].date).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
