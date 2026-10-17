import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Sidebar.css";

/* ── Menu data ── */
const MASTER_ITEMS = [
  { path: "/dashboard/products",         icon: "fa fa-box",          label: "Product Master"     },
  { path: "/dashboard/ToolMaster",       icon: "fa fa-wrench",       label: "Tool Master"        },
  { path: "/dashboard/InstrumentMaster", icon: "fa fa-stethoscope",  label: "Instrument Master"  },
  { path: "/dashboard/uom",              icon: "fa fa-ruler",        label: "UOM Master"         },
  { path: "/dashboard/categories",       icon: "fa fa-tag",          label: "Category Master"    },
  { path: "/dashboard/machines",         icon: "fa fa-cogs",         label: "Machine Master"     },
  { path: "/dashboard/workers",          icon: "fa fa-users",        label: "Worker Master"      },
  { path: "/dashboard/CustomerMaster",   icon: "fa fa-user-tie",     label: "Customer Master"    },
];

const TRANSACTION_ITEMS = [
  { path: "/dashboard/lineout",       icon: "fa fa-arrow-right", label: "Line Out"        },
  { path: "/dashboard/returns",       icon: "fa fa-undo",        label: "Line Out History" },
  { path: "/dashboard/SalesPage",     icon: "fa fa-receipt",     label: "Sales Page"      },
  { path: "/dashboard/IGSTSalesPage", icon: "fa fa-file-alt",    label: "IGST-Sales Page" },
  { path: "/dashboard/InvoiceHistory",icon: "fa fa-history",     label: "Invoice History" },
];

const INVENTORY_ITEMS = [
  { path: "/dashboard/InwardEntry",          icon: "fa fa-arrow-down",   label: "Product Inward Entry"    },
  { path: "/dashboard/ToolInwardEntry",      icon: "fa fa-tools",        label: "Tool Inward Entry"       },
  { path: "/dashboard/DeliveryChallan",      icon: "fa fa-truck",        label: "Delivery Challan"        },
  { path: "/dashboard/DeliveryHistory",      icon: "fa fa-list-alt",     label: "Challan History"         },
  { path: "/dashboard/Returndeliverychallan",icon: "fa fa-undo-alt",     label: "Return Delivery Challan" },
  { path: "/dashboard/CurrentStock",         icon: "fa fa-warehouse",    label: "Current Stock"           },
  { path: "/dashboard/Toolstack",            icon: "fa fa-layer-group",  label: "Tool Stock"              },
  { path: "/dashboard/Reports",              icon: "fa fa-chart-bar",    label: "Reports"                 },
];

const SUPPLIER_ITEMS = [
  { path: "/dashboard/SupplierDC",      icon: "fa fa-truck",         label: "Supplier DC"      },
  { path: "/dashboard/ProductDC",       icon: "fa fa-file-alt",      label: "Product DC"        },
  { path: "/dashboard/SupplierInvoice", icon: "fa fa-file-invoice",  label: "Supplier Invoice"  },
];

const WORKER_ITEMS = [
  { path: "/dashboard/WorkOrderEntry",  icon: "fa fa-clipboard-list", label: "Work Order" },
];

