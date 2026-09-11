import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const ok = await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value);
  if (!ok) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, hasDb: !!prisma });
}
