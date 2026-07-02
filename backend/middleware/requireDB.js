import { ensureDB, isDBConnected } from '../config/db.js';

export async function requireDB(_req, res, next) {
  if (!isDBConnected()) {
    const connected = await ensureDB();
    if (!connected) {
      return res.status(503).json({
        message: 'Database is not connected. Check MONGODB_URI on the server.',
      });
    }
  }
  next();
}
