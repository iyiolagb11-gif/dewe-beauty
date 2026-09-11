import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { newsletterSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid email' }, { status: 400 });
  const email = parsed.data.email.toLowerCase();

  if (prisma) {
    try {
      await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
      return NextResponse.json({ message: 'You are in! Check your inbox for 15% off.', source: 'db' });
    } catch (e) {
      console.warn('newsletter DB failed, mock success', e);
    }
  }
  return NextResponse.json({ message: 'You are in! Check your inbox for 15% off. (mock — connect Postgres to persist)', source: 'mock' });
}
