import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_COOKIE, adminCredentialsConfigured, createSessionToken, verifyCredentials } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  if (!adminCredentialsConfigured()) {
    return NextResponse.json({ error: 'Admin login is not configured (set ADMIN_EMAIL + ADMIN_PASSWORD)' }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter email + password' }, { status: 400 });
  if (!verifyCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
