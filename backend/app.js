import express from 'express';
import cors from 'cors';
import { connectDB, isDBConnected } from './config/db.js';
import { env } from './config/env.js';
import newsRoutes from './routes/news.js';
import serviceRoutes from './routes/services.js';
import companyRoutes from './routes/company.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import adminNewsRoutes from './routes/admin/news.js';
import adminCompanyRoutes from './routes/admin/company.js';
import adminContactRoutes from './routes/admin/contacts.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch {
    // requireDB will return 503 for data routes if connection failed
  }
  next();
});

app.use('/api/news', newsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/news', adminNewsRoutes);
app.use('/api/admin/company', adminCompanyRoutes);
app.use('/api/admin/contacts', adminContactRoutes);

app.get('/api/health', async (_req, res) => {
  let mongoConnected = isDBConnected();
  if (!mongoConnected && env('MONGODB_URI')) {
    mongoConnected = await connectDB();
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    authConfigured: {
      jwtSecret: Boolean(env('JWT_SECRET')),
      adminPassword: Boolean(env('ADMIN_PASSWORD') || env('ADMIN_PASSWORD_HASH')),
      adminUsername: Boolean(env('ADMIN_USERNAME')),
    },
    mongoConfigured: Boolean(env('MONGODB_URI')),
    mongoConnected,
  });
});

export default app;
