/**
 * Database Connection Utility
 */

import mysql from 'mysql2/promise';
import { dbConfig } from '../config';

let pool: mysql.Pool | null = null;

/**
 * Get database connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/**
 * Execute a query with parameters
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T;
  } finally {
    connection.release();
  }
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default {
  getPool,
  query,
  transaction,
  closePool,
};
