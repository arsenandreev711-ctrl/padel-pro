-- Padel-PRO — подтверждение матча вторым игроком (защита от накрутки рейтинга)
-- Выполнить в Supabase SQL Editor один раз.

alter table matches add column if not exists status text not null default 'confirmed';
alter table matches add column if not exists created_by uuid references players(id);

-- существующие матчи считаем подтверждёнными (default выше уже это делает)
notify pgrst, 'reload schema';
