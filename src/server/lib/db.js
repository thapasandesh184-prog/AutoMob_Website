import mysql from 'mysql2/promise';
import crypto from 'crypto';

function parseDbUrl(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      port: parseInt(u.port, 10) || 3306,
      database: u.pathname.slice(1).split('?')[0],
      ssl: u.searchParams.get('sslmode') === 'require' ? { rejectUnauthorized: false } : undefined,
    };
  } catch (err) {
    console.error('[DB] Failed to parse DATABASE_URL:', err.message);
    throw err;
  }
}

const config = parseDbUrl(process.env.DATABASE_URL);

export const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

export async function insert(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

export function generateId() {
  return crypto.randomUUID();
}

// Convert MySQL TINYINT(1) to JS boolean for common fields
export function bool(row, field) {
  if (!row || row[field] === undefined) return row?.[field];
  return row[field] === 1;
}
