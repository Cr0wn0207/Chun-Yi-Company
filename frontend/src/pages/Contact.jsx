import { useMemo, useState } from 'react';
import { api } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import CoverHero from '../components/CoverHero';
import './Contact.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&q=80';

const EMPTY_FORM = {
  lastName: '',
  firstName: '',
  email: '',
  address: '',
  company: '',
  phone1: '',
  phone2: '',
  phone3: '',
  inquiryType: '',
  message: '',
  privacyAgree: false,
};

export default function Contact() {
  const { t, messages } = useLanguage();
  usePageMeta('contact');
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const inquiryOptions = messages.contact.inquiryOptions;

  const canSubmit = useMemo(() => {
    return (
      form.lastName.trim() &&
      form.firstName.trim() &&
      form.email.trim() &&
      form.inquiryType &&
      form.message.trim() &&
      form.privacyAgree
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setStatus(null);

    const phone = [form.phone1, form.phone2, form.phone3].filter(Boolean).join('-');
    const inquiryLabel =
      inquiryOptions.find((option) => option.value === form.inquiryType)?.label ||
      form.inquiryType;

    const payload = {
      name: `${form.lastName} ${form.firstName}`.trim(),
      email: form.email,
      company: form.company,
      subject: inquiryLabel,
      inquiryType: form.inquiryType,
      message: [
        form.address && `${t('contact.address')}: ${form.address}`,
        phone && `${t('contact.phone')}: ${phone}`,
        '',
        form.message,
      ]
        .filter(Boolean)
        .join('\n'),
    };

    try {
      const result = await api.submitContact(payload);
      setStatus({ type: 'success', message: result.message || t('contact.success') });
      setForm(EMPTY_FORM);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CoverHero
        title={t('contact.heroTitle')}
        subtitle={t('contact.pageTitle')}
        image={HERO_IMAGE}
      />

      <section className="section contact-section">
        <div className="container">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__group">
              <div className="contact-form__label-row">
                <label htmlFor="lastName">{t('contact.name')}</label>
                <span className="contact-form__badge">{t('contact.requiredBadge')}</span>
              </div>
              <div className="contact-form__row contact-form__row--name">
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder={t('contact.placeholders.lastName')}
                  required
                />
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder={t('contact.placeholders.firstName')}
                  required
                />
              </div>
            </div>

            <div className="contact-form__group">
              <div className="contact-form__label-row">
                <label htmlFor="email">{t('contact.email')}</label>
                <span className="contact-form__badge">{t('contact.requiredBadge')}</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('contact.placeholders.email')}
                required
              />
            </div>

            <div className="contact-form__group">
              <label htmlFor="address">{t('contact.address')}</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={t('contact.placeholders.address')}
              />
            </div>

            <div className="contact-form__group">
              <label htmlFor="company">{t('contact.company')}</label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder={t('contact.placeholders.company')}
              />
            </div>

            <div className="contact-form__group">
              <label htmlFor="phone1">{t('contact.phone')}</label>
              <div className="contact-form__row contact-form__row--phone">
                <input
                  id="phone1"
                  name="phone1"
                  inputMode="numeric"
                  value={form.phone1}
                  onChange={handleChange}
                  placeholder={t('contact.placeholders.phone1')}
                />
                <span className="contact-form__dash" aria-hidden>-</span>
                <input
                  name="phone2"
                  inputMode="numeric"
                  value={form.phone2}
                  onChange={handleChange}
                  placeholder={t('contact.placeholders.phone2')}
                />
                <span className="contact-form__dash" aria-hidden>-</span>
                <input
                  name="phone3"
                  inputMode="numeric"
                  value={form.phone3}
                  onChange={handleChange}
                  placeholder={t('contact.placeholders.phone3')}
                />
              </div>
            </div>

            <div className="contact-form__group">
              <div className="contact-form__label-row">
                <label htmlFor="inquiryType">{t('contact.inquiryType')}</label>
                <span className="contact-form__badge">{t('contact.requiredBadge')}</span>
              </div>
              <div className="contact-form__select-wrap">
                <select
                  id="inquiryType"
                  name="inquiryType"
                  className={form.inquiryType ? 'contact-form__select--filled' : ''}
                  value={form.inquiryType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('contact.selectPlaceholder')}</option>
                  {inquiryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form__group">
              <div className="contact-form__label-row">
                <label htmlFor="message">{t('contact.inquiryDetail')}</label>
                <span className="contact-form__badge">{t('contact.requiredBadge')}</span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={7}
                value={form.message}
                onChange={handleChange}
                placeholder={t('contact.placeholders.message')}
                required
              />
            </div>

            <div className="contact-form__group">
              <div className="contact-form__privacy-box" tabIndex={0}>
                {t('contact.privacyText')}
              </div>
              <label className="contact-form__agree">
                <input
                  type="checkbox"
                  name="privacyAgree"
                  checked={form.privacyAgree}
                  onChange={handleChange}
                />
                <span className="contact-form__agree-text">{t('contact.privacyAgree')}</span>
                <span className="contact-form__badge">{t('contact.requiredBadge')}</span>
              </label>
            </div>

            {status && (
              <div className={`contact-form__status contact-form__status--${status.type}`}>
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="contact-form__submit"
              disabled={loading || !canSubmit}
            >
              {loading ? t('contact.submitting') : t('contact.submit')}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
