import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

      {/* ===== MASTERS ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">MASTERS</div>}


        <div
          className={`menu-item ${isActive("/dashboard/products") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/products")}
        >
          <i className="fa fa-box"></i>
          {!collapsed && <span>Product Master</span>}
        </div>


         <div
          className={`menu-item ${isActive("/dashboard/ToolMaster") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/ToolMaster")}
        >
          <i className="fa fa-box"></i>
          {!collapsed && <span>Tool Master</span>}
        </div>


<div
          className={`menu-item ${isActive("/dashboard/InstrumentMaster") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/InstrumentMaster")}
        >
          <i className="fa fa-box"></i>
          {!collapsed && <span>Instrument Master</span>}
        </div>








        <div
        className={`menu-item ${isActive("/dashboard/uom") ? "active" : ""}`}
        onClick={() => navigate("/dashboard/uom")}
        >
          <i className="fa fa-box"></i>
          {!collapsed && <span>UOM   Master</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/categories") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/categories")}
        >
          <i className="fa fa-tag"></i>
          {!collapsed && <span>Category Master</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/machines") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/machines")}
        >
          <i className="fa fa-cogs"></i>
          {!collapsed && <span>Machine Master</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/workers") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/workers")}
        >
          <i className="fa fa-users"></i>
          {!collapsed && <span>Worker Master</span>}
        </div>

{/* 
        <div
          className={`menu-item ${isActive("/dashboard/salesproducts") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/salesproducts")}
        >
          <i className="fa fa-users"></i>
          {!collapsed && <span>Sales Product Master</span>}
        </div> */}

        

        <div
          className={`menu-item ${isActive("/dashboard/CustomerMaster") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/CustomerMaster")}
        >
          <i className="fa fa-users"></i>
          {!collapsed && <span>Customer Master</span>}
        </div>


      </div>

      {/* ===== TRANSACTIONS ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">TRANSACTIONS</div>}

        <div
          className={`menu-item ${isActive("/dashboard/lineout") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/lineout")}
        >
          <i className="fa fa-arrow-right"></i>
          {!collapsed && <span>Line Out</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/returns") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/returns")}
        >
          <i className="fa fa-undo"></i>
          {!collapsed && <span>Line Out History</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/SalesPage") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/SalesPage")}
        >
          <i className="fa fa-undo"></i>
          {!collapsed && <span>Sales Page</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/IGSTSalesPage") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/IGSTSalesPage")}
        >
          <i className="fa fa-undo"></i>
          {!collapsed && <span>IGST-Sales Page</span>}
        </div>

        <div
          className={`menu-item ${isActive("/dashboard/InvoiceHistory") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/InvoiceHistory")}
          >
          <i className="fa fa-warehouse"></i>
          {!collapsed && <span>Invoice History</span>}
        </div>
      </div>

      {/* ===== INVENTORY ===== */}
      <div className="menu-section">
        {!collapsed && <div className="menu-title">INVENTORY</div>}

        <div
          className={`menu-item ${isActive("/dashboard/InwardEntry") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/InwardEntry")}
        >
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Product Inward Entry</span>}
        </div>




          <div
          className={`menu-item ${isActive("/dashboard/ToolInwardEntry") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/ToolInwardEntry")}
        >
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Tool Inward Entry</span>}
        </div>




        <div
          className={`menu-item ${isActive("/dashboard/DeliveryChallan") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/DeliveryChallan")}
        >
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Delivery Challan</span>}
        </div>



       <div
          className={`menu-item ${isActive("/dashboard/DeliveryHistory") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/DeliveryHistory")}
        >
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Challan History</span>}
        </div>



        <div
          className={`menu-item ${isActive("/dashboard/Returndeliverychallan") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/Returndeliverychallan")}
        >
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Return Delivery Challan</span>}
        </div>







        <div
          className={`menu-item ${isActive("/dashboard/CurrentStock") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/CurrentStock")}
        >
          <i className="fa fa-warehouse"></i>
          {!collapsed && <span>Current Stock</span>}
        </div>





         <div
          className={`menu-item ${isActive("/dashboard/Toolstack") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/Toolstack")}
        >
          <i className="fa fa-warehouse"></i>
          {!collapsed && <span>Tool Stock</span>}
        </div>
          </div>




        <div
          className={`menu-item ${isActive("/dashboard/Reports") ? "active" : ""}`}
          onClick={() => navigate("/dashboard/Reports")}
        >
          <i className="fa fa-chart-bar"></i>
          {!collapsed && <span>Reports</span>}
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