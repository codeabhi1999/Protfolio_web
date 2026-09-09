import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

export const isPostgresConfigured = () => {
  return Boolean(
    connectionString &&
    !connectionString.includes('[YOUR-PASSWORD]')
  );
};

let poolInstance = null;

if (isPostgresConfigured()) {
  try {
    poolInstance = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    poolInstance.on('error', (err) => {
      console.error('[PostgreSQL Pool Error]:', err.message);
    });
  } catch (err) {
    console.error('[PostgreSQL Init Error]:', err.message);
  }
}

export const query = async (text, params) => {
  if (!poolInstance) {
    throw new Error('PostgreSQL database pool is not configured');
  }
  return await poolInstance.query(text, params);
};

export const pool = poolInstance;
export default { pool, query, isPostgresConfigured };
