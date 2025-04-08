import { logEntries, type LogEntry, type InsertLogEntry } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllLogEntries(): Promise<LogEntry[]>;
  getLogEntryById(id: number): Promise<LogEntry | undefined>;
  createLogEntry(entry: InsertLogEntry): Promise<LogEntry>;
  updateLogEntry(id: number, entry: InsertLogEntry): Promise<LogEntry | undefined>;
  deleteLogEntry(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private logEntries: Map<number, LogEntry>;
  private currentId: number;

  constructor() {
    this.logEntries = new Map();
    this.currentId = 1;
  }

  async getAllLogEntries(): Promise<LogEntry[]> {
    return Array.from(this.logEntries.values());
  }

  async getLogEntryById(id: number): Promise<LogEntry | undefined> {
    return this.logEntries.get(id);
  }

  async createLogEntry(entry: InsertLogEntry): Promise<LogEntry> {
    const id = this.currentId++;
    const newEntry: LogEntry = { ...entry, id };
    this.logEntries.set(id, newEntry);
    return newEntry;
  }

  async updateLogEntry(id: number, entry: InsertLogEntry): Promise<LogEntry | undefined> {
    if (!this.logEntries.has(id)) {
      return undefined;
    }

    const updatedEntry: LogEntry = { ...entry, id };
    this.logEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteLogEntry(id: number): Promise<boolean> {
    return this.logEntries.delete(id);
  }
}

export class SQLiteStorage implements IStorage {
  async getAllLogEntries(): Promise<LogEntry[]> {
    // SQLite doesn't support returning all columns automatically, so we need to select them explicitly
    return await db.select({
      id: logEntries.id,
      userName: logEntries.userName,
      description: logEntries.description,
      date: logEntries.date,
      location: logEntries.location
    }).from(logEntries);
  }

  async getLogEntryById(id: number): Promise<LogEntry | undefined> {
    const results = await db.select({
      id: logEntries.id,
      userName: logEntries.userName,
      description: logEntries.description,
      date: logEntries.date,
      location: logEntries.location
    }).from(logEntries).where(eq(logEntries.id, id));
    
    return results.length > 0 ? results[0] : undefined;
  }

  async createLogEntry(entry: InsertLogEntry): Promise<LogEntry> {
    // First insert
    const result = db.insert(logEntries).values(entry).run();
    
    // Then get the inserted row using last inserted id
    const lastId = result.lastInsertRowid;
    const newEntries = await db.select({
      id: logEntries.id,
      userName: logEntries.userName,
      description: logEntries.description,
      date: logEntries.date,
      location: logEntries.location
    }).from(logEntries).where(eq(logEntries.id, Number(lastId)));
    
    return newEntries[0];
  }

  async updateLogEntry(id: number, entry: InsertLogEntry): Promise<LogEntry | undefined> {
    // Update
    const result = db.update(logEntries).set(entry).where(eq(logEntries.id, id)).run();
    
    // If no rows affected, return undefined
    if (result.changes === 0) {
      return undefined;
    }
    
    // Get updated entry
    const updatedEntries = await db.select({
      id: logEntries.id,
      userName: logEntries.userName,
      description: logEntries.description,
      date: logEntries.date,
      location: logEntries.location
    }).from(logEntries).where(eq(logEntries.id, id));
    
    return updatedEntries.length > 0 ? updatedEntries[0] : undefined;
  }

  async deleteLogEntry(id: number): Promise<boolean> {
    const result = db.delete(logEntries).where(eq(logEntries.id, id)).run();
    return result.changes > 0;
  }
}

// Use SQLite storage
export const storage = new SQLiteStorage();
