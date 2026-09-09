import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const fallbackDatabaseUrl = 'postgresql://postgres.sfmmdbrmzqioheheirgv:Abhijeet%40190@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

export const getConnectionString = () => {
  let connStr = process.env.DATABASE_URL || fallbackDatabaseUrl;
  if (!connStr || connStr.includes('[YOUR-PASSWORD]')) {
    connStr = fallbackDatabaseUrl;
  }
  // In serverless environments (Vercel) or when connecting to Supabase pooler, use port 6543 (transaction mode)
  if (connStr.includes('.pooler.supabase.com:5432')) {
    connStr = connStr.replace(':5432', ':6543');
  }
  return connStr;
};

export const isPostgresConfigured = () => {
  return Boolean(getConnectionString());
};

let poolInstance = null;

const createNewPool = () => {
  const connStr = getConnectionString();
  if (!connStr) return null;

  const newPool = new Pool({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    max: process.env.VERCEL ? 3 : 5,
    idleTimeoutMillis: 5000, // release idle connections within 5 seconds so they never go stale
    connectionTimeoutMillis: 10000,
  });

  newPool.on('error', (err) => {
    console.warn('[PostgreSQL Pool Notice]:', err.message);
    // Reset pool instance if connection was terminated
    poolInstance = null;
  });

  return newPool;
};

export const getPool = () => {
  if (!poolInstance) {
    poolInstance = createNewPool();
  }
  return poolInstance;
};

export const query = async (text, params) => {
  let p = getPool();
  if (!p) {
    throw new Error('Database pool not configured. Please check DATABASE_URL.');
  }

  try {
    return await p.query(text, params);
  } catch (err) {
    const msg = (err.message || '').toLowerCase();
    // If connection was closed or timed out due to idle state, immediately reconnect and retry once
    if (
      msg.includes('timeout') ||
      msg.includes('terminated') ||
      msg.includes('closed') ||
      msg.includes('econnreset') ||
      msg.includes('connection refused')
    ) {
      console.warn('[PostgreSQL] Stale connection detected. Reconnecting pool and retrying query...');
      try {
        p.end().catch(() => {});
      } catch (_) {}
      poolInstance = createNewPool();
      p = poolInstance;
      if (p) {
        return await p.query(text, params);
      }
    }
    throw err;
  }
};

// Resilient pool proxy so existing code calling pool.query works dynamically and retries on stale connections
export const pool = new Proxy({}, {
  get(target, prop) {
    if (prop === 'query') {
      return query;
    }
    const p = getPool();
    if (p && typeof p[prop] === 'function') {
      return p[prop].bind(p);
    }
    return p ? p[prop] : undefined;
  }
});

export default { pool, query, isPostgresConfigured, getPool };
