import { z } from "zod";

export const createIncomeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title is too long."),
  description: z
    .string()
    .trim()
    .max(240, "Description is too long.")
    .optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  date: z.string().min(1, "Please select a date."),
  source: z.string().trim().max(80, "Source is too long.").optional(),
});

export type CreateIncomeFormValues = z.infer<typeof createIncomeSchema>;
