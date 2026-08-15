"use client";

import { useMemo, useState } from "react";
import { grade, levelToElo } from "@/lib/grading";
import type { CourtSide, Sport } from "@/lib/types";

interface Q {
  id: string;
  q: string;
  options: { label: string; w: number }[];
}

const PADEL_Q: Q[] = [
  {
    id: "exp",
    q: "Как давно играешь в падел?",
    options: [
      { label: "Никогда не играл(а)", w: 0.0 },
      { label: "До полугода", w: 0.15 },
      { label: "Полгода – 2 года", w: 0.4 },
      { label: "2 – 5 лет", w: 0.7 },
      { label: "Более 5 лет", w: 0.95 },
    ],
  },
  {
    id: "rally",
    q: "Насколько длинный розыгрыш держишь?",
    options: [
      { label: "2–3 удара", w: 0.15 },
      { label: "4–6 ударов", w: 0.45 },
      { label: "Длинные розыгрыши стабильно", w: 0.85 },
    ],
  },
  {
    id: "wall",
    q: "Игра от задней стенки?",
    options: [
      { label: "Пока не умею", w: 0.1 },
      { label: "Иногда получается", w: 0.5 },
      { label: "Уверенно отыгрываю от стены", w: 0.9 },
    ],
  },
  {
    id: "net",
    q: "Игра у сетки (воллеи, бандеха)?",
    options: [
      { label: "Нет", w: 0.1 },
      { label: "Базово", w: 0.5 },
      { label: "Уверенно контролирую сетку", w: 0.9 },
    ],
  },
  {
    id: "tour",
    q: "Турнирный опыт?",
    options: [
      { label: "Нет", w: 0.2 },
      { label: "Любительские турниры", w: 0.55 },
      { label: "Региональные / национальные", w: 0.95 },
    ],
  },
];

const TENNIS_Q: Q[] = [
  {
    id: "exp",
    q: "Как давно играешь в теннис?",
    options: [
      { label: "Никогда не играл(а)", w: 0.0 },
      { label: "До года", w: 0.2 },
      { label: "1 – 3 года", w: 0.45 },
      { label: "3 – 7 лет", w: 0.7 },
      { label: "Более 7 лет / спортшкола", w: 0.95 },
    ],
  },
  {
    id: "base",
    q: "Удары с задней линии (форхенд/бэкхенд)?",
    options: [
      { label: "Только осваиваю", w: 0.15 },
      { label: "Средне попадаю в корт", w: 0.5 },
      { label: "Стабильно, контролирую глубину и вращение", w: 0.9 },
    ],
  },
  {
    id: "serve",
    q: "Подача?",
    options: [
      { label: "Учусь вводить мяч", w: 0.15 },
      { label: "Стабильная вторая подача", w: 0.5 },
      { label: "Уверенные первая и вторая", w: 0.9 },
    ],
  },
  {
    id: "net",
    q: "Игра с лёта и спецудары?",
    options: [
      { label: "Нет", w: 0.15 },
      { label: "Базово", w: 0.5 },
      { label: "Уверенно у сетки, смэш, укороченные", w: 0.9 },
    ],
  },
  {
    id: "tour",
    q: "Турнирный / лиговый опыт?",
    options: [
      { label: "Нет", w: 0.2 },
      { label: "Клубные турниры", w: 0.55 },
      { label: "Региональные и выше", w: 0.95 },
    ],
  },
];

function levelFrom(answers: Record<string, number>, qs: Q[]): number {
  const vals = qs
    .map((q) => (answers[q.id] != null ? q.options[answers[q.id]].w : null))
    .filter((v): v is number => v != null);
  if (vals.length === 0) return 1;
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const level = 1 + avg * 6;
  // округляем вниз до 0.5 (консервативная самооценка)
  return Math.max(1, Math.min(7, Math.floor(level * 2) / 2));
}

const SIDES: { key: CourtSide; label: string }[] = [
  { key: "L", label: "Левая (L)" },
  { key: "R", label: "Правая (R)" },
  { key: "both", label: "Оба (универсал)" },
];

