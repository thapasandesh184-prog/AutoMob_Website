import { Router } from 'express';
import { query, queryOne, insert, generateId } from '../lib/db.js';
import { requireAuth, hashPassword } from '../lib/auth.js';

const router = Router();
router.use(requireAuth);

function generateSlug(year, make, model) {
  const base = `${year}-${make}-${model}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

router.get('/cars', async (req, res) => {
  try {
    const vehicles = await query('SELECT * FROM Vehicle ORDER BY createdAt DESC LIMIT 1000');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

router.post('/cars', async (req, res) => {
  try {
    const data = req.body;
    const features = Array.isArray(data.features) ? data.features.join(',') : data.features || '';
    const images = Array.isArray(data.images) ? data.images.join(',') : data.images || '';
    const slug = data.slug || generateSlug(data.year, data.make, data.model);
    const id = generateId();

    await insert(
      `INSERT INTO Vehicle (id, slug, stockNumber, vin, make, model, trim, year, price, msrp,
       mileage, bodyStyle, transmission, engine, fuelType, driveType, doors, seats,
       exteriorColor, interiorColor, description, features, images, videoUrl, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, slug, data.stockNumber || null, data.vin || null, data.make, data.model,
        data.trim || null, Number(data.year), Number(data.price), data.msrp ? Number(data.msrp) : null,
        Number(data.mileage), data.bodyStyle || null, data.transmission || null, data.engine || null,
        data.fuelType || null, data.driveType || null, data.doors ? Number(data.doors) : null,
        data.seats ? Number(data.seats) : null, data.exteriorColor || null, data.interiorColor || null,
        data.description || '', features, images, data.videoUrl || null,
        data.status || 'available', data.featured ? 1 : 0,
      ]
    );
    const vehicle = await queryOne('SELECT * FROM Vehicle WHERE id = ?', [id]);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Create vehicle error:', err);
    res.status(500).json({ error: 'Failed to create vehicle', detail: err.message });
  }
});

router.get('/cars/:id', async (req, res) => {
  try {
    const vehicle = await queryOne('SELECT * FROM Vehicle WHERE id = ?', [req.params.id]);
    if (!vehicle) return res.status(404).json({ error: 'Not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

router.put('/cars/:id', async (req, res) => {
  try {
    const data = req.body;
    const fields = [];
    const values = [];

    const add = (col, val) => { fields.push(`${col} = ?`); values.push(val); };

    if (data.slug !== undefined) add('slug', data.slug);
    if (data.stockNumber !== undefined) add('stockNumber', data.stockNumber || null);
    if (data.vin !== undefined) add('vin', data.vin || null);
    if (data.make !== undefined) add('make', data.make);
    if (data.model !== undefined) add('model', data.model);
    if (data.trim !== undefined) add('trim', data.trim || null);
    if (data.year !== undefined) add('year', Number(data.year));
    if (data.price !== undefined) add('price', Number(data.price));
    if (data.msrp !== undefined) add('msrp', data.msrp ? Number(data.msrp) : null);
    if (data.mileage !== undefined) add('mileage', Number(data.mileage));
    if (data.bodyStyle !== undefined) add('bodyStyle', data.bodyStyle || null);
    if (data.transmission !== undefined) add('transmission', data.transmission || null);
    if (data.engine !== undefined) add('engine', data.engine || null);
    if (data.fuelType !== undefined) add('fuelType', data.fuelType || null);
    if (data.driveType !== undefined) add('driveType', data.driveType || null);
    if (data.doors !== undefined) add('doors', data.doors ? Number(data.doors) : null);
    if (data.seats !== undefined) add('seats', data.seats ? Number(data.seats) : null);
    if (data.exteriorColor !== undefined) add('exteriorColor', data.exteriorColor || null);
    if (data.interiorColor !== undefined) add('interiorColor', data.interiorColor || null);
    if (data.description !== undefined) add('description', data.description || '');
    if (data.features !== undefined) add('features', Array.isArray(data.features) ? data.features.join(',') : data.features || '');
    if (data.images !== undefined) add('images', Array.isArray(data.images) ? data.images.join(',') : data.images || '');
    if (data.videoUrl !== undefined) add('videoUrl', data.videoUrl || null);
    if (data.status !== undefined) add('status', data.status);
    if (data.featured !== undefined) add('featured', data.featured ? 1 : 0);

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    values.push(req.params.id);
    await query(`UPDATE Vehicle SET ${fields.join(', ')}, updatedAt = NOW() WHERE id = ?`, values);
    const vehicle = await queryOne('SELECT * FROM Vehicle WHERE id = ?', [req.params.id]);
    res.json(vehicle);
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

router.delete('/cars/:id', async (req, res) => {
  try {
    await query('DELETE FROM Vehicle WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

router.get('/submissions', async (req, res) => {
  try {
    const { type } = req.query;
    let sql;
    switch (type) {
      case 'contact': sql = 'SELECT * FROM ContactSubmission ORDER BY createdAt DESC'; break;
      case 'finance': sql = 'SELECT * FROM FinanceApplication ORDER BY createdAt DESC'; break;
      case 'tradein': sql = 'SELECT * FROM TradeInSubmission ORDER BY createdAt DESC'; break;
      case 'appointments': sql = 'SELECT * FROM Appointment ORDER BY createdAt DESC'; break;
      case 'carfinder': sql = 'SELECT * FROM CarFinderRequest ORDER BY createdAt DESC'; break;
      default: return res.status(400).json({ error: 'Invalid type' });
    }
    const data = await query(sql);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const settings = await query('SELECT `key`, `value` FROM SiteSetting');
    const mapped = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { key, value, group = 'general' } = req.body;
    const existing = await queryOne('SELECT id FROM SiteSetting WHERE `key` = ?', [key]);
    if (existing) {
      await query('UPDATE SiteSetting SET `value` = ?, `group` = ?, updatedAt = NOW() WHERE `key` = ?', [value, group, key]);
    } else {
      const id = generateId();
      await insert('INSERT INTO SiteSetting (id, `key`, `value`, `group`) VALUES (?, ?, ?, ?)', [id, key, value, group]);
    }
    const setting = await queryOne('SELECT * FROM SiteSetting WHERE `key` = ?', [key]);
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const payload = req.body;
    for (const [key, value] of Object.entries(payload)) {
      const existing = await queryOne('SELECT id FROM SiteSetting WHERE `key` = ?', [key]);
      if (existing) {
        await query('UPDATE SiteSetting SET `value` = ?, updatedAt = NOW() WHERE `key` = ?', [String(value), key]);
      } else {
        const id = generateId();
        await insert('INSERT INTO SiteSetting (id, `key`, `value`, `group`) VALUES (?, ?, ?, ?)', [id, key, String(value), 'general']);
      }
    }
    res.json({ success: true, count: Object.keys(payload).length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

router.delete('/settings/:key', async (req, res) => {
  try {
    await query('DELETE FROM SiteSetting WHERE `key` = ?', [req.params.key]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

export default router;
