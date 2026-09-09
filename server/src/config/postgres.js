import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const getConnectionString = () => {
  let connStr = process.env.DATABASE_URL;
  if (!connStr || connStr.includes('[YOUR-PASSWORD]')) {
    return null;
  }
  // If running on Vercel or AWS Lambda with Supabase pooler, automatically use port 6543 (transaction mode)
  if (process.env.VERCEL && connStr.includes('.pooler.supabase.com:5432')) {
    connStr = connStr.replace(':5432', ':6543');
  }
  return connStr;
};

export const isPostgresConfigured = () => {
  return Boolean(getConnectionString());
};

let poolInstance = null;

export const getPool = () => {
  const connStr = getConnectionString();
  if (!connStr) return null;

  if (!poolInstance) {
    try {
      poolInstance = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        max: process.env.VERCEL ? 3 : 10,
        idleTimeoutMillis: process.env.VERCEL ? 2000 : 30000,
        connectionTimeoutMillis: 8000,
      });

      poolInstance.on('error', (err) => {
        console.error('[PostgreSQL Pool Error]:', err.message);
        // Reset pool instance if fatal
        if (err.message.includes('closed') || err.message.includes('timeout')) {
          poolInstance = null;
        }
      });
    } catch (err) {
      console.error('[PostgreSQL Init Error]:', err.message);
      return null;
    }
  }

  return poolInstance;
};

export const query = async (text, params) => {
  const p = getPool();
  if (!p) {
    throw new Error('PostgreSQL database is not configured. Please verify DATABASE_URL.');
  }
  return await p.query(text, params);
};

// Resilient pool proxy so existing code calling pool.query works dynamically
export const pool = new Proxy({}, {
  get(target, prop) {
    const p = getPool();
    if (prop === 'query') {
      return (...args) => {
        if (!p) throw new Error('Database pool not available');
        return p.query(...args);
      };
    }
    if (p && typeof p[prop] === 'function') {
      return p[prop].bind(p);
    }
    return p ? p[prop] : undefined;
  }
});

export default { pool, query, isPostgresConfigured, getPool };
