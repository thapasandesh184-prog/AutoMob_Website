import { Router } from 'express';
import { queryOne, insert, generateId } from '../lib/db.js';
import { authenticateUser, generateToken, hashPassword, requireAuth } from '../lib/auth.js';

const router = Router();

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

router.get('/check-admin', async (req, res) => {
  try {
    const result = await queryOne('SELECT COUNT(*) as count FROM AdminUser');
    const count = result?.count || 0;
    res.json({ hasAdmin: count > 0, count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check admin' });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const result = await queryOne('SELECT COUNT(*) as count FROM AdminUser');
    if (result?.count > 0) {
      return res.status(403).json({ error: 'Admin already exists' });
    }
    const { email, password } = req.body;
    const hashed = await hashPassword(password);
    const id = generateId();
    await insert(
      'INSERT INTO AdminUser (id, email, password) VALUES (?, ?, ?)',
      [id, email, hashed]
    );
    const user = { id, email };
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/setup-admin', async (req, res) => {
  try {
    const { secret, email, password } = req.body;
    if (secret !== process.env.SETUP_SECRET) {
      return res.status(403).json({ error: 'Invalid setup secret' });
    }
    const hashed = await hashPassword(password);
    const id = generateId();
    await insert(
      'INSERT INTO AdminUser (id, email, password) VALUES (?, ?, ?)',
      [id, email, hashed]
    );
    const user = { id, email };
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
