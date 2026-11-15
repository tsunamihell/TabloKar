import { Request, Response } from 'express';
import { prisma } from '../db.js';

export async function getSettings(_req: Request, res: Response): Promise<void> {
  try {
    const settings = await prisma.shopSetting.upsert({
      where: { id: 1 }, update: {}, create: { id: 1 },
    });

    const catalog = await prisma.productTypeCatalog.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });

    res.json({
      settings,
      catalog,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'خطا در دریافت تنظیمات مغازه' });
  }
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  try {
    const fields = ['shopName', 'tagline', 'city', 'address', 'phone', 'mobile', 'currency', 'receiptHeader', 'receiptFooter', 'logoUrl'];
    const nullable = ['tagline', 'mobile', 'receiptHeader', 'receiptFooter', 'logoUrl'];
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) ||
      fields.some(field => req.body[field] !== undefined &&
        !(nullable.includes(field) && req.body[field] === null) &&
        (typeof req.body[field] !== 'string' || req.body[field].length > 2000)) ||
      (req.body.currency !== undefined && req.body.currency !== 'تومان')) {
      res.status(400).json({ error: 'مقادیر تنظیمات معتبر نیست؛ واحد پول باید تومان باشد.' });
      return;
    }
    // Normalize nullable database fields without converting null to the literal "null".
    for (const field of nullable) {
      if (req.body[field] === null) req.body[field] = '';
    }
    const {
      shopName,
      tagline,
      city,
      address,
      phone,
      mobile,
      currency,
      receiptHeader,
      receiptFooter,
      logoUrl,
    } = req.body;

    if (!shopName || String(shopName).trim() === '') {
      res.status(400).json({ error: 'نام مغازه الزامی است.' });
      return;
    }

    const updated = await prisma.shopSetting.upsert({
      where: { id: 1 },
      update: {
        shopName: String(shopName).trim(),
        tagline: tagline !== undefined ? String(tagline).trim() : undefined,
        city: city !== undefined ? String(city).trim() : undefined,
        address: address !== undefined ? String(address).trim() : undefined,
        phone: phone !== undefined ? String(phone).trim() : undefined,
        mobile: mobile !== undefined ? String(mobile).trim() : undefined,
        currency: currency !== undefined ? String(currency).trim() : undefined,
        receiptHeader: receiptHeader !== undefined ? String(receiptHeader).trim() : undefined,
        receiptFooter: receiptFooter !== undefined ? String(receiptFooter).trim() : undefined,
        logoUrl: logoUrl !== undefined ? String(logoUrl).trim() : undefined,
      },
      create: {
        id: 1,
        shopName: String(shopName).trim(),
        tagline: tagline || '',
        city: city || 'میناب',
        address: address || '',
        phone: phone || '',
        mobile: mobile || '',
        currency: currency || 'تومان',
        receiptHeader: receiptHeader || '',
        receiptFooter: receiptFooter || '',
        logoUrl: logoUrl || '',
      },
    });

    res.json({
      success: true,
      message: 'تنظیمات مغازه با موفقیت ذخیره شد.',
      settings: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'خطا در به‌روزرسانی تنظیمات مغازه' });
  }
}

