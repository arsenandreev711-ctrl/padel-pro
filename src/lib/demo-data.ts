import type { Court, Game, Match, Player, Rating, Tournament } from "./types";

const days = (n: number) => new Date(Date.now() + n * 864e5).toISOString();

// Демо-данные, пока Supabase не подключён
export const demoPlayers: Player[] = [
  { id: "p1", full_name: "Азамат Исаков", city: "Бишкек", avatar_url: null, side_padel: "R", side_tennis: "R" },
  { id: "p2", full_name: "Бакыт Осмонов", city: "Бишкек", avatar_url: null, side_padel: "L", side_tennis: "both" },
  { id: "p3", full_name: "Айгерим Токтогулова", city: "Бишкек", avatar_url: null, side_padel: "R", side_tennis: null },
  { id: "p4", full_name: "Данияр Мамытов", city: "Бишкек", avatar_url: null, side_padel: "L", side_tennis: null },
  { id: "p5", full_name: "Мария Ким", city: "Бишкек", avatar_url: null, side_padel: "both", side_tennis: null },
  { id: "p6", full_name: "Нурлан Абдыкадыров", city: "Ош", avatar_url: null, side_padel: "R", side_tennis: null },
  { id: "p7", full_name: "Елена Соколова", city: "Бишкек", avatar_url: null, side_padel: null, side_tennis: "L" },
  { id: "p8", full_name: "Тимур Джумабеков", city: "Бишкек", avatar_url: null, side_padel: null, side_tennis: "R" },
];

// Демо-награды за турниры (места)
export const demoAwards: Record<string, { tournament_id: string; tournament_name: string; sport: import("./types").Sport; place: number; date: string }[]> = {
  p1: [
    { tournament_id: "tf1", tournament_name: "Bishkek Padel Cup 2025", sport: "padel", place: 1, date: days(-40) },
    { tournament_id: "tf2", tournament_name: "Ala-Too Tennis Open", sport: "tennis", place: 2, date: days(-70) },
    { tournament_id: "tf3", tournament_name: "Winter Padel Series", sport: "padel", place: 3, date: days(-110) },
    { tournament_id: "tf4", tournament_name: "Ala-Too Autumn Cup", sport: "tennis", place: 8, date: days(-140) },
  ],
  p2: [
    { tournament_id: "tf1", tournament_name: "Bishkek Padel Cup 2025", sport: "padel", place: 3, date: days(-40) },
  ],
  p7: [
    { tournament_id: "tf2", tournament_name: "Ala-Too Tennis Open", sport: "tennis", place: 1, date: days(-70) },
  ],
};

export const demoTournamentsPlayed: Record<string, number> = {
  p1: 6, p2: 3, p3: 2, p4: 1, p5: 2, p6: 1, p7: 4, p8: 2,
};

const p = (id: string) => demoPlayers.find((x) => x.id === id)!;

export const demoRatings: Rating[] = [
  { id: "r1", player_id: "p1", sport: "padel", rating: 1245, matches_played: 34, wins: 24, losses: 10, players: p("p1") },
  { id: "r2", player_id: "p2", sport: "padel", rating: 1198, matches_played: 28, wins: 18, losses: 10, players: p("p2") },
  { id: "r3", player_id: "p3", sport: "padel", rating: 1152, matches_played: 22, wins: 14, losses: 8, players: p("p3") },
  { id: "r4", player_id: "p4", sport: "padel", rating: 1104, matches_played: 19, wins: 10, losses: 9, players: p("p4") },
  { id: "r5", player_id: "p5", sport: "padel", rating: 1067, matches_played: 15, wins: 8, losses: 7, players: p("p5") },
  { id: "r6", player_id: "p6", sport: "padel", rating: 1012, matches_played: 9, wins: 4, losses: 5, players: p("p6") },
  { id: "r7", player_id: "p1", sport: "tennis", rating: 1310, matches_played: 41, wins: 30, losses: 11, players: p("p1") },
  { id: "r8", player_id: "p7", sport: "tennis", rating: 1275, matches_played: 36, wins: 25, losses: 11, players: p("p7") },
  { id: "r9", player_id: "p8", sport: "tennis", rating: 1230, matches_played: 30, wins: 20, losses: 10, players: p("p8") },
  { id: "r10", player_id: "p2", sport: "tennis", rating: 1140, matches_played: 18, wins: 10, losses: 8, players: p("p2") },
  { id: "r11", player_id: "p3", sport: "tennis", rating: 1085, matches_played: 12, wins: 6, losses: 6, players: p("p3") },
];

