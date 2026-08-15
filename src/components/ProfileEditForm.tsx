"use client";

import { useRef, useState } from "react";
import { Camera, Save } from "lucide-react";
import { updateProfile } from "@/app/players/actions";
import { PhoneField } from "@/components/PhoneField";

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-green transition-colors";
const labelCls = "text-sm font-medium text-ink";

export function ProfileEditForm({
  initialFirst,
  initialLast,
  initialCity,
  initialPhone,
  initialAvatar,
}: {
  initialFirst: string;
  initialLast: string;
  initialCity: string;
  initialPhone: string;
  initialAvatar: string | null;
}) {
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [first, setFirst] = useState(initialFirst);
  const [last, setLast] = useState(initialLast);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initials =
    [first, last].filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "•";

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <form
      action={updateProfile}
      className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 max-w-md"
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
            aria-label="Изменить фото"
            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-green text-white flex items-center justify-center shadow-md hover:bg-green-deep transition-colors cursor-pointer"
          >
            <Camera size={15} />
          </button>
          <input ref={fileRef} type="file" name="avatar" accept="image/*" className="hidden" onChange={pickPhoto} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Имя</span>
          <input name="first_name" required value={first} onChange={(e) => setFirst(e.target.value)} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Фамилия</span>
          <input name="last_name" value={last} onChange={(e) => setLast(e.target.value)} className={inputCls} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Город</span>
        <input name="city" defaultValue={initialCity} className={inputCls} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Номер телефона</span>
        <PhoneField initial={initialPhone} />
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-6 py-3 rounded-full hover:bg-green-deep transition-colors cursor-pointer"
      >
        <Save size={17} /> Сохранить
      </button>
    </form>
  );
}
