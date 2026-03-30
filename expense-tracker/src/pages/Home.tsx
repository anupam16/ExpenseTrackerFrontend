import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import KeyIndicator from "@/components/KeyIndicator";
import MonthTabs from "@/components/MonthTabs";
import Navbar from "@/components/Navbar";
import type { ExpenseItem } from "@/types/expense.types";

function Home() {
  const [notification, setNotification] = useState<string | null>(null);
  const expenses: ExpenseItem[] = [
    {
      id: "1",
      title: "Snacks",
      amount: 300,
      category: "snacks",
    },
    {
      id: "2",
      title: "Transportation",
      amount: 200,
      category: "transportation",
    },
    {
      id: "3",
      title: "Shopping",
      amount: 500,
      category: "shopping",
    },
  ];

  const totalsByCategory = expenses.reduce(
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
      <Navbar onExpenseCreated={setNotification} />
      {notification ? (
        <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {notification}
        </div>
      ) : null}
      <MonthTabs />
      <div className="grid grid-cols-2 gap-4 p-2 ">
        <Dashboard data={expenses} />
        <KeyIndicator data={chartItems} />
      </div>
    </div>
  );
}

export default Home;
