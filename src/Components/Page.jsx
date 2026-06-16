import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../CSS/Page.css";

const Page = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalMachines: 0,
    totalWorkers: 0,
    totalStock: 0,
  });

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(
          "/dashboard/dashboards"
        );

        // Adjust mapping based on API response
        if (res.status === 200 && res.data) {
          const data = res.data.data || res.data;

          setDashboardData({
            totalProducts: data.total_products || 0,
            totalMachines: data.total_machines || 0,
            totalWorkers: data.total_workers || 0,
            totalStock: data.total_stock_quantity || data.total_stock || 0,
          });
        }
      } catch (err) {
        console.error("Dashboard API Error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>
          Real-time inventory overview —{" "}
          <span className="company">SHREE AANDAVAR TOOLING</span>
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-container">
        <div className="stat-card red">
          <div className="stat-icon"><i className="fa fa-box"></i></div>
          <h2>{dashboardData.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><i className="fa fa-cogs"></i></div>
          <h2>{dashboardData.totalMachines}</h2>
          <p>Total Machines</p>
        </div>

        <div className="stat-card green">
          <div className="stat-icon"><i className="fa fa-users"></i></div>
          <h2>{dashboardData.totalWorkers}</h2>
          <p>Total Workers</p>
        </div>

        <div className="stat-card yellow">
          <div className="stat-icon"><i className="fa fa-warehouse"></i></div>
          <h2>{dashboardData.totalStock}</h2>
          <p>Total Stock Qty</p>
        </div>
      </div>

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="dashboard-grid">

        {/* LEFT SIDE */}
        <div className="left-section">

          {/* STOCK ALERTS */}
          <div className="card large-card">
            <h3><i className="fa fa-exclamation-triangle"></i> Stock Alerts</h3>
            <div className="healthy">
              <i className="fa fa-check-circle"></i> All stock levels are healthy
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">

          {/* QUICK ACTIONS */}
          <div className="card">
            <h3>Quick Actions</h3>

            <button
              className="outline-btn"
              onClick={() => navigate("/dashboard/lineout")}
            >
              <i className="fa fa-arrow-right"></i> Issue Material
            </button>

            <button
              className="outline-btn"
              onClick={() => navigate("/dashboard/returns")}
            >
              <i className="fa fa-undo"></i> Record Return
            </button>

            <button
              className="outline-btn"
              onClick={() => navigate("/dashboard/CurrentStock")}
            >
              <i className="fa fa-box"></i> View Stock
            </button>

            <button
              className="outline-btn"
              onClick={() => navigate("/dashboard/Reports")}
            >
              <i className="fa fa-chart-bar"></i> View Reports
            </button>
          </div>

          {/* STOCK FORMULA */}
          <div className="card">
            <h3>Stock Formula</h3>
            <p><strong>Current Stock</strong> is calculated as:</p>

            <div className="formula-box">
              <p>Current Stock Calculations</p>
              <p>+ Line Returns</p>
              <p>- Line Feed Out</p>
              <br />
              <p>= Current Stock</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
