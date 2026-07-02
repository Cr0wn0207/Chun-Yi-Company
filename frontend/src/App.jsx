import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminCompany from './pages/admin/AdminCompany';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminRoute from './auth/AdminRoute';
import { isAuthenticated } from './auth/authStorage';

function isPageReload() {
  const entry = performance.getEntriesByType('navigation')[0];
  return entry?.type === 'reload';
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSplashComplete = useCallback(() => {
    if (isPageReload()) {
      navigate('/', { replace: true });
    }
    window.scrollTo(0, 0);
    setSplashDone(true);
  }, [navigate]);

  return (
    <>
      {!splashDone && !isAdminRoute && <SplashScreen onComplete={handleSplashComplete} />}
      <Routes>
        <Route
          path="/admin/login"
          element={isAuthenticated() ? <Navigate to="/admin" replace /> : <AdminLogin />}
        />
        <Route
          path="/admin"
          element={(
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          )}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="company" element={<AdminCompany />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}
