import express from 'express';
import News from '../../models/News.js';
import { authMiddleware } from '../../middleware/auth.js';
import { requireDB } from '../../middleware/requireDB.js';
import { getLocaleFromRequest } from '../../utils/locale.js';
import { toAdminNewsForm, toAdminNewsListItem } from '../../utils/newsLocale.js';

const router = express.Router();

router.use(authMiddleware, requireDB);

router.get('/', async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news.map((item) => toAdminNewsListItem(item, locale)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'News not found' });
    res.json(toAdminNewsForm(item, locale));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const { title, category, summary, content, publishedAt, featured, seedKey } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const localePayload = {
      title: title.trim(),
      summary: summary?.trim() || '',
      content: content?.trim() || '',
    };

    const item = new News({
      title: localePayload.title,
      seedKey: seedKey?.trim() || undefined,
      category: category || 'press',
      summary: localePayload.summary,
      content: localePayload.content,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      featured: Boolean(featured),
      locales: new Map([[locale, localePayload]]),
    });

    await item.save();
    res.status(201).json(toAdminNewsForm(item, locale));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const { title, category, summary, content, publishedAt, featured } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'News not found' });

    const localePayload = {
      title: title.trim(),
      summary: summary?.trim() || '',
      content: content?.trim() || '',
    };

    if (!item.locales) {
      item.locales = new Map();
    }

    item.locales.set(locale, localePayload);
    item.category = category || item.category;
    item.publishedAt = publishedAt ? new Date(publishedAt) : item.publishedAt;
    item.featured = Boolean(featured);

    if (locale === 'ko' || !item.title) {
      item.title = localePayload.title;
      item.summary = localePayload.summary;
      item.content = localePayload.content;
    }

    await item.save();
    res.json(toAdminNewsForm(item, locale));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await News.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
