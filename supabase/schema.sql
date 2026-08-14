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
  side_padel text check (side_padel in ('L','R','both')),
  side_tennis text check (side_tennis in ('L','R','both')),
  created_at timestamptz not null default now()
);

-- История рейтинга (для графика в профиле)
create table rating_history (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references players(id) on delete cascade,
  sport sport_type not null,
  rating int not null,
  created_at timestamptz not null default now()
);
create index rating_history_player_idx on rating_history (player_id, sport, created_at);

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
alter table rating_history enable row level security;
alter table ratings enable row level security;
alter table matches enable row level security;
alter table games enable row level security;
alter table game_players enable row level security;
alter table tournaments enable row level security;
alter table tournament_players enable row level security;

create policy "public read courts" on courts for select using (true);
create policy "public read players" on players for select using (true);
create policy "public read rating_history" on rating_history for select using (true);
create policy "public read ratings" on ratings for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read games" on games for select using (true);
create policy "public read game_players" on game_players for select using (true);
create policy "public read tournaments" on tournaments for select using (true);
create policy "public read tournament_players" on tournament_players for select using (true);

-- Корты Бишкека
insert into courts (name, city, address, sports) values
  ('Mr. Padel', 'Бишкек', 'ул. Токомбаева 52в/7', '{padel}'),
  ('КФСО Динамо', 'Бишкек', 'ул. Водопроводная 4', '{tennis}'),
  ('T-club', 'Бишкек', 'ул. Токтогула 75/3', '{tennis}'),
  ('Ernin Tennis School', 'Бишкек', 'ул. Ахунбаева 97Б', '{tennis}'),
  ('Корты Парка Панфилова', 'Бишкек', 'ул. Тоголок Молдо 17а', '{tennis}'),
  ('Академия Тенниса', 'Бишкек', 'ул. Исакеева 4', '{tennis}'),
  ('Теннисные корты (4-й мкр)', 'Бишкек', '4-й микрорайон 19/1', '{tennis}'),
  ('Family Sport', 'Бишкек', 'ул. Ахунбаева 2/4', '{tennis}');
