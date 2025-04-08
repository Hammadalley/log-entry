import { db } from './db';
import { logEntries } from '@shared/schema';
import { sql } from 'drizzle-orm';

// This function runs database migrations for SQLite
export async function runMigrations() {
  console.log('Running SQLite migrations...');
  
  try {
    // Create the log_entries table if it doesn't exist
    db.run(sql`
      CREATE TABLE IF NOT EXISTS log_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL
      )
    `);
    
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}

// Export the migration function
export default runMigrations;