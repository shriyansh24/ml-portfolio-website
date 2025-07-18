/**
 * Database Initializer Component
 * This is a server component that initializes the database during application startup
 */

import { initializeDatabase } from '@/lib/dbInitializer';

export async function DatabaseInitializer() {
  // This will run on the server side during SSR
  if (process.env.NODE_ENV !== 'test') {
    await initializeDatabase();
  }
  
  // This component doesn't render anything
  return null;
}