import React, { useState } from "react";

type Category =
  | "Food"
  | "Shopping"
  | "Transport"
  | "Bills"
  | "Entertainment"
  | "Other";

const categories: Category[] = [
  "Food",
  "Shopping",
  "Transport",
  "Bills",
  "Entertainment",
  "Other",
];

export function DialogDefault() {
  const [open, setOpen] = useState(false);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);

  const handleOpen = () => setOpen(!open);

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format for HTML date input

  const [form, setForm] = useState({
    title: "",
    date: today,
    category: "Food" as Category,
    tag: "",
    description: "",
    amount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategory = (cat: Category) => {
    setForm({ ...form, category: cat });
    setOpenCategoryDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Add Expense
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="border-b px-6 py-4">
              <span className="text-xl font-bold text-gray-900">
                Add Expense
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div className="relative">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    onFocus={() => setOpenCategoryDropdown(false)}
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                  <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                    Title
                  </label>
                </div>

                {/* Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      onFocus={() => setOpenCategoryDropdown(false)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 cursor-pointer"
                    />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCategoryDropdown(!openCategoryDropdown)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center text-gray-900"
                    >
                      {form.category}
                      <span className="text-gray-400 text-sm">▼</span>
                    </button>

                    {openCategoryDropdown && (
                      <ul className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 z-10 max-h-48 overflow-auto">
                        {categories.map((cat) => (
                          <li
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-900"
                          >
                            {cat}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Tag */}
                <div className="relative">
                  <input
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    onFocus={() => setOpenCategoryDropdown(false)}
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                  <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                    Tag
                  </label>
                </div>

                {/* Description */}
                <div className="relative">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onFocus={() => setOpenCategoryDropdown(false)}
                    placeholder=" "
                    rows={3}
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                  <label className="absolute left-3 top-2 text-gray-500 text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all">
                    Description
                  </label>
                </div>

                {/* Amount */}
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    onFocus={() => setOpenCategoryDropdown(false)}
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                  <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                    Amount
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
