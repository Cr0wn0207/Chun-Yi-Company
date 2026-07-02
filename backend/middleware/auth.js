import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, env('JWT_SECRET'));
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
