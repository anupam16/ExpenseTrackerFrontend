import InfoCard from "./InfoCard";
import DayExpenseList from "./DayExpenseList";
import type { ExpenseItem } from "@/types/expense.types";

type DashboardProps = {
  data: ExpenseItem[];
};

function Dashboard({ data }: DashboardProps) {
  return (
    <div className="overflow-y-auto p-4 space-y-4">
      <InfoCard title="Balance" value="₹1,250.00" bgColor="bg-blue-300" />
      <div className="flex w-full ">
        <InfoCard title="Income" value="₹2,500.00" bgColor="bg-green-300" />
        <InfoCard title="Expense" value="₹1,250.00" bgColor="bg-red-300" />
      </div>

      <DayExpenseList day="January 22, Sun" items={data} />
      <DayExpenseList day="January 22, Sun" items={data} />
      <DayExpenseList day="January 22, Sun" items={data} />
    </div>
  );
}

export default Dashboard;
