import { z } from "zod";
import { expenseCategories } from "./types";

export const createExpenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title is too long."),
  description: z
    .string()
    .trim()
    .min(3, "Description must be at least 3 characters.")
    .max(240, "Description is too long."),
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  date: z.string().min(1, "Please select a date."),
  category: z.enum(expenseCategories),
  tag: z.string().trim().optional(),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;
