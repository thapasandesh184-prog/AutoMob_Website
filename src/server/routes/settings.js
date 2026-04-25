import { Router } from 'express';
import { query, queryOne } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const settings = await query('SELECT `key`, `value` FROM SiteSetting');
    const mapped = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const setting = await queryOne('SELECT `value` FROM SiteSetting WHERE `key` = ?', [req.params.key]);
    res.json({ value: setting?.value ?? '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

export default router;
