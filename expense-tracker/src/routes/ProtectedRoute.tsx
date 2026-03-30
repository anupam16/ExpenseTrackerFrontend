import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/features/auth/storage";

function ProtectedRoute() {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
