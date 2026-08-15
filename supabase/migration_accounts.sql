-- Padel-PRO — вход по телефону + фото профиля + поля создания игр
-- Выполнить в Supabase SQL Editor ОДИН раз.

-- 1) Поля для публичного создания игр/турниров
alter table games add column if not exists level text;
alter table games add column if not exists court_booked boolean not null default false;
alter table games add column if not exists organizer_name text;
alter table games add column if not exists organizer_contact text;

alter table tournaments add column if not exists level text;
alter table tournaments add column if not exists prizes text;
alter table tournaments add column if not exists organizer_name text;
alter table tournaments add column if not exists organizer_contact text;

-- 2) Уникальный номер телефона (для входа). Пустые номера не мешают.
create unique index if not exists players_phone_unique
  on players (phone) where phone is not null;

-- 3) Хранилище для фото профиля (публичный бакет "avatars")
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 4) Обновить кэш схемы PostgREST, чтобы новые колонки сразу заработали
notify pgrst, 'reload schema';

-- Проверка: должно вернуться 2 строки
select table_name, column_name
from information_schema.columns
where (table_name = 'games' and column_name = 'court_booked')
   or (table_name = 'tournaments' and column_name = 'prizes');
