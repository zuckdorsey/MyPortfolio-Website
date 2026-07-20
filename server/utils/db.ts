/**
 * db.ts — DEPRECATED
 * Database connection has been removed. Data is now served from static JSON files in /data/.
 * This file is kept as a stub to avoid breaking legacy admin/seed endpoints.
 */

import { createError } from 'h3';

export function isDatabaseConfigured() {
  return false;
}

export function getDb(): never {
  throw new Error('Database is not configured. Data is now served from static JSON files.');
}

export function emptyWhenDatabaseMissing<T>(fallback: T[] = []): T[] {
  return fallback;
}

export async function initializeDatabase(): Promise<void> {
  console.warn('Database is disabled. Data is served from static JSON files.');
}

export function handleDbError(error: any) {
  console.error('Database error:', error);
  return createError({
    statusCode: 500,
    message: 'Database is disabled. Data is served from static JSON files.',
    stack: ''
  });
}
