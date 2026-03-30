import {
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "./schemas";
import { useRegisterMutation } from "./hooks";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleFieldChange = (
    field: "name" | "email" | "password" | "confirmPassword",
    value: string,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = registerSchema.safeParse(formValues);
    if (!parsed.success) {
      const nextErrors: FormErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "confirmPassword"
        ) {
          nextErrors[field] = issue.message;
        }
      }

      setFormErrors(nextErrors);
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      navigate("/login", { replace: true });
    } catch {
      // Server error shown from mutation state.
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_85%_15%,#e2e8f0_0%,#f8fafc_40%,#f8fafc_100%)] p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(2,6,23,0.18)]">
        <section className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
              Expense Tracker
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Start your finance journey.
            </h1>
            <p className="mt-4 text-slate-300 text-sm leading-6">
              Create your account to securely manage expenses and monitor
              spending patterns.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/20 p-3">
              Modern Tailwind UI
            </div>
            <div className="rounded-xl border border-white/20 p-3">
              Validated Registration
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="max-w-md w-full mx-auto">
            <h2
              className="text-3xl font-bold text-black!"
              style={{ color: "#020617" }}
            >
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Register to access your expense dashboard
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserCircleIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="name"
                    type="text"
                    value={formValues.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Anupam"
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formErrors.name ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {formErrors.name}
                  </p>
                ) : null}
              </div>

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
                    placeholder="******"
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formErrors.password ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {formErrors.password}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={(e) =>
                      handleFieldChange("confirmPassword", e.target.value)
                    }
                    placeholder="******"
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formErrors.confirmPassword ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {formErrors.confirmPassword}
                  </p>
                ) : null}
              </div>

              {registerMutation.error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-sm text-rose-600">
                  {registerMutation.error instanceof Error
                    ? registerMutation.error.message
                    : "Registration failed. Please try again."}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-11 w-full rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-slate-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
