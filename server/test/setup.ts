import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, afterAll } from 'vitest';

const directory = mkdtempSync(join(tmpdir(), 'tablokar-test-'));
process.env.DATABASE_URL = `file:${join(directory, 'test.db').replace(/\\/g, '/')}`;
process.env.JWT_SECRET = 'isolated-test-secret-that-is-at-least-32-characters';

beforeAll(async () => {
  const { prisma } = await import('../src/db.js');
  const { hashPassword } = await import('../src/utils/password.js');
  const migration = readFileSync(resolve('prisma/migrations/20261101012911_init/migration.sql'), 'utf8');
  for (const sql of migration.split(';').filter(sql => sql.trim())) {
    await prisma.$executeRawUnsafe(sql);
  }
  for (const name of ['Admin', 'Installer']) {
    const role = await prisma.role.create({ data: { name, title: name === 'Admin' ? 'مدیر' : 'نصاب' } });
    const username = name.toLowerCase();
    await prisma.user.create({ data: { username, fullName: username, roleId: role.id,
      passwordHash: await hashPassword(`${username}123`) } });
  }
  await prisma.shopSetting.create({ data: { id: 1 } });
  await prisma.productTypeCatalog.create({ data: { code: 'TEST', name: 'تست', unit: 'متر' } });
});

afterAll(async () => {
  const { prisma } = await import('../src/db.js');
  await prisma.$disconnect();
  rmSync(directory, { recursive: true, force: true });
});
