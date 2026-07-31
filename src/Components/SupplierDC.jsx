import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../CSS/SupplierDC.css";

const EMPTY = {
  item_name:        "",
  uom:              "",
  name:             "",
  qty:              "",
  supplier_name:    "",
  supplier_dc_no:   "",
  supplier_dc_date: "",
  dc_entry_date:    "",
};

function SupplierDC() {
  const [form,     setForm]     = useState(EMPTY);
  const [entries,  setEntries]  = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  /* inline edit — only the row id and whichever cells the user touches */
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchAll(); }, []);

  /* ── GET /supplierdc/getSupplierDCs ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/supplierdc/getSupplierDCs");
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

  /* ── POST /supplierdc/createSupplierDC ── */
  const handleAdd = async () => {
    /* no mandatory validation — just skip totally empty submits */
    const hasAny = Object.values(form).some((v) => String(v).trim() !== "");
    if (!hasAny) {
      alert("Please fill at least one field.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/supplierdc/createSupplierDC", form);
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

  /* ── start inline edit — populate only the values from this row ── */
  const startEdit = (row) => {
    setEditId(row.id);
    setEditForm({
      id:               row.id,
      item_name:        row.item_name        ?? "",
      uom:              row.uom              ?? "",
      name:             row.name             ?? "",
      qty:              row.qty              ?? "",
      supplier_name:    row.supplier_name    ?? "",
      supplier_dc_no:   row.supplier_dc_no   ?? "",
      supplier_dc_date: (row.supplier_dc_date ?? "").split("T")[0],
      dc_entry_date:    (row.dc_entry_date    ?? "").split("T")[0],
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  /* ── POST /supplierdc/updateSupplierDC  — send only changed fields + id ── */
  const handleUpdate = async () => {
    setSaving(true);
    try {
      /* send full editForm; backend ignores blank fields if needed */
      const res = await api.post("/supplierdc/updateSupplierDC", editForm);
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

  /* ── POST /supplierdc/deleteSupplierDC  — send { id } ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const res = await api.post("/supplierdc/deleteSupplierDC", { id });
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
    <div className="sdc-page">
      <Sidebar />
      <Topbar />

      <div className="sdc-header">
        <h1>Supplier DC</h1>
        <p>Supplier Transaction — Delivery Challan Entry</p>
      </div>

      {/* ══════ FORM CARD ══════ */}
      <div className="sdc-card">
        <h2 className="sdc-card-title">New Entry</h2>

        <div className="sdc-grid">
          <div className="sdc-field">
            <label>Item Name</label>
            <input name="item_name" value={form.item_name}
              onChange={handleChange} placeholder="Enter item name" />
          </div>

          <div className="sdc-field">
            <label>UOM</label>
            <input name="uom" value={form.uom}
              onChange={handleChange} placeholder="e.g. Nos, Kg, Mtr" />
          </div>

          <div className="sdc-field">
            <label>Name</label>
            <input name="name" value={form.name}
              onChange={handleChange} placeholder="Enter name" />
          </div>

          <div className="sdc-field">
            <label>Qty</label>
            <input name="qty" type="number" min="0" value={form.qty}
              onChange={handleChange} placeholder="Enter quantity" />
          </div>

          <div className="sdc-field">
            <label>Supplier Name</label>
            <input name="supplier_name" value={form.supplier_name}
              onChange={handleChange} placeholder="Enter supplier name" />
          </div>

          <div className="sdc-field">
            <label>Supplier DC No</label>
            <input name="supplier_dc_no" value={form.supplier_dc_no}
              onChange={handleChange} placeholder="Enter DC number" />
          </div>

          <div className="sdc-field">
            <label>Supplier DC Date</label>
            <input name="supplier_dc_date" type="date"
              value={form.supplier_dc_date} onChange={handleChange} />
          </div>

          <div className="sdc-field">
            <label>DC Entry Date</label>
            <input name="dc_entry_date" type="date"
              value={form.dc_entry_date} onChange={handleChange} />
          </div>
        </div>

        <div className="sdc-actions">
          <button className="sdc-btn sdc-btn--add"
            onClick={handleAdd} disabled={saving}>
            {saving ? "Saving…" : "+ Add Entry"}
          </button>
          <button className="sdc-btn sdc-btn--clear"
            onClick={() => setForm(EMPTY)} disabled={saving}>
            Clear
          </button>
        </div>
      </div>

      {/* ══════ GRID CARD ══════ */}
      <div className="sdc-card">
        <div className="sdc-card-title-row">
          <h2 className="sdc-card-title">
            Entries
            {entries.length > 0 && (
              <span className="sdc-count">{entries.length}</span>
            )}
          </h2>
          <button className="sdc-btn sdc-btn--refresh" onClick={fetchAll}>
            ↻ Refresh
          </button>
        </div>

        <div className="sdc-table-wrap">
          <table className="sdc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>UOM</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Supplier Name</th>
                <th>Supplier DC No</th>
                <th>Supplier DC Date</th>
                <th>DC Entry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="sdc-empty">Loading…</td></tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="sdc-empty">
                    No entries yet. Fill the form above and click Add Entry.
                  </td>
                </tr>
              ) : (
                entries.map((row, i) =>
                  editId === row.id ? (
                    /* ── inline edit row — edit any cell you want ── */
                    <tr key={row.id} className="sdc-edit-row">
                      <td>{i + 1}</td>
                      <td>
                        <input className="sdc-inline" name="item_name"
                          value={editForm.item_name} onChange={handleEditChange}
                          placeholder="Item name" />
                      </td>
                      <td>
                        <input className="sdc-inline sdc-inline--sm" name="uom"
                          value={editForm.uom} onChange={handleEditChange}
                          placeholder="UOM" />
                      </td>
                      <td>
                        <input className="sdc-inline" name="name"
                          value={editForm.name} onChange={handleEditChange}
                          placeholder="Name" />
                      </td>
                      <td>
                        <input className="sdc-inline sdc-inline--sm" name="qty"
                          type="number" value={editForm.qty}
                          onChange={handleEditChange} placeholder="Qty" />
                      </td>
                      <td>
                        <input className="sdc-inline" name="supplier_name"
                          value={editForm.supplier_name} onChange={handleEditChange}
                          placeholder="Supplier name" />
                      </td>
                      <td>
                        <input className="sdc-inline" name="supplier_dc_no"
                          value={editForm.supplier_dc_no} onChange={handleEditChange}
                          placeholder="DC No" />
                      </td>
                      <td>
                        <input className="sdc-inline sdc-inline--date"
                          name="supplier_dc_date" type="date"
                          value={editForm.supplier_dc_date}
                          onChange={handleEditChange} />
                      </td>
                      <td>
                        <input className="sdc-inline sdc-inline--date"
                          name="dc_entry_date" type="date"
                          value={editForm.dc_entry_date}
                          onChange={handleEditChange} />
                      </td>
                      <td className="sdc-action-cell">
                        <button className="sdc-save-btn"
                          onClick={handleUpdate} disabled={saving}>
                          {saving ? "…" : "Save"}
                        </button>
                        <button className="sdc-cancel-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    /* ── normal display row ── */
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>{row.item_name || "-"}</td>
                      <td>{row.uom || "-"}</td>
                      <td>{row.name || "-"}</td>
                      <td>{row.qty ?? "-"}</td>
                      <td>{row.supplier_name || "-"}</td>
                      <td>{row.supplier_dc_no || "-"}</td>
                      <td>{fmtDate(row.supplier_dc_date)}</td>
                      <td>{fmtDate(row.dc_entry_date)}</td>
                      <td className="sdc-action-cell">
                        <button className="sdc-edit-btn"
                          onClick={() => startEdit(row)}>
                          Edit
                        </button>
                        <button className="sdc-del-btn"
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

export default SupplierDC;
