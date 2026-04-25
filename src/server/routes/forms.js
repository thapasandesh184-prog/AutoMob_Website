import { Router } from 'express';
import { insert, generateId } from '../lib/db.js';

const router = Router();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const id = generateId();
    await insert(
      'INSERT INTO ContactSubmission (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, phone || null, subject || null, message]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

router.post('/finance', async (req, res) => {
  try {
    const b = req.body;
    const id = generateId();
    await insert(
      `INSERT INTO FinanceApplication (id, name, email, phone, dob, sin, street, city, state, zip,
       address, timeAtAddress, employer, occupation, income, timeAtJob, vehicleId, tradeIn,
       tradeInDetails, reference1, reference2, consent, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, b.name, b.email, b.phone || null, b.dob || null, b.sin || null,
        b.street || null, b.city || null, b.state || null, b.zip || null,
        b.address || null, b.timeAtAddress || null, b.employer || null, b.occupation || null,
        b.income ? parseFloat(b.income) : null, b.timeAtJob || null, b.vehicleId || null,
        b.tradeIn ? 1 : 0, b.tradeInDetails || null, b.reference1 || null, b.reference2 || null,
        b.consent ? 1 : 0, b.message || null,
      ]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Finance error:', err.message);
    res.status(500).json({ error: 'Failed to save application' });
  }
});

router.post('/trade-in', async (req, res) => {
  try {
    const b = req.body;
    const id = generateId();
    await insert(
      `INSERT INTO TradeInSubmission (id, firstName, lastName, email, phone, year, make, model, trim,
       vin, mileage, color, transmission, condition, mechanical, exterior, interior, hasLoan,
       payoffAmount, photos, videos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, b.firstName, b.lastName, b.email, b.phone, b.year, b.make, b.model,
        b.trim || null, b.vin || null, b.mileage, b.color || null, b.transmission || null,
        b.condition || null, b.mechanical || null, b.exterior || null, b.interior || null,
        b.hasLoan ? 1 : 0, b.payoffAmount || null,
        b.photos ? JSON.stringify(b.photos) : null,
        b.videos ? JSON.stringify(b.videos) : null,
      ]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Trade-in error:', err.message);
    res.status(500).json({ error: 'Failed to save trade-in' });
  }
});

router.post('/appointments', async (req, res) => {
  try {
    const { type, date, time, vehicleId, name, email, phone, notes } = req.body;
    const id = generateId();
    await insert(
      'INSERT INTO Appointment (id, type, date, time, vehicleId, name, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, type, date, time, vehicleId || null, name, email, phone, notes || null]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Appointment error:', err.message);
    res.status(500).json({ error: 'Failed to save appointment' });
  }
});

router.post('/car-finder', async (req, res) => {
  try {
    const b = req.body;
    const id = generateId();
    await insert(
      `INSERT INTO CarFinderRequest (id, name, email, phone, make, model, minYear, maxYear, minPrice,
       maxPrice, bodyStyle, transmission, fuelType, driveType, color, maxMileage, features, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, b.name, b.email, b.phone || null, b.make || null, b.model || null,
        b.minYear ? parseInt(b.minYear, 10) : null,
        b.maxYear ? parseInt(b.maxYear, 10) : null,
        b.minPrice ? parseFloat(b.minPrice) : null,
        b.maxPrice ? parseFloat(b.maxPrice) : null,
        b.bodyStyle || null, b.transmission || null, b.fuelType || null,
        b.driveType || null, b.color || null,
        b.maxMileage ? parseInt(b.maxMileage, 10) : null,
        b.features ? JSON.stringify(b.features) : null,
        b.notes || null, 'open',
      ]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Car finder error:', err.message);
    res.status(500).json({ error: 'Failed to save request', detail: err.message });
  }
});

export default router;
