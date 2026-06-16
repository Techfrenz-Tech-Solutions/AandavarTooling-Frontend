import { Navigate, Outlet } from "react-router-dom";

/**
 * PublicRoute — shows login page only when NOT authenticated.
 * If already authenticated in this tab, redirect to /dashboard.
 */
const PublicRoute = () => {
  const isLoggedIn   = sessionStorage.getItem("isLoggedIn")  === "true";
  const tabKey       = sessionStorage.getItem("tabKey");
  const authTabKey   = sessionStorage.getItem("authTabKey");
  const validSession = isLoggedIn && tabKey && authTabKey === tabKey;

  return validSession ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
