import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: integer("priority").notNull(),
  category: text("category").notNull(),
  deadline: timestamp("deadline"),
  completed: boolean("completed").notNull().default(false),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, completed: true })
  .extend({
    priority: z.number().min(1).max(3),
    title: z.string().min(1, "Title is required").max(100),
    category: z.string().min(1, "Category is required"),
    deadline: z.string().optional().nullable(),
  });

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const updateTaskSchema = insertTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type UpdateTask = z.infer<typeof updateTaskSchema>;
