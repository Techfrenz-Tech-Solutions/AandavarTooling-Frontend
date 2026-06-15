import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Topbar.css";

const routeNames = {
  "/dashboard": "Dashboard",
  "/dashboard/products": "Product Master",
  "/dashboard/uom": "UOM Master",
  "/dashboard/categories": "Category Master",
  "/dashboard/machines": "Machine Master",
  "/dashboard/workers": "Worker Master",
  "/dashboard/salesproducts": "Sales Products",
  "/dashboard/CustomerMaster": "Customer Master",
  "/dashboard/feedout": "Line Out",
  "/dashboard/returns": "Line Return",
  "/dashboard/SalesPage": "Sales Page",
  "/dashboard/IGSTSalasPage": "IGST-Sales Page",
  "/dashboard/InwardEntry": "product Inward Entry",
  "/dashboard/ToolInward": "Tool Inward Entry",
  "/dashboard/CurrentStock": "Current Stock",
  "/dashboard/Reports": "Reports",
  "/dashboard/ToolMaster":"TooL Master",
};

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= CURRENT PAGE ================= */

const getCurrentPage = () => {
  const path = location.pathname;

  // Find the best matching route
  const matchedRoute = Object.keys(routeNames)
    .sort((a, b) => b.length - a.length)
    .find((route) => path.startsWith(route));

  return routeNames[matchedRoute] || "Dashboard";
};

const currentPage = getCurrentPage();

  console.log("Current Path:", location.pathname);

  /* ================= FUNCTIONS ================= */

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("tabInitialized");
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">

      {/* LEFT SIDE */}
      <div className="topbar-left">

        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span className="erp-text">ERP</span>
          <span className="slash"> / </span>
          <span className="active-page">{currentPage}</span>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="topbar-right">

        <button className="icon-btn" onClick={handleRefresh}>
          <i className="fa-solid fa-rotate-right"></i>
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </div>

    </header>
  );
};

export default Topbar;