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
    // Skip database initialization if MongoDB URI is not provided
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not provided, skipping database initialization');
      return;
    }
    
    // Check if database connection is working
    const isConnected = await checkDatabaseConnection();
    
    if (!isConnected) {
      console.warn('Failed to connect to database during initialization - continuing without database');
      return;
    }
    
    // Set up database collections and schema validation
    await setupDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.warn('Error initializing database - continuing without database:', error);
  }
}

// Initialize database when this module is imported
// This will run once during application startup
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(console.error);
}