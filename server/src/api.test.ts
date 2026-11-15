import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { prisma, configureDatabase } from './db.js';

describe('TabloKar Authentication & Settings API', () => {
  let adminCookie: string;
  let installerCookie: string;

  beforeAll(async () => {
    await configureDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in as Admin with correct credentials and set cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.username).toBe('admin');
      expect(res.body.user.role.name).toBe('Admin');
      expect(res.body.token).toBeDefined();

      const cookies = (res.headers['set-cookie'] || []) as string[];
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies.some((c: string) => c.includes('tablokar_token'))).toBe(true);
      adminCookie = cookies.find((c: string) => c.includes('tablokar_token'))!;
    });

    it('should successfully log in as Installer and set cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'installer', password: 'installer123' });

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('installer');
      expect(res.body.user.role.name).toBe('Installer');

      const cookies = (res.headers['set-cookie'] || []) as string[];
      installerCookie = cookies.find((c: string) => c.includes('tablokar_token'))!;
    });

    it('should reject login with wrong password and return 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('should reject login for non-existent user and return 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'ghost_user', password: 'any' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated with cookie', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('admin');
      expect(res.body.user.role.name).toBe('Admin');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('Role-Based Authorization & Settings Persistence', () => {
    it('should reject non-admin (Installer) from updating settings with 403 Forbidden', async () => {
      const res = await request(app)
        .put('/api/settings')
        .set('Cookie', [installerCookie])
        .send({ shopName: 'هک شده' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('دسترسی غیرمجاز');
    });

    it('should allow Admin to update shop settings and persist them', async () => {
      const newName = 'تابلوسازی آبرنگ میناب (دفتر مرکزی)';
      const newAddress = 'میناب، بلوار رسالت، نبش کوچه شهید زاهدی';

      const updateRes = await request(app)
        .put('/api/settings')
        .set('Cookie', [adminCookie])
        .send({
          shopName: newName,
          address: newAddress,
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.settings.shopName).toBe(newName);
      expect(updateRes.body.settings.address).toBe(newAddress);

      // Verify persistence via GET /api/settings
      const getRes = await request(app).get('/api/settings');
      expect(getRes.status).toBe(200);
      expect(getRes.body.settings.shopName).toBe(newName);
      expect(getRes.body.settings.address).toBe(newAddress);
      expect(getRes.body.catalog.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear cookie and logout successfully', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = (res.headers['set-cookie'] || []) as string[];
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies.some((c: string) => c.includes('tablokar_token=;'))).toBe(true);
    });
  });
});
