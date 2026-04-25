import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone: phone || null, subject: subject || null, message },
    });
    res.status(201).json({ success: true, id: submission.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// POST /api/finance
router.post('/finance', async (req, res) => {
  try {
    const body = req.body;
    const data = {
      ...body,
      income: body.income ? parseFloat(body.income) : null,
    };
    const application = await prisma.financeApplication.create({ data });
    res.status(201).json({ success: true, id: application.id });
  } catch (err) {
    console.error('Finance error:', err.message);
    res.status(500).json({ error: 'Failed to save application', detail: err.message });
  }
});

// POST /api/trade-in
router.post('/trade-in', async (req, res) => {
  try {
    const data = req.body;
    const submission = await prisma.tradeInSubmission.create({ data });
    res.status(201).json({ success: true, id: submission.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save trade-in' });
  }
});

// POST /api/appointments
router.post('/appointments', async (req, res) => {
  try {
    const { type, date, time, vehicleId, name, email, phone, notes } = req.body;
    const appointment = await prisma.appointment.create({
      data: { type, date, time, vehicleId: vehicleId || null, name, email, phone, notes: notes || null },
    });
    res.status(201).json({ success: true, id: appointment.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save appointment' });
  }
});

// POST /api/car-finder
router.post('/car-finder', async (req, res) => {
  try {
    const body = req.body;
    const data = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      make: body.make || null,
      model: body.model || null,
      minYear: body.minYear ? parseInt(body.minYear, 10) : null,
      maxYear: body.maxYear ? parseInt(body.maxYear, 10) : null,
      minPrice: body.minPrice ? parseFloat(body.minPrice) : null,
      maxPrice: body.maxPrice ? parseFloat(body.maxPrice) : null,
      bodyStyle: body.bodyStyle || null,
      transmission: body.transmission || null,
      fuelType: body.fuelType || null,
      driveType: body.driveType || null,
      color: body.color || null,
      maxMileage: body.maxMileage ? parseInt(body.maxMileage, 10) : null,
      features: body.features ? JSON.stringify(body.features) : null,
      notes: body.notes || null,
    };
    const request = await prisma.carFinderRequest.create({ data });
    res.status(201).json({ success: true, id: request.id });
  } catch (err) {
    console.error('Car finder error:', err.message);
    res.status(500).json({ error: 'Failed to save request', detail: err.message });
  }
});

export default router;
