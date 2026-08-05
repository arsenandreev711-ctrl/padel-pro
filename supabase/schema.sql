-- Padel-PRO — рейтинг падела и тенниса в Кыргызстане
-- Выполнить в Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Спорт: padel | tennis
create type sport_type as enum ('padel', 'tennis');
create type game_status as enum ('open', 'full', 'finished', 'cancelled');
create type tournament_status as enum ('upcoming', 'registration', 'ongoing', 'finished');

-- Корты / клубы
create table courts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text not null default 'Бишкек',
  address text,
  sports sport_type[] not null default '{padel,tennis}',
  phone text,
  created_at timestamptz not null default now()
);

-- Игроки
create table players (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  city text not null default 'Бишкек',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Рейтинг игрока по каждому виду спорта
create table ratings (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references players(id) on delete cascade,
  sport sport_type not null,
  rating int not null default 1000,
  matches_played int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  unique (player_id, sport)
);

-- Матчи (падел 2х2, теннис 1х1 или 2х2)
create table matches (
  id uuid primary key default uuid_generate_v4(),
  sport sport_type not null,
  played_at timestamptz not null default now(),
  court_id uuid references courts(id),
  score text not null, -- напр. "6:3, 4:6, 7:5"
  team1 uuid[] not null, -- id игроков команды 1 (победители)
  team2 uuid[] not null, -- id игроков команды 2
  winner int not null default 1 check (winner in (1,2)),
  rating_deltas jsonb not null default '{}', -- {player_id: delta}
  tournament_id uuid,
  created_at timestamptz not null default now()
);

-- Открытые игры (запись на корт)
create table games (
  id uuid primary key default uuid_generate_v4(),
  sport sport_type not null,
  court_id uuid references courts(id),
  starts_at timestamptz not null,
  max_players int not null default 4,
  min_rating int,
  max_rating int,
  price_som int,
  comment text,
  status game_status not null default 'open',
  created_by uuid references players(id),
  created_at timestamptz not null default now()
);

create table game_players (
  game_id uuid not null references games(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (game_id, player_id)
);

-- Турниры (Americano, Mexicano, Эскалера, олимпийка...)
create table tournaments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sport sport_type not null,
  format text not null default 'Americano',
  court_id uuid references courts(id),
  starts_at timestamptz not null,
  max_players int not null default 16,
  price_som int,
  description text,
  status tournament_status not null default 'registration',
  created_at timestamptz not null default now()
);

create table tournament_players (
  tournament_id uuid not null references tournaments(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  registered_at timestamptz not null default now(),
  place int,
  primary key (tournament_id, player_id)
);

alter table matches
  add constraint matches_tournament_fk
  foreign key (tournament_id) references tournaments(id) on delete set null;

-- RLS: публичное чтение, запись только через service role (админка на сервере)
alter table courts enable row level security;
alter table players enable row level security;
alter table ratings enable row level security;
alter table matches enable row level security;
alter table games enable row level security;
alter table game_players enable row level security;
alter table tournaments enable row level security;
alter table tournament_players enable row level security;

create policy "public read courts" on courts for select using (true);
create policy "public read players" on players for select using (true);
create policy "public read ratings" on ratings for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read games" on games for select using (true);
create policy "public read game_players" on game_players for select using (true);
create policy "public read tournaments" on tournaments for select using (true);
create policy "public read tournament_players" on tournament_players for select using (true);

-- Демо-данные: корты Бишкека
insert into courts (name, city, address, sports) values
  ('Padel Club Bishkek', 'Бишкек', 'ул. Ахунбаева 97', '{padel}'),
  ('Ala-Too Tennis Club', 'Бишкек', 'пр. Чуй 158', '{tennis}'),
  ('Dordoi Sport Arena', 'Бишкек', 'ул. Кожевенная 74', '{padel,tennis}');
