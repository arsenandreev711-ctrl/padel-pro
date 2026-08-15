"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { setSession, clearSession, normalizePhone } from "@/lib/auth";

function requireDb() {
  const db = supaAdmin();
  if (!db) throw new Error("Supabase не настроен");
  return db;
}

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

/** Вход по номеру телефона. */
export async function login(formData: FormData) {
  const db = requireDb();
  const phone = normalizePhone(str(formData.get("phone")));
  if (phone.replace(/\D/g, "").length < 6) redirect("/login?error=phone");

  const { data: player } = await db
    .from("players")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (!player) {
    redirect("/login?tab=register&error=notfound&phone=" + encodeURIComponent(phone));
  }

  await setSession(player.id);
  revalidatePath("/");
  redirect("/players/" + player.id);
}

/** Регистрация: имя, фамилия, телефон, фото. */
export async function register(formData: FormData) {
  const db = requireDb();
  const first = str(formData.get("first_name"));
  const last = str(formData.get("last_name"));
  const city = str(formData.get("city")) || "Бишкек";
  const phone = normalizePhone(str(formData.get("phone")));
  const full_name = [first, last].filter(Boolean).join(" ").trim();

  if (!first) redirect("/login?tab=register&error=name");
  if (phone.replace(/\D/g, "").length < 6) redirect("/login?tab=register&error=phone");

  // номер уже зарегистрирован — просто входим
  const { data: existing } = await db
    .from("players")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();
  if (existing) {
    await setSession(existing.id);
    redirect("/players/" + existing.id);
  }

  const { data: player, error } = await db
    .from("players")
    .insert({ full_name, city, phone })
    .select("id")
    .single();
  if (error || !player) redirect("/login?tab=register&error=db&msg=" + encodeURIComponent(error?.message || ""));

  // загрузка фото в Supabase Storage (bucket "avatars")
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
      const path = `${player.id}/avatar.${ext}`;
      const buf = Buffer.from(await f.arrayBuffer());
      const { error: upErr } = await db.storage
        .from("avatars")
        .upload(path, buf, { contentType: f.type || "image/jpeg", upsert: true });
      if (!upErr) {
        const { data: pub } = db.storage.from("avatars").getPublicUrl(path);
        if (pub?.publicUrl) {
          await db.from("players").update({ avatar_url: pub.publicUrl }).eq("id", player.id);
        }
      }
    } catch {
      // фото не критично — регистрацию не срываем
    }
  }

  await setSession(player.id);
  revalidatePath("/");
  redirect("/join");
}

export async function logout() {
  await clearSession();
  revalidatePath("/");
  redirect("/");
}
