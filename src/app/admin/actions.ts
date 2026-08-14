"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { calcDeltas, START_RATING } from "@/lib/elo";
import type { Sport } from "@/lib/types";

const COOKIE = "padelpro_admin";

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get(COOKIE)?.value === adminToken();
}

function adminToken(): string {
  const pwd = process.env.ADMIN_PASSWORD || "";
  // простой токен на основе пароля
  return Buffer.from("padelpro:" + pwd).toString("base64url");
}

export async function login(formData: FormData) {
  const pwd = String(formData.get("password") || "");
  if (!process.env.ADMIN_PASSWORD || pwd !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }
  const c = await cookies();
  c.set(COOKIE, adminToken(), { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  redirect("/admin");
}

export async function logout() {
  const c = await cookies();
  c.delete(COOKIE);
  redirect("/admin");
}

function requireDb() {
  const db = supaAdmin();
  if (!db) throw new Error("Supabase не настроен (env-переменные)");
  return db;
}

async function guard() {
  if (!(await isAdmin())) redirect("/admin");
}

export async function addPlayer(formData: FormData) {
  await guard();
  const db = requireDb();
  const full_name = String(formData.get("full_name") || "").trim();
  const city = String(formData.get("city") || "Бишкек").trim();
  const sports = formData.getAll("sports").map(String) as Sport[];
  if (!full_name) redirect("/admin?error=name");

  const { data: player, error } = await db
    .from("players")
    .insert({ full_name, city })
    .select()
    .single();
  if (error || !player) redirect("/admin?error=db");

  for (const sport of sports.length ? sports : ["padel" as Sport]) {
    await db.from("ratings").insert({
      player_id: player.id,
      sport,
      rating: START_RATING,
    });
    await db.from("rating_history").insert({
      player_id: player.id,
      sport,
      rating: START_RATING,
    });
  }
  revalidatePath("/");
  revalidatePath("/rating");
  redirect("/admin?ok=player");
}

export async function addMatch(formData: FormData) {
  await guard();
  const db = requireDb();
  const sport = (formData.get("sport") === "tennis" ? "tennis" : "padel") as Sport;
  const score = String(formData.get("score") || "").trim();
  const winner = formData.get("winner") === "2" ? 2 : 1;
  const team1 = [formData.get("t1p1"), formData.get("t1p2")]
    .map(String)
    .filter((x) => x && x !== "none");
  const team2 = [formData.get("t2p1"), formData.get("t2p2")]
    .map(String)
    .filter((x) => x && x !== "none");
  if (team1.length === 0 || team2.length === 0 || !score)
    redirect("/admin?error=match");

  // текущие рейтинги
  const ids = [...team1, ...team2];
  const { data: ratings } = await db
    .from("ratings")
    .select("*")
    .eq("sport", sport)
    .in("player_id", ids);

  const getR = (pid: string) => {
    const r = (ratings ?? []).find((x) => x.player_id === pid);
    return {
      playerId: pid,
      rating: r?.rating ?? START_RATING,
      matchesPlayed: r?.matches_played ?? 0,
      row: r,
    };
  };
  const T1 = team1.map(getR);
  const T2 = team2.map(getR);
  const deltas = calcDeltas(T1, T2, winner as 1 | 2);

  const { error } = await db.from("matches").insert({
    sport,
    score,
    team1,
    team2,
    winner,
    rating_deltas: deltas,
  });
  if (error) redirect("/admin?error=db");

  // применяем дельты
  for (const p of [...T1, ...T2]) {
    const isT1 = team1.includes(p.playerId);
    const won = (winner === 1) === isT1;
    const newRating = p.rating + (deltas[p.playerId] ?? 0);
    if (p.row) {
      await db
        .from("ratings")
        .update({
          rating: newRating,
          matches_played: p.matchesPlayed + 1,
          wins: (p.row.wins ?? 0) + (won ? 1 : 0),
          losses: (p.row.losses ?? 0) + (won ? 0 : 1),
        })
        .eq("id", p.row.id);
    } else {
      await db.from("ratings").insert({
        player_id: p.playerId,
        sport,
        rating: newRating,
        matches_played: 1,
        wins: won ? 1 : 0,
        losses: won ? 0 : 1,
      });
    }
    await db.from("rating_history").insert({
      player_id: p.playerId,
      sport,
      rating: newRating,
    });
  }
  revalidatePath("/");
  revalidatePath("/rating");
  redirect("/admin?ok=match");
}

export async function addGame(formData: FormData) {
  await guard();
  const db = requireDb();
  const sport = (formData.get("sport") === "tennis" ? "tennis" : "padel") as Sport;
  const starts_at = String(formData.get("starts_at") || "");
  const court_id = String(formData.get("court_id") || "") || null;
  const max_players = Number(formData.get("max_players") || 4);
  const price_som = formData.get("price_som") ? Number(formData.get("price_som")) : null;
  const comment = String(formData.get("comment") || "").trim() || null;
  if (!starts_at) redirect("/admin?error=game");

  const { error } = await db.from("games").insert({
    sport,
    starts_at: new Date(starts_at).toISOString(),
    court_id: court_id === "none" ? null : court_id,
    max_players,
    price_som,
    comment,
  });
  if (error) redirect("/admin?error=db");
  revalidatePath("/games");
  redirect("/admin?ok=game");
}

export async function addTournament(formData: FormData) {
  await guard();
  const db = requireDb();
  const name = String(formData.get("name") || "").trim();
  const sport = (formData.get("sport") === "tennis" ? "tennis" : "padel") as Sport;
  const format = String(formData.get("format") || "Americano");
  const starts_at = String(formData.get("starts_at") || "");
  const court_id = String(formData.get("court_id") || "") || null;
  const max_players = Number(formData.get("max_players") || 16);
  const price_som = formData.get("price_som") ? Number(formData.get("price_som")) : null;
  const description = String(formData.get("description") || "").trim() || null;
  if (!name || !starts_at) redirect("/admin?error=tournament");

  const { error } = await db.from("tournaments").insert({
    name,
    sport,
    format,
    starts_at: new Date(starts_at).toISOString(),
    court_id: court_id === "none" ? null : court_id,
    max_players,
    price_som,
    description,
  });
  if (error) redirect("/admin?error=db");
  revalidatePath("/tournaments");
  redirect("/admin?ok=tournament");
}

export async function addCourt(formData: FormData) {
  await guard();
  const db = requireDb();
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "Бишкек").trim();
  const address = String(formData.get("address") || "").trim() || null;
  const sports = formData.getAll("sports").map(String);
  if (!name) redirect("/admin?error=court");
  const { error } = await db.from("courts").insert({
    name,
    city,
    address,
    sports: sports.length ? sports : ["padel", "tennis"],
  });
  if (error) redirect("/admin?error=db");
  redirect("/admin?ok=court");
}
