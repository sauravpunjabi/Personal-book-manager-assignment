import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt';

export function protect(req: Request, res: Response, next: NextFunction): void {
  const token: unknown = req.cookies?.token;

  if (typeof token !== 'string' || token.length === 0) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    req.user = { id: verifyToken(token).id };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
