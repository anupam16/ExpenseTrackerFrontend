import { z } from "zod";
import {
  API_BASE_URL,
  fetchWithAutoRefresh,
} from "@/features/auth/authenticatedFetch";
import type {
  CreateIncomePayload,
  CreateIncomeResponse,
  GetIncomeByYearResponse,
} from "./types";

const incomeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.union([z.string(), z.number()]).transform((value) => String(value)),
  date: z.string(),
  source: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? ""),
  description: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? ""),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const createIncomeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: incomeItemSchema,
});

const getIncomeByYearResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(incomeItemSchema),
});

export async function createIncome(
  payload: CreateIncomePayload,
): Promise<CreateIncomeResponse> {
  const response = await fetchWithAutoRefresh(`${API_BASE_URL}/api/income`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Failed to create income. Please try again.";
    throw new Error(message);
  }

  const parsed = createIncomeResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected income response from server.");
  }

  return parsed.data;
}

export async function getIncomeByYear(
  year: number,
): Promise<GetIncomeByYearResponse> {
  const response = await fetchWithAutoRefresh(
    `${API_BASE_URL}/api/income?year=${year}`,
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
        : "Failed to fetch income.";
    throw new Error(message);
  }

  const parsed = getIncomeByYearResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected income list response from server.");
  }

  return parsed.data;
}
