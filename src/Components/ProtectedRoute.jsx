import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute — pure sessionStorage auth guard.
 *
 * Grants access only when ALL of the following are true:
 *  1. sessionStorage.isLoggedIn === "true"
 *  2. sessionStorage.authTabKey === sessionStorage.tabKey
 *     (ensures auth token belongs to THIS tab, not copied from another)
 *
 * Covers every scenario:
 *  ✅ Normal navigation within Tab 1          → both keys match → granted
 *  ✅ Page refresh on Tab 1                   → sessionStorage preserved → granted
 *  🔒 New Tab: paste URL                      → fresh sessionStorage, no keys → /login
 *  🔒 Duplicate Tab (right-click → Duplicate) → index.js detects tabLive=true on cold
 *                                               start, resets tabKey & clears auth → /login
 */
const ProtectedRoute = () => {
  const isLoggedIn   = sessionStorage.getItem("isLoggedIn")  === "true";
  const tabKey       = sessionStorage.getItem("tabKey");
  const authTabKey   = sessionStorage.getItem("authTabKey");
  const validSession = isLoggedIn && tabKey && authTabKey === tabKey;

  return validSession ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
