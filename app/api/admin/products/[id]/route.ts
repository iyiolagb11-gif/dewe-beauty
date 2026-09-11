import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { SHADES } from '@/lib/data';

function needDb() {
  if (!prisma) return NextResponse.json({ error: 'Database not connected — set DATABASE_URL (Vercel Postgres) to manage products' }, { status: 503 });
  return null;
}

const updateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().min(4).max(500).optional(),
  priceDollars: z.number().min(0.5).max(9999).optional(),
  image: z.string().url().or(z.literal('')).optional(),
  bestseller: z.boolean().optional(),
  shadeHexes: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).max(12).optional(),
});

function shadeName(hex: string) {
  return SHADES.find((s) => s.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const err = needDb();
  if (err) return err;
  const body = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid update' }, { status: 400 });
  const d = parsed.data;

  try {
    const found = await prisma!.product.findUnique({ where: { id: params.id } });
    if (!found) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    const product = await prisma!.product.update({
      where: { id: params.id },
      data: {
        ...(d.name ? { name: d.name } : {}),
        ...(d.description ? { description: d.description } : {}),
        ...(d.priceDollars != null ? { priceCents: Math.round(d.priceDollars * 100) } : {}),
        ...(d.image !== undefined ? { image: d.image } : {}),
        ...(d.bestseller !== undefined ? { bestseller: d.bestseller } : {}),
      },
    });
    if (d.shadeHexes) {
      await prisma!.shade.deleteMany({ where: { productId: params.id } });
      await prisma!.shade.createMany({ data: d.shadeHexes.map((hex) => ({ name: shadeName(hex), hex, productId: params.id })) });
    }
    const full = await prisma!.product.findUnique({ where: { id: params.id }, include: { shades: true } });
    return NextResponse.json({ product: full ?? product });
  } catch {
    return NextResponse.json({ error: 'Database unreachable — check DATABASE_URL / start Postgres' }, { status: 503 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const err = needDb();
  if (err) return err;
  try {
    const found = await prisma!.product.findUnique({ where: { id: params.id }, include: { _count: { select: { items: true } } } });
    if (!found) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (found._count.items > 0) {
      return NextResponse.json({ error: `Can't delete — ${found._count.items} order(s) reference this product. Uncheck "bestseller" to hide it instead.` }, { status: 409 });
    }
    await prisma!.shade.deleteMany({ where: { productId: params.id } });
    await prisma!.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Database unreachable — check DATABASE_URL / start Postgres' }, { status: 503 });
  }
}
