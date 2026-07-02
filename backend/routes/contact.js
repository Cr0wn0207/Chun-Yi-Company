import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, company, subject, inquiryType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      company,
      subject,
      inquiryType,
      message,
    });
    res.status(201).json({ message: 'Inquiry submitted successfully', id: contact._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
