import { NextRequest } from "next/server";
import { supaAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  const db = supaAdmin();
  if (!token || !db) return Response.json({ verified: false });
  const { data } = await db
    .from("tg_verify")
    .select("verified")
    .eq("token", token)
    .maybeSingle();
  return Response.json({ verified: !!data?.verified });
}
