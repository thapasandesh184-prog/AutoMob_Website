import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/settings - all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const mapped = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/settings/:key
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: req.params.key },
    });
    res.json({ value: setting?.value ?? '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

export default router;
