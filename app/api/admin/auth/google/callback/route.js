import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/auth/oauth";
import { createAdminSession } from "@/lib/auth/admin";
import { COOKIE_NAMES, cookieOptions } from "@/lib/auth/cookies";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/admin/login?error=google_denied", request.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL("/admin/login?error=google_invalid", request.url));
  }

  const storedState = cookies().get("google_oauth_state")?.value;
  cookies().delete("google_oauth_state");
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL("/admin/login?error=google_state", request.url));
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectUri = `${siteUrl}/api/admin/auth/google/callback`;

    const tokens = await exchangeCodeForTokens({ code, redirectUri });
    const userInfo = await getGoogleUserInfo(tokens.access_token);

    const email = userInfo.email;
    if (!email) {
      return NextResponse.redirect(new URL("/admin/login?error=google_no_email", request.url));
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.redirect(new URL("/admin/login?error=not_authorized", request.url));
    }

    const { token, expiresAt } = await createAdminSession(admin.id);
    const res = NextResponse.redirect(new URL("/admin", request.url));
    res.cookies.set(COOKIE_NAMES.adminSession, token, {
      ...cookieOptions(),
      expires: expiresAt,
    });
    return res;
  } catch (err) {
    console.error("[admin google callback] error:", err.message);
    return NextResponse.redirect(new URL("/admin/login?error=google_failed", request.url));
  }
}
