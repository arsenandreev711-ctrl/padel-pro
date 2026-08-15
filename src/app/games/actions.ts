"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { currentUser } from "@/lib/auth";

function gid(formData: FormData): string {
  return String(formData.get("game_id") || "");
}

export async function joinGame(formData: FormData) {
  const gameId = gid(formData);
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect(`/games/${gameId}`);

  const { data: game } = await db
    .from("games")
    .select("id, max_players, game_players(player_id)")
    .eq("id", gameId)
    .maybeSingle();
  if (!game) redirect("/games");

  const players = (game.game_players as { player_id: string }[]) || [];
  if (players.some((p) => p.player_id === me.id)) redirect(`/games/${gameId}`);
  if (players.length >= game.max_players) redirect(`/games/${gameId}?full=1`);

  await db.from("game_players").insert({ game_id: gameId, player_id: me.id });
  if (players.length + 1 >= game.max_players) {
    await db.from("games").update({ status: "full" }).eq("id", gameId);
  }
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
  revalidatePath("/");
  redirect(`/games/${gameId}`);
}

export async function cancelGame(formData: FormData) {
  const gameId = gid(formData);
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect(`/games/${gameId}`);

  const { data: g } = await db
    .from("games")
    .select("id, created_by")
    .eq("id", gameId)
    .maybeSingle();
  if (!g) redirect("/games");
  if (g.created_by !== me.id) redirect(`/games/${gameId}`);

  await db.from("games").update({ status: "cancelled" }).eq("id", gameId);
  revalidatePath("/games");
  revalidatePath("/");
  revalidatePath(`/games/${gameId}`);
  redirect("/games");
}

export async function leaveGame(formData: FormData) {
  const gameId = gid(formData);
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect(`/games/${gameId}`);

  await db.from("game_players").delete().eq("game_id", gameId).eq("player_id", me.id);
  await db.from("games").update({ status: "open" }).eq("id", gameId);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
  revalidatePath("/");
  redirect(`/games/${gameId}`);
}
