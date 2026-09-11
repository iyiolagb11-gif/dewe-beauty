import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { orderSchema } from '@/lib/validations';
import { PRODUCTS } from '@/lib/data';
import { sendOrderConfirmation } from '@/lib/mail';

async function priceFor(productId: string) {
  if (prisma) {
    try {
      const row = await prisma.product.findUnique({ where: { id: productId }, select: { priceCents: true } });
      if (row) return row.priceCents;
    } catch {}
  }
  return PRODUCTS.find((p) => p.id === productId)?.priceCents;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid order' }, { status: 400 });
  const { email, name, address, city, zip, items } = parsed.data;

  let totalCents = 0;
  const prices = new Map<string, number>();
  for (const it of items) {
    const price = await priceFor(it.productId);
    if (price == null) return NextResponse.json({ error: `Unknown product ${it.productId}` }, { status: 400 });
    prices.set(it.productId, price);
    totalCents += price * it.qty;
  }
  const shipping = totalCents >= 3500 ? 0 : 495;
  totalCents += shipping;

  if (prisma) {
    try {
      const order = await prisma.order.create({
        data: {
          email, name, address, city, zip, totalCents, status: 'mock_completed',
          items: { create: items.map((it) => ({ productId: it.productId, qty: it.qty, priceCents: prices.get(it.productId)! })) },
        },
        include: { items: true },
      });
      const emailResult = await sendOrderConfirmation({ to: email, name, orderId: order.id, totalCents, items });
      return NextResponse.json({ order, source: 'db', email: emailResult }, { status: 201 });
    } catch (e) {
      console.warn('order DB failed, mock order', e);
    }
  }

  const mockId = `mock_${Date.now().toString(36)}`;
  const emailResult = await sendOrderConfirmation({ to: email, name, orderId: mockId, totalCents, items });
  return NextResponse.json(
    { order: { id: mockId, email, name, totalCents, status: 'mock_completed', items }, source: 'mock', email: emailResult },
    { status: 201 },
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!prisma) return NextResponse.json({ orders: [], source: 'mock' });
  try {
    const orders = await prisma.order.findMany({
      where: email ? { email } : undefined,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ orders, source: 'db' });
  } catch (e) {
    return NextResponse.json({ orders: [], source: 'mock' });
  }
}
