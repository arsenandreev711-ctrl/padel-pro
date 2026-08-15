"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supaAdmin } from "@/lib/supabase/server";
import { currentUser } from "@/lib/auth";

function tid(formData: FormData): string {
  return String(formData.get("tournament_id") || "");
}

export async function joinTournament(formData: FormData) {
  const id = tid(formData);
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect(`/tournaments/${id}`);

  const { data: tr } = await db
    .from("tournaments")
    .select("id, max_players, tournament_players(player_id)")
    .eq("id", id)
    .maybeSingle();
  if (!tr) redirect("/tournaments");

  const players = (tr.tournament_players as { player_id: string }[]) || [];
  if (players.some((p) => p.player_id === me.id)) redirect(`/tournaments/${id}`);
  if (players.length >= tr.max_players) redirect(`/tournaments/${id}?full=1`);

  await db.from("tournament_players").insert({ tournament_id: id, player_id: me.id });
  revalidatePath(`/tournaments/${id}`);
  revalidatePath("/tournaments");
  redirect(`/tournaments/${id}`);
}

export async function leaveTournament(formData: FormData) {
  const id = tid(formData);
  const me = await currentUser();
  if (!me) redirect("/login?tab=login");
  const db = supaAdmin();
  if (!db) redirect(`/tournaments/${id}`);

  await db
    .from("tournament_players")
    .delete()
    .eq("tournament_id", id)
    .eq("player_id", me.id);
  revalidatePath(`/tournaments/${id}`);
  revalidatePath("/tournaments");
  redirect(`/tournaments/${id}`);
}
