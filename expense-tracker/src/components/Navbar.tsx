import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/features/auth/hooks";
import { DialogDefault } from "./DialogDefault";
import { YearDropdown } from "./DropDownMenu";

type NavbarProps = {
  onExpenseCreated?: (message: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
};

function Navbar({ onExpenseCreated, selectedYear, onYearChange }: NavbarProps) {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="bg-black text-white py-2 px-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Spend it</h2>
      <div className="flex items-center gap-2">
        <div className="py-0.5 px-1">
          <YearDropdown value={selectedYear} onSelect={onYearChange} />
        </div>
        <DialogDefault onExpenseCreated={onExpenseCreated} />
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="px-2.5 py-1.5 text-sm rounded-lg border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
