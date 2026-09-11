import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { SHADES } from '@/lib/data';

function needDb() {
  if (!prisma) return NextResponse.json({ error: 'Database not connected — set DATABASE_URL (Vercel Postgres) to manage products' }, { status: 503 });
  return null;
}

const hexList = z
  .array(z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use hex colors like #C83F68'))
  .max(12)
  .default([]);

const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(80),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug: lowercase letters, numbers, hyphens')
    .min(2)
    .max(80)
    .optional(),
  description: z.string().min(4, 'Description is required').max(500),
  priceDollars: z.number().min(0.5).max(9999),
  image: z.string().url('Image must be a URL').or(z.literal('')),
  bestseller: z.boolean().default(false),
  shadeHexes: hexList,
});

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || `product-${Date.now().toString(36)}`;
}

function shadeName(hex: string) {
  return SHADES.find((s) => s.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;
}

export async function GET() {
  const err = needDb();
  if (err) return err;
  try {
    const products = await prisma!.product.findMany({ include: { shades: true, _count: { select: { items: true } } }, orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Database unreachable — check DATABASE_URL / start Postgres' }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const err = needDb();
  if (err) return err;
  const body = await req.json().catch(() => ({}));
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid product' }, { status: 400 });
  const d = parsed.data;
  const slug = d.slug || slugify(d.name);
  try {
    const existing = await prisma!.product.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: `Slug "${slug}" is taken` }, { status: 409 });
    const product = await prisma!.product.create({
      data: {
        slug,
        name: d.name,
        description: d.description,
        priceCents: Math.round(d.priceDollars * 100),
        image: d.image,
        bestseller: d.bestseller,
        shades: { create: d.shadeHexes.map((hex) => ({ name: shadeName(hex), hex })) },
      },
      include: { shades: true },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Database unreachable — check DATABASE_URL / start Postgres' }, { status: 503 });
  }
}
