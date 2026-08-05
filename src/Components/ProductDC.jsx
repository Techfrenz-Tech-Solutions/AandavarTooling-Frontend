import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../CSS/ProductDC.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EMPTY = {
  item_name: "", uom: "", name: "", qty: "",
  customer_name: "", customer_dc_no: "",
  customer_dc_date: "", dc_entry_date: "",
};

function ProductDC() {
  const [form,     setForm]     = useState(EMPTY);
  const [entries,  setEntries]  = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  /* ── filter state ── */
  const [fCustomer,  setFCustomer]  = useState("");
  const [fName,      setFName]      = useState("");
  const [fItemName,  setFItemName]  = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customerdc/getCustomerDCs");
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
    const cn = (r.customer_name || "").toLowerCase();
    const nm = (r.name          || "").toLowerCase();
    const it = (r.item_name     || "").toLowerCase();
    return (
      cn.includes(fCustomer.toLowerCase()) &&
      nm.includes(fName.toLowerCase())     &&
      it.includes(fItemName.toLowerCase())
    );
  });

  const clearFilters = () => { setFCustomer(""); setFName(""); setFItemName(""); };

  /* ── CREATE ── */
  const handleAdd = async () => {
    if (!Object.values(form).some((v) => String(v).trim())) {
      alert("Please fill at least one field."); return;
    }
    setSaving(true);
    try {
      const res = await api.post("/customerdc/createCustomerDC", form);
      if (res.data.status === 1) { await fetchAll(); setForm(EMPTY); }
      else alert(res.data.message || "Failed to save.");
    } catch { alert("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── EDIT ── */
  const startEdit = (row) => {
    setEditId(row.id);
    setEditForm({
      id: row.id,
      item_name:        row.item_name        ?? "",
      uom:              row.uom              ?? "",
      name:             row.name             ?? "",
      qty:              row.qty              ?? "",
      customer_name:    row.customer_name    ?? "",
      customer_dc_no:   row.customer_dc_no   ?? "",
      customer_dc_date: (row.customer_dc_date ?? "").split("T")[0],
      dc_entry_date:    (row.dc_entry_date    ?? "").split("T")[0],
    });
  };
  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  /* ── UPDATE ── */
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await api.post("/customerdc/updateCustomerDC", editForm);
      if (res.data.status === 1) { await fetchAll(); cancelEdit(); }
      else alert(res.data.message || "Update failed.");
    } catch { alert("Update failed. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const res = await api.post("/customerdc/deleteCustomerDC", { id });
      if (res.data.status === 1) setEntries((p) => p.filter((r) => r.id !== id));
      else alert(res.data.message || "Delete failed.");
    } catch { alert("Delete failed. Please try again."); }
  };

  return (
    <div className="pdc-page">
      <Sidebar /><Topbar />

      <div className="pdc-header">
        <h1>Product DC</h1>
        <p>Customer Transaction — Customer Delivery Challan Entry</p>
      </div>

      {/* ══ FORM ══ */}
      <div className="pdc-card">
        <h2 className="pdc-card-title">New Entry</h2>
        <div className="pdc-grid">
          <div className="pdc-field"><label>Item Name</label>
            <input name="item_name" value={form.item_name} onChange={handleChange} placeholder="Enter item name" /></div>
          <div className="pdc-field"><label>UOM</label>
            <input name="uom" value={form.uom} onChange={handleChange} placeholder="e.g. Nos, Kg, Mtr" /></div>
          <div className="pdc-field"><label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter name" /></div>
          <div className="pdc-field"><label>Qty</label>
            <input name="qty" type="number" min="0" step="0.01" value={form.qty} onChange={handleChange} placeholder="Quantity" /></div>
          <div className="pdc-field"><label>Customer Name</label>
            <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Enter customer name" /></div>
          <div className="pdc-field"><label>Customer DC No</label>
            <input name="customer_dc_no" value={form.customer_dc_no} onChange={handleChange} placeholder="Enter DC number" /></div>
          <div className="pdc-field"><label>Customer DC Date</label>
            <input name="customer_dc_date" type="date" value={form.customer_dc_date} onChange={handleChange} /></div>
          <div className="pdc-field"><label>DC Entry Date</label>
            <input name="dc_entry_date" type="date" value={form.dc_entry_date} onChange={handleChange} /></div>
        </div>
        <div className="pdc-actions">
          <button className="pdc-btn pdc-btn--add" onClick={handleAdd} disabled={saving}>{saving ? "Saving…" : "+ Add Entry"}</button>
          <button className="pdc-btn pdc-btn--clear" onClick={() => setForm(EMPTY)} disabled={saving}>Clear</button>
        </div>
      </div>

      {/* ══ FILTER ══ */}
      <div className="pdc-card">
        <h2 className="pdc-card-title">Filter</h2>
        <div className="pdc-filter-row">
          <div className="pdc-field">
            <label>Customer Name</label>
            <input value={fCustomer} onChange={(e) => setFCustomer(e.target.value)} placeholder="Search customer…" />
          </div>
          <div className="pdc-field">
            <label>Name</label>
            <input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Search name…" />
          </div>
          <div className="pdc-field">
            <label>Item Name</label>
            <input value={fItemName} onChange={(e) => setFItemName(e.target.value)} placeholder="Search item…" />
          </div>
          <div className="pdc-field pdc-field--btn">
            <button className="pdc-btn pdc-btn--clear" onClick={clearFilters}>✕ Clear Filters</button>
          </div>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="pdc-card">
        <div className="pdc-card-title-row">
          <h2 className="pdc-card-title">
            Entries {filtered.length > 0 && <span className="pdc-count">{filtered.length}</span>}
          </h2>
          <button className="pdc-btn pdc-btn--refresh" onClick={fetchAll}>↻ Refresh</button>
        </div>

        <div className="pdc-table-wrap">
          <table className="pdc-table">
            <thead><tr>
              <th>#</th><th>Item Name</th><th>UOM</th><th>Name</th><th>Qty</th>
              <th>Customer Name</th><th>Customer DC No</th><th>Customer DC Date</th><th>DC Entry Date</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="pdc-empty">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="pdc-empty">No entries found.</td></tr>
              ) : filtered.map((row, i) =>
                editId === row.id ? (
                  <tr key={row.id} className="pdc-edit-row">
                    <td>{i + 1}</td>
                    <td><input className="pdc-inline" name="item_name" value={editForm.item_name} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline pdc-inline--sm" name="uom" value={editForm.uom} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline" name="name" value={editForm.name} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline pdc-inline--sm" name="qty" type="number" value={editForm.qty} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline" name="customer_name" value={editForm.customer_name} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline" name="customer_dc_no" value={editForm.customer_dc_no} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline pdc-inline--date" name="customer_dc_date" type="date" value={editForm.customer_dc_date} onChange={handleEditChange} /></td>
                    <td><input className="pdc-inline pdc-inline--date" name="dc_entry_date" type="date" value={editForm.dc_entry_date} onChange={handleEditChange} /></td>
                    <td className="pdc-action-cell">
                      <button className="pdc-save-btn" onClick={handleUpdate} disabled={saving}>{saving ? "…" : "Save"}</button>
                      <button className="pdc-cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>{row.item_name     || "-"}</td>
                    <td>{row.uom           || "-"}</td>
                    <td>{row.name          || "-"}</td>
                    <td>{row.qty           ?? "-"}</td>
                    <td>{row.customer_name  || "-"}</td>
                    <td>{row.customer_dc_no || "-"}</td>
                    <td>{fmtDate(row.customer_dc_date)}</td>
                    <td>{fmtDate(row.dc_entry_date)}</td>
                    <td className="pdc-action-cell">
                      <button className="pdc-edit-btn" onClick={() => startEdit(row)}>Edit</button>
                      <button className="pdc-del-btn" onClick={() => handleDelete(row.id)}>Delete</button>
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

export default ProductDC;
