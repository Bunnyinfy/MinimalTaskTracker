import { Task, type InsertTask, type UpdateTask } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: UpdateTask): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      ...insertTask,
      id,
      completed: false,
      deadline: insertTask.deadline ? new Date(insertTask.deadline) : null,
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
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
