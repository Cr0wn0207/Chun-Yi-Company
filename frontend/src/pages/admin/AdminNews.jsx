import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { LANGUAGES } from '../../i18n/locales/index.js';
import './AdminShared.css';

const EMPTY_FORM = {
  title: '',
  category: 'press',
  summary: '',
  content: '',
  publishedAt: '',
  featured: false,
};

function toDateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function toFormState(item) {
  return {
    title: item.title || '',
    category: item.category || 'press',
    summary: item.summary || '',
    content: item.content || '',
    publishedAt: toDateInput(item.publishedAt),
    featured: Boolean(item.featured),
  };
}

export default function AdminNews() {
  const { locale, t } = useLanguage();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const localeLabel = LANGUAGES.find((lang) => lang.code === locale)?.label || locale;

  const categoryLabel = (category) => {
    if (category === 'press') return t('admin.news.categoryPress');
    if (category === 'notice') return t('admin.news.categoryNotice');
    if (category === 'event') return t('admin.news.categoryEvent');
    return category;
  };

  const loadNews = () => {
    setLoading(true);
    setError('');
    api.adminGetNews(locale)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNews();
  }, [locale]);

  useEffect(() => {
    if (!editingId) return;

    api.adminGetNewsItem(editingId, locale)
      .then((item) => setForm(toFormState(item)))
      .catch((err) => setError(err.message));
  }, [editingId, locale]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm(toFormState(item));
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await api.adminUpdateNews(editingId, form);
        setSuccess(t('admin.news.updated'));
      } else {
        await api.adminCreateNews(form);
        setSuccess(t('admin.news.created'));
      }
      resetForm();
      loadNews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.news.confirmDelete'))) return;

    setError('');
    setSuccess('');
    try {
      await api.adminDeleteNews(id);
      if (editingId === id) resetForm();
      setSuccess(t('admin.news.deleted'));
      loadNews();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <h2>{t('admin.news.title')}</h2>
        <button type="button" className="admin-btn" onClick={resetForm}>
          {t('admin.news.newArticle')}
        </button>
      </div>

      <p className="admin-panel__desc">
        {t('admin.editingLanguage')}: {localeLabel}
      </p>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {success && <p className="admin-alert admin-alert--success">{success}</p>}

      <div className="admin-split">
        <div className="admin-table-wrap">
          {loading ? (
            <p>{t('admin.common.loading')}</p>
          ) : items.length === 0 ? (
            <p>{t('admin.news.noItems')}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.news.tableTitle')}</th>
                  <th>{t('admin.news.tableCategory')}</th>
                  <th>{t('admin.news.tableDate')}</th>
                  <th>{t('admin.news.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${item.category}`}>
                        {categoryLabel(item.category)}
                      </span>
                    </td>
                    <td>{new Date(item.publishedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          type="button"
                          className="admin-table__btn"
                          onClick={() => handleEdit(item)}
                        >
                          {t('admin.news.edit')}
                        </button>
                        <button
                          type="button"
                          className="admin-table__btn admin-table__btn--danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          {t('admin.news.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? t('admin.news.editNews') : t('admin.news.createNews')}</h3>

          <label className="admin-field">
            <span>{t('admin.news.fieldTitle')}</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <div className="admin-form__row">
            <label className="admin-field">
              <span>{t('admin.news.fieldCategory')}</span>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="press">{t('admin.news.categoryPress')}</option>
                <option value="notice">{t('admin.news.categoryNotice')}</option>
                <option value="event">{t('admin.news.categoryEvent')}</option>
              </select>
            </label>

            <label className="admin-field">
              <span>{t('admin.news.fieldPublishedAt')}</span>
              <input
                type="date"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>{t('admin.news.fieldSummary')}</span>
            <textarea name="summary" value={form.summary} onChange={handleChange} />
          </label>

          <label className="admin-field">
            <span>{t('admin.news.fieldContent')}</span>
            <textarea name="content" value={form.content} onChange={handleChange} rows={6} />
          </label>

          <label className="admin-field admin-field--check">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            <span>{t('admin.news.fieldFeatured')}</span>
          </label>

          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving
                ? t('admin.news.saving')
                : editingId
                  ? t('admin.news.update')
                  : t('admin.news.create')}
            </button>
            {editingId && (
              <button type="button" className="admin-btn" onClick={resetForm}>
                {t('admin.news.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
