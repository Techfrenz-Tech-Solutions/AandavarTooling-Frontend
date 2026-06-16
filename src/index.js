import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Tab Identity Guard — runs once synchronously before React mounts.
 *
 * How it works:
 *  1. Every tab gets a unique `tabKey` stored in sessionStorage on first load.
 *  2. At login, we stamp `authTabKey` = current `tabKey` into sessionStorage.
 *  3. ProtectedRoute checks: isLoggedIn === "true" AND authTabKey === tabKey.
 *
 * Scenarios:
 *  - Normal tab (login → navigate): tabKey set, authTabKey set at login → access granted.
 *  - Page refresh: sessionStorage preserved → both keys intact → access granted.
 *  - New tab (paste URL): fresh sessionStorage → tabKey newly generated, authTabKey absent → blocked.
 *  - Duplicate tab (right-click → Duplicate): browser COPIES sessionStorage, so tabKey and
 *    authTabKey are both copied. We detect this by comparing against a crypto random tabKey
 *    that we regenerate if the tab has no prior identity marker in sessionStorage.
 *    To block duplicate tab: we use window.performance.navigation or a generated nonce.
 *
 * Duplicate tab block strategy:
 *  - On first load of any tab, if sessionStorage has NO "tabKey", generate a new one.
 *  - If sessionStorage already HAS a "tabKey" (copied from parent tab via duplication),
 *    we MUST NOT use the copied authTabKey — it belongs to the parent tab.
 *  - We detect duplication using `sessionStorage.getItem("tabLive")`:
 *      · "tabLive" is set AFTER React mounts (see App.js useEffect).
 *      · On a fresh load (new tab / paste URL) React hasn't mounted yet → "tabLive" is absent.
 *      · On a duplicate tab, the copied sessionStorage already has "tabLive" = "true" from parent.
 *  - If "tabLive" is present on a cold start → this is a DUPLICATE TAB → clear auth.
 */
const existingTabKey = sessionStorage.getItem("tabKey");
const tabLive = sessionStorage.getItem("tabLive");

if (!existingTabKey) {
  // Brand-new tab: generate a fresh identity
  const newKey = crypto.randomUUID();
  sessionStorage.setItem("tabKey", newKey);
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("authTabKey");
} else if (tabLive === "true") {
  // tabKey exists AND tabLive is true before React even mounts →
  // this sessionStorage was COPIED from another tab (duplicate tab).
  // Invalidate the copied auth so the user must log in fresh.
  const newKey = crypto.randomUUID();
  sessionStorage.setItem("tabKey", newKey);
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("authTabKey");
  sessionStorage.removeItem("tabLive");
}
// else: tabKey exists but tabLive is absent → normal page refresh → leave auth intact.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
