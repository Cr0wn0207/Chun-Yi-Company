import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { resolveInquirySubjectLabel } from '../../i18n/content';
import './AdminShared.css';

export default function AdminInquiries() {
  const { t, messages } = useLanguage();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadContacts = () => {
    setLoading(true);
    setError('');
    api.adminGetContacts()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const selected = items.find((item) => item._id === selectedId);

  const statusLabel = (status) => {
    if (status === 'new') return t('admin.inquiries.statusNew');
    if (status === 'read') return t('admin.inquiries.statusRead');
    if (status === 'replied') return t('admin.inquiries.statusReplied');
    return status;
  };

  const inquiryLabel = (item) =>
    resolveInquirySubjectLabel(item?.subject, item?.inquiryType, messages);

  const handleStatusChange = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      await api.adminUpdateContactStatus(id, status);
      setSuccess(t('admin.inquiries.statusUpdated'));
      loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.inquiries.confirmDelete'))) return;

    setError('');
    setSuccess('');
    try {
      await api.adminDeleteContact(id);
      if (selectedId === id) setSelectedId(null);
      setSuccess(t('admin.inquiries.deleted'));
      loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <h2>{t('admin.inquiries.title')}</h2>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {success && <p className="admin-alert admin-alert--success">{success}</p>}

      {loading ? (
        <p>{t('admin.common.loading')}</p>
      ) : items.length === 0 ? (
        <p>{t('admin.inquiries.noItems')}</p>
      ) : (
        <div className="admin-split">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.inquiries.tableDate')}</th>
                  <th>{t('admin.inquiries.tableName')}</th>
                  <th>{t('admin.inquiries.tableSubject')}</th>
                  <th>{t('admin.inquiries.tableStatus')}</th>
                  <th>{t('admin.inquiries.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.name}</td>
                    <td>{inquiryLabel(item) || '-'}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${item.status}`}>
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          type="button"
                          className="admin-table__btn"
                          onClick={() => setSelectedId(item._id)}
                        >
                          {t('admin.inquiries.view')}
                        </button>
                        <button
                          type="button"
                          className="admin-table__btn admin-table__btn--danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          {t('admin.inquiries.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            {selected ? (
              <div className="admin-detail">
                <p><strong>{t('admin.inquiries.labelName')}:</strong> {selected.name}</p>
                <p><strong>{t('admin.inquiries.labelEmail')}:</strong> {selected.email}</p>
                {selected.company && (
                  <p><strong>{t('admin.inquiries.labelCompany')}:</strong> {selected.company}</p>
                )}
                {selected.subject && (
                  <p><strong>{t('admin.inquiries.labelSubject')}:</strong> {inquiryLabel(selected)}</p>
                )}
                <p>
                  <strong>{t('admin.inquiries.labelStatus')}:</strong>{' '}
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                  >
                    <option value="new">{t('admin.inquiries.statusNew')}</option>
                    <option value="read">{t('admin.inquiries.statusRead')}</option>
                    <option value="replied">{t('admin.inquiries.statusReplied')}</option>
                  </select>
                </p>
                <p><strong>{t('admin.inquiries.labelMessage')}:</strong></p>
                <pre>{selected.message}</pre>
                <p style={{ marginTop: '12px', color: 'var(--scsk-text-muted)', fontSize: '13px' }}>
                  {t('admin.inquiries.labelReceived')}: {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>{t('admin.inquiries.selectPrompt')}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
