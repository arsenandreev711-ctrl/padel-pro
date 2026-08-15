"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { currentUser } from "@/lib/auth";
import type { Sport } from "@/lib/types";

function requireDb() {
  const db = supaAdmin();
  if (!db) throw new Error("Supabase не настроен (env-переменные)");
  return db;
}

function toSport(v: FormDataEntryValue | null): Sport {
  return v === "tennis" ? "tennis" : "padel";
}

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// ——— Публичное создание открытой игры ———
export async function createGame(formData: FormData) {
  const db = requireDb();
  const me = await currentUser();
  const sport = toSport(formData.get("sport"));
  const starts_at = str(formData.get("starts_at"));
  const court_id = str(formData.get("court_id"));
  const max_players = num(formData.get("max_players")) ?? (sport === "padel" ? 4 : 2);
  const level = str(formData.get("level")) || null;
  const court_booked = formData.get("court_booked") === "on";
  const price_som = num(formData.get("price_som"));
  const comment = str(formData.get("comment")) || null;
  const organizer_name = str(formData.get("organizer_name")) || me?.full_name || null;
  const organizer_contact = str(formData.get("organizer_contact")) || me?.phone || null;

  if (!starts_at) redirect("/create?tab=game&error=time");
  if (!organizer_contact) redirect("/create?tab=game&error=contact");

  const { data: gameRow, error } = await db
    .from("games")
    .insert({
      sport,
      starts_at: new Date(starts_at).toISOString(),
      court_id: court_id && court_id !== "none" ? court_id : null,
      max_players: Math.min(Math.max(max_players, 2), 8),
      level,
      court_booked,
      price_som,
      comment,
      organizer_name,
      organizer_contact,
      created_by: me?.id ?? null,
    })
    .select("id")
    .single();
  if (error || !gameRow) redirect("/create?tab=game&error=db");

  revalidatePath("/");
  revalidatePath("/games");
  redirect(`/games/${gameRow.id}?created=1`);
}

// ——— Публичное создание турнира ———
export async function createTournament(formData: FormData) {
  const db = requireDb();
  const me = await currentUser();
  const name = str(formData.get("name"));
  const sport = toSport(formData.get("sport"));
  const format = str(formData.get("format")) || "Americano";
  const starts_at = str(formData.get("starts_at"));
  const court_id = str(formData.get("court_id"));
  const max_players = num(formData.get("max_players")) ?? 16;
  const level = str(formData.get("level")) || null;
  const price_som = num(formData.get("price_som")); // взнос
  const prizes = str(formData.get("prizes")) || null;
  const description = str(formData.get("description")) || null;
  const organizer_name = str(formData.get("organizer_name")) || me?.full_name || null;
  const organizer_contact = str(formData.get("organizer_contact")) || me?.phone || null;

  if (!name) redirect("/create?tab=tournament&error=name");
  if (!starts_at) redirect("/create?tab=tournament&error=time");
  if (!organizer_contact) redirect("/create?tab=tournament&error=contact");

  const { error } = await db.from("tournaments").insert({
    name,
    sport,
    format,
    starts_at: new Date(starts_at).toISOString(),
    court_id: court_id && court_id !== "none" ? court_id : null,
    max_players: Math.min(Math.max(max_players, 4), 64),
    level,
    price_som,
    prizes,
    description,
    organizer_name,
    organizer_contact,
    status: "registration",
  });
  if (error) redirect("/create?tab=tournament&error=db");

  revalidatePath("/");
  revalidatePath("/tournaments");
  redirect("/tournaments?created=1");
}
