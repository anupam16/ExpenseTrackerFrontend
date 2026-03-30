import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExpense, getExpenseSummary, getExpensesByYear } from "./api";
import type { CreateExpensePayload } from "./types";

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-by-year"] });
    },
  });
}

export function useExpensesByYearQuery(year: number) {
  return useQuery({
    queryKey: ["expenses-by-year", year],
    queryFn: () => getExpensesByYear(year),
  });
}

export function useExpenseSummaryQuery(month: string) {
  return useQuery({
    queryKey: ["expense-summary", month],
    queryFn: () => getExpenseSummary(month),
  });
}
