import { z } from "zod";
import { authStorage } from "@/features/auth/storage";
import type { CreateExpensePayload, CreateExpenseResponse } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

const createExpenseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    amount: z.string(),
    date: z.string(),
    category: z.enum([
      "Food",
      "Shopping",
      "Transport",
      "Bills",
      "Entertainment",
      "Other",
    ]),
    tags: z.array(z.string()),
    aiNote: z.string().nullable(),
    aiProvider: z.string().nullable(),
    aiConfidence: z.number().nullable(),
    isManualEdited: z.boolean(),
    userId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export async function createExpense(
  payload: CreateExpensePayload,
): Promise<CreateExpenseResponse> {
  const token = authStorage.getAccessToken();

  if (!token) {
    throw new Error("You are not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Failed to create expense. Please try again.";
    throw new Error(message);
  }

  const parsed = createExpenseResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected response from server.");
  }

  return parsed.data;
}
