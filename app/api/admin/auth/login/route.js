// POST /api/admin/auth/login
// Body: { email, password }
// - Validate email + password
// - Check rate limit (key: "admin_login:<ip>:<email>")
// - Use verifyAdminCredentials (returns safe admin or null)
// - Create session, set admin cookie
// - Return 200 with safe admin data (id, email, name)
//
// Admin login gets its own limit string to keep it separate from
// customer login. Reuse the same numeric values as customer login.
const ADMIN_LOGIN_LIMIT = { maxAttempts: 10, windowMs: 15 * 60 * 1000 };

export const dynamic = "force-dynamic";

export async function POST(request) {
  const ip = getClientIp(request);
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const emailR = validateEmail(body.email);
  if (!emailR.ok) return NextResponse.json({ error: emailR.error }, { status: 400 });

  const limit = checkRateLimit(
    `admin_login:${ip}:${emailR.value}`,
    ADMIN_LOGIN_LIMIT.maxAttempts,
    ADMIN_LOGIN_LIMIT.windowMs
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 403 }
    );
  }

  const passwordR = validatePassword(body.password);
  if (!passwordR.ok) return NextResponse.json({ error: passwordR.error }, { status: 400 });

  const admin = await verifyAdminCredentials(emailR.value, passwordR.value);
  if (!admin) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const { token, expiresAt } = await createAdminSession(admin.id);

  const res = NextResponse.json({ admin });
  res.cookies.set(COOKIE_NAMES.adminSession, token, {
    ...cookieOptions(),
    expires: expiresAt,
  });
  return res;
}
