-- MatePoint — финальная подготовка базы к запуску.
-- Безопасно запускать целиком один раз (идемпотентно). Supabase → SQL Editor → Run.

-- 1) Поля игр и турниров
alter table games add column if not exists level text;
alter table games add column if not exists court_booked boolean not null default false;
alter table games add column if not exists organizer_name text;
alter table games add column if not exists organizer_contact text;

alter table tournaments add column if not exists level text;
alter table tournaments add column if not exists prizes text;
alter table tournaments add column if not exists organizer_name text;
alter table tournaments add column if not exists organizer_contact text;
alter table tournaments add column if not exists created_by uuid references players(id);

-- 2) Подтверждение матчей
alter table matches add column if not exists status text not null default 'confirmed';
alter table matches add column if not exists created_by uuid references players(id);

-- 3) Уникальный телефон и хранилище фото
create unique index if not exists players_phone_unique on players (phone) where phone is not null;
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true) on conflict (id) do nothing;

-- 4) Удалить тестовые данные
delete from games where organizer_contact = '+996700000001';
delete from players where phone = '+996700000001';

-- 5) Обновить кэш схемы
notify pgrst, 'reload schema';

-- Проверка: тестового игрока быть не должно (вернёт 0 строк)
select id, full_name, phone from players where phone = '+996700000001';
