import { z } from "zod";
import {
  API_BASE_URL,
  fetchWithAutoRefresh,
} from "@/features/auth/authenticatedFetch";
import type {
  CreateExpensePayload,
  CreateExpenseResponse,
  ExpenseSummaryResponse,
  GetExpensesByYearResponse,
} from "./types";

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

const expenseApiItemSchema = z.object({
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
});

const getExpensesByYearResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  data: z.array(expenseApiItemSchema),
});

const expenseSummaryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    month: z.string(),
    total: z.number(),
    categories: z.record(z.string(), z.number()),
    aiSummary: z.string(),
  }),
});

export async function createExpense(
  payload: CreateExpensePayload,
): Promise<CreateExpenseResponse> {
  const response = await fetchWithAutoRefresh(`${API_BASE_URL}/api/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export async function getExpensesByYear(
  year: number,
): Promise<GetExpensesByYearResponse> {
  const response = await fetchWithAutoRefresh(
    `${API_BASE_URL}/api/expenses?year=${year}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Failed to fetch expenses.";
    throw new Error(message);
  }

  const parsed = getExpensesByYearResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected expenses response from server.");
  }

  return parsed.data;
}

export async function getExpenseSummary(
  month: string,
): Promise<ExpenseSummaryResponse> {
  const response = await fetchWithAutoRefresh(
    `${API_BASE_URL}/api/expenses/summary?month=${month}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Failed to fetch summary.";
    throw new Error(message);
  }

  const parsed = expenseSummaryResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected summary response from server.");
  }

  return parsed.data;
}
