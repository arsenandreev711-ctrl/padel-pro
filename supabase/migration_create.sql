-- Padel-PRO — публичное создание игр и турниров (в стиле Lunda)
-- Выполнить в Supabase SQL Editor

-- Новые поля игр
alter table games add column if not exists level text;               -- уровень игры (текст)
alter table games add column if not exists court_booked boolean not null default false; -- корт уже забронирован
alter table games add column if not exists organizer_name text;       -- имя организатора
alter table games add column if not exists organizer_contact text;    -- телефон/telegram организатора

-- Новые поля турниров
alter table tournaments add column if not exists level text;          -- уровень
alter table tournaments add column if not exists prizes text;         -- призы за победу
alter table tournaments add column if not exists organizer_name text; -- имя организатора
alter table tournaments add column if not exists organizer_contact text; -- контакт организатора

-- Примечание по безопасности:
-- запись по-прежнему идёт только через service role (серверные экшены),
-- анонимный ключ не имеет прав на INSERT. RLS-политики не меняются.
