"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

/** Поле телефона с фиксированным префиксом +996. Отдаёт полный номер в name="phone". */
export function PhoneField({ initial = "" }: { initial?: string }) {
  const initLocal = initial.replace(/\D/g, "").replace(/^996/, "");
  const [local, setLocal] = useState(initLocal);

  return (
    <span className="flex items-center rounded-xl border border-line bg-cream focus-within:border-green transition-colors">
      <Phone size={15} className="ml-3.5 text-ink-soft shrink-0" />
      <span className="pl-2 pr-1 text-sm font-medium text-ink select-none">+996</span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        required
        value={local}
        onChange={(e) => setLocal(e.target.value.replace(/\D/g, "").slice(0, 9))}
        placeholder="700 123456"
        className="flex-1 min-w-0 bg-transparent py-2.5 pr-4 text-sm outline-none"
      />
      <input type="hidden" name="phone" value={"+996" + local} />
    </span>
  );
}
