import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import "../CSS/Page.css";

/* ── Pie custom label ── */
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ── Custom Tooltip for bar chart ── */
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e2430", color: "#fff", padding: "8px 14px",
      borderRadius: 8, fontSize: 13 }}>
      <p style={{ margin: 0, fontWeight: 700 }}>{label}</p>
      <p style={{ margin: "2px 0 0", color: "#fbbf24" }}>{payload[0].value}</p>
    </div>
  );
};

const Page = () => {
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/dashboards")
      .then((res) => { if (res.data.status === 1) setData(res.data.data); })
      .catch((err) => console.error("Dashboard API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const n = (v) => parseFloat(v) || 0;
  const fmt = (v) => v == null ? "—" : (Number(v) % 1 === 0 ? Number(v) : parseFloat(v).toFixed(2));

  /* ── stat card config ── */
  const CARDS = [
    { key: "total_products",      label: "Total Products",  icon: "fa fa-box",         color: "#d60000", bg: "#fff5f5", nav: "/dashboard/products"      },
    { key: "total_tools",         label: "Total Tools",     icon: "fa fa-wrench",      color: "#b45309", bg: "#fffbeb", nav: "/dashboard/ToolMaster"     },
    { key: "total_machines",      label: "Total Machines",  icon: "fa fa-cogs",        color: "#1d4ed8", bg: "#eff6ff", nav: "/dashboard/machines"        },
    { key: "total_tool_stock",    label: "Tool Stock",      icon: "fa fa-layer-group", color: "#0f766e", bg: "#f0fdfa", nav: "/dashboard/Toolstack"       },
    { key: "total_current_stock", label: "Current Stock",   icon: "fa fa-warehouse",   color: "#7c3aed", bg: "#faf5ff", nav: "/dashboard/CurrentStock"    },
  ];

  /* ── bar chart data ── */
  const BAR_COLORS = ["#d60000", "#b45309", "#1d4ed8", "#0f766e", "#7c3aed"];
  const barData = data
    ? CARDS.map((c, i) => ({ name: c.label, value: n(data[c.key]), color: BAR_COLORS[i] }))
    : [];

  /* ── pie chart data ── */
  const PIE_COLORS = ["#d60000", "#b45309", "#1d4ed8", "#0f766e", "#7c3aed"];
  const pieData = data
    ? [
        { name: "Products",      value: n(data.total_products)      },
        { name: "Tools",         value: n(data.total_tools)         },
        { name: "Machines",      value: n(data.total_machines)      },
        { name: "Tool Stock",    value: n(data.total_tool_stock)    },
        { name: "Current Stock", value: n(data.total_current_stock) },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="dashboard-page">

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Real-time overview — <button type="button" className="company company-link" onClick={() => window.open(new URL("/dashboard", window.location.href).href, "_blank", "noopener,noreferrer")} aria-label="Open SHREE AANDAVAR TOOLING dashboard in a new tab" title="Open dashboard in a new tab">SHREE AANDAVAR TOOLING <span aria-hidden="true" className="company-link-indicator">↗</span></button></p>
        </div>
        <button className="db-refresh-btn" onClick={() => window.location.reload()}>
          <i className="fa fa-sync-alt"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="db-loading">Loading dashboard…</div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div className="stats-container">
            {CARDS.map((card) => (
              <div key={card.key} className="stat-card"
                style={{ borderTop: `4px solid ${card.color}` }}
                onClick={() => navigate(card.nav)}>
                <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                  <i className={card.icon}></i>
                </div>
                <div className="stat-info">
                  <h2 style={{ color: card.color }}>{fmt(data?.[card.key])}</h2>
                  <p>{card.label}</p>
                </div>
                <i className="fa fa-chevron-right stat-arrow" style={{ color: card.color }}></i>
              </div>
            ))}
          </div>

          {/* ── Charts row ── */}
          <div className="charts-row">

            {/* Bar Chart */}
            <div className="card chart-card">
              <h3><i className="fa fa-chart-bar"></i> Inventory Overview</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
                  barSize={38}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#555" }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#555" }} axisLine={false}
                    tickLine={false} width={40} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="card chart-card">
              <h3><i className="fa fa-chart-pie"></i> Stock Distribution</h3>
              {pieData.length === 0 ? (
                <div className="db-loading">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [fmt(value), name]}
                      contentStyle={{ borderRadius: 8, fontSize: 12,
                        border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Bottom grid ── */}
          <div className="dashboard-grid">

            {/* Quick Actions */}
            <div className="card">
              <h3><i className="fa fa-bolt"></i> Quick Actions</h3>
              <div className="quick-actions-grid">
                {[
                  { icon: "fa fa-arrow-right", label: "Line Out",        nav: "/dashboard/lineout"         },
                  { icon: "fa fa-undo",         label: "Line Return",     nav: "/dashboard/returns"         },
                  { icon: "fa fa-box",          label: "Current Stock",   nav: "/dashboard/CurrentStock"    },
                  { icon: "fa fa-chart-bar",    label: "Reports",         nav: "/dashboard/Reports"         },
                  { icon: "fa fa-truck",        label: "Delivery Challan",nav: "/dashboard/DeliveryChallan" },
                  { icon: "fa fa-history",      label: "Invoice History", nav: "/dashboard/InvoiceHistory"  },
                ].map((a) => (
                  <button key={a.nav} className="outline-btn" onClick={() => navigate(a.nav)}>
                    <i className={a.icon}></i> {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock summary */}
            <div className="card">
              <h3><i className="fa fa-info-circle"></i> Stock Summary</h3>
              <div className="stock-summary">
                {CARDS.map((c) => (
                  <div key={c.key} className="stock-row">
                    <div className="stock-row-left">
                      <span className="stock-dot" style={{ background: c.color }}></span>
                      <span>{c.label}</span>
                    </div>
                    <span className="stock-val" style={{ color: c.color }}>
                      {fmt(data?.[c.key])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Page;
