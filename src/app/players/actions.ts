"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supaAdmin } from "@/lib/supabase/server";
import { levelToElo } from "@/lib/grading";
import type { Sport } from "@/lib/types";

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
