import { NextRequest } from "next/server";
import { supaAdmin } from "@/lib/supabase/server";
import { tg } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const digits = (s: string) => (s || "").replace(/\D/g, "");

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 401 });
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return new Response("ok");
  }

  const msg = (update?.message ?? {}) as {
    chat?: { id?: number };
    text?: string;
    contact?: { phone_number?: string };
  };
  const chatId = msg.chat?.id;
  const db = supaAdmin();

  if (!chatId || !db) return new Response("ok");

  try {
    if (typeof msg.text === "string" && msg.text.startsWith("/start")) {
      const token = msg.text.split(/\s+/)[1];
      if (token) {
        await db.from("tg_verify").update({ chat_id: chatId }).eq("token", token);
        await tg("sendMessage", {
          chat_id: chatId,
          text: "Нажми кнопку ниже, чтобы подтвердить свой номер в MatePoint 👇",
          reply_markup: {
            keyboard: [[{ text: "📱 Поделиться номером", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      } else {
        await tg("sendMessage", {
          chat_id: chatId,
          text: "Открой ссылку подтверждения со страницы своего профиля на MatePoint.",
        });
      }
    } else if (msg.contact) {
      const phone = digits(String(msg.contact.phone_number || ""));
      const { data: rows } = await db
        .from("tg_verify")
        .select("token, phone")
        .eq("chat_id", chatId)
        .eq("verified", false)
        .order("created_at", { ascending: false })
        .limit(1);
      const row = rows?.[0] as { token: string; phone: string } | undefined;
      if (row) {
        const expected = digits(row.phone);
        if (phone === expected || phone.endsWith(expected) || expected.endsWith(phone)) {
          await db.from("players").update({ phone_verified: true }).eq("phone", row.phone);
          await db.from("tg_verify").update({ verified: true }).eq("token", row.token);
          await tg("sendMessage", {
            chat_id: chatId,
            text: "✅ Номер подтверждён! Возвращайся на сайт MatePoint.",
            reply_markup: { remove_keyboard: true },
          });
        } else {
          await tg("sendMessage", {
            chat_id: chatId,
            text: "Номер в Telegram не совпал с тем, что ты ввёл на сайте. Проверь номер в профиле.",
          });
        }
      }
    }
  } catch {
    // не роняем вебхук — Telegram не должен ретраить бесконечно
  }

  return new Response("ok");
}
