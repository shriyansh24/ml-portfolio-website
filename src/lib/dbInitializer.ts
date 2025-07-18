/**
 * Database Initializer
 * This file contains a function to initialize the database during application startup
 */

import { setupDatabase } from './dbSetup';
import { checkDatabaseConnection } from './db';

// Flag to track if initialization has been attempted
let hasInitialized = false;

/**
 * Initialize the database if it hasn't been initialized yet
 * This function is idempotent and will only run once
 */
export async function initializeDatabase() {
  if (hasInitialized) {
    return;
  }
  
  hasInitialized = true;
  
  try {
    // Check if database connection is working
    const isConnected = await checkDatabaseConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database during initialization');
      return;
    }
    
    // Set up database collections and schema validation
    await setupDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database when this module is imported
// This will run once during application startup
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(console.error);
}