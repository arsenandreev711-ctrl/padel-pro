"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";

/**
 * Аватар игрока с возможностью установить фото.
 * Демо/без авторизации — предпросмотр локально; постоянное хранение
 * подключается вместе со входом через Supabase.
 */
export function AvatarBox({
  name,
  src,
  editable = true,
}: {
  name: string;
  src?: string | null;
  editable?: boolean;
}) {
  const [url, setUrl] = useState<string | null>(src ?? null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUrl(String(reader.result));
      setTouched(true);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-green to-burgundy text-white flex items-center justify-center text-3xl font-bold display">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={name} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        {editable && (
          <button
            onClick={() => inputRef.current?.click()}
            aria-label="Изменить фото"
            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-green text-white flex items-center justify-center shadow-md hover:bg-green-deep transition-colors duration-200 cursor-pointer"
          >
            <Camera size={15} />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pick}
        />
      </div>
      {touched && (
        <span className="text-[11px] text-ink-soft text-center max-w-[10rem]">
          Фото сохранится после входа в аккаунт
        </span>
      )}
    </div>
  );
}
