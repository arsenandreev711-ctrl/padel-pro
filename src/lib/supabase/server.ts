import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedAnon: SupabaseClient | null = null;
let cachedAdmin: SupabaseClient | null = null;

export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Клиент для чтения публичных данных (anon key). null если env не настроен. */
export function supaAnon(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  if (!cachedAnon) {
    cachedAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return cachedAnon;
}

/** Сервисный клиент для записи (админка, запись на игры). null если env не настроен. */
export function supaAdmin(): SupabaseClient | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return null;
  if (!cachedAdmin) {
    cachedAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return cachedAdmin;
}
