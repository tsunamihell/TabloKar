import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { verifyPassword } from '../utils/password.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

import { JWT_SECRET } from '../config.js';
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body ?? {};

  if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password || username.length > 200 || Buffer.byteLength(password, 'utf8') > 72) {
    res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { username: String(username).trim() },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    res.status(401).json({ error: 'نام کاربری یا کلمه عبور نادرست است.' });
    return;
  }

  const isValidPassword = await verifyPassword(String(password), user.passwordHash);
  if (!isValidPassword) {
    res.status(401).json({ error: 'نام کاربری یا کلمه عبور نادرست است.' });
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      roleName: user.role.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('tablokar_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE_MS,
    path: '/',
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      role: {
        id: user.role.id,
        name: user.role.name,
        title: user.role.title,
      },
    },
  });
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'احراز هویت انجام نشده است.' });
    return;
  }

  res.json({ user: req.user });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('tablokar_token', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  res.json({ success: true, message: 'خروج با موفقیت انجام شد.' });
}

