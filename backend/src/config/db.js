// src/config/db.js
// PostgreSQL connection pool using the 'pg' library.
// All database queries go through the exported query() wrapper.
// The pool is tested once on startup so you know immediately if the DB is unreachable.

import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const poolConfig = {
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Parse DATABASE_URL safely on startup to diagnose connectivity issues and verify settings
try {
  const dbUrl = new URL(env.databaseUrl);
  const host = dbUrl.hostname;
  const port = dbUrl.port || '5432';
  const database = dbUrl.pathname.slice(1);
  console.log(`📡 Database connection configuration: host=${host}, port=${port}, database=${database}`);

  // Render internal hosts (e.g., dpg-xxxxxxxx-a) do not require SSL.
  // External hosts (containing dots) require SSL in production.
  const isInternalHost = host && !host.includes('.');
  if (!env.isDev && !isInternalHost) {
    console.log('🔒 Enabling database SSL connection for production/external host');
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }
} catch (err) {
  console.warn('⚠️ Failed to parse DATABASE_URL on startup. Falling back to default SSL config in production:', err.message);
  if (!env.isDev) {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }
}

const pool = new Pool(poolConfig);

// Test the connection when the module is first loaded
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ PostgreSQL connected successfully');
  release();
});

// Thin query wrapper — pass sql and optional params array
export const query = (sql, params) => pool.query(sql, params);

export default pool;
