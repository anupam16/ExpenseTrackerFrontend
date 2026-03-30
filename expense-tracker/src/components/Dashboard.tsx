import InfoCard from "./InfoCard";
import DayExpenseList from "./DayExpenseList";
import type { ExpenseItem } from "@/types/expense.types";

type DashboardProps = {
  data: ExpenseItem[];
  incomeTotal: number;
};

function Dashboard({ data, incomeTotal }: DashboardProps) {
  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = incomeTotal - totalExpense;
  const groupedByDay = data.reduce(
    (acc, item) => {
      const dayKey = item.date
        ? new Date(item.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            weekday: "short",
          })
        : "Unknown date";

      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }

      acc[dayKey].push(item);
      return acc;
    },
    {} as Record<string, ExpenseItem[]>,
  );

  const groupedEntries = Object.entries(groupedByDay);

  return (
    <div className="overflow-y-auto p-4 space-y-4">
      <InfoCard
        title="Balance"
        value={`₹${totalBalance.toFixed(2)}`}
        bgColor="bg-blue-300"
      />
      <div className="flex w-full ">
        <InfoCard
          title="Income"
          value={`₹${incomeTotal.toFixed(2)}`}
          bgColor="bg-green-300"
        />
        <InfoCard
          title="Expense"
          value={`₹${totalExpense.toFixed(2)}`}
          bgColor="bg-red-300"
        />
      </div>

      {groupedEntries.length > 0 ? (
        groupedEntries.map(([day, items]) => (
          <DayExpenseList key={day} day={day} items={items} />
        ))
      ) : (
        <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-600">
          No expenses found for selected year/month.
        </div>
      )}
    </div>
  );
}

export default Dashboard;
