import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SHADES } from '@/lib/data';

export async function GET() {
  if (prisma) {
    try {
      const shades = await prisma.shade.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json({ shades, source: 'db' });
    } catch (e) {
      console.warn('DB shades failed, falling back', e);
    }
  }
  return NextResponse.json({ shades: SHADES, source: 'static' });
}
