import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: integer("priority").notNull(),
  category: text("category").notNull(),
  deadline: timestamp("deadline"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: integer("user_id").notNull().references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, completed: true, createdAt: true, updatedAt: true, userId: true })
  .extend({
    priority: z.number().min(1).max(3),
    title: z.string().min(1, "Title is required").max(100),
    category: z.string().min(1, "Category is required"),
    deadline: z.string().optional().nullable(),
  });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const updateTaskSchema = insertTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type UpdateTask = z.infer<typeof updateTaskSchema>;