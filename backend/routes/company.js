import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const company = await Company.findOne();
    if (!company) return res.status(404).json({ message: 'Company info not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