/* ── Reusable dropdown section ── */
function DropSection({ label, icon, items, collapsed, isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const hasActive = items.some((m) => isActive(m.path));

  return (
    <div className="menu-section">
      {!collapsed && <div className="menu-title">{label}</div>}

      {/* Parent trigger */}
      <div
        className={`menu-item menu-item--parent ${hasActive ? "active" : ""}`}
        onClick={onToggle}
        title={collapsed ? label : undefined}
      >
        <i className={icon}></i>
        {!collapsed && (
          <>
            <span>{label}</span>
            <i className={`fa fa-chevron-${isOpen ? "up" : "down"} menu-chevron`}></i>
          </>
        )}
      </div>

      {/* Expanded — show children */}
      {isOpen && !collapsed && (
        <div className="menu-dropdown">
          {items.map((item) => (
            <div
              key={item.path}
              className={`menu-item menu-item--child ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Collapsed — show icons only */}
      {collapsed && items.map((item) => (
        <div
          key={item.path}
          className={`menu-item ${isActive(item.path) ? "active" : ""}`}
          onClick={() => navigate(item.path)}
          title={item.label}
        >
          <i className={item.icon}></i>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   Sidebar
══════════════════════════════════════ */
const Sidebar = ({ collapsed }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isActive  = (path) => location.pathname === path;

  const inGroup   = (items) => items.some((m) => location.pathname === m.path);

  // Accordion: only one dropdown section open at a time.
  // The section containing the current route starts open.
  const [openSection, setOpenSection] = useState(() => {
    if (inGroup(MASTER_ITEMS))      return "masters";
    if (inGroup(TRANSACTION_ITEMS)) return "transactions";
    if (inGroup(INVENTORY_ITEMS))   return "inventory";
    if (inGroup(SUPPLIER_ITEMS))    return "supplier";
    if (inGroup(WORKER_ITEMS))      return "worker";
    return null;
  });

  // Keep the open dropdown in sync with the active route so the
  // section containing the current page stays expanded after
  // navigation.  This runs during render (no flash) and only fires
  // when the pathname actually changes, so manual toggling is
  // preserved while staying on the same route.
  const prevPath = useRef(location.pathname);
  if (prevPath.current !== location.pathname) {
    prevPath.current = location.pathname;
    if (inGroup(MASTER_ITEMS))      setOpenSection("masters");
    else if (inGroup(TRANSACTION_ITEMS)) setOpenSection("transactions");
    else if (inGroup(INVENTORY_ITEMS))   setOpenSection("inventory");
    else if (inGroup(SUPPLIER_ITEMS))    setOpenSection("supplier");
    else if (inGroup(WORKER_ITEMS))      setOpenSection("worker");
    // Routes outside all sections (e.g. /dashboard) leave the
    // current openSection unchanged so a dropdown isn't forced closed.
  }

  const toggle = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* ── Logo ── */}
      <div className="sidebar-top">
        <div className="logo-box">SAT</div>
        {!collapsed && (
          <div className="logo-text">
            <h2>SHREE AANDAVAR TOOLING</h2>
            <p>ERP System</p>
          </div>
        )}
      </div>

      {/* ── Dashboard ── */}
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

      {/* ── Masters ── */}
      <DropSection
        label="Masters"
        icon="fa fa-layer-group"
        items={MASTER_ITEMS}
        collapsed={collapsed}
        isOpen={openSection === "masters"}
        onToggle={() => toggle("masters")}
      />

      {/* ── Transactions ── */}
      <DropSection
        label="Transactions"
        icon="fa fa-exchange-alt"
        items={TRANSACTION_ITEMS}
        collapsed={collapsed}
        isOpen={openSection === "transactions"}
        onToggle={() => toggle("transactions")}
      />

      {/* ── Inventory ── */}
      <DropSection
        label="Inventory"
        icon="fa fa-boxes"
        items={INVENTORY_ITEMS}
        collapsed={collapsed}
        isOpen={openSection === "inventory"}
        onToggle={() => toggle("inventory")}
      />

      {/* ── Supplier Transaction ── */}
      <DropSection
        label="Supplier Transaction"
        icon="fa fa-truck-loading"
        items={SUPPLIER_ITEMS}
        collapsed={collapsed}
        isOpen={openSection === "supplier"}
        onToggle={() => toggle("supplier")}
      />

      {/* ── Aandavar Worker ── */}
      <DropSection
        label="Aandavar Worker"
        icon="fa fa-hard-hat"
        items={WORKER_ITEMS}
        collapsed={collapsed}
        isOpen={openSection === "worker"}
        onToggle={() => toggle("worker")}
      />

      {/* ── Footer / Logout ── */}
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
