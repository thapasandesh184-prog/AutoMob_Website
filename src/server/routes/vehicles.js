import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/vehicles - list with filters
router.get('/', async (req, res) => {
  try {
    const {
      featured, make, model, trim, bodyStyle, transmission,
      fuelType, driveType, exteriorColor, status = 'available',
      minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
    } = req.query;

    const where = {};
    if (featured === 'true') where.featured = true;
    if (make) where.make = { contains: make };
    if (model) where.model = { contains: model };
    if (trim) where.trim = { contains: trim };
    if (bodyStyle) where.bodyStyle = { contains: bodyStyle };
    if (transmission) where.transmission = { contains: transmission };
    if (fuelType) where.fuelType = { contains: fuelType };
    if (driveType) where.driveType = { contains: driveType };
    if (exteriorColor) where.exteriorColor = { contains: exteriorColor };
    if (status) where.status = status;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = Number(minYear);
      if (maxYear) where.year.lte = Number(maxYear);
    }
    if (minMileage || maxMileage) {
      where.mileage = {};
      if (minMileage) where.mileage.gte = Number(minMileage);
      if (maxMileage) where.mileage.lte = Number(maxMileage);
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const parsed = vehicles.map(v => ({
      ...v,
      features: v.features ? v.features.split(',') : [],
      images: v.images ? v.images.split(',') : [],
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Failed to fetch vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/vehicles/:slug - single vehicle
router.get('/:slug', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: req.params.slug },
    });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    res.json({
      ...vehicle,
      features: vehicle.features ? vehicle.features.split(',') : [],
      images: vehicle.images ? vehicle.images.split(',') : [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

export default router;
