import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useMyProfileQuery } from "@/features/auth/hooks";
import { DialogDefault } from "./DialogDefault";
import { YearDropdown } from "./DropDownMenu";

type NavbarProps = {
  onExpenseCreated?: (message: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  onExportCsv: () => void;
  exportDisabled?: boolean;
};

function Navbar({
  onExpenseCreated,
  selectedYear,
  onYearChange,
  onExportCsv,
  exportDisabled = false,
}: NavbarProps) {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const profileQuery = useMyProfileQuery();

  const profileName = profileQuery.data?.data.name ?? "Profile";
  const profileEmail = profileQuery.data?.data.email ?? "";
  const initials =
    profileName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "P";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="bg-black text-white py-2 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-cyan-300 to-emerald-300 text-sm font-black text-slate-900 shadow">
          ₹
        </div>
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
            Expense Tracker
          </p>
          <p className="text-lg font-extrabold tracking-tight text-white">
            Spend<span className="text-emerald-300">it</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="py-0.5 px-1">
          <YearDropdown value={selectedYear} onSelect={onYearChange} />
        </div>
        <DialogDefault onExpenseCreated={onExpenseCreated} />
        <button
          type="button"
          onClick={onExportCsv}
          disabled={exportDisabled}
          className="px-2.5 py-1.5 text-sm rounded-lg border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="px-2.5 py-1.5 text-sm rounded-lg border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>

        <div className="ml-1 flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-2 py-1">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-slate-900">
            {profileQuery.isLoading ? ".." : initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-semibold text-white">{profileName}</p>
            <p className="text-[11px] text-slate-300 max-w-40 truncate">
              {profileEmail || "Loading profile..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
