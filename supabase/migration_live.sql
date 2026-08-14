-- Padel-PRO — миграция живой базы: профили + сид кортов
-- Выполнить в Supabase SQL Editor

-- 1. Профили: стороны корта
alter table players add column if not exists side_padel text check (side_padel in ('L','R','both'));
alter table players add column if not exists side_tennis text check (side_tennis in ('L','R','both'));

-- 2. История рейтинга (для графика в профиле)
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

-- 3. Корты Бишкека (сеем только если таблица пустая)
insert into courts (name, city, address, sports)
select v.name, v.city, v.address, v.sports::sport_type[] from (values
  ('Mr. Padel','Бишкек','ул. Токомбаева 52в/7','{padel}'),
  ('КФСО Динамо','Бишкек','ул. Водопроводная 4','{tennis}'),
  ('T-club','Бишкек','ул. Токтогула 75/3','{tennis}'),
  ('Ernin Tennis School','Бишкек','ул. Ахунбаева 97Б','{tennis}'),
  ('Корты Парка Панфилова','Бишкек','ул. Тоголок Молдо 17а','{tennis}'),
  ('Академия Тенниса','Бишкек','ул. Исакеева 4','{tennis}'),
  ('Теннисные корты (4-й мкр)','Бишкек','4-й микрорайон 19/1','{tennis}'),
  ('Family Sport','Бишкек','ул. Ахунбаева 2/4','{tennis}')
) as v(name,city,address,sports)
where not exists (select 1 from courts);
