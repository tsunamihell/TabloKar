import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// Configure SQLite WAL mode and busy timeout for concurrent LAN access
export async function configureDatabase() {
  try {
    await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
    await prisma.$queryRawUnsafe('PRAGMA busy_timeout = 5000;');
    await prisma.$queryRawUnsafe('PRAGMA foreign_keys = ON;');
  } catch (err) {
    console.error('Error setting SQLite PRAGMAs:', err);
    throw err;
  }
}
