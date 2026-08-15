"use client";

import { useState } from "react";
import { Swords, Trophy } from "lucide-react";
import { recordMatch } from "@/app/matches/actions";

type P = { id: string; full_name: string };
type SportT = "padel" | "tennis";

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-green transition-colors";

function PlayerSelect({
  name,
  players,
  defaultValue,
  label,
}: {
  name: string;
  players: P[];
  defaultValue?: string;
  label: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <select name={name} defaultValue={defaultValue ?? "none"} className={inputCls}>
        <option value="none">— игрок —</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MatchForm({ players, meId }: { players: P[]; meId: string }) {
  const [sport, setSport] = useState<SportT>("padel");
  const [doubles, setDoubles] = useState(true);
  const [winner, setWinner] = useState<1 | 2>(1);

  return (
    <form action={recordMatch} className="flex flex-col gap-6 max-w-lg rounded-2xl border border-line bg-surface p-6">
      <input type="hidden" name="sport" value={sport} />
      <input type="hidden" name="winner" value={winner} />

      {/* Спорт */}
      <div className="flex gap-2">
        {([
          { id: "padel" as SportT, label: "Падел", ring: "border-green text-green" },
          { id: "tennis" as SportT, label: "Теннис", ring: "border-burgundy text-burgundy" },
        ]).map((s) => {
          const active = sport === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSport(s.id);
                setDoubles(s.id === "padel");
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                active ? `${s.ring} bg-cream` : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Формат */}
      <div className="flex gap-2 p-1 rounded-xl border border-line bg-cream">
        {[
          { d: false, label: "1 на 1" },
          { d: true, label: "2 на 2" },
        ].map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setDoubles(f.d)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              doubles === f.d ? "bg-green text-white" : "text-ink-soft"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Команды */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3 rounded-xl border border-line-soft p-3.5">
          <span className="text-sm font-bold display">Команда 1</span>
          <PlayerSelect name="t1p1" players={players} defaultValue={meId} label="Игрок 1" />
          {doubles && <PlayerSelect name="t1p2" players={players} label="Игрок 2" />}
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-line-soft p-3.5">
          <span className="text-sm font-bold display">Команда 2</span>
          <PlayerSelect name="t2p1" players={players} label="Игрок 1" />
          {doubles && <PlayerSelect name="t2p2" players={players} label="Игрок 2" />}
        </div>
      </div>

      {/* Счёт */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Счёт</span>
        <input name="score" required placeholder="6:3, 4:6, 7:5" className={inputCls} />
      </label>

      {/* Победитель */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink flex items-center gap-1.5">
          <Trophy size={15} className="text-green" /> Кто победил
        </span>
        <div className="flex gap-2">
          {[1, 2].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWinner(w as 1 | 2)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                winner === w ? "border-green bg-green/10 text-green" : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              Команда {w}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
      >
        <Swords size={18} /> Записать результат
      </button>
      <p className="text-xs text-ink-soft -mt-2">
        Результат отправится сопернику на подтверждение. После подтверждения рейтинг
        Elo всех участников пересчитается автоматически.
      </p>
    </form>
  );
}
