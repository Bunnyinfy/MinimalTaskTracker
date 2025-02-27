import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

interface AuthenticatedRequest extends Request {
  user: Express.User;
}

export async function registerRoutes(app: Express) {
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  app.get("/api/tasks", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const tasks = await storage.getTasksByUserId(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({ ...taskData, userId: req.user.id });
      res.status(201).json(task);
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ message: fromZodError(err).message });
        return;
      }
      throw err;
    }
  });

  app.patch("/api/tasks/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const taskData = updateTaskSchema.parse(req.body);
      const updated = await storage.updateTask(id, taskData);
      res.json(updated);
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ message: fromZodError(err).message });
        return;
      }
      throw err;
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await storage.deleteTask(id);
    res.status(204).end();
  });

  return createServer(app);
}