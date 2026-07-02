import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { buildCompany } from '../../i18n/content';
import { LANGUAGES } from '../../i18n/locales/index.js';
import './AdminShared.css';

const EMPTY_COMPANY = {
  name: '',
  tagline: '',
  vision: '',
  mission: '',
  founded: '',
  address: '',
  phone: '',
  email: '',
  ceoMessage: '',
  values: [],
  history: [],
};

function applyDefaults(data, messages) {
  const defaults = buildCompany(messages);
  return {
    name: data.name || defaults.name,
    tagline: data.tagline || defaults.tagline,
    vision: data.vision || defaults.vision,
    mission: data.mission || defaults.mission,
    founded: data.founded || defaults.founded,
    address: data.address || defaults.address,
    phone: data.phone || defaults.phone,
    email: data.email || defaults.email,
    ceoMessage: data.ceoMessage || defaults.ceoMessage,
    values: data.values?.length ? data.values : defaults.values,
    history: data.history?.length ? data.history : defaults.history,
  };
}

export default function AdminCompany() {
  const { locale, messages, t } = useLanguage();
  const [form, setForm] = useState(EMPTY_COMPANY);
  const [valuesText, setValuesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const localeLabel = LANGUAGES.find((lang) => lang.code === locale)?.label || locale;

  useEffect(() => {
    setLoading(true);
    setError('');
    setSuccess('');

    api.adminGetCompany()
      .then((data) => {
        const merged = applyDefaults(data, messages);
        setForm({
          ...merged,
          history: merged.history?.length ? merged.history : [{ year: '', event: '' }],
        });
        setValuesText((merged.values || []).join('\n'));
      })
      .catch((err) => {
        if (err.message.toLowerCase().includes('not found')) {
          const defaults = buildCompany(messages);
          setForm({ ...defaults, history: defaults.history?.length ? defaults.history : [{ year: '', event: '' }] });
          setValuesText((defaults.values || []).join('\n'));
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [locale, messages]);

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleHistoryChange = (index, field, value) => {
    setForm((prev) => {
      const history = [...prev.history];
      history[index] = { ...history[index], [field]: value };
      return { ...prev, history };
    });
  };

  const addHistoryRow = () => {
    setForm((prev) => ({
      ...prev,
      history: [...prev.history, { year: '', event: '' }],
    }));
  };

  const removeHistoryRow = (index) => {
    setForm((prev) => ({
      ...prev,
      history: prev.history.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      ...form,
      values: valuesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      history: form.history.filter((item) => item.year.trim() && item.event.trim()),
    };

    try {
      const updated = await api.adminUpdateCompany(payload);
      const merged = applyDefaults(updated, messages);
      setForm({
        ...merged,
        history: merged.history?.length ? merged.history : [{ year: '', event: '' }],
      });
      setValuesText((merged.values || []).join('\n'));
      setSuccess(`${t('admin.company.saved')} (${localeLabel}).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>{t('admin.common.loading')}</p>;
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h2>{t('admin.company.title')}</h2>
          <p className="admin-panel__desc">
            {t('admin.editingLanguage')}: {localeLabel}
          </p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {success && <p className="admin-alert admin-alert--success">{success}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__row">
          <label className="admin-field">
            <span>{t('admin.company.fieldName')}</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label className="admin-field">
            <span>{t('admin.company.fieldTagline')}</span>
            <input name="tagline" value={form.tagline} onChange={handleChange} />
          </label>
        </div>

        <label className="admin-field">
          <span>{t('admin.company.fieldVision')}</span>
          <textarea name="vision" value={form.vision} onChange={handleChange} rows={3} />
        </label>

        <label className="admin-field">
          <span>{t('admin.company.fieldMission')}</span>
          <textarea name="mission" value={form.mission} onChange={handleChange} rows={3} />
        </label>

        <label className="admin-field">
          <span>{t('admin.company.fieldCeoMessage')}</span>
          <textarea name="ceoMessage" value={form.ceoMessage} onChange={handleChange} rows={5} />
        </label>

        <div className="admin-form__row">
          <label className="admin-field">
            <span>{t('admin.company.fieldFounded')}</span>
            <input name="founded" value={form.founded} onChange={handleChange} />
          </label>
          <label className="admin-field">
            <span>{t('admin.company.fieldPhone')}</span>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
        </div>

        <label className="admin-field">
          <span>{t('admin.company.fieldEmail')}</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>

        <label className="admin-field">
          <span>{t('admin.company.fieldAddress')}</span>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} />
        </label>

        <label className="admin-field">
          <span>{t('admin.company.fieldValues')}</span>
          <textarea
            value={valuesText}
            onChange={(e) => setValuesText(e.target.value)}
            rows={4}
          />
        </label>

        <div className="admin-field">
          <span>{t('admin.company.fieldHistory')}</span>
          <div className="admin-history-list">
            {form.history.map((item, index) => (
              <div key={index} className="admin-history-row">
                <input
                  placeholder={t('admin.company.historyYear')}
                  value={item.year}
                  onChange={(e) => handleHistoryChange(index, 'year', e.target.value)}
                />
                <input
                  placeholder={t('admin.company.historyEvent')}
                  value={item.event}
                  onChange={(e) => handleHistoryChange(index, 'event', e.target.value)}
                />
                <button
                  type="button"
                  className="admin-table__btn admin-table__btn--danger"
                  onClick={() => removeHistoryRow(index)}
                >
                  {t('admin.company.removeHistory')}
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="admin-btn" onClick={addHistoryRow}>
            {t('admin.company.addHistory')}
          </button>
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? t('admin.company.saving') : t('admin.company.saveChanges')}
          </button>
        </div>
      </form>
    </section>
  );
}
