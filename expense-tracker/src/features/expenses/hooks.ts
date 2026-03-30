import { useMutation } from "@tanstack/react-query";
import { createExpense } from "./api";
import type { CreateExpensePayload } from "./types";

export function useCreateExpenseMutation() {
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
  });
}
