export type Sport = "padel" | "tennis";
export type CourtSide = "L" | "R" | "both";

export interface Court {
  id: string;
  name: string;
  city: string;
  address: string | null;
  sports: Sport[];
}

export interface Player {
  id: string;
  full_name: string;
  city: string;
  avatar_url: string | null;
  side_padel?: CourtSide | null;
  side_tennis?: CourtSide | null;
}

/** Точка истории рейтинга для графика */
export interface RatingPoint {
  date: string;
  rating: number;
  level: number;
}

/** Награда игрока за турнир (место) */
export interface PlayerAward {
  tournament_id: string;
  tournament_name: string;
  sport: Sport;
  place: number;
  date: string;
}

export interface Rating {
  id: string;
  player_id: string;
  sport: Sport;
  rating: number;
  matches_played: number;
  wins: number;
  losses: number;
  players?: Player;
}

export interface Match {
  id: string;
  sport: Sport;
  played_at: string;
  court_id: string | null;
  score: string;
  team1: string[];
  team2: string[];
  winner: 1 | 2;
  rating_deltas: Record<string, number>;
  tournament_id: string | null;
}

export interface Game {
  id: string;
  sport: Sport;
  court_id: string | null;
  starts_at: string;
  max_players: number;
  min_rating: number | null;
  max_rating: number | null;
  price_som: number | null;
  comment: string | null;
  status: "open" | "full" | "finished" | "cancelled";
  level?: string | null;
  court_booked?: boolean | null;
  organizer_name?: string | null;
  organizer_contact?: string | null;
  courts?: Court;
  game_players?: { player_id: string; players?: Player }[];
}

export interface Tournament {
  id: string;
  name: string;
  sport: Sport;
  format: string;
  court_id: string | null;
  starts_at: string;
  max_players: number;
  price_som: number | null;
  description: string | null;
  status: "upcoming" | "registration" | "ongoing" | "finished";
  level?: string | null;
  prizes?: string | null;
  organizer_name?: string | null;
  organizer_contact?: string | null;
  courts?: Court;
  tournament_players?: { player_id: string; place: number | null; players?: Player }[];
}
