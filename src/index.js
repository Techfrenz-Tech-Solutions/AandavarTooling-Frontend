import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Tab initialization guard.
 *
 * sessionStorage is empty in every brand-new tab.
 * We set "tabInitialized" here so ProtectedRoute can distinguish between:
 *   - A page REFRESH (sessionStorage had it from a previous render → re-seed isLoggedIn)
 *   - A NEW TAB     (sessionStorage is empty → do NOT re-seed → force login)
 *
 * Wait — on a refresh sessionStorage is NOT cleared by the browser, so "tabInitialized"
 * will already be "true" after a refresh. On a new tab it will be absent.
 * Setting it here ensures it is present from the very first render of any tab.
 *
 * ProtectedRoute reads it BEFORE this line runs on first render, so we use a
 * synchronous flag: if it isn't set yet, this IS the first load of a new tab.
 */
if (sessionStorage.getItem("tabInitialized") !== "true") {
  // Brand-new tab: do NOT carry over any previous login
  // (localStorage may have isLoggedIn from another tab — we ignore it)
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.setItem("tabInitialized", "true");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
