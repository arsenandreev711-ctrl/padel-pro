import { supaAnon, hasSupabase } from "./supabase/server";
import {
  demoGames,
  demoMatches,
  demoPlayers,
  demoRatings,
  demoTournaments,
} from "./demo-data";
import type { Game, Match, Player, Rating, Sport, Tournament } from "./types";

export const isDemo = () => !hasSupabase();

export async function getRatings(sport: Sport, limit = 100): Promise<Rating[]> {
  const supa = supaAnon();
  if (!supa) return demoRatings.filter((r) => r.sport === sport).slice(0, limit);
  const { data } = await supa
    .from("ratings")
    .select("*, players(*)")
    .eq("sport", sport)
    .order("rating", { ascending: false })
    .limit(limit);
  return (data as Rating[]) ?? [];
}

export async function getPlayer(id: string): Promise<Player | null> {
  const supa = supaAnon();
  if (!supa) return demoPlayers.find((p) => p.id === id) ?? null;
  const { data } = await supa.from("players").select("*").eq("id", id).single();
  return (data as Player) ?? null;
}

export async function getPlayerRatings(id: string): Promise<Rating[]> {
  const supa = supaAnon();
  if (!supa) return demoRatings.filter((r) => r.player_id === id);
  const { data } = await supa.from("ratings").select("*").eq("player_id", id);
  return (data as Rating[]) ?? [];
}

export async function getPlayerMatches(id: string): Promise<Match[]> {
  const supa = supaAnon();
  if (!supa)
    return demoMatches.filter(
      (m) => m.team1.includes(id) || m.team2.includes(id)
    );
  const { data } = await supa
    .from("matches")
    .select("*")
    .or(`team1.cs.{${id}},team2.cs.{${id}}`)
    .order("played_at", { ascending: false })
    .limit(50);
  return (data as Match[]) ?? [];
}

export async function getRecentMatches(limit = 10): Promise<Match[]> {
  const supa = supaAnon();
  if (!supa) return demoMatches.slice(0, limit);
  const { data } = await supa
    .from("matches")
    .select("*")
    .order("played_at", { ascending: false })
    .limit(limit);
  return (data as Match[]) ?? [];
}

export async function getGames(): Promise<Game[]> {
  const supa = supaAnon();
  if (!supa) return demoGames;
  const { data } = await supa
    .from("games")
    .select("*, courts(*), game_players(player_id, players(*))")
    .in("status", ["open", "full"])
    .gte("starts_at", new Date(Date.now() - 864e5).toISOString())
    .order("starts_at");
  return (data as Game[]) ?? [];
}

export async function getTournaments(): Promise<Tournament[]> {
  const supa = supaAnon();
  if (!supa) return demoTournaments;
  const { data } = await supa
    .from("tournaments")
    .select("*, courts(*), tournament_players(player_id, place, players(*))")
    .order("starts_at");
  return (data as Tournament[]) ?? [];
}

export async function getAllPlayers(): Promise<Player[]> {
  const supa = supaAnon();
  if (!supa) return demoPlayers;
  const { data } = await supa.from("players").select("*").order("full_name");
  return (data as Player[]) ?? [];
}

export async function getPlayersMap(ids: string[]): Promise<Record<string, Player>> {
  const supa = supaAnon();
  const map: Record<string, Player> = {};
  if (!supa) {
    for (const p of demoPlayers) if (ids.includes(p.id)) map[p.id] = p;
    return map;
  }
  if (ids.length === 0) return map;
  const { data } = await supa.from("players").select("*").in("id", ids);
  for (const p of (data as Player[]) ?? []) map[p.id] = p;
  return map;
}
