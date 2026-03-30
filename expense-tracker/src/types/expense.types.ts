import type { categoryIconMap } from "@/helper/categoryIconMap";

export type CategoryType = keyof typeof categoryIconMap;

export type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  tag?: string;
};
