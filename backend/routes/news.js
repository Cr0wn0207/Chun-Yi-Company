import express from 'express';
import News from '../models/News.js';
import { ensureDB } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!(await ensureDB())) {
      return res.status(503).json({
        message: 'Database is not connected. Check MONGODB_URI on the server.',
      });
    }

    const { limit = 10, category } = req.query;
    const filter = category ? { category } : {};
    const news = await News.find(filter)
      .sort({ publishedAt: -1 })
      .limit(Number(limit));
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!(await ensureDB())) {
      return res.status(503).json({
        message: 'Database is not connected. Check MONGODB_URI on the server.',
      });
    }

    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'News not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
