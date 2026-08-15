import "server-only";

const base = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/** Вызов метода Bot API (выполняется на сервере Vercel, у которого есть интернет). */
export async function tg(method: string, body: unknown) {
  try {
    const res = await fetch(`${base()}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

let cachedUsername: string | null = null;

/** Username бота (для ссылки t.me/<bot>?start=...). Кэшируется. */
export async function botUsername(): Promise<string | null> {
  if (cachedUsername) return cachedUsername;
  if (!process.env.TELEGRAM_BOT_TOKEN) return null;
  try {
    const res = await fetch(`${base()}/getMe`);
    const j = await res.json();
    cachedUsername = j?.result?.username ?? null;
  } catch {
    cachedUsername = null;
  }
  return cachedUsername;
}
