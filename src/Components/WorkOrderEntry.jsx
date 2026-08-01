import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../CSS/WorkOrderEntry.css";

const EMPTY = {
  wo_no:          "",
  wo_date:        "",
  wo_total_hours: "",
  item_name:      "",
  item_qty:       "",
  worker_name:    "",
  wo_start_time:  "",
  wo_end_time:    "",
  idle_hours:     "",
  description:    "",
};

function WorkOrderEntry() {
  const [form,     setForm]     = useState(EMPTY);
  const [entries,  setEntries]  = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  /* inline edit */
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchAll(); }, []);

  /* ── GET ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/workorder/getWorkOrders");
      if (res.data.status === 1) setEntries(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleEditChange = (e) =>
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const fmtDate = (d) => {
    if (!d) return "-";
    const part = String(d).split("T")[0];
    const [y, m, day] = part.split("-");
    return `${day}-${m}-${y}`;
  };

  /* ── CREATE ── */
  const handleAdd = async () => {
    const hasAny = Object.values(form).some((v) => String(v).trim() !== "");
    if (!hasAny) { alert("Please fill at least one field."); return; }
    setSaving(true);
    try {
      const res = await api.post("/workorder/createWorkOrder", form);
      if (res.data.status === 1) {
        await fetchAll();
        setForm(EMPTY);
      } else {
        alert(res.data.message || "Failed to save.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── START EDIT ── */
  const startEdit = (row) => {
    setEditId(row.id);
    setEditForm({
      id:             row.id,
      wo_no:          row.wo_no          ?? "",
      wo_date:        (row.wo_date       ?? "").split("T")[0],
      wo_total_hours: row.wo_total_hours ?? "",
      item_name:      row.item_name      ?? "",
      item_qty:       row.item_qty       ?? "",
      worker_name:    row.worker_name    ?? "",
      wo_start_time:  row.wo_start_time  ?? "",
      wo_end_time:    row.wo_end_time    ?? "",
      idle_hours:     row.idle_hours     ?? "",
      description:    row.description    ?? "",
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  /* ── UPDATE ── */
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await api.post("/workorder/updateWorkOrder", editForm);
      if (res.data.status === 1) {
        await fetchAll();
        cancelEdit();
      } else {
        alert(res.data.message || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this work order?")) return;
    try {
      const res = await api.post("/workorder/deleteWorkOrder", { id });
      if (res.data.status === 1) {
        setEntries((p) => p.filter((r) => r.id !== id));
      } else {
        alert(res.data.message || "Delete failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="wo-page">
      <Sidebar />
      <Topbar />

      {/* ── Header ── */}
      <div className="wo-header">
        <h1>Work Order</h1>
        <p>Create and manage work order entries</p>
      </div>

      {/* ══════ FORM CARD ══════ */}
      <div className="wo-card">
        <h2 className="wo-card-title">New Work Order</h2>

        <div className="wo-grid">

          {/* WO No */}
          <div className="wo-field">
            <label>WO No</label>
            <input name="wo_no" value={form.wo_no}
              onChange={handleChange} placeholder="e.g. WO-2024-001" />
          </div>

          {/* WO Date */}
          <div className="wo-field">
            <label>WO Date</label>
            <input name="wo_date" type="date"
              value={form.wo_date} onChange={handleChange} />
          </div>

          {/* WO Total Hours */}
          <div className="wo-field">
            <label>WO Total Hours</label>
            <input name="wo_total_hours" type="number" min="0" step="0.5"
              value={form.wo_total_hours} onChange={handleChange}
              placeholder="e.g. 8" />
          </div>

          {/* Item Name */}
          <div className="wo-field">
            <label>Item Name</label>
            <input name="item_name" value={form.item_name}
              onChange={handleChange} placeholder="Enter item name" />
          </div>

          {/* Item Qty */}
          <div className="wo-field">
            <label>Item Qty</label>
            <input name="item_qty" type="number" min="0"
              value={form.item_qty} onChange={handleChange}
              placeholder="Enter quantity" />
          </div>

          {/* Worker Name */}
          <div className="wo-field">
            <label>Worker Name</label>
            <input name="worker_name" value={form.worker_name}
              onChange={handleChange} placeholder="Enter worker name" />
          </div>

          {/* WO Start Time */}
          <div className="wo-field">
            <label>WO Start Time</label>
            <input name="wo_start_time" type="time"
              value={form.wo_start_time} onChange={handleChange} />
          </div>

          {/* WO End Time */}
          <div className="wo-field">
            <label>WO End Time</label>
            <input name="wo_end_time" type="time"
              value={form.wo_end_time} onChange={handleChange} />
          </div>

          {/* Idle Hours */}
          <div className="wo-field">
            <label>Idle Hours</label>
            <input name="idle_hours" type="number" min="0" step="0.5"
              value={form.idle_hours} onChange={handleChange}
              placeholder="e.g. 1.5" />
          </div>

          {/* Description — full width */}
          <div className="wo-field wo-field--full">
            <label>Description</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} placeholder="Enter description (optional)"
              rows={3} />
          </div>

        </div>

        <div className="wo-actions">
          <button className="wo-btn wo-btn--add"
            onClick={handleAdd} disabled={saving}>
            {saving ? "Saving…" : "+ Add Work Order"}
          </button>
          <button className="wo-btn wo-btn--clear"
            onClick={() => setForm(EMPTY)} disabled={saving}>
            Clear
          </button>
        </div>
      </div>

      {/* ══════ GRID CARD ══════ */}
      <div className="wo-card">
        <div className="wo-card-title-row">
          <h2 className="wo-card-title">
            Work Orders
            {entries.length > 0 && (
              <span className="wo-count">{entries.length}</span>
            )}
          </h2>
          <button className="wo-btn wo-btn--refresh" onClick={fetchAll}>
            ↻ Refresh
          </button>
        </div>

        <div className="wo-table-wrap">
          <table className="wo-table">
            <thead>
              <tr>
                <th>#</th>
                <th>WO No</th>
                <th>WO Date</th>
                <th>Total Hrs</th>
                <th>Item Name</th>
                <th>Item Qty</th>
                <th>Worker Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Idle Hrs</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} className="wo-empty">Loading…</td></tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={12} className="wo-empty">
                    No work orders yet. Fill the form above and click Add Work Order.
                  </td>
                </tr>
              ) : (
                entries.map((row, i) =>
                  editId === row.id ? (
                    /* ── inline edit row ── */
                    <tr key={row.id} className="wo-edit-row">
                      <td>{i + 1}</td>
                      <td>
                        <input className="wo-inline" name="wo_no"
                          value={editForm.wo_no} onChange={handleEditChange}
                          placeholder="WO No" />
                      </td>
                      <td>
                        <input className="wo-inline wo-inline--date" name="wo_date"
                          type="date" value={editForm.wo_date}
                          onChange={handleEditChange} />
                      </td>
                      <td>
                        <input className="wo-inline wo-inline--sm" name="wo_total_hours"
                          type="number" value={editForm.wo_total_hours}
                          onChange={handleEditChange} placeholder="Hrs" />
                      </td>
                      <td>
                        <input className="wo-inline" name="item_name"
                          value={editForm.item_name} onChange={handleEditChange}
                          placeholder="Item name" />
                      </td>
                      <td>
                        <input className="wo-inline wo-inline--sm" name="item_qty"
                          type="number" value={editForm.item_qty}
                          onChange={handleEditChange} placeholder="Qty" />
                      </td>
                      <td>
                        <input className="wo-inline" name="worker_name"
                          value={editForm.worker_name} onChange={handleEditChange}
                          placeholder="Worker" />
                      </td>
                      <td>
                        <input className="wo-inline wo-inline--time" name="wo_start_time"
                          type="time" value={editForm.wo_start_time}
                          onChange={handleEditChange} />
                      </td>
                      <td>
                        <input className="wo-inline wo-inline--time" name="wo_end_time"
                          type="time" value={editForm.wo_end_time}
                          onChange={handleEditChange} />
                      </td>
                      <td>
                        <input className="wo-inline wo-inline--sm" name="idle_hours"
                          type="number" value={editForm.idle_hours}
                          onChange={handleEditChange} placeholder="Idle" />
                      </td>
                      <td>
                        <input className="wo-inline" name="description"
                          value={editForm.description} onChange={handleEditChange}
                          placeholder="Description" />
                      </td>
                      <td className="wo-action-cell">
                        <button className="wo-save-btn"
                          onClick={handleUpdate} disabled={saving}>
                          {saving ? "…" : "Save"}
                        </button>
                        <button className="wo-cancel-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    /* ── display row ── */
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>{row.wo_no || "-"}</td>
                      <td>{fmtDate(row.wo_date)}</td>
                      <td>{row.wo_total_hours ?? "-"}</td>
                      <td>{row.item_name || "-"}</td>
                      <td>{row.item_qty ?? "-"}</td>
                      <td>{row.worker_name || "-"}</td>
                      <td>{row.wo_start_time || "-"}</td>
                      <td>{row.wo_end_time || "-"}</td>
                      <td>{row.idle_hours ?? "-"}</td>
                      <td className="wo-desc">{row.description || "-"}</td>
                      <td className="wo-action-cell">
                        <button className="wo-edit-btn"
                          onClick={() => startEdit(row)}>
                          Edit
                        </button>
                        <button className="wo-del-btn"
                          onClick={() => handleDelete(row.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
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
