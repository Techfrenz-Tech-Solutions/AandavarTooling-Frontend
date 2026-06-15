import { Navigate, Outlet } from "react-router-dom";

/**
 * PublicRoute — wraps pages that logged-in users should not see (e.g. Login).
 * Uses the same dual-storage check as ProtectedRoute.
 */
const PublicRoute = () => {
  const sessionAuth = sessionStorage.getItem("isLoggedIn") === "true";

  if (!sessionAuth) {
    const localAuth = localStorage.getItem("isLoggedIn") === "true";
    const isRefresh = sessionStorage.getItem("tabInitialized") === "true";

    if (localAuth && isRefresh) {
      // Same tab refresh — already logged in, send to dashboard
      sessionStorage.setItem("isLoggedIn", "true");
      return <Navigate to="/dashboard" replace />;
    }

    // New tab or genuinely not logged in → show login page
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
