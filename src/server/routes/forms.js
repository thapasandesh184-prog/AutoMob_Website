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
    const data = req.body;
    const application = await prisma.financeApplication.create({ data });
    res.status(201).json({ success: true, id: application.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save application' });
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
    const data = req.body;
    const request = await prisma.carFinderRequest.create({ data });
    res.status(201).json({ success: true, id: request.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save request' });
  }
});

export default router;
