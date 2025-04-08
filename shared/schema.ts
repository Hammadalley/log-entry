import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const logEntries = sqliteTable("log_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userName: text("user_name").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(), 
  location: text("location").notNull(),
});

export const insertLogEntrySchema = createInsertSchema(logEntries).omit({
  id: true,
});

export type InsertLogEntry = z.infer<typeof insertLogEntrySchema>;
export type LogEntry = typeof logEntries.$inferSelect;
