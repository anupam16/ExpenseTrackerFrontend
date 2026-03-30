import React, { useState, useRef, useEffect } from "react";

export type DropdownItem = {
  label: string;
  value: string;
};

type DropdownProps = {
  label: string;
  items: DropdownItem[];
  onSelect?: (value: string) => void;
};

type YearDropdownProps = {
  onSelect?: (year: string) => void;
  value?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ label, items, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
      >
        {label}
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <ul className="py-1">
            {items.map((item) => (
              <li
                key={item.value}
                onClick={() => {
                  onSelect?.(item.value);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const YearDropdown: React.FC<YearDropdownProps> = ({ onSelect, value }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    value ?? currentYear.toString(),
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedYear(value);
    }
  }, [value]);

  // Generate years from current year - 4 to current year (past 4 years + current)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (year: string) => {
    setSelectedYear(year);
    onSelect?.(year);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-2"
      >
        {selectedYear}
        <span className="text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <ul className="py-1">
            {years.map((year) => (
              <li
                key={year}
                onClick={() => handleSelect(year.toString())}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-black ${
                  year.toString() === selectedYear ? "bg-gray-200" : ""
                }`}
              >
                {year}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
export { YearDropdown };
