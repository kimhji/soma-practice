import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

declare global {
  namespace Express {
    interface Request { guest?: { sub: string; iat: number; exp: number } }
  }
}

export function signGuestToken() {
  const sub = crypto.randomUUID();
  return jwt.sign({ sub }, config.GUEST_JWT_SECRET, { expiresIn: config.GUEST_JWT_EXPIRES_IN_SECONDS });
}

export function requireGuest(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Missing guest token' });
  try {
    req.guest = jwt.verify(token, config.GUEST_JWT_SECRET) as any;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired guest token' });
  }
}
