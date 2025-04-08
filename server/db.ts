import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create SQLite database
const dbPath = path.join(dataDir, 'log_entries.db');
console.log(`Using SQLite database at: ${dbPath}`);

// Create or open the database file
const sqlite = new Database(dbPath);

// Create Drizzle client
export const db = drizzle(sqlite, { schema });
