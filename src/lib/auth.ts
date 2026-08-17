import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { supaAnon } from "./supabase/server";
import type { Player } from "./types";

const COOKIE = "padelpro_user";

function secret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "padelpro-fallback-secret"
  );
}

/** Подпись id игрока: id.sig — кука не подделывается без секрета. */
export function signSession(id: string): string {
  const sig = crypto
    .createHmac("sha256", secret())
    .update(id)
    .digest("base64url");
  return `${id}.${sig}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret())
    .update(id)
    .digest("base64url");
  // сравнение с защитой от timing-атак
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? id : null;
}

export async function setSession(id: string) {
  const c = await cookies();
  c.set(COOKIE, signSession(id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function currentUserId(): Promise<string | null> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE)?.value);
}

/** Текущий вошедший игрок (или null). */
export async function currentUser(): Promise<Player | null> {
  const id = await currentUserId();
  if (!id) return null;
  const supa = supaAnon();
  if (!supa) return null;
  const { data } = await supa.from("players").select("*").eq("id", id).single();
  return (data as Player) ?? null;
}

/** Нормализация номера: оставляем + и цифры. */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^0-9]/g, "");
  return (plus ? "+" : "") + digits;
}
