"use client";

import { useState } from "react";
import { Users2, Trophy, Plus } from "lucide-react";
import type { Court } from "@/lib/types";
import type { Dict } from "@/lib/i18n";
import { createGame, createTournament } from "@/app/create/actions";

type Tab = "game" | "tournament";
type SportT = "padel" | "tennis";

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-green transition-colors";
const labelCls = "text-sm font-medium text-ink flex items-center gap-1.5";
const optCls = "text-xs text-ink-soft font-normal";

function Field({
  label,
  children,
  optional,
  t,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  t: Dict;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>
        {label}
        {optional && <span className={optCls}>· {t.create.optional}</span>}
      </span>
      {children}
    </label>
  );
}

export function CreateForm({
  courts,
  t,
  initialTab = "game",
}: {
  courts: Court[];
  t: Dict;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [sport, setSport] = useState<SportT>("padel");

  const c = t.create;
  const filteredCourts = courts.filter((ct) => ct.sports.includes(sport));

  const Tabs = (
    <div className="flex gap-2 p-1 rounded-2xl border border-line bg-cream w-full sm:w-fit">
      {([
        { id: "game" as Tab, label: c.tabGame, icon: Users2 },
        { id: "tournament" as Tab, label: c.tabTournament, icon: Trophy },
      ]).map((it) => {
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => setTab(it.id)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              active ? "bg-green text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            <it.icon size={16} /> {it.label}
          </button>
        );
      })}
    </div>
  );

  const SportToggle = (
    <Field label={c.sport} t={t}>
      <div className="flex gap-2">
        {([
          { id: "padel" as SportT, label: t.padel, dot: "bg-green", ring: "border-green text-green" },
          { id: "tennis" as SportT, label: t.tennis, dot: "bg-burgundy", ring: "border-burgundy text-burgundy" },
        ]).map((s) => {
          const active = sport === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSport(s.id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                active ? `${s.ring} bg-surface` : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${s.dot}`} /> {s.label}
            </button>
          );
        })}
      </div>
      <input type="hidden" name="sport" value={sport} />
    </Field>
  );

  const CourtSelect = (
    <Field label={c.court} t={t} optional>
      <select name="court_id" className={inputCls} defaultValue="none">
        <option value="none">{c.noCourt}</option>
        {filteredCourts.map((ct) => (
          <option key={ct.id} value={ct.id}>
            {ct.name}
          </option>
        ))}
      </select>
    </Field>
  );

  const LevelSelect = (
    <Field label={c.level} t={t}>
      <select name="level" className={inputCls} defaultValue={c.levels[0]}>
        {c.levels.map((lv) => (
          <option key={lv} value={lv}>
            {lv}
          </option>
        ))}
      </select>
    </Field>
  );

  const TimeField = (
    <Field label={c.time} t={t}>
      <input type="datetime-local" name="starts_at" required className={inputCls} />
    </Field>
  );

  const Organizer = (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label={c.organizerName} t={t} optional>
        <input name="organizer_name" className={inputCls} placeholder={t.yourName} />
      </Field>
      <Field label={c.organizerContact} t={t}>
        <input
          name="organizer_contact"
          required
          className={inputCls}
          placeholder={c.organizerContactPh}
        />
      </Field>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {Tabs}

      {tab === "game" ? (
        <form action={createGame} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-7">
          {SportToggle}
          <div className="grid sm:grid-cols-2 gap-4">
            {TimeField}
            <Field label={c.maxPlayers} t={t}>
              <input
                type="number"
                name="max_players"
                min={2}
                max={8}
                defaultValue={sport === "padel" ? 4 : 2}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CourtSelect}
            {LevelSelect}
          </div>
          <Field label={c.rentPrice} t={t} optional>
            <input type="number" name="price_som" min={0} className={inputCls} placeholder="600" />
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-line bg-cream px-4 py-3 cursor-pointer">
            <input type="checkbox" name="court_booked" className="mt-0.5 w-4 h-4 accent-green cursor-pointer" />
            <span className="flex flex-col">
              <span className="text-sm font-medium text-ink">{c.booked}</span>
              <span className="text-xs text-ink-soft">{c.bookedHint}</span>
            </span>
          </label>
          <Field label={c.comment} t={t} optional>
            <textarea name="comment" rows={2} className={inputCls} placeholder={c.commentPh} />
          </Field>
          {Organizer}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
          >
            <Plus size={18} /> {c.submitGame}
          </button>
        </form>
      ) : (
        <form
          action={createTournament}
          className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-7"
        >
          {SportToggle}
          <Field label={c.tourName} t={t}>
            <input name="name" required className={inputCls} placeholder={c.tourNamePh} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            {TimeField}
            <Field label={c.format} t={t}>
              <select name="format" className={inputCls} defaultValue="Americano">
                <option value="Americano">Americano</option>
                <option value="Mexicano">Mexicano</option>
                <option value="Эскалера">Эскалера</option>
                <option value="Олимпийская сетка">Олимпийская сетка</option>
                <option value="Круговой">Круговой</option>
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CourtSelect}
            {LevelSelect}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={c.maxPlayers} t={t}>
              <input type="number" name="max_players" min={4} max={64} defaultValue={16} className={inputCls} />
            </Field>
            <Field label={c.entryFee} t={t} optional>
              <input type="number" name="price_som" min={0} className={inputCls} placeholder="1000" />
            </Field>
          </div>
          <Field label={c.prizes} t={t} optional>
            <textarea name="prizes" rows={2} className={inputCls} placeholder={c.prizesPh} />
          </Field>
          <Field label={c.description} t={t} optional>
            <textarea name="description" rows={2} className={inputCls} placeholder={c.descriptionPh} />
          </Field>
          {Organizer}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
          >
            <Trophy size={17} /> {c.submitTournament}
          </button>
        </form>
      )}
    </div>
  );
}
