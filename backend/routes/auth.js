import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

async function verifyPassword(password) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (hash) {
    return bcrypt.compare(password, hash);
  }

  if (plain) {
    return password === plain;
  }

  return false;
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server auth is not configured' });
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const passwordConfigured = process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD;

    if (!passwordConfigured) {
      return res.status(500).json({ message: 'Server auth is not configured' });
    }

    if (username !== adminUsername) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const valid = await verifyPassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { username: adminUsername, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { username: adminUsername, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    username: req.user.username,
    role: req.user.role,
  });
});

export default router;
