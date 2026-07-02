import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { clearToken, getToken } from './authStorage';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState(() => (getToken() ? 'checking' : 'denied'));

  useEffect(() => {
    if (!getToken()) {
      setStatus('denied');
      return;
    }

    api.getMe()
      .then(() => setStatus('allowed'))
      .catch(() => {
        clearToken();
        setStatus('denied');
      });
  }, []);

  if (status === 'checking') {
    return null;
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
