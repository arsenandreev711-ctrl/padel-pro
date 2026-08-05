import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get("to") === "ky" ? "ky" : "ru";
  const back = req.nextUrl.searchParams.get("back") || "/";
  const res = NextResponse.redirect(new URL(back, req.url));
  res.cookies.set("lang", to, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  return res;
}
