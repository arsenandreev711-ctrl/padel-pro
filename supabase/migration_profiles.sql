-- Миграция для уже созданной базы: профили, стороны корта, история рейтинга
-- Выполнить в Supabase SQL Editor поверх schema.sql

alter table players add column if not exists side_padel text check (side_padel in ('L','R','both'));
alter table players add column if not exists side_tennis text check (side_tennis in ('L','R','both'));

create table if not exists rating_history (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references players(id) on delete cascade,
  sport sport_type not null,
  rating int not null,
  created_at timestamptz not null default now()
);
create index if not exists rating_history_player_idx on rating_history (player_id, sport, created_at);

alter table rating_history enable row level security;
drop policy if exists "public read rating_history" on rating_history;
create policy "public read rating_history" on rating_history for select using (true);
