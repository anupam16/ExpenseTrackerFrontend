import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import KeyIndicator from "@/components/KeyIndicator";
import MonthTabs from "@/components/MonthTabs";
import Navbar from "@/components/Navbar";
import {
  useExpenseSummaryQuery,
  useExpensesByYearQuery,
} from "@/features/expenses/hooks";
import { useIncomeByYearQuery } from "@/features/income/hooks";
import type { ExpenseItem } from "@/types/expense.types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const apiCategoryToUiCategory: Record<string, ExpenseItem["category"]> = {
  Food: "food",
  Shopping: "shopping",
  Transport: "transport",
  Bills: "bills",
  Entertainment: "entertainment",
  Other: "other",
};

function getYearMonthKey(dateValue: string): string | null {
  if (!dateValue) {
    return null;
  }

  const directIsoMatch = dateValue.match(/^(\d{4}-\d{2})/);
  if (directIsoMatch) {
    return directIsoMatch[1];
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function Home() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    monthNames[currentDate.getMonth()],
  );
  const [notification, setNotification] = useState<string | null>(null);
  const expensesQuery = useExpensesByYearQuery(Number(selectedYear));
  const incomeQuery = useIncomeByYearQuery(Number(selectedYear));
  const selectedMonthIndex = monthNames.indexOf(selectedMonth);
  const monthParam = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, "0")}`;
  const summaryQuery = useExpenseSummaryQuery(monthParam);

  const expenses: ExpenseItem[] =
    expensesQuery.data?.data.map((item) => ({
      id: item.id,
      title: item.title,
      amount: Number(item.amount),
      category: apiCategoryToUiCategory[item.category] ?? "other",
      date: item.date,
      description: item.description,
      tags: item.tags,
    })) ?? [];

  const filteredExpenses = expenses.filter((item) => {
    if (!item.date || selectedMonthIndex < 0) {
      return false;
    }

    return getYearMonthKey(item.date) === monthParam;
  });

  const monthlyIncomeTotal =
    incomeQuery.data?.data
      .filter((item) => getYearMonthKey(item.date) === monthParam)
      .reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;

  const totalsByCategory = filteredExpenses.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartItems = Object.entries(totalsByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="fixed inset-x-0 top-0 z-40">
        <Navbar
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onExpenseCreated={setNotification}
        />
      </div>
      {notification ? (
        <div className="fixed right-4 top-16 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {notification}
        </div>
      ) : null}

      <div className="fixed inset-x-0 top-14 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <MonthTabs activeMonth={selectedMonth} onChange={setSelectedMonth} />
      </div>

      <div className="h-full pt-27 px-2 pb-2">
        {expensesQuery.isError ? (
          <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {expensesQuery.error instanceof Error
              ? expensesQuery.error.message
              : "Failed to load expenses."}
          </div>
        ) : null}

        {incomeQuery.isError ? (
          <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {incomeQuery.error instanceof Error
              ? incomeQuery.error.message
              : "Failed to load income."}
          </div>
        ) : null}

        <div className="grid h-full gap-4 lg:grid-cols-2">
          <div className="h-full overflow-y-auto rounded-xl">
            <Dashboard
              data={filteredExpenses}
              incomeTotal={monthlyIncomeTotal}
            />
          </div>

          <div className="h-full overflow-y-auto lg:sticky lg:top-0">
            <KeyIndicator
              data={chartItems}
              summary={summaryQuery.data?.data}
              summaryLoading={summaryQuery.isLoading}
              summaryError={
                summaryQuery.isError
                  ? summaryQuery.error instanceof Error
                    ? summaryQuery.error.message
                    : "Failed to load summary."
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
