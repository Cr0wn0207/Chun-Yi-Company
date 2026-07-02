import express from 'express';
import Company from '../../models/Company.js';
import { authMiddleware } from '../../middleware/auth.js';
import { requireDB } from '../../middleware/requireDB.js';
import { getLocaleFromRequest } from '../../utils/locale.js';

const router = express.Router();

router.use(authMiddleware, requireDB);

function getLocaleBucket(company, locale) {
  if (!company) return null;

  const fromMap = company.locales?.get?.(locale) || company.locales?.[locale];
  if (fromMap) return fromMap;

  if (locale === 'ko' && company.name) {
    return {
      name: company.name,
      tagline: company.tagline,
      vision: company.vision,
      mission: company.mission,
      address: company.address,
      ceoMessage: company.ceoMessage,
      values: company.values,
      history: company.history,
    };
  }

  return null;
}

function toFormResponse(company, locale) {
  const bucket = getLocaleBucket(company, locale) || {};

  return {
    editingLocale: locale,
    founded: company.founded || '',
    phone: company.phone || '',
    email: company.email || '',
    name: bucket.name || '',
    tagline: bucket.tagline || '',
    vision: bucket.vision || '',
    mission: bucket.mission || '',
    address: bucket.address || '',
    ceoMessage: bucket.ceoMessage || '',
    values: bucket.values || [],
    history: bucket.history?.length ? bucket.history : [{ year: '', event: '' }],
  };
}

router.get('/', async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const company = await Company.findOne();

    if (!company) {
      return res.status(404).json({ message: 'Company info not found' });
    }

    res.json(toFormResponse(company, locale));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const {
      name,
      tagline,
      vision,
      mission,
      founded,
      address,
      phone,
      email,
      ceoMessage,
      values,
      history,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const localePayload = {
      name: name.trim(),
      tagline: tagline?.trim() || '',
      vision: vision?.trim() || '',
      mission: mission?.trim() || '',
      address: address?.trim() || '',
      ceoMessage: ceoMessage?.trim() || '',
      values: Array.isArray(values) ? values.filter(Boolean) : [],
      history: Array.isArray(history)
        ? history.filter((item) => item?.year?.trim() && item?.event?.trim())
        : [],
    };

    let company = await Company.findOne();
    if (!company) {
      company = new Company({ locales: new Map() });
    }

    if (!company.locales) {
      company.locales = new Map();
    }

    company.locales.set(locale, localePayload);
    company.founded = founded?.trim() || company.founded || '';
    company.phone = phone?.trim() || company.phone || '';
    company.email = email?.trim() || company.email || '';

    if (locale === 'ko') {
      company.name = localePayload.name;
      company.tagline = localePayload.tagline;
      company.vision = localePayload.vision;
      company.mission = localePayload.mission;
      company.address = localePayload.address;
      company.ceoMessage = localePayload.ceoMessage;
      company.values = localePayload.values;
      company.history = localePayload.history;
    }

    await company.save();
    res.json(toFormResponse(company, locale));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
