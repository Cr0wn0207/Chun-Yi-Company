import mongoose from 'mongoose';

const globalCache = globalThis;

function getMongoUri() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chunyi-corp';
  return uri.replace('mongodb://localhost', 'mongodb://127.0.0.1');
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectDB() {
  if (isDBConnected()) return true;

  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.error('MONGODB_URI is not set');
    return false;
  }

  if (!globalCache._mongooseCache) {
    globalCache._mongooseCache = { conn: null, promise: null };
  }

  const cache = globalCache._mongooseCache;

  if (cache.conn) {
    return true;
  }

  if (!cache.promise) {
    const uri = getMongoUri();
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((connection) => {
        console.log('MongoDB connected');
        return connection;
      })
      .catch((error) => {
        cache.promise = null;
        console.error('MongoDB connection error:', error.message);
        throw error;
      });
  }

  try {
    cache.conn = await cache.promise;
    return true;
  } catch {
    if (process.env.VERCEL) {
      return false;
    }

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    console.warn('Continuing without MongoDB. Auth routes still work; data APIs need a database.');
    return false;
  }
}

export async function ensureDB() {
  if (isDBConnected()) return true;
  return connectDB();
}
