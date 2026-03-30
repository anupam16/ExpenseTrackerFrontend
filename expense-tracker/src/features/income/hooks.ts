import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIncome, getIncomeByYear } from "./api";
import type { CreateIncomePayload } from "./types";

export function useCreateIncomeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIncomePayload) => createIncome(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-by-year"] });
    },
  });
}

export function useIncomeByYearQuery(year: number) {
  return useQuery({
    queryKey: ["income-by-year", year],
    queryFn: () => getIncomeByYear(year),
  });
}
