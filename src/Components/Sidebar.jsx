import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Sidebar.css";

const MASTER_ITEMS = [
  { path: "/dashboard/products",        icon: "fa fa-box",         label: "Product Master"    },
  { path: "/dashboard/ToolMaster",      icon: "fa fa-wrench",      label: "Tool Master"       },
  { path: "/dashboard/InstrumentMaster",icon: "fa fa-stethoscope", label: "Instrument Master" },
  { path: "/dashboard/uom",             icon: "fa fa-ruler",       label: "UOM Master"        },
  { path: "/dashboard/categories",      icon: "fa fa-tag",         label: "Category Master"   },
  { path: "/dashboard/machines",        icon: "fa fa-cogs",        label: "Machine Master"    },
  { path: "/dashboard/workers",         icon: "fa fa-users",       label: "Worker Master"     },
  { path: "/dashboard/CustomerMaster",  icon: "fa fa-user-tie",    label: "Customer Master"   },
];

const Sidebar = ({ collapsed }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  /* track which dropdown sections are open */
  const [mastersOpen, setMastersOpen] = useState(
    MASTER_ITEMS.some((m) => location.pathname === m.path)
  );

  const isActive       = (path) => location.pathname === path;
  const isMasterActive = MASTER_ITEMS.some((m) => location.pathname === m.path);

  const handleMasterClick = (path) => {
    navigate(path);
    /* keep dropdown open after navigating */
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* ===== LOGO ===== */}
      <div className="sidebar-top">
        <div className="logo-box">SAT</div>
        {!collapsed && (
          <div className="logo-text">
            <h2>SHREE AANDAVAR TOOLING</h2>
            <p>ERP System</p>
          </div>
        )}
      </div>

      {/* ===== MAIN ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">MAIN</div>}
        <div
          className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <i className="fa fa-th-large"></i>
          {!collapsed && <span>Dashboard</span>}
        </div>
      </div>

      {/* ===== MASTERS — collapsible dropdown ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">MASTERS</div>}

        {/* Parent trigger */}
        <div
          className={`menu-item menu-item--parent ${isMasterActive ? "active" : ""}`}
          onClick={() => setMastersOpen((o) => !o)}
        >
          <i className="fa fa-layer-group"></i>
          {!collapsed && (
            <>
              <span>Masters</span>
              <i className={`fa fa-chevron-${mastersOpen ? "up" : "down"} menu-chevron`}></i>
            </>
          )}
        </div>

        {/* Dropdown children */}
        {mastersOpen && !collapsed && (
          <div className="menu-dropdown">
            {MASTER_ITEMS.map((item) => (
              <div
                key={item.path}
                className={`menu-item menu-item--child ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleMasterClick(item.path)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Collapsed mode: show icons only, no dropdown */}
        {collapsed && (
          MASTER_ITEMS.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <i className={item.icon}></i>
            </div>
          ))
        )}
      </div>

      {/* ===== TRANSACTIONS ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">TRANSACTIONS</div>}

        <div className={`menu-item ${isActive("/dashboard/lineout") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/lineout")}>
          <i className="fa fa-arrow-right"></i>
          {!collapsed && <span>Line Out</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/returns") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/returns")}>
          <i className="fa fa-undo"></i>
          {!collapsed && <span>Line Out History</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/SalesPage") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/SalesPage")}>
          <i className="fa fa-undo"></i>
          {!collapsed && <span>Sales Page</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/IGSTSalesPage") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/IGSTSalesPage")}>
          <i className="fa fa-undo"></i>
          {!collapsed && <span>IGST-Sales Page</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/InvoiceHistory") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/InvoiceHistory")}>
          <i className="fa fa-warehouse"></i>
          {!collapsed && <span>Invoice History</span>}
        </div>
      </div>

      {/* ===== INVENTORY ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">INVENTORY</div>}

        <div className={`menu-item ${isActive("/dashboard/InwardEntry") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/InwardEntry")}>
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Product Inward Entry</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/ToolInwardEntry") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/ToolInwardEntry")}>
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Tool Inward Entry</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/DeliveryChallan") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/DeliveryChallan")}>
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Delivery Challan</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/DeliveryHistory") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/DeliveryHistory")}>
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Challan History</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/Returndeliverychallan") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/Returndeliverychallan")}>
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Return Delivery Challan</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/CurrentStock") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/CurrentStock")}>
          <i className="fa fa-warehouse"></i>
          {!collapsed && <span>Current Stock</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/Toolstack") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/Toolstack")}>
          <i className="fa fa-warehouse"></i>
          {!collapsed && <span>Tool Stock</span>}
        </div>
      </div>

      {/* Reports — standalone */}
      <div className={`menu-item ${isActive("/dashboard/Reports") ? "active" : ""}`}
        onClick={() => navigate("/dashboard/Reports")}
        style={{ margin: "2px 8px" }}>
        <i className="fa fa-chart-bar"></i>
        {!collapsed && <span>Reports</span>}
      </div>

      {/* ===== SUPPLIER TRANSACTION ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">SUPPLIER TRANSACTION</div>}

        <div className={`menu-item ${isActive("/dashboard/SupplierDC") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/SupplierDC")}>
          <i className="fa fa-truck"></i>
          {!collapsed && <span>Supplier DC</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/WorkOrderEntry") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/WorkOrderEntry")}>
          <i className="fa fa-clipboard-list"></i>
          {!collapsed && <span>Work Order</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/ProductDC") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/ProductDC")}>
          <i className="fa fa-file-alt"></i>
          {!collapsed && <span>Product DC</span>}
        </div>

        <div className={`menu-item ${isActive("/dashboard/SupplierInvoice") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/SupplierInvoice")}>
          <i className="fa fa-file-invoice"></i>
          {!collapsed && <span>Supplier Invoice</span>}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="sidebar-footer">
        <div
          className="menu-item logout"
          onClick={() => {
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("authTabKey");
            navigate("/login", { replace: true });
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          {!collapsed && <span>Logout</span>}
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
