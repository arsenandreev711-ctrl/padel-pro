import { NextRequest } from "next/server";
import { tg } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Разовая настройка вебхука. Открыть: /api/telegram/setup?key=<WEBHOOK_SECRET> */
export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  if (key !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 401 });
  }
  const webhookUrl = "https://padel-pro-bay.vercel.app/api/telegram/webhook";
  const setWebhook = await tg("setWebhook", {
    url: webhookUrl,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message"],
  });
  let me: unknown = null;
  try {
    me = await (
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`)
    ).json();
  } catch {
    /* ignore */
  }
  return Response.json({ setWebhook, me });
}
