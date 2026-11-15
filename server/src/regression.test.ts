import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import app from './app.js';
import { prisma } from './db.js';
import { JWT_SECRET } from './config.js';

const findUser = prisma.user.findUnique.bind(prisma.user);
afterEach(() => {
  vi.mocked(prisma.user.findUnique).mockImplementation?.(findUser);
});

async function adminCookie() {
  const response = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin123' });
  expect(response.status).toBe(200);
  return response.headers['set-cookie'];
}

describe('Audit regressions', () => {
  it.each([{}, { username: {}, password: 'x' }, { username: 'admin', password: [] }, { username: ' ', password: 'x' }])('rejects malformed login %j', async body => {
    expect((await request(app).post('/api/auth/login').send(body)).status).toBe(400);
  });

  it('returns JSON 400 for malformed JSON', async () => {
    const response = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{');
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });

  it('forwards async login database failures to a JSON 500 response', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error('private database detail'));
    const response = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin123' });
    expect(response.status).toBe(500);
    expect(JSON.stringify(response.body)).not.toContain('private');
  });

  it('does not misreport a database outage as an expired session', async () => {
    const cookie = await adminCookie();
    vi.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error('offline'));
    expect((await request(app).get('/api/auth/me').set('Cookie', cookie)).status).toBe(500);
  });

  it('rejects signed tokens without a valid user ID', async () => {
    const token = jwt.sign({ username: 'admin' }, JWT_SECRET);
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)).status).toBe(401);
  });

  it('does not grant credentialed CORS access to arbitrary sites', async () => {
    const response = await request(app).get('/api/settings').set('Origin', 'https://untrusted.example');
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects invalid settings without modifying the record', async () => {
    const cookie = await adminCookie();
    const before = await prisma.shopSetting.findUnique({ where: { id: 1 } });
    for (const body of [{ shopName: {} }, { shopName: 'valid', phone: [] }, { shopName: 'valid', currency: 'USD' }]) {
      expect((await request(app).put('/api/settings').set('Cookie', cookie).send(body)).status).toBe(400);
    }
    expect(await prisma.shopSetting.findUnique({ where: { id: 1 } })).toEqual(before);
  });

  it('round-trips nullable settings without storing the text null', async () => {
    const cookie = await adminCookie();
    const response = await request(app).put('/api/settings').set('Cookie', cookie).send({ shopName: ' تست ', logoUrl: null, mobile: null });
    expect(response.status).toBe(200);
    expect(response.body.settings.shopName).toBe('تست');
    expect(response.body.settings.logoUrl).toBe('');
    expect(response.body.settings.mobile).toBe('');
  });

  it('seeding twice preserves edited settings, catalog prices and user roles', async () => {
    // setup.ts sets DATABASE_URL to a unique disposable directory before importing Prisma.
    expect(process.env.DATABASE_URL).toContain('tablokar-test-');
    const seed = () => execFileSync(process.execPath, [resolve('../node_modules/tsx/dist/cli.mjs'), 'prisma/seed.ts'], { env: process.env, stdio: 'pipe' });
    seed();
    await prisma.shopSetting.update({ where: { id: 1 }, data: { shopName: 'حفظ تنظیمات' } });
    await prisma.productTypeCatalog.update({ where: { code: 'COMPOSITE' }, data: { defaultBasePrice: 1234 } });
    const installerRole = await prisma.role.findUniqueOrThrow({ where: { name: 'Installer' } });
    await prisma.user.update({ where: { username: 'admin' }, data: { roleId: installerRole.id } });
    seed();
    expect((await prisma.shopSetting.findUniqueOrThrow({ where: { id: 1 } })).shopName).toBe('حفظ تنظیمات');
    expect((await prisma.productTypeCatalog.findUniqueOrThrow({ where: { code: 'COMPOSITE' } })).defaultBasePrice).toBe(1234);
    expect((await prisma.user.findUniqueOrThrow({ where: { username: 'admin' } })).roleId).toBe(installerRole.id);
  });
});
