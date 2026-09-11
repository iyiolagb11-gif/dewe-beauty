import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PRODUCTS } from '@/lib/data';

export async function GET() {
  if (prisma) {
    try {
      const products = await prisma.product.findMany({ include: { shades: true }, orderBy: { createdAt: 'asc' } });
      return NextResponse.json({ products, source: 'db' });
    } catch (e) {
      console.warn('DB products failed, falling back to static', e);
    }
  }
  return NextResponse.json({
    products: PRODUCTS.map((p) => ({ ...p, shades: p.shadeHexes.map((hex, i) => ({ id: `${p.id}-${i}`, hex, name: hex })) })),
    source: 'static',
  });
}
