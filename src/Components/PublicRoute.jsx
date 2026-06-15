import { Navigate, Outlet } from "react-router-dom";

/**
 * PublicRoute — wraps public-only pages (e.g. Login).
 * If the user IS already logged in, redirects to /dashboard.
 * Otherwise renders the page via <Outlet />.
 */
const PublicRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
