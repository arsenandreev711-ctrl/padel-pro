"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { currentUser } from "@/lib/auth";
import { calcDeltas, START_RATING } from "@/lib/elo";
import type { Sport } from "@/lib/types";

/** Игрок записывает матч → статус «ожидает подтверждения» соперника. Elo пока не меняется. */
export async function recordMatch(formData: FormData) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect("/matches?error=db");

  const sport = (formData.get("sport") === "tennis" ? "tennis" : "padel") as Sport;
  const score = String(formData.get("score") || "").trim();
  const winner = formData.get("winner") === "2" ? 2 : 1;
  const team1 = [formData.get("t1p1"), formData.get("t1p2")]
    .map(String)
    .filter((x) => x && x !== "none");
  const team2 = [formData.get("t2p1"), formData.get("t2p2")]
    .map(String)
    .filter((x) => x && x !== "none");

  const overlap = team1.some((x) => team2.includes(x));
  const all = [...team1, ...team2];
  if (team1.length === 0 || team2.length === 0 || !score || overlap)
    redirect("/matches/new?error=1");
  // записывающий должен сам играть в матче
  if (!all.includes(me.id)) redirect("/matches/new?error=self");

  const { error } = await db.from("matches").insert({
    sport,
    score,
    team1,
    team2,
    winner,
    rating_deltas: {},
    status: "pending",
    created_by: me.id,
  });
  if (error) redirect("/matches/new?error=1");

  revalidatePath("/matches");
  redirect("/matches?pending=1");
}

/** Соперник подтверждает матч → пересчёт Elo по актуальным рейтингам. */
export async function confirmMatch(formData: FormData) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect("/matches?error=db");
  const matchId = String(formData.get("match_id") || "");

  const { data: m } = await db
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .maybeSingle();
  if (!m || m.status !== "pending") redirect("/matches");

  const team1: string[] = m.team1 ?? [];
  const team2: string[] = m.team2 ?? [];
  const all = [...team1, ...team2];
  // подтвердить может участник матча, но не тот, кто его записал
  if (!all.includes(me.id) || m.created_by === me.id) redirect("/matches?error=perm");

  const sport = m.sport as Sport;
  const winner = (m.winner === 2 ? 2 : 1) as 1 | 2;
  const ids = [...new Set(all)];
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
  const deltas = calcDeltas(T1, T2, winner);

  await db
    .from("matches")
    .update({ rating_deltas: deltas, status: "confirmed" })
    .eq("id", matchId);

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
  revalidatePath("/matches");
  redirect("/matches?confirmed=1");
}

/** Участник отклоняет неверный матч → запись удаляется. */
export async function rejectMatch(formData: FormData) {
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect("/matches?error=db");
  const matchId = String(formData.get("match_id") || "");

  const { data: m } = await db
    .from("matches")
    .select("id, team1, team2, status")
    .eq("id", matchId)
    .maybeSingle();
  if (!m || m.status !== "pending") redirect("/matches");
  const all = [...(m.team1 ?? []), ...(m.team2 ?? [])];
  if (!all.includes(me.id)) redirect("/matches?error=perm");

  await db.from("matches").delete().eq("id", matchId);
  revalidatePath("/matches");
  redirect("/matches?rejected=1");
}
