-- MatePoint — владелец турнира (чтобы организатор мог отменить свой турнир)
-- Выполнить один раз в Supabase SQL Editor.

alter table tournaments add column if not exists created_by uuid references players(id);
notify pgrst, 'reload schema';
