"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { currentUser } from "@/lib/auth";
import { calcDeltas, START_RATING } from "@/lib/elo";
import type { Sport } from "@/lib/types";

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

  // без дублей между командами
  const overlap = team1.some((x) => team2.includes(x));
  if (team1.length === 0 || team2.length === 0 || !score || overlap)
    redirect("/matches/new?error=1");

  const ids = [...new Set([...team1, ...team2])];
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
  if (error) redirect("/matches/new?error=1");

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
  redirect("/matches?recorded=1");
}
