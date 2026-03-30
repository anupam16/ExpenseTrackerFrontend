import React from "react";

type ChartItem = {
  name: string;
  value: number;
};

type KeyIndicatorProps = {
  data: ChartItem[];
};

const defaultColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-lime-500",
];

const KeyIndicator: React.FC<KeyIndicatorProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Expense Chart
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Category-wise spend breakdown
      </p>

      <div className="w-full h-4 rounded-full bg-gray-100 overflow-hidden mb-4 flex">
        {data.map((item, index) => {
          const width = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div
              key={item.name}
              className={`${defaultColors[index % defaultColors.length]} h-full`}
              style={{ width: `${width}%` }}
              title={`${item.name}: ₹${item.value}`}
            />
          );
        })}
      </div>

      <div className="space-y-2">
        {data.map((item, index) => {
          const percent =
            total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${defaultColors[index % defaultColors.length]}`}
                />
                <span className="text-gray-700 capitalize">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                ₹{item.value} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyIndicator;
