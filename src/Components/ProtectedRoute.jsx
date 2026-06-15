import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute — wraps authenticated pages.
 * If the user is NOT logged in, redirects to /login.
 * If authenticated, renders the nested route via <Outlet />.
 */
const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
