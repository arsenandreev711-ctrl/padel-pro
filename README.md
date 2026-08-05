# Padel-PRO 🎾

Рейтинг падела и тенниса в Кыргызстане: рейтинг игроков (Elo), запись на игры, турниры, админ-панель. RU / KY.

## Стек
Next.js (App Router) · Tailwind CSS 4 · Supabase · Vercel

## Запуск локально
```bash
npm install
cp .env.example .env.local   # заполнить ключи Supabase
npm run dev
```
Без ключей Supabase сайт работает в демо-режиме с примерными данными.

## База данных
Выполнить `supabase/schema.sql` в Supabase SQL Editor.

## Деплой
Vercel: импортировать репозиторий, добавить env-переменные из `.env.example`.
