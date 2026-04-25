import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, hashPassword } from '../lib/auth.js';

const router = Router();

// All routes require auth
router.use(requireAuth);

// GET /api/admin/cars
router.get('/cars', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// POST /api/admin/cars
router.post('/cars', async (req, res) => {
  try {
    const data = req.body;
    const features = Array.isArray(data.features) ? data.features.join(',') : data.features || '';
    const images = Array.isArray(data.images) ? data.images.join(',') : data.images || '';
    
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        features,
        images,
        year: Number(data.year),
        price: Number(data.price),
        mileage: Number(data.mileage),
      },
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// GET /api/admin/cars/:id
router.get('/cars/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });
    if (!vehicle) return res.status(404).json({ error: 'Not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// PUT /api/admin/cars/:id
router.put('/cars/:id', async (req, res) => {
  try {
    const data = req.body;
    const updateData = { ...data };
    if (data.features) updateData.features = Array.isArray(data.features) ? data.features.join(',') : data.features;
    if (data.images) updateData.images = Array.isArray(data.images) ? data.images.join(',') : data.images;
    if (data.year) updateData.year = Number(data.year);
    if (data.price) updateData.price = Number(data.price);
    if (data.mileage) updateData.mileage = Number(data.mileage);
    
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// DELETE /api/admin/cars/:id
router.delete('/cars/:id', async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// GET /api/admin/submissions
router.get('/submissions', async (req, res) => {
  try {
    const { type } = req.query;
    let data;
    switch (type) {
      case 'contact': data = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'finance': data = await prisma.financeApplication.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'tradein': data = await prisma.tradeInSubmission.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'appointments': data = await prisma.appointment.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'carfinder': data = await prisma.carFinderRequest.findMany({ orderBy: { createdAt: 'desc' } }); break;
      default: return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// POST /api/admin/settings
router.post('/settings', async (req, res) => {
  try {
    const { key, value, group = 'general' } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group },
    });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

// DELETE /api/admin/settings/:key
router.delete('/settings/:key', async (req, res) => {
  try {
    await prisma.siteSetting.delete({ where: { key: req.params.key } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

export default router;
