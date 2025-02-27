import { Task, type InsertTask, type UpdateTask, User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask & { userId: number }): Promise<Task>;
  updateTask(id: number, task: UpdateTask): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  getTasksByUserId(userId: number): Promise<Task[]>;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private users: Map<number, User>;
  private currentTaskId: number;
  private currentUserId: number;
  readonly sessionStore: session.Store;

  constructor() {
    this.tasks = new Map();
    this.users = new Map();
    this.currentTaskId = 1;
    this.currentUserId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask & { userId: number }): Promise<Task> {
    const id = this.currentTaskId++;
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      completed: false,
      deadline: insertTask.deadline ? new Date(insertTask.deadline) : null,
      createdAt: now,
      updatedAt: now,
      description: insertTask.description || null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateTask: UpdateTask): Promise<Task> {
    const existing = await this.getTask(id);
    if (!existing) {
      throw new Error("Task not found");
    }

    const updated: Task = {
      ...existing,
      ...updateTask,
      deadline: updateTask.deadline ? new Date(updateTask.deadline) : existing.deadline,
      description: updateTask.description ?? existing.description,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();