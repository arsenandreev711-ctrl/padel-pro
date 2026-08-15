import { supaAnon, hasSupabase } from "./supabase/server";
import {
  demoGames,
  demoMatches,
  demoPlayers,
  demoRatings,
  demoTournaments,
  demoAwards,
  demoTournamentsPlayed,
  demoCourts,
} from "./demo-data";
import { eloToLevel } from "./grading";
import type {
  Court,
  Game,
  Match,
  Player,
  PlayerAward,
  Rating,
  RatingPoint,
  Sport,
  Tournament,
} from "./types";

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
    .limit(60);
  return ((data as Match[]) ?? []).filter((m) => m.status !== "pending").slice(0, 50);
}

export async function getRecentMatches(limit = 10): Promise<Match[]> {
  const supa = supaAnon();
  if (!supa) return demoMatches.slice(0, limit);
  const { data } = await supa
    .from("matches")
    .select("*")
    .order("played_at", { ascending: false })
    .limit(limit * 3);
  return ((data as Match[]) ?? []).filter((m) => m.status !== "pending").slice(0, limit);
}

/** Матчи, ожидающие подтверждения, где участвует игрок. */
export async function getPendingMatchesFor(playerId: string): Promise<Match[]> {
  const supa = supaAnon();
  if (!supa) return [];
  const { data } = await supa
    .from("matches")
    .select("*")
    .or(`team1.cs.{${playerId}},team2.cs.{${playerId}}`)
    .order("played_at", { ascending: false })
    .limit(30);
  return ((data as Match[]) ?? []).filter((m) => m.status === "pending");
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

export async function getGame(id: string): Promise<Game | null> {
  const supa = supaAnon();
  if (!supa) return demoGames.find((g) => g.id === id) ?? null;
  const { data } = await supa
    .from("games")
    .select("*, courts(*), game_players(player_id, players(*))")
    .eq("id", id)
    .maybeSingle();
  return (data as Game) ?? null;
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

export async function getTournament(id: string): Promise<Tournament | null> {
  const supa = supaAnon();
  if (!supa) return demoTournaments.find((tr) => tr.id === id) ?? null;
  const { data } = await supa
    .from("tournaments")
    .select("*, courts(*), tournament_players(player_id, place, players(*))")
    .eq("id", id)
    .maybeSingle();
  return (data as Tournament) ?? null;
}

export async function getPlayerGames(playerId: string): Promise<Game[]> {
  const supa = supaAnon();
  if (!supa) return [];
  const { data } = await supa
    .from("game_players")
    .select("games(*, courts(*), game_players(player_id, players(*)))")
    .eq("player_id", playerId);
  const rows = (data as unknown as { games: Game | null }[]) ?? [];
  const now = Date.now() - 864e5;
  return rows
    .map((r) => r.games)
    .filter((g): g is Game => !!g && new Date(g.starts_at).getTime() >= now)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}

export async function getPlayerUpcomingTournaments(playerId: string): Promise<Tournament[]> {
  const supa = supaAnon();
  if (!supa) return [];
  const { data } = await supa
    .from("tournament_players")
    .select("tournaments(*, courts(*), tournament_players(player_id))")
    .eq("player_id", playerId);
  const rows = (data as unknown as { tournaments: Tournament | null }[]) ?? [];
  return rows
    .map((r) => r.tournaments)
    .filter((tr): tr is Tournament => !!tr && tr.status !== "finished")
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}

export async function getCourts(): Promise<Court[]> {
  const supa = supaAnon();
  if (!supa) return demoCourts;
  const { data } = await supa.from("courts").select("*").order("name");
  return (data as Court[]) ?? [];
}

export async function getCounts(): Promise<{
  players: number;
  games: number;
  matches: number;
  tournaments: number;
}> {
  const supa = supaAnon();
  if (!supa)
    return {
      players: demoPlayers.length,
      games: demoGames.length,
      matches: demoMatches.length,
      tournaments: demoTournaments.length,
    };
  const [p, g, m, tr] = await Promise.all([
    supa.from("players").select("*", { count: "exact", head: true }),
    supa
      .from("games")
      .select("*", { count: "exact", head: true })
      .in("status", ["open", "full"]),
    supa.from("matches").select("*", { count: "exact", head: true }),
    supa.from("tournaments").select("*", { count: "exact", head: true }),
  ]);
  return {
    players: p.count ?? 0,
    games: g.count ?? 0,
    matches: m.count ?? 0,
    tournaments: tr.count ?? 0,
  };
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

// ——— Профиль: история рейтинга, награды, турниры ———

function seedFrom(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export async function getRatingHistory(
  playerId: string,
  sport: Sport,
  currentRating: number
): Promise<RatingPoint[]> {
  const supa = supaAnon();
  if (supa) {
    const { data } = await supa
      .from("rating_history")
      .select("rating, created_at")
      .eq("player_id", playerId)
      .eq("sport", sport)
      .order("created_at");
    const rows = (data as { rating: number; created_at: string }[]) ?? [];
    if (rows.length > 1) {
      return rows.map((d) => ({
        date: d.created_at,
        rating: d.rating,
        level: eloToLevel(d.rating),
      }));
    }
    return [
      {
        date: new Date().toISOString(),
        rating: currentRating,
        level: eloToLevel(currentRating),
      },
    ];
  }
  // demo: детерминированная история ~12 точек
  const n = 12;
  const seed = seedFrom(playerId + sport);
  const start = currentRating - 90 - (seed % 40);
  const pts: RatingPoint[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = start + (currentRating - start) * (0.15 + 0.85 * t);
    const wave = Math.sin((seed % 7) + i * 0.9) * 12 * (1 - t * 0.4);
    const rating = Math.round(i === n - 1 ? currentRating : base + wave);
    const date = new Date(Date.now() - (n - 1 - i) * 14 * 864e5).toISOString();
    pts.push({ date, rating, level: eloToLevel(rating) });
  }
  return pts;
}

interface AwardRow {
  place: number;
  tournament_id: string;
  tournaments?: { name?: string; sport?: Sport; starts_at?: string } | null;
}

export async function getPlayerAwards(playerId: string): Promise<PlayerAward[]> {
  const supa = supaAnon();
  if (!supa) {
    return (demoAwards[playerId] ?? []).slice().sort((a, b) => a.place - b.place);
  }
  const { data } = await supa
    .from("tournament_players")
    .select("place, tournament_id, tournaments(name, sport, starts_at)")
    .eq("player_id", playerId)
    .not("place", "is", null);
  const rows = (data as unknown as AwardRow[]) ?? [];
  return rows
    .map((r) => ({
      tournament_id: r.tournament_id,
      tournament_name: r.tournaments?.name ?? "Турнир",
      sport: (r.tournaments?.sport ?? "padel") as Sport,
      place: r.place,
      date: r.tournaments?.starts_at ?? new Date().toISOString(),
    }))
    .sort((a, b) => a.place - b.place);
}

export async function getTournamentsPlayed(playerId: string): Promise<number> {
  const supa = supaAnon();
  if (!supa) return demoTournamentsPlayed[playerId] ?? 0;
  const { count } = await supa
    .from("tournament_players")
    .select("*", { count: "exact", head: true })
    .eq("player_id", playerId);
  return count ?? 0;
}
