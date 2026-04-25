import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateUser, generateToken, hashPassword, requireAuth } from '../lib/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/check-admin
router.get('/check-admin', async (req, res) => {
  try {
    const count = await prisma.adminUser.count();
    res.json({ hasAdmin: count > 0, count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check admin' });
  }
});

// POST /api/auth/register-admin
router.post('/register-admin', async (req, res) => {
  try {
    const existing = await prisma.adminUser.count();
    if (existing > 0) {
      return res.status(403).json({ error: 'Admin already exists' });
    }
    const { email, password } = req.body;
    const hashed = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { email, password: hashed },
    });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/setup-admin (emergency setup with secret)
router.post('/setup-admin', async (req, res) => {
  try {
    const { secret, email, password } = req.body;
    if (secret !== process.env.SETUP_SECRET) {
      return res.status(403).json({ error: 'Invalid setup secret' });
    }
    const hashed = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { email, password: hashed },
    });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

// GET /api/auth/me - verify token
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
