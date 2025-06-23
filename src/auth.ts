import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies.token;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = payload.id;
    next();
  } catch {
    res.sendStatus(403);
  }
}
