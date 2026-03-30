import { useState } from "react";
import { useCreateExpenseMutation } from "@/features/expenses/hooks";
import { createExpenseSchema } from "@/features/expenses/schemas";
import { useCreateIncomeMutation } from "@/features/income/hooks";
import { createIncomeSchema } from "@/features/income/schemas";

type DialogDefaultProps = {
  onExpenseCreated?: (message: string) => void;
};

type EntryType = "expense" | "income";

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

function toApiDateTime(dateValue: string): string {
  if (dateValue.includes("T")) {
    return dateValue;
  }

  return `${dateValue}T00:00:00.000Z`;
}

export function DialogDefault({ onExpenseCreated }: DialogDefaultProps) {
  const [open, setOpen] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>("expense");
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [errors, setErrors] = useState<
    Partial<
      Record<
        | "title"
        | "date"
        | "category"
        | "tag"
        | "description"
        | "amount"
        | "source",
        string
      >
    >
  >({});
  const createExpenseMutation = useCreateExpenseMutation();
  const createIncomeMutation = useCreateIncomeMutation();

  const today = new Date().toLocaleDateString("en-CA");

  const [form, setForm] = useState({
    title: "",
    date: today,
    category: "Food" as Category,
    source: "",
    tag: "",
    description: "",
    amount: "",
  });

  const handleOpen = () => {
    setOpen((prev) => !prev);
    setOpenCategoryDropdown(false);
    setErrors({});
    createExpenseMutation.reset();
    createIncomeMutation.reset();
  };

  const handleEntryTypeChange = (type: EntryType) => {
    setEntryType(type);
    setOpenCategoryDropdown(false);
    setErrors({});
    createExpenseMutation.reset();
    createIncomeMutation.reset();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleCategory = (cat: Category) => {
    setForm({ ...form, category: cat });
    setOpenCategoryDropdown(false);
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed =
      entryType === "expense"
        ? createExpenseSchema.safeParse(form)
        : createIncomeSchema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: Partial<
        Record<
          | "title"
          | "date"
          | "category"
          | "tag"
          | "description"
          | "amount"
          | "source",
          string
        >
      > = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (
          field === "title" ||
          field === "date" ||
          field === "category" ||
          field === "tag" ||
          field === "description" ||
          field === "amount" ||
          field === "source"
        ) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    try {
      if (entryType === "expense") {
        const parsedExpense = createExpenseSchema.parse(form);

        await createExpenseMutation.mutateAsync({
          title: parsedExpense.title,
          description: parsedExpense.description,
          amount: parsedExpense.amount,
          date: parsedExpense.date,
          category: parsedExpense.category,
          tags: parsedExpense.tag
            ? parsedExpense.tag
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [],
        });

        onExpenseCreated?.("Expense created successfully");
      } else {
        const parsedIncome = createIncomeSchema.parse(form);

        await createIncomeMutation.mutateAsync({
          title: parsedIncome.title,
          description: parsedIncome.description || undefined,
          amount: parsedIncome.amount,
          date: toApiDateTime(parsedIncome.date),
          source: parsedIncome.source || undefined,
        });

        onExpenseCreated?.("Income created successfully");
      }

      setForm({
        title: "",
        date: today,
        category: "Food",
        source: "",
        tag: "",
        description: "",
        amount: "",
      });
      setOpen(false);
    } catch {
      // Server error is shown below the form.
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-5 py-2.5 bg-white text-slate-900 rounded-xl shadow hover:bg-slate-100 transition font-semibold"
      >
        Add Entry
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden">
            <div className="border-b px-4 py-2.5 bg-slate-50">
              <span className="text-lg font-bold text-gray-900">
                Add {entryType === "expense" ? "Expense" : "Income"}
              </span>
              <p className="mt-0.5 text-xs text-slate-500">
                Save a new {entryType} entry to your account.
              </p>

              <div className="mt-2 inline-flex rounded-lg border border-slate-300 p-1 bg-white">
                <button
                  type="button"
                  onClick={() => handleEntryTypeChange("expense")}
                  className={`px-3 py-1.5 text-sm rounded-md transition ${
                    entryType === "expense"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleEntryTypeChange("income")}
                  className={`px-3 py-1.5 text-sm rounded-md transition ${
                    entryType === "income"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-3 space-y-2.5">
                <div className="relative">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    onFocus={() => setOpenCategoryDropdown(false)}
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                  <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                    Title
                  </label>
                  {errors.title ? (
                    <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    {errors.date ? (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.date}
                      </p>
                    ) : null}
                  </div>

                  {entryType === "expense" ? (
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
                      {errors.category ? (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.category}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        onFocus={() => setOpenCategoryDropdown(false)}
                        placeholder=" "
                        className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      />
                      <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                        Source
                      </label>
                      {errors.source ? (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.source}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                {entryType === "expense" ? (
                  <div className="relative">
                    <input
                      name="tag"
                      value={form.tag}
                      onChange={handleChange}
                      onFocus={() => setOpenCategoryDropdown(false)}
                      placeholder=" "
                      className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                    <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Tag
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Separate tags with commas.
                    </p>
                    {errors.tag ? (
                      <p className="mt-1 text-xs text-rose-600">{errors.tag}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="relative">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onFocus={() => setOpenCategoryDropdown(false)}
                    placeholder=" "
                    rows={1}
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                  <label className="absolute left-3 top-2 text-gray-500 text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all">
                    Description
                  </label>
                  {errors.description ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.description}
                    </p>
                  ) : null}
                </div>

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
                  <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                    Amount
                  </label>
                  {errors.amount ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.amount}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border-t px-4 py-2.5 flex justify-end gap-2 bg-gray-50 rounded-b-2xl">
                {createExpenseMutation.error || createIncomeMutation.error ? (
                  <div className="mr-auto rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                    {createExpenseMutation.error instanceof Error
                      ? createExpenseMutation.error.message
                      : createIncomeMutation.error instanceof Error
                        ? createIncomeMutation.error.message
                        : `Failed to create ${entryType}.`}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={handleOpen}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createExpenseMutation.isPending ||
                    createIncomeMutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createExpenseMutation.isPending ||
                  createIncomeMutation.isPending
                    ? "Saving..."
                    : `Save ${entryType === "expense" ? "Expense" : "Income"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
