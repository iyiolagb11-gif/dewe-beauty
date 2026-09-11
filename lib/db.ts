import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient | null; prismaInit?: boolean };

function createClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  try {
    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({ adapter });
  } catch {
    return null;
  }
}

if (!globalForPrisma.prismaInit) {
  globalForPrisma.prisma = globalForPrisma.prisma ?? createClient();
  globalForPrisma.prismaInit = true;
}

export const prisma: PrismaClient | null = globalForPrisma.prisma ?? null;

export function hasDb() {
  return !!prisma;
}
