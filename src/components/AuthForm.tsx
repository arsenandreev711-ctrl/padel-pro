"use client";

import { useRef, useState } from "react";
import { LogIn, UserPlus, Camera, Phone } from "lucide-react";
import { login, register } from "@/app/login/actions";

type Tab = "login" | "register";

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-green transition-colors";
const labelCls = "text-sm font-medium text-ink";

export function AuthForm({
  initialTab = "login",
  initialPhone = "",
}: {
  initialTab?: Tab;
  initialPhone?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "•";

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-6 max-w-md w-full">
      <div className="flex gap-2 p-1 rounded-2xl border border-line bg-cream">
        {([
          { id: "login" as Tab, label: "Вход", icon: LogIn },
          { id: "register" as Tab, label: "Регистрация", icon: UserPlus },
        ]).map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setTab(it.id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                active ? "bg-green text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              <it.icon size={16} /> {it.label}
            </button>
          );
        })}
      </div>

      {tab === "login" ? (
        <form
          action={login}
          className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6"
        >
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Номер телефона</span>
            <span className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                name="phone"
                type="tel"
                required
                defaultValue={initialPhone}
                placeholder="+996 700 123456"
                className={inputCls + " pl-10"}
              />
            </span>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
          >
            <LogIn size={17} /> Войти
          </button>
          <p className="text-xs text-ink-soft text-center">
            Нет аккаунта?{" "}
            <button type="button" onClick={() => setTab("register")} className="text-green font-medium cursor-pointer">
              Зарегистрируйся
            </button>
          </p>
        </form>
      ) : (
        <form
          action={register}
          className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-green to-burgundy text-white flex items-center justify-center text-3xl font-bold display">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Добавить фото"
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-green text-white flex items-center justify-center shadow-md hover:bg-green-deep transition-colors cursor-pointer"
              >
                <Camera size={15} />
              </button>
              <input
                ref={fileRef}
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={pickPhoto}
              />
            </div>
            <span className="text-xs text-ink-soft">Фото профиля · необязательно</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Имя</span>
              <input
                name="first_name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Азамат"
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Фамилия</span>
              <input
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Исаков"
                className={inputCls}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Номер телефона</span>
            <span className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                name="phone"
                type="tel"
                required
                defaultValue={initialPhone}
                placeholder="+996 700 123456"
                className={inputCls + " pl-10"}
              />
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
          >
            <UserPlus size={17} /> Создать аккаунт
          </button>
        </form>
      )}
    </div>
  );
}
