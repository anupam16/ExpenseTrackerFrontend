import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./hooks";
import { loginSchema } from "./schemas";

type FormErrors = {
  email?: string;
  password?: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleFieldChange = (field: "email" | "password", value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(formValues);
    if (!parsed.success) {
      const nextErrors: FormErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "email" || field === "password") {
          nextErrors[field] = issue.message;
        }
      }

      setFormErrors(nextErrors);
      return;
    }

    try {
      await loginMutation.mutateAsync(parsed.data);
      navigate("/", { replace: true });
    } catch {
      // Server error shown from mutation state.
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,#dbeafe_0%,#f8fafc_45%,#f8fafc_100%)] p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(2,6,23,0.18)]">
        <section className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
              Expense Tracker
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Own your spending journey.
            </h1>
            <p className="mt-4 text-slate-300 text-sm leading-6">
              Sign in to access a focused dashboard, monthly trends, and
              category-wise insights.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/20 p-3">
              JWT Protected Routes
            </div>
            <div className="rounded-xl border border-white/20 p-3">
              Fast Query Mutations
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Login to continue to your account
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="email"
                    type="email"
                    value={formValues.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="anupam@gmail.com"
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formErrors.email ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {formErrors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    type="password"
                    value={formValues.password}
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                    placeholder="123456"
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formErrors.password ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {formErrors.password}
                  </p>
                ) : null}
              </div>

              {loginMutation.error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-sm text-rose-600">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : "Login failed. Please try again."}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="h-11 w-full rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
