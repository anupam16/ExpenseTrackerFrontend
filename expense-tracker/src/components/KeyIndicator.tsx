import React from "react";

type ChartItem = {
  name: string;
  value: number;
};

type ExpenseSummaryData = {
  month: string;
  total: number;
  categories: Record<string, number>;
  aiSummary: string;
};

type KeyIndicatorProps = {
  data: ChartItem[];
  summary?: ExpenseSummaryData;
  summaryLoading?: boolean;
  summaryError?: string | null;
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

const KeyIndicator: React.FC<KeyIndicatorProps> = ({
  data,
  summary,
  summaryLoading = false,
  summaryError = null,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const summaryText = summary?.aiSummary.replace(/\*\*/g, "");

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

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900">AI Summary</h4>

        {summaryLoading ? (
          <div className="mt-3 space-y-2 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-11/12 rounded bg-gray-200" />
            <div className="h-3 w-10/12 rounded bg-gray-200" />
            <div className="h-3 w-8/12 rounded bg-gray-200" />
          </div>
        ) : null}

        {!summaryLoading && summaryError ? (
          <p className="mt-2 text-sm text-rose-600">{summaryError}</p>
        ) : null}

        {!summaryLoading && !summaryError && summary ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500">
              Month:{" "}
              <span className="font-medium text-gray-700">{summary.month}</span>
            </p>
            <p className="text-xs text-gray-500">
              Total:{" "}
              <span className="font-medium text-gray-700">
                ₹{summary.total}
              </span>
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-6">
              {summaryText}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default KeyIndicator;