function SportBlock({
  sport,
  qs,
  answers,
  setAnswer,
  side,
  setSide,
}: {
  sport: Sport;
  qs: Q[];
  answers: Record<string, number>;
  setAnswer: (qid: string, idx: number) => void;
  side: CourtSide | null;
  setSide: (s: CourtSide) => void;
}) {
  const accent = sport === "padel" ? "green" : "burgundy";
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
      {qs.map((q) => (
        <div key={q.id} className="flex flex-col gap-2">
          <p className="font-semibold text-sm">{q.q}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o, i) => {
              const on = answers[q.id] === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAnswer(q.id, i)}
                  className={`text-sm px-3.5 py-2 rounded-full border transition-colors duration-200 cursor-pointer ${
                    on
                      ? accent === "green"
                        ? "bg-green text-white border-green"
                        : "bg-burgundy text-white border-burgundy"
                      : "border-line text-ink-soft hover:border-ink-soft"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-sm">Предпочитаемая сторона корта</p>
        <div className="flex flex-wrap gap-2">
          {SIDES.map((s) => {
            const on = side === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSide(s.key)}
                className={`text-sm px-3.5 py-2 rounded-full border transition-colors duration-200 cursor-pointer ${
                  on
                    ? accent === "green"
                      ? "bg-green text-white border-green"
                      : "bg-burgundy text-white border-burgundy"
                    : "border-line text-ink-soft hover:border-ink-soft"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function QuestionnaireForm({
  hasDb,
  loggedIn = false,
  submitAction,
}: {
  hasDb: boolean;
  loggedIn?: boolean;
  submitAction: (formData: FormData) => void;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Бишкек");
  const [padelOn, setPadelOn] = useState(true);
  const [tennisOn, setTennisOn] = useState(false);
  const [pAns, setPAns] = useState<Record<string, number>>({});
  const [tAns, setTAns] = useState<Record<string, number>>({});
  const [pSide, setPSide] = useState<CourtSide | null>(null);
  const [tSide, setTSide] = useState<CourtSide | null>(null);

  const pLevel = useMemo(() => (padelOn ? levelFrom(pAns, PADEL_Q) : 0), [padelOn, pAns]);
  const tLevel = useMemo(() => (tennisOn ? levelFrom(tAns, TENNIS_Q) : 0), [tennisOn, tAns]);

  const results = [
    padelOn ? { sport: "padel" as const, level: pLevel } : null,
    tennisOn ? { sport: "tennis" as const, level: tLevel } : null,
  ].filter(Boolean) as { sport: Sport; level: number }[];

  const canSubmit = (loggedIn || name.trim().length > 1) && (padelOn || tennisOn);

  return (
    <form action={submitAction} className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
      <div className="flex flex-col gap-6">
        {/* Базовое */}
        <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
          {!loggedIn && (
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Имя и фамилия
              </span>
              <input
                name="full_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-line rounded-lg px-3 py-2 text-sm bg-cream focus:outline-2 focus:outline-green"
                placeholder="Азамат Исаков"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Город
              </span>
              <input
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-line rounded-lg px-3 py-2 text-sm bg-cream focus:outline-2 focus:outline-green"
              />
            </label>
          </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPadelOn(!padelOn)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 cursor-pointer ${
                padelOn ? "bg-green text-white border-green" : "border-line text-ink-soft"
              }`}
            >
              Падел
            </button>
            <button
              type="button"
              onClick={() => setTennisOn(!tennisOn)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 cursor-pointer ${
                tennisOn ? "bg-burgundy text-white border-burgundy" : "border-line text-ink-soft"
              }`}
            >
              Теннис
            </button>
          </div>
        </div>

        {padelOn && (
          <SportBlock
            sport="padel"
            qs={PADEL_Q}
            answers={pAns}
            setAnswer={(q, i) => setPAns({ ...pAns, [q]: i })}
            side={pSide}
            setSide={setPSide}
          />
        )}
        {tennisOn && (
          <SportBlock
            sport="tennis"
            qs={TENNIS_Q}
            answers={tAns}
            setAnswer={(q, i) => setTAns({ ...tAns, [q]: i })}
            side={tSide}
            setSide={setTSide}
          />
        )}
      </div>

      {/* Результат */}
      <aside className="lg:sticky lg:top-24 flex flex-col gap-4 rounded-2xl border border-line bg-ink text-cream p-6">
        <h2 className="display text-xl font-bold">Твой стартовый уровень</h2>
        {results.length === 0 && (
          <p className="text-sm text-cream/70">Выбери вид спорта и ответь на вопросы.</p>
        )}
        {results.map((r) => {
          const g = grade(r.sport, levelToElo(r.level));
          return (
            <div key={r.sport} className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold display text-white"
                style={{ backgroundColor: g.tier.color }}
              >
                {r.sport === "padel" ? g.tier.label : g.level.toFixed(1)}
              </span>
              <div className="leading-tight">
                <p className="font-semibold">
                  {r.sport === "padel" ? "Падел" : "Теннис"} ·{" "}
                  {r.sport === "padel"
                    ? `${g.tier.label} · ${r.level.toFixed(1)}`
                    : `NTRP ${r.level.toFixed(1)}`}
                </p>
                <p className="text-xs text-cream/60">
                  {g.tier.name} · рейтинг {levelToElo(r.level)}
                </p>
              </div>
            </div>
          );
        })}

        {/* скрытые поля для сервера */}
        <input type="hidden" name="level_padel" value={pLevel} />
        <input type="hidden" name="level_tennis" value={tLevel} />
        <input type="hidden" name="side_padel" value={pSide ?? ""} />
        <input type="hidden" name="side_tennis" value={tSide ?? ""} />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 bg-cream text-ink font-bold px-5 py-2.5 rounded-full hover:bg-white transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loggedIn ? "Сохранить уровень" : "Создать профиль"}
        </button>
        {!hasDb && (
          <p className="text-[11px] text-cream/55">
            Демо: подключи базу данных, чтобы профиль сохранился. Уровень
            рассчитывается сразу.
          </p>
        )}
        <p className="text-[11px] text-cream/45">
          Уровень оценивается консервативно (округление вниз) и уточняется по
          результатам первых матчей.
        </p>
      </aside>
    </form>
  );
}
