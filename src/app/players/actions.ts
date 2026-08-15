"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supaAdmin } from "@/lib/supabase/server";
import { currentUser, normalizePhone } from "@/lib/auth";
import { levelToElo } from "@/lib/grading";
import type { Sport } from "@/lib/types";

/** Начать подтверждение номера через Telegram: создаёт токен и ведёт на /verify. */
export async function startTelegramVerify() {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  if (!me.phone) redirect("/profile/edit");
  const db = supaAdmin();
  if (!db) redirect(`/players/${me.id}`);
  const token = crypto.randomUUID().replace(/-/g, "");
  await db.from("tg_verify").insert({ token, phone: me.phone });
  redirect(`/verify?token=${token}`);
}

/** Редактирование своего профиля: имя, фамилия, телефон, город, фото. */
export async function updateProfile(formData: FormData) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect("/profile/edit?error=db");

  const first = String(formData.get("first_name") || "").trim();
  const last = String(formData.get("last_name") || "").trim();
  const city = String(formData.get("city") || "Бишкек").trim() || "Бишкек";
  const phone = normalizePhone(String(formData.get("phone") || ""));
  const full_name = [first, last].filter(Boolean).join(" ").trim();

  if (!first) redirect("/profile/edit?error=name");
  if (phone.replace(/\D/g, "").length < 6) redirect("/profile/edit?error=phone");

  // номер занят другим аккаунтом?
  const { data: taken } = await db
    .from("players")
    .select("id")
    .eq("phone", phone)
    .neq("id", me.id)
    .maybeSingle();
  if (taken) redirect("/profile/edit?error=phonetaken");

  const update: Record<string, string> = { full_name, city, phone };

  const file = formData.get("avatar");
  if (
    file &&
    typeof file === "object" &&
    "arrayBuffer" in file &&
    (file as File).size > 0 &&
    (file as File).size <= 5 * 1024 * 1024
  ) {
    try {
      const f = file as File;
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${me.id}/avatar-${Date.now()}.${ext}`;
      const buf = Buffer.from(await f.arrayBuffer());
      const { error: upErr } = await db.storage
        .from("avatars")
        .upload(path, buf, { contentType: f.type || "image/jpeg", upsert: true });
      if (!upErr) {
        const { data: pub } = db.storage.from("avatars").getPublicUrl(path);
        if (pub?.publicUrl) update.avatar_url = pub.publicUrl;
      }
    } catch {
      /* фото не критично */
    }
  }

  await db.from("players").update(update).eq("id", me.id);
  revalidatePath(`/players/${me.id}`);
  revalidatePath("/");
  redirect(`/players/${me.id}`);
}

/** Установить свой уровень по анкете на уже существующий аккаунт. */
export async function setMyLevel(formData: FormData) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect("/join?error=nodb");

  const side_padel = String(formData.get("side_padel") || "") || null;
  const side_tennis = String(formData.get("side_tennis") || "") || null;
  const lp = Number(formData.get("level_padel") || 0);
  const lt = Number(formData.get("level_tennis") || 0);

  const sports: { sport: Sport; level: number }[] = [];
  if (lp >= 1) sports.push({ sport: "padel", level: lp });
  if (lt >= 1) sports.push({ sport: "tennis", level: lt });
  if (sports.length === 0) redirect("/join?error=data");

  await db.from("players").update({ side_padel, side_tennis }).eq("id", me.id);

  for (const s of sports) {
    const rating = levelToElo(s.level);
    await db
      .from("ratings")
      .upsert({ player_id: me.id, sport: s.sport, rating }, { onConflict: "player_id,sport" });
    await db.from("rating_history").insert({
      player_id: me.id,
      sport: s.sport,
      rating,
    });
  }

  revalidatePath("/rating");
  revalidatePath(`/players/${me.id}`);
  redirect(`/players/${me.id}`);
}

/**
 * Создать профиль игрока по результатам анкеты.
 * Стартовый рейтинг рассчитывается из самооценённого уровня.
 */
export async function createPlayer(formData: FormData) {
  const db = supaAdmin();
  const full_name = String(formData.get("full_name") || "").trim();
  const city = String(formData.get("city") || "Бишкек").trim();
  const side_padel = (String(formData.get("side_padel") || "") || null) as
    | string
    | null;
  const side_tennis = (String(formData.get("side_tennis") || "") || null) as
    | string
    | null;

  const sports: { sport: Sport; level: number }[] = [];
  const lp = Number(formData.get("level_padel") || 0);
  const lt = Number(formData.get("level_tennis") || 0);
  if (lp >= 1) sports.push({ sport: "padel", level: lp });
  if (lt >= 1) sports.push({ sport: "tennis", level: lt });

  if (!full_name || sports.length === 0) redirect("/join?error=data");
  if (!db) redirect("/join?error=nodb");

  const { data: player, error } = await db
    .from("players")
    .insert({ full_name, city, side_padel, side_tennis })
    .select()
    .single();
  if (error || !player) redirect("/join?error=db");

  for (const s of sports) {
    const rating = levelToElo(s.level);
    await db.from("ratings").insert({
      player_id: player.id,
      sport: s.sport,
      rating,
    });
    await db.from("rating_history").insert({
      player_id: player.id,
      sport: s.sport,
      rating,
    });
  }

  revalidatePath("/rating");
  redirect(`/players/${player.id}`);
}
