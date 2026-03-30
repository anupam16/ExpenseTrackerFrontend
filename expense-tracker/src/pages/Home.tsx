import Dashboard from "@/components/Dashboard";
import KeyIndicator from "@/components/KeyIndicator";
import MonthTabs from "@/components/MonthTabs";
import Navbar from "@/components/Navbar";
import type { ExpenseItem } from "@/types/expense.types";

function Home() {
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

  return (
    <div>
      <Navbar />
      <MonthTabs />
      <div className="grid grid-cols-2 gap-4 p-2 ">
        <Dashboard data={expenses} />
        <KeyIndicator data={chartItems} />
      </div>
    </div>
  );
}

export default Home;
