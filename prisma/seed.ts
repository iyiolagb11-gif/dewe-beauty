import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PRODUCTS, SHADES } from '../lib/data';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('Set DATABASE_URL to seed.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding DEWE catalog...');
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description, priceCents: p.priceCents, bestseller: p.bestseller, image: p.image },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        image: p.image,
        bestseller: p.bestseller,
      },
    });
  }
  for (const s of SHADES) {
    const existing = await prisma.shade.findFirst({ where: { name: s.name } });
    if (!existing) await prisma.shade.create({ data: { id: s.id, name: s.name, hex: s.hex } });
  }
  const links: Record<string, string[]> = {
    'glass-gloss': ['#E8879E', '#C83F68', '#F0AFC0'],
    'plump-tint': ['#7A2E42', '#B2665A', '#D96A82'],
    'sheer-balm-gloss': ['#F4C2CE', '#E3A6A0'],
    'mirror-shine-oil': ['#9C4B5C', '#C83F68'],
  };
  for (const [slug, hexes] of Object.entries(links)) {
    const prod = await prisma.product.findUnique({ where: { slug } });
    if (!prod) continue;
    for (const hex of hexes) {
      const shade = await prisma.shade.findFirst({ where: { hex } });
      if (shade && !shade.productId) await prisma.shade.update({ where: { id: shade.id }, data: { productId: prod.id } });
    }
  }
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
