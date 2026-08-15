-- MatePoint — подтверждение номера через Telegram
-- Выполнить один раз в Supabase → SQL Editor.

alter table players add column if not exists phone_verified boolean not null default false;

create table if not exists tg_verify (
  token text primary key,
  phone text not null,
  chat_id bigint,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
-- доступ только через сервисный ключ (сервер), не через публичный anon
alter table tg_verify enable row level security;

notify pgrst, 'reload schema';
