import { Router } from 'express';
import { query, queryOne } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const {
      featured, make, model, trim, bodyStyle, transmission,
      fuelType, driveType, exteriorColor, status = 'available',
      minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
    } = req.query;

    let where = 'WHERE status = ?';
    const params = [status];

    if (featured === 'true') { where += ' AND featured = 1'; }
    if (make) { where += ' AND make LIKE ?'; params.push(`%${make}%`); }
    if (model) { where += ' AND model LIKE ?'; params.push(`%${model}%`); }
    if (trim) { where += ' AND trim LIKE ?'; params.push(`%${trim}%`); }
    if (bodyStyle) { where += ' AND bodyStyle LIKE ?'; params.push(`%${bodyStyle}%`); }
    if (transmission) { where += ' AND transmission LIKE ?'; params.push(`%${transmission}%`); }
    if (fuelType) { where += ' AND fuelType LIKE ?'; params.push(`%${fuelType}%`); }
    if (driveType) { where += ' AND driveType LIKE ?'; params.push(`%${driveType}%`); }
    if (exteriorColor) { where += ' AND exteriorColor LIKE ?'; params.push(`%${exteriorColor}%`); }
    if (minPrice) { where += ' AND price >= ?'; params.push(Number(minPrice)); }
    if (maxPrice) { where += ' AND price <= ?'; params.push(Number(maxPrice)); }
    if (minYear) { where += ' AND year >= ?'; params.push(Number(minYear)); }
    if (maxYear) { where += ' AND year <= ?'; params.push(Number(maxYear)); }
    if (minMileage) { where += ' AND mileage >= ?'; params.push(Number(minMileage)); }
    if (maxMileage) { where += ' AND mileage <= ?'; params.push(Number(maxMileage)); }

    const vehicles = await query(`SELECT * FROM Vehicle ${where} ORDER BY createdAt DESC LIMIT 500`, params);

    const parsed = vehicles.map(v => ({
      ...v,
      featured: v.featured === 1,
      features: v.features ? v.features.split(',') : [],
      images: v.images ? v.images.split(',') : [],
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Failed to fetch vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const vehicle = await queryOne('SELECT * FROM Vehicle WHERE slug = ?', [req.params.slug]);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    res.json({
      ...vehicle,
      featured: vehicle.featured === 1,
      features: vehicle.features ? vehicle.features.split(',') : [],
      images: vehicle.images ? vehicle.images.split(',') : [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

export default router;
