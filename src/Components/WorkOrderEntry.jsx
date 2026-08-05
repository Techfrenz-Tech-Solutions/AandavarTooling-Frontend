import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../CSS/WorkOrderEntry.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_OPTIONS = ["Not Yet Started", "Partially Complete", "Completed"];

const EMPTY = {
  wo_no: "", wo_date: "", item_name: "", item_qty: "",
  worker_name: "", wo_start_time: "", wo_end_time: "",
  wo_total_hours: "", idle_hours: "", description: "",
  status: "Not Yet Started",
};

function WorkOrderEntry() {
  const [form,     setForm]     = useState(EMPTY);
  const [entries,  setEntries]  = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  /* ── filter state ── */
  const [fWorker,  setFWorker]  = useState("");
  const [fDateFrom,setFDateFrom]= useState("");
  const [fDateTo,  setFDateTo]  = useState("");

  useEffect(() => { fetchAll(); }, []);

  /* ── GET ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/newworkorder/getNewWorkOrders");
      if (res.data.status === 1) setEntries(res.data.data || []);
    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  };

  const handleChange     = (e) => setForm(     (p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleEditChange = (e) => setEditForm( (p) => ({ ...p, [e.target.name]: e.target.value }));

  const fmtDate = (d) => {
    if (!d) return "-";
    const [y, m, day] = String(d).split("T")[0].split("-");
    return `${day}-${m}-${y}`;
  };

  /* ── filtered rows ── */
  const filtered = entries.filter((r) => {
    const wn = (r.worker_name || "").toLowerCase();
    if (!wn.includes(fWorker.toLowerCase())) return false;
    if (fDateFrom || fDateTo) {
      const d = String(r.wo_date || "").split("T")[0];
      if (fDateFrom && d < fDateFrom) return false;
      if (fDateTo   && d > fDateTo)   return false;
    }
    return true;
  });

  const clearFilters = () => { setFWorker(""); setFDateFrom(""); setFDateTo(""); };

  /* ── CREATE ── */
  const handleAdd = async () => {
    const req = ["wo_no", "wo_date", "item_name", "item_qty", "worker_name"];
    const missing = req.filter((k) => !String(form[k]).trim());
    if (missing.length) { alert(`Required: ${missing.join(", ")}`); return; }
    setSaving(true);
    try {
      const res = await api.post("/newworkorder/createNewWorkOrder", form);
      if (res.data.status === 1) { await fetchAll(); setForm(EMPTY); }
      else alert(res.data.message || "Failed to save.");
    } catch { alert("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── EDIT ── */
  const startEdit = (row) => {
    setEditId(row.wo_id);
    setEditForm({
      wo_id:          row.wo_id,
      wo_no:          row.wo_no          ?? "",
      wo_date:        (row.wo_date       ?? "").split("T")[0],
      item_name:      row.item_name      ?? "",
      item_qty:       row.item_qty       ?? "",
      worker_name:    row.worker_name    ?? "",
      wo_start_time:  row.wo_start_time  ?? "",
      wo_end_time:    row.wo_end_time    ?? "",
      wo_total_hours: row.wo_total_hours ?? "",
      idle_hours:     row.idle_hours     ?? "",
      description:    row.description    ?? "",
      status:         row.status         ?? "Not Yet Started",
    });
  };
  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  /* ── UPDATE ── */
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await api.post("/newworkorder/updateNewWorkOrder", editForm);
      if (res.data.status === 1) { await fetchAll(); cancelEdit(); }
      else alert(res.data.message || "Update failed.");
    } catch { alert("Update failed. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── DELETE ── */
  const handleDelete = async (wo_id) => {
    if (!window.confirm("Delete this work order?")) return;
    try {
      const res = await api.post("/newworkorder/deleteNewWorkOrder", { wo_id });
      if (res.data.status === 1) setEntries((p) => p.filter((r) => r.wo_id !== wo_id));
      else alert(res.data.message || "Delete failed.");
    } catch { alert("Delete failed. Please try again."); }
  };

  /* ── PDF DOWNLOAD ── */
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Work Order Report", 14, 14);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    let subtitle = "SHREE AANDAVAR TOOLING";
    if (fWorker)   subtitle += `  |  Worker: ${fWorker}`;
    if (fDateFrom) subtitle += `  |  From: ${fDateFrom}`;
    if (fDateTo)   subtitle += `  |  To: ${fDateTo}`;
    doc.text(subtitle, 14, 20);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 25);

    const cols = [
      "#", "WO No", "WO Date", "Item Name", "Item Qty",
      "Worker Name", "Start Time", "End Time",
      "Total Hrs", "Idle Hrs", "Status", "Description",
    ];

    const rows = filtered.map((r, i) => [
      i + 1,
      r.wo_no          || "-",
      fmtDate(r.wo_date),
      r.item_name      || "-",
      r.item_qty       ?? "-",
      r.worker_name    || "-",
      r.wo_start_time  || "-",
      r.wo_end_time    || "-",
      r.wo_total_hours ?? "-",
      r.idle_hours     ?? "-",
      r.status         || "Not Yet Started",
      r.description    || "-",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [cols],
      body: rows,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 36, 48], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: { 11: { cellWidth: 30 } },
      margin: { left: 14, right: 14 },
    });

    const label = fWorker
      ? `WorkOrders_${fWorker.replace(/\s+/g, "_")}`
      : "WorkOrders_All";
    doc.save(`${label}.pdf`);
  };

  const statusClass = (s) => {
    if (s === "Completed")          return "wo-status wo-status--done";
    if (s === "Partially Complete") return "wo-status wo-status--partial";
    return "wo-status wo-status--pending";
  };

  return (
    <div className="wo-page">
      <Sidebar /><Topbar />

      <div className="wo-header">
        <h1>Work Order</h1>
        <p>Create and manage work order entries</p>
      </div>

      {/* ══ FORM ══ */}
      <div className="wo-card">
        <h2 className="wo-card-title">New Work Order</h2>
        <div className="wo-grid">
          <div className="wo-field"><label>WO No <span className="wo-req">*</span></label>
            <input name="wo_no" value={form.wo_no} onChange={handleChange} placeholder="e.g. WO-2024-001" /></div>
          <div className="wo-field"><label>WO Date <span className="wo-req">*</span></label>
            <input name="wo_date" type="date" value={form.wo_date} onChange={handleChange} /></div>
          <div className="wo-field"><label>Item Name <span className="wo-req">*</span></label>
            <input name="item_name" value={form.item_name} onChange={handleChange} placeholder="Enter item name" /></div>
          <div className="wo-field"><label>Item Qty <span className="wo-req">*</span></label>
            <input name="item_qty" type="number" min="0" step="0.01" value={form.item_qty} onChange={handleChange} placeholder="Enter quantity" /></div>
          <div className="wo-field"><label>Worker Name <span className="wo-req">*</span></label>
            <input name="worker_name" value={form.worker_name} onChange={handleChange} placeholder="Enter worker name" /></div>
          <div className="wo-field"><label>WO Start Time</label>
            <input name="wo_start_time" type="time" value={form.wo_start_time} onChange={handleChange} /></div>
          <div className="wo-field"><label>WO End Time</label>
            <input name="wo_end_time" type="time" value={form.wo_end_time} onChange={handleChange} /></div>
          <div className="wo-field"><label>WO Total Hours</label>
            <input name="wo_total_hours" type="number" min="0" step="0.01" value={form.wo_total_hours} onChange={handleChange} placeholder="e.g. 8" /></div>
          <div className="wo-field"><label>Idle Hours</label>
            <input name="idle_hours" type="number" min="0" step="0.01" value={form.idle_hours} onChange={handleChange} placeholder="e.g. 1.5" /></div>
          <div className="wo-field"><label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="wo-field wo-field--full"><label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter description (optional)" rows={3} /></div>
        </div>
        <div className="wo-actions">
          <button className="wo-btn wo-btn--add" onClick={handleAdd} disabled={saving}>{saving ? "Saving…" : "+ Add Work Order"}</button>
          <button className="wo-btn wo-btn--clear" onClick={() => setForm(EMPTY)} disabled={saving}>Clear</button>
        </div>
      </div>

      {/* ══ FILTER ══ */}
      <div className="wo-card">
        <h2 className="wo-card-title">Filter</h2>
        <div className="wo-filter-row">
          <div className="wo-field">
            <label>Worker Name</label>
            <input value={fWorker} onChange={(e) => setFWorker(e.target.value)} placeholder="Search worker…" />
          </div>
          <div className="wo-field">
            <label>WO Date From</label>
            <input type="date" value={fDateFrom} onChange={(e) => setFDateFrom(e.target.value)} />
          </div>
          <div className="wo-field">
            <label>WO Date To</label>
            <input type="date" value={fDateTo} onChange={(e) => setFDateTo(e.target.value)} />
          </div>
          <div className="wo-field wo-field--btn">
            <button className="wo-btn wo-btn--clear" onClick={clearFilters}>✕ Clear</button>
          </div>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="wo-card">
        <div className="wo-card-title-row">
          <h2 className="wo-card-title">
            Work Orders {filtered.length > 0 && <span className="wo-count">{filtered.length}</span>}
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="wo-btn wo-btn--pdf" onClick={handleDownloadPDF}
              disabled={filtered.length === 0}>
              ⬇ Download PDF
            </button>
            <button className="wo-btn wo-btn--refresh" onClick={fetchAll}>↻ Refresh</button>
          </div>
        </div>

        <div className="wo-table-wrap">
          <table className="wo-table">
            <thead><tr>
              <th>#</th><th>WO No</th><th>WO Date</th><th>Item Name</th><th>Item Qty</th>
              <th>Worker Name</th><th>Start Time</th><th>End Time</th>
              <th>Total Hrs</th><th>Idle Hrs</th><th>Status</th><th>Description</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={13} className="wo-empty">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={13} className="wo-empty">No work orders found.</td></tr>
              ) : filtered.map((row, i) =>
                editId === row.wo_id ? (
                  <tr key={row.wo_id} className="wo-edit-row">
                    <td>{i + 1}</td>
                    <td><input className="wo-inline" name="wo_no" value={editForm.wo_no} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline wo-inline--date" name="wo_date" type="date" value={editForm.wo_date} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline" name="item_name" value={editForm.item_name} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline wo-inline--sm" name="item_qty" type="number" value={editForm.item_qty} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline" name="worker_name" value={editForm.worker_name} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline wo-inline--time" name="wo_start_time" type="time" value={editForm.wo_start_time} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline wo-inline--time" name="wo_end_time" type="time" value={editForm.wo_end_time} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline wo-inline--sm" name="wo_total_hours" type="number" value={editForm.wo_total_hours} onChange={handleEditChange} /></td>
                    <td><input className="wo-inline wo-inline--sm" name="idle_hours" type="number" value={editForm.idle_hours} onChange={handleEditChange} /></td>
                    <td>
                      <select className="wo-inline wo-inline--select" name="status" value={editForm.status} onChange={handleEditChange}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td><input className="wo-inline" name="description" value={editForm.description} onChange={handleEditChange} /></td>
                    <td className="wo-action-cell">
                      <button className="wo-save-btn" onClick={handleUpdate} disabled={saving}>{saving ? "…" : "Save"}</button>
                      <button className="wo-cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.wo_id}>
                    <td>{i + 1}</td>
                    <td>{row.wo_no       || "-"}</td>
                    <td>{fmtDate(row.wo_date)}</td>
                    <td>{row.item_name   || "-"}</td>
                    <td>{row.item_qty    ?? "-"}</td>
                    <td>{row.worker_name || "-"}</td>
                    <td>{row.wo_start_time  || "-"}</td>
                    <td>{row.wo_end_time    || "-"}</td>
                    <td>{row.wo_total_hours ?? "-"}</td>
                    <td>{row.idle_hours     ?? "-"}</td>
                    <td><span className={statusClass(row.status)}>{row.status || "Not Yet Started"}</span></td>
                    <td className="wo-desc">{row.description || "-"}</td>
                    <td className="wo-action-cell">
                      <button className="wo-edit-btn" onClick={() => startEdit(row)}>Edit</button>
                      <button className="wo-del-btn" onClick={() => handleDelete(row.wo_id)}>Delete</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WorkOrderEntry;
