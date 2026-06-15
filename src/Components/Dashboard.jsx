import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="page-content">
          {/* Nested routes are rendered here via App.js route definitions */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

