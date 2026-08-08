import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../CSS/Page.css";

const Page = () => {
  const navigate = useNavigate();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch dashboard stats ── */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/dashboards");
        if (res.data.status === 1) setData(res.data.data);
      } catch (err) {
        console.error("Dashboard API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const fmt = (v) =>
    v == null ? "—" : Number(v) % 1 === 0 ? Number(v) : parseFloat(v).toFixed(2);

  /* ── Stat card config — matches API fields exactly ── */
  const CARDS = [
    {
      key:   "total_products",
      label: "Total Products",
      icon:  "fa fa-box",
      color: "#d60000",
      bg:    "#fff5f5",
      nav:   "/dashboard/products",
    },
    {
      key:   "total_tools",
      label: "Total Tools",
      icon:  "fa fa-wrench",
      color: "#b45309",
      bg:    "#fffbeb",
      nav:   "/dashboard/ToolMaster",
    },
    {
      key:   "total_machines",
      label: "Total Machines",
      icon:  "fa fa-cogs",
      color: "#1d4ed8",
      bg:    "#eff6ff",
      nav:   "/dashboard/machines",
    },
    {
      key:   "total_tool_stock",
      label: "Tool Stock",
      icon:  "fa fa-layer-group",
      color: "#0f766e",
      bg:    "#f0fdfa",
      nav:   "/dashboard/Toolstack",
    },
    {
      key:   "total_current_stock",
      label: "Current Stock",
      icon:  "fa fa-warehouse",
      color: "#7c3aed",
      bg:    "#faf5ff",
      nav:   "/dashboard/CurrentStock",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Real-time overview —{" "}
            <span className="company">SHREE AANDAVAR TOOLING</span>
          </p>
        </div>
        <button
          className="db-refresh-btn"
          onClick={() => window.location.reload()}
          title="Refresh"
        >
          <i className="fa fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="db-loading">Loading dashboard…</div>
      ) : (
        <div className="stats-container">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className="stat-card"
              style={{ borderTop: `4px solid ${card.color}` }}
              onClick={() => navigate(card.nav)}
            >
              <div
                className="stat-icon"
                style={{ background: card.bg, color: card.color }}
              >
                <i className={card.icon}></i>
              </div>
              <div className="stat-info">
                <h2 style={{ color: card.color }}>
                  {data ? fmt(data[card.key]) : "—"}
                </h2>
                <p>{card.label}</p>
              </div>
              <i className="fa fa-chevron-right stat-arrow" style={{ color: card.color }}></i>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom grid ── */}
      <div className="dashboard-grid">

        {/* Quick Actions */}
        <div className="card">
          <h3><i className="fa fa-bolt"></i> Quick Actions</h3>
          <div className="quick-actions-grid">
            {[
              { icon: "fa fa-arrow-right", label: "Line Out",       nav: "/dashboard/lineout"        },
              { icon: "fa fa-undo",        label: "Line Return",     nav: "/dashboard/returns"        },
              { icon: "fa fa-box",         label: "Current Stock",   nav: "/dashboard/CurrentStock"   },
              { icon: "fa fa-chart-bar",   label: "Reports",         nav: "/dashboard/Reports"        },
              { icon: "fa fa-truck",       label: "Delivery Challan",nav: "/dashboard/DeliveryChallan"},
              { icon: "fa fa-history",     label: "Invoice History", nav: "/dashboard/InvoiceHistory" },
            ].map((a) => (
              <button
                key={a.nav}
                className="outline-btn"
                onClick={() => navigate(a.nav)}
              >
                <i className={a.icon}></i> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stock formula */}
        <div className="card">
          <h3><i className="fa fa-info-circle"></i> Stock Formula</h3>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>
            Current stock is calculated as:
          </p>
          <div className="formula-box">
            <div className="formula-row">
              <span className="formula-label">Opening Stock</span>
              <span className="formula-op">+</span>
            </div>
            <div className="formula-row">
              <span className="formula-label">Inward Entry</span>
              <span className="formula-op">+</span>
            </div>
            <div className="formula-row">
              <span className="formula-label">Line Returns</span>
              <span className="formula-op">−</span>
            </div>
            <div className="formula-row">
              <span className="formula-label">Line Out</span>
              <span className="formula-op">=</span>
            </div>
            <div className="formula-row formula-result">
              <span className="formula-label">Current Stock</span>
            </div>
          </div>

          <div className="stock-summary">
            <div className="stock-row">
              <span>Tool Stock</span>
              <span className="stock-val">
                {data ? fmt(data.total_tool_stock) : "—"}
              </span>
            </div>
            <div className="stock-row">
              <span>Current Stock</span>
              <span className="stock-val">
                {data ? fmt(data.total_current_stock) : "—"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
