import { ShieldCheck, LogOut } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getAllPlayers } from "@/lib/data";
import { supaAnon, hasSupabase } from "@/lib/supabase/server";
import {
  isAdmin,
  login,
  logout,
  addPlayer,
  addMatch,
  addGame,
  addTournament,
  addCourt,
} from "./actions";
import type { Court } from "@/lib/types";
import { demoCourts } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

const input =
  "border border-line rounded-lg px-3 py-2 text-sm bg-cream focus:outline-2 focus:outline-green w-full";
const label = "text-xs font-bold text-ink-soft uppercase tracking-wide";
const card = "rounded-2xl border border-line bg-surface p-5 flex flex-col gap-3";
const btn =
  "bg-green text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-deep transition-colors duration-200 cursor-pointer text-sm";

async function getCourts(): Promise<Court[]> {
  const supa = supaAnon();
  if (!supa) return demoCourts;
  const { data } = await supa.from("courts").select("*").order("name");
  return (data as Court[]) ?? [];
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { t } = await getLang();
  const params = await searchParams;
  const authed = await isAdmin();

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <div className={card}>
          <h1 className="text-3xl font-bold display flex items-center gap-2">
            <ShieldCheck className="text-green" /> {t.nav.admin}
          </h1>
          {params.error && (
            <p className="text-danger text-sm font-semibold">Неверный пароль</p>
          )}
          {!process.env.ADMIN_PASSWORD && (
            <p className="text-sm text-ink-soft">
              Установи переменную окружения <code>ADMIN_PASSWORD</code>, чтобы
              включить админку.
            </p>
          )}
          <form action={login} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              className={input}
              autoFocus
            />
            <button className={btn}>Войти</button>
          </form>
        </div>
      </div>
    );
  }

  const [players, courts] = await Promise.all([getAllPlayers(), getCourts()]);
  const playerOptions = players.map((p) => (
    <option key={p.id} value={p.id}>
      {p.full_name}
    </option>
  ));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold display flex items-center gap-2">
          <ShieldCheck className="text-green" /> Админ-панель
        </h1>
        <form action={logout}>
          <button className="text-sm text-ink-soft hover:text-danger inline-flex items-center gap-1.5 cursor-pointer transition-colors duration-200">
            <LogOut size={15} /> Выйти
          </button>
        </form>
      </div>

      {!hasSupabase() && (
        <p className="bg-burgundy/10 rounded-xl p-4 text-sm">
          ⚠️ Supabase не подключён — формы не будут сохранять данные. Добавь
          env-переменные NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
          и SUPABASE_SERVICE_ROLE_KEY.
        </p>
      )}
      {params.ok && (
        <p className="bg-green-100 text-green-800 rounded-xl p-4 text-sm font-semibold">
          Сохранено ✓
        </p>
      )}
      {params.error === "db" && (
        <p className="bg-red-100 text-red-800 rounded-xl p-4 text-sm font-semibold">
          Ошибка базы данных — проверь настройки Supabase.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Новый игрок */}
        <form action={addPlayer} className={card}>
          <h2 className="text-2xl font-bold display">Новый игрок</h2>
          <div>
            <span className={label}>Имя и фамилия</span>
            <input name="full_name" className={input} required />
          </div>
          <div>
            <span className={label}>Город</span>
            <input name="city" defaultValue="Бишкек" className={input} />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="sports" value="padel" defaultChecked />
              {t.padel}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="sports" value="tennis" />
              {t.tennis}
            </label>
          </div>
          <button className={btn}>Добавить игрока</button>
        </form>

        {/* Результат матча */}
        <form action={addMatch} className={card}>
          <h2 className="text-2xl font-bold display">Результат матча</h2>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sport" value="padel" defaultChecked /> {t.padel}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sport" value="tennis" /> {t.tennis}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Команда 1 (победители по умолчанию)</span>
              <select name="t1p1" className={input}>{playerOptions}</select>
              <select name="t1p2" className={input + " mt-2"}>
                <option value="none">— (одиночка)</option>
                {playerOptions}
              </select>
            </div>
            <div>
              <span className={label}>Команда 2</span>
              <select name="t2p1" className={input}>{playerOptions}</select>
              <select name="t2p2" className={input + " mt-2"}>
                <option value="none">— (одиночка)</option>
                {playerOptions}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Счёт</span>
              <input name="score" placeholder="6:3, 6:4" className={input} required />
            </div>
            <div>
              <span className={label}>Победитель</span>
              <select name="winner" className={input}>
                <option value="1">Команда 1</option>
                <option value="2">Команда 2</option>
              </select>
            </div>
          </div>
          <button className={btn}>Записать матч (Elo пересчитается)</button>
        </form>

        {/* Новая игра */}
        <form action={addGame} className={card}>
          <h2 className="text-2xl font-bold display">Новая игра (запись)</h2>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sport" value="padel" defaultChecked /> {t.padel}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sport" value="tennis" /> {t.tennis}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Дата и время</span>
              <input type="datetime-local" name="starts_at" className={input} required />
            </div>
            <div>
              <span className={label}>Корт</span>
              <select name="court_id" className={input}>
                <option value="none">—</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <span className={label}>Мест</span>
              <input type="number" name="max_players" defaultValue={4} className={input} />
            </div>
            <div>
              <span className={label}>Взнос (сом)</span>
              <input type="number" name="price_som" className={input} />
            </div>
          </div>
          <div>
            <span className={label}>Комментарий</span>
            <input name="comment" className={input} />
          </div>
          <button className={btn}>Создать игру</button>
        </form>

        {/* Новый турнир */}
        <form action={addTournament} className={card}>
          <h2 className="text-2xl font-bold display">Новый турнир</h2>
          <div>
            <span className={label}>Название</span>
            <input name="name" className={input} required />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sport" value="padel" defaultChecked /> {t.padel}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sport" value="tennis" /> {t.tennis}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Формат</span>
              <select name="format" className={input}>
                <option>Americano</option>
                <option>Mexicano</option>
                <option>Эскалера</option>
                <option>Олимпийская сетка</option>
                <option>Круговая система</option>
              </select>
            </div>
            <div>
              <span className={label}>Дата и время</span>
              <input type="datetime-local" name="starts_at" className={input} required />
            </div>
            <div>
              <span className={label}>Корт</span>
              <select name="court_id" className={input}>
                <option value="none">—</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <span className={label}>Макс. игроков</span>
              <input type="number" name="max_players" defaultValue={16} className={input} />
            </div>
            <div>
              <span className={label}>Взнос (сом)</span>
              <input type="number" name="price_som" className={input} />
            </div>
          </div>
          <div>
            <span className={label}>Описание</span>
            <input name="description" className={input} />
          </div>
          <button className={btn}>Создать турнир</button>
        </form>

        {/* Новый корт */}
        <form action={addCourt} className={card}>
          <h2 className="text-2xl font-bold display">Новый корт / клуб</h2>
          <div>
            <span className={label}>Название</span>
            <input name="name" className={input} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Город</span>
              <input name="city" defaultValue="Бишкек" className={input} />
            </div>
            <div>
              <span className={label}>Адрес</span>
              <input name="address" className={input} />
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="sports" value="padel" defaultChecked /> {t.padel}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="sports" value="tennis" defaultChecked /> {t.tennis}
            </label>
          </div>
          <button className={btn}>Добавить корт</button>
        </form>
      </div>
    </div>
  );
}
