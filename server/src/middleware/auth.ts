import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

import { JWT_SECRET } from '../config.js';

export interface AuthUserPayload {
  id: number;
  username: string;
  roleName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    fullName: string;
    phone: string | null;
    role: {
      id: number;
      name: string;
      title: string;
      permissions: string;
    };
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token =
    req.cookies?.tablokar_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    res.status(401).json({ error: 'احراز هویت انجام نشده است. لطفاً وارد شوید.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    if (!Number.isSafeInteger(decoded.id) || decoded.id <= 0) {
      res.status(401).json({ error: 'نشست کاربری نامعتبر است.' });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'حساب کاربری یافت نشد یا غیرفعال است.' });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      role: {
        id: user.role.id,
        name: user.role.name,
        title: user.role.title,
        permissions: user.role.permissions,
      },
    };

    next();
  } catch (err) {
    if (!(err instanceof jwt.JsonWebTokenError)) {
      next(err);
      return;
    }
    res.status(401).json({ error: 'نشست کاربری نامعتبر یا منقضی شده است.' });
    return;
  }
}

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'ابتدا وارد حساب کاربری شوید.' });
      return;
    }

    // Admin has universal access
    if (req.user.role.name === 'Admin') {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.role.name)) {
      res.status(403).json({
        error: `دسترسی غیرمجاز: نقش «${req.user.role.title}» اجازه دسترسی به این بخش را ندارد.`,
      });
      return;
    }

    next();
  };
}

