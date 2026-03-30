export type CreateIncomePayload = {
  title: string;
  amount: number;
  date: string;
  source?: string;
  description?: string;
};

export type IncomeItem = {
  id: string;
  title: string;
  amount: string;
  date: string;
  source: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateIncomeResponse = {
  success: boolean;
  message: string;
  data: IncomeItem;
};

export type GetIncomeByYearResponse = {
  success: boolean;
  data: IncomeItem[];
};
