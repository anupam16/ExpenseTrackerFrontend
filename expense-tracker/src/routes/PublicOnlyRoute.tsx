import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/features/auth/storage";

function PublicOnlyRoute() {
  if (authStorage.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
