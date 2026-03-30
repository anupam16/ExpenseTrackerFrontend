import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import KeyIndicator from "@/components/KeyIndicator";
import MonthTabs from "@/components/MonthTabs";
import Navbar from "@/components/Navbar";
import { useExpensesByYearQuery } from "@/features/expenses/hooks";
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

  const selectedMonthIndex = monthNames.indexOf(selectedMonth);
  const filteredExpenses = expenses.filter((item) => {
    if (!item.date || selectedMonthIndex < 0) {
      return false;
    }

    const expenseDate = new Date(item.date);
    return expenseDate.getMonth() === selectedMonthIndex;
  });

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
    <div>
      <Navbar
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onExpenseCreated={setNotification}
      />
      {notification ? (
        <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {notification}
        </div>
      ) : null}
      <MonthTabs activeMonth={selectedMonth} onChange={setSelectedMonth} />
      {expensesQuery.isError ? (
        <div className="mx-2 mt-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {expensesQuery.error instanceof Error
            ? expensesQuery.error.message
            : "Failed to load expenses."}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-4 p-2 ">
        <Dashboard data={filteredExpenses} />
        <KeyIndicator data={chartItems} />
      </div>
    </div>
  );
}

export default Home;
