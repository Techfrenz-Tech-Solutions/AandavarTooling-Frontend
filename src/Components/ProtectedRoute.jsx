import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute
 *
 * Auth strategy:
 *  - sessionStorage "isLoggedIn" = "true"  → set at login time, lives for this tab only.
 *  - localStorage   "isLoggedIn" = "true"  → persists across refreshes within the SAME tab.
 *
 * On every render we check sessionStorage first.
 * If the session flag is missing but localStorage has it, this is a REFRESH of the same
 * tab (not a new tab), so we re-seed sessionStorage and allow access.
 *
 * A brand-new tab always starts with empty sessionStorage, so pasting a URL there
 * will find nothing in sessionStorage and will NOT re-seed from localStorage → /login.
 *
 * This is achieved by writing a "tabId" to sessionStorage when the tab is first opened
 * in index.js / main entry, but the simpler approach below works for CRA:
 * We rely on the fact that sessionStorage is empty in a new tab, even if localStorage has data.
 */
const ProtectedRoute = () => {
  // Check sessionStorage first (tab-scoped)
  const sessionAuth = sessionStorage.getItem("isLoggedIn") === "true";

  // If no session flag, check if this is a refresh (localStorage has the flag)
  // Re-seed sessionStorage so a page refresh doesn't log the user out.
  if (!sessionAuth) {
    const localAuth = localStorage.getItem("isLoggedIn") === "true";
    const isRefresh = sessionStorage.getItem("tabInitialized") === "true";

    if (localAuth && isRefresh) {
      // Same tab, just a refresh — restore session flag
      sessionStorage.setItem("isLoggedIn", "true");
      return <Outlet />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
