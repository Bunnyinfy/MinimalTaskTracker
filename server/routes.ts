import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ message: fromZodError(err).message });
        return;
      }
      throw err;
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(id, taskData);
      res.json(task);
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ message: fromZodError(err).message });
        return;
      }
      if (err.message === "Task not found") {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      throw err;
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.status(204).end();
  });

  return createServer(app);
}
