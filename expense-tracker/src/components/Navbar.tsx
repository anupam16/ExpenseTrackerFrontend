import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/features/auth/hooks";
import { DialogDefault } from "./DialogDefault";
import { YearDropdown } from "./DropDownMenu";

type NavbarProps = {
  onExpenseCreated?: (message: string) => void;
};

function Navbar({ onExpenseCreated }: NavbarProps) {
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
    <div className="bg-black text-white py-3 px-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold">Spend it</h2>
      <div className="flex items-center gap-4">
        <div className="py-2 px-4">
          <YearDropdown
            onSelect={(year) => console.log("Selected year:", year)}
          />
        </div>
        <DialogDefault onExpenseCreated={onExpenseCreated} />
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
