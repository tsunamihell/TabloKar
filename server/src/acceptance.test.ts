import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { configureDatabase } from './db.js';

describe('Acceptance Criteria Verification (Task 4.2)', () => {
  beforeAll(async () => {
    await configureDatabase();
  });

  it('verifies complete lifecycle: login admin -> edit shop name -> logout -> fail bad pass -> login installer -> verify 403 restriction', async () => {
    // 1. Log in as Admin
    const loginAdminRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(loginAdminRes.status).toBe(200);
    expect(loginAdminRes.body.user.username).toBe('admin');
    expect(loginAdminRes.body.user.role.name).toBe('Admin');
    const adminCookies = (loginAdminRes.headers['set-cookie'] || []) as string[];
    const adminTokenCookie = adminCookies.find((c) => c.includes('tablokar_token'))!;
    expect(adminTokenCookie).toBeDefined();

    // 2. Change shop name as Admin
    const newShopName = 'چاپ و تابلوسازی آبرنگ میناب (کارگاه مرکزی)';
    const updateSettingsRes = await request(app)
      .put('/api/settings')
      .set('Cookie', [adminTokenCookie])
      .send({
        shopName: newShopName,
        city: 'میناب',
        address: 'هرمزگان، میناب، بلوار امام خمینی، روبروی بانک ملی',
        phone: '07642221234',
      });

    expect(updateSettingsRes.status).toBe(200);
    expect(updateSettingsRes.body.settings.shopName).toBe(newShopName);

    // 3. Verify persistence
    const fetchSettingsRes = await request(app).get('/api/settings');
    expect(fetchSettingsRes.status).toBe(200);
    expect(fetchSettingsRes.body.settings.shopName).toBe(newShopName);
    expect(fetchSettingsRes.body.settings.phone).toBe('07642221234');

    // 4. Log out
    const logoutRes = await request(app).post('/api/auth/logout');
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // Verify session revoked / me returns 401 without cookie
    const meWithoutCookieRes = await request(app).get('/api/auth/me');
    expect(meWithoutCookieRes.status).toBe(401);

    // 5. Attempt invalid password
    const failLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'incorrect_password' });

    expect(failLoginRes.status).toBe(401);
    expect(failLoginRes.body.error).toBe('نام کاربری یا کلمه عبور نادرست است.');

    // 6. Log in as restricted role (Installer)
    const loginInstallerRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'installer', password: 'installer123' });

    expect(loginInstallerRes.status).toBe(200);
    expect(loginInstallerRes.body.user.username).toBe('installer');
    expect(loginInstallerRes.body.user.role.name).toBe('Installer');
    expect(loginInstallerRes.body.user.role.title).toBe('نصاب');

    const installerCookies = (loginInstallerRes.headers['set-cookie'] || []) as string[];
    const installerTokenCookie = installerCookies.find((c) => c.includes('tablokar_token'))!;
    expect(installerTokenCookie).toBeDefined();

    // 7. Verify restricted permissions: Installer cannot change shop settings (403 Forbidden)
    const unauthorizedUpdateRes = await request(app)
      .put('/api/settings')
      .set('Cookie', [installerTokenCookie])
      .send({
        shopName: 'تغییر غیرمجاز توسط نصاب',
      });

    expect(unauthorizedUpdateRes.status).toBe(403);
    expect(unauthorizedUpdateRes.body.error).toContain('دسترسی غیرمجاز');
    expect(unauthorizedUpdateRes.body.error).toContain('نصاب');

    // Verify the shop name was NOT modified by the unauthorized request
    const checkSettingsUnchanged = await request(app).get('/api/settings');
    expect(checkSettingsUnchanged.body.settings.shopName).toBe(newShopName);
  });
});

