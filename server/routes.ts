import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLogEntrySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all log entries
  app.get("/api/log-entries", async (req, res) => {
    try {
      const entries = await storage.getAllLogEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch log entries" });
    }
  });

  // Get a single log entry by ID
  app.get("/api/log-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const entry = await storage.getLogEntryById(id);
      if (!entry) {
        return res.status(404).json({ message: "Log entry not found" });
      }

      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch log entry" });
    }
  });

  // Create a new log entry
  app.post("/api/log-entries", async (req, res) => {
    try {
      const validatedData = insertLogEntrySchema.parse(req.body);
      const newEntry = await storage.createLogEntry(validatedData);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create log entry" });
    }
  });

  // Update an existing log entry
  app.put("/api/log-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const validatedData = insertLogEntrySchema.parse(req.body);
      const updatedEntry = await storage.updateLogEntry(id, validatedData);

      if (!updatedEntry) {
        return res.status(404).json({ message: "Log entry not found" });
      }

      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update log entry" });
    }
  });

  // Delete a log entry
  app.delete("/api/log-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const success = await storage.deleteLogEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Log entry not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete log entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
