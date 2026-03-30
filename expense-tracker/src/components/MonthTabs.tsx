import React, { useState } from "react";

const months = [
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

type MonthTabsProps = {
  activeMonth?: string;
  onChange?: (month: string) => void;
};

const MonthTabs: React.FC<MonthTabsProps> = ({
  activeMonth: activeMonthProp,
  onChange,
}) => {
  const [internalActiveMonth, setInternalActiveMonth] =
    useState<string>("January");
  const activeMonth = activeMonthProp ?? internalActiveMonth;

  const handleMonthChange = (month: string) => {
    if (!activeMonthProp) {
      setInternalActiveMonth(month);
    }
    onChange?.(month);
  };

  return (
    <div className="w-full ">
      <div
        className="flex overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthChange(month)}
            className={`
              flex-shrink-0 px-8 py-3 text-sm font-medium
               transition-all duration-200
              ${
                activeMonth === month
                  ? "border-black text-black border-b-2"
                  : " hover:text-black"
              }
            `}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonthTabs;
