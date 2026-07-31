import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { getGoogleAuthUrl } from "@/lib/auth/oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Google OAuth not configured", { status: 500 });
  }

  const state = randomBytes(32).toString("hex");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  cookies().set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const url = getGoogleAuthUrl({ state, redirectUri });
  return NextResponse.redirect(url);
}
