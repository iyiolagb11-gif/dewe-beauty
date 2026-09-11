import { prisma } from './db';
import { PRODUCTS, SHADES, type StaticProduct } from './data';

/** Storefront read path: Postgres when configured, static catalog otherwise. */
export async function getAllProducts(): Promise<{ products: StaticProduct[]; source: 'db' | 'static' }> {
  if (prisma) {
    try {
      const rows = await prisma.product.findMany({ include: { shades: true }, orderBy: { createdAt: 'asc' } });
      if (rows.length > 0) {
        return {
          source: 'db',
          products: rows.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            priceCents: p.priceCents,
            image: p.image,
            bestseller: p.bestseller,
            shadeHexes: p.shades.map((s) => s.hex),
          })),
        };
      }
    } catch (e) {
      console.warn('[products] DB read failed, static fallback', e);
    }
  }
  return { source: 'static', products: PRODUCTS };
}

export async function getProductBySlugDb(slug: string): Promise<StaticProduct | undefined> {
  const { products } = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export function shadeLabel(hex: string) {
  return SHADES.find((s) => s.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;
}
