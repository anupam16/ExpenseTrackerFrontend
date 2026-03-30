export const expenseCategories = [
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Entertainment",
  "Other",
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export type CreateExpensePayload = {
  title: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  tags: string[];
};

export type CreateExpenseResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    amount: string;
    date: string;
    category: ExpenseCategory;
    tags: string[];
    aiNote: string | null;
    aiProvider: string | null;
    aiConfidence: number | null;
    isManualEdited: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type ExpenseApiItem = {
  id: string;
  title: string;
  description: string;
  amount: string;
  date: string;
  category: ExpenseCategory;
  tags: string[];
  aiNote: string | null;
  aiProvider: string | null;
  aiConfidence: number | null;
  isManualEdited: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type GetExpensesByYearResponse = {
  success: boolean;
  count: number;
  data: ExpenseApiItem[];
};

export type ExpenseSummaryResponse = {
  success: boolean;
  data: {
    month: string;
    total: number;
    categories: Record<string, number>;
    aiSummary: string;
  };
};