export const demoCourts: Court[] = [
  // Падел
  { id: "cp1", name: "Mr. Padel", city: "Бишкек", address: "ул. Токомбаева 52в/7", sports: ["padel"] },
  // Теннис
  { id: "ct1", name: "КФСО Динамо", city: "Бишкек", address: "ул. Водопроводная 4", sports: ["tennis"] },
  { id: "ct2", name: "T-club", city: "Бишкек", address: "ул. Токтогула 75/3", sports: ["tennis"] },
  { id: "ct3", name: "Ernin Tennis School", city: "Бишкек", address: "ул. Ахунбаева 97Б", sports: ["tennis"] },
  { id: "ct4", name: "Корты Парка Панфилова", city: "Бишкек", address: "ул. Тоголок Молдо 17а", sports: ["tennis"] },
  { id: "ct5", name: "Академия Тенниса", city: "Бишкек", address: "ул. Исакеева 4", sports: ["tennis"] },
  { id: "ct6", name: "Теннисные корты (4-й мкр)", city: "Бишкек", address: "4-й микрорайон 19/1", sports: ["tennis"] },
  { id: "ct7", name: "Family Sport", city: "Бишкек", address: "ул. Ахунбаева 2/4", sports: ["tennis"] },
];

export const demoGames: Game[] = [
  {
    id: "g1", sport: "padel", court_id: "cp1", starts_at: days(1), max_players: 4,
    min_rating: 1000, max_rating: 1300, price_som: 600, comment: "Дружеская игра 2х2",
    status: "open", courts: demoCourts[0],
    game_players: [{ player_id: "p1", players: p("p1") }, { player_id: "p3", players: p("p3") }],
  },
  {
    id: "g2", sport: "tennis", court_id: "ct1", starts_at: days(2), max_players: 2,
    min_rating: null, max_rating: null, price_som: 800, comment: "Одиночка, средний уровень",
    status: "open", courts: demoCourts[1],
    game_players: [{ player_id: "p7", players: p("p7") }],
  },
  {
    id: "g3", sport: "padel", court_id: "cp1", starts_at: days(3), max_players: 4,
    min_rating: 1100, max_rating: null, price_som: 500, comment: "Ищем сильных соперников",
    status: "open", courts: demoCourts[0],
    game_players: [{ player_id: "p2", players: p("p2") }, { player_id: "p4", players: p("p4") }, { player_id: "p5", players: p("p5") }],
  },
];

export const demoTournaments: Tournament[] = [
  {
    id: "t1", name: "Bishkek Padel Open", sport: "padel", format: "Americano",
    court_id: "cp1", starts_at: days(6), max_players: 16, price_som: 1500,
    description: "Открытый турнир для всех уровней", status: "registration", courts: demoCourts[0],
    tournament_players: demoRatings.filter(r => r.sport === "padel").slice(0, 6).map(r => ({ player_id: r.player_id, place: null, players: r.players })),
  },
  {
    id: "t2", name: "Ala-Too Tennis Cup", sport: "tennis", format: "Олимпийская сетка",
    court_id: "ct1", starts_at: days(13), max_players: 32, price_som: 2000,
    description: "Классический теннисный турнир", status: "registration", courts: demoCourts[1],
    tournament_players: [],
  },
];

export const demoMatches: Match[] = [
  {
    id: "m1", sport: "padel", played_at: days(-1), court_id: "cp1", score: "6:3, 6:4",
    team1: ["p1", "p3"], team2: ["p2", "p4"], winner: 1,
    rating_deltas: { p1: 14, p3: 16, p2: -14, p4: -16 }, tournament_id: null,
  },
  {
    id: "m2", sport: "tennis", played_at: days(-2), court_id: "ct1", score: "7:5, 4:6, 7:6",
    team1: ["p1"], team2: ["p7"], winner: 1,
    rating_deltas: { p1: 15, p7: -15 }, tournament_id: null,
  },
  {
    id: "m3", sport: "padel", played_at: days(-3), court_id: "cp1", score: "6:2, 6:1",
    team1: ["p2", "p5"], team2: ["p4", "p6"], winner: 1,
    rating_deltas: { p2: 12, p5: 13, p4: -12, p6: -13 }, tournament_id: null,
  },
];
