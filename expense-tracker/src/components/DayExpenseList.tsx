import { categoryIconMap } from "@/helper/categoryIconMap";
import type { ExpenseItem } from "@/types/expense.types";

type Props = {
  day: string;
  items: ExpenseItem[];
};

const DayExpenseList: React.FC<Props> = ({ day, items }) => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 w-full ">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-gray-700 font-semibold mb-3 ml-2">{day}</h3>
        {items.length > 0 && (
          <span className="text-sm font-bold text-gray-900 p-2">
            ₹{items.reduce((sum, item) => sum + item.amount, 0)}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const { icon: Icon, color } = categoryIconMap[item.category];

          return (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <p className="text-gray-700 font-medium">{item.title}</p>
              </div>

              <p className="font-semibold text-gray-800">₹{item.amount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayExpenseList;
