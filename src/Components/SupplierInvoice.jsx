import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../CSS/SupplierInvoice.css";

const STATUS_OPTIONS = ["Pending", "Done"];

const EMPTY = {
  supplier_name:    "",
  supplier_inv_no:  "",
  supplier_inv_date: "",
  amount:           "",
  amount_paid_date: "",
  status:           "Pending",
};

function SupplierInvoice() {
  const [form,     setForm]     = useState(EMPTY);
  const [entries,  setEntries]  = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  /* ── filter ── */
  const [fSupplier, setFSupplier] = useState("");
  const [fStatus,   setFStatus]   = useState("");

  useEffect(() => { fetchAll(); }, []);

  /* ── GET /supplierinvoice/getSupplierInvoices ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/supplierinvoice/getSupplierInvoices");
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
    const sn = (r.supplier_name || "").toLowerCase();
    const st = (r.status        || "").toLowerCase();
    return (
      sn.includes(fSupplier.toLowerCase()) &&
      (fStatus === "" || st === fStatus.toLowerCase())
    );
  });

  const clearFilters = () => { setFSupplier(""); setFStatus(""); };

  /* ── CREATE ── */
  const handleAdd = async () => {
    if (!Object.values(form).some((v) => String(v).trim())) {
      alert("Please fill at least one field."); return;
    }
    setSaving(true);
    try {
      const res = await api.post("/supplierinvoice/createSupplierInvoice", form);
      if (res.data.status === 1) { await fetchAll(); setForm(EMPTY); }
      else alert(res.data.message || "Failed to save.");
    } catch { alert("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── EDIT ── */
  const startEdit = (row) => {
    setEditId(row.id);
    setEditForm({
      id:               row.id,
      supplier_name:    row.supplier_name    ?? "",
      supplier_inv_no:  row.supplier_inv_no  ?? "",
      supplier_inv_date:(row.supplier_inv_date ?? "").split("T")[0],
      amount:           row.amount           ?? "",
      amount_paid_date: (row.amount_paid_date ?? "").split("T")[0],
      status:           row.status           ?? "Pending",
    });
  };
  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  /* ── UPDATE ── */
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await api.post("/supplierinvoice/updateSupplierInvoice", editForm);
      if (res.data.status === 1) { await fetchAll(); cancelEdit(); }
      else alert(res.data.message || "Update failed.");
    } catch { alert("Update failed. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      const res = await api.post("/supplierinvoice/deleteSupplierInvoice", { id });
      if (res.data.status === 1) setEntries((p) => p.filter((r) => r.id !== id));
      else alert(res.data.message || "Delete failed.");
    } catch { alert("Delete failed. Please try again."); }
  };

  const statusClass = (s) =>
    s === "Done" ? "si-badge si-badge--done" : "si-badge si-badge--pending";

  return (
    <div className="si-page">
      <Sidebar /><Topbar />

      <div className="si-header">
        <h1>Supplier Invoice</h1>
        <p>Supplier Transaction — Invoice Tracking</p>
      </div>

      {/* ══ FORM ══ */}
      <div className="si-card">
        <h2 className="si-card-title">New Invoice</h2>
        <div className="si-grid">

          <div className="si-field">
            <label>Supplier Name</label>
            <input name="supplier_name" value={form.supplier_name}
              onChange={handleChange} placeholder="Enter supplier name" />
          </div>

          <div className="si-field">
            <label>Supplier Invoice No</label>
            <input name="supplier_inv_no" value={form.supplier_inv_no}
              onChange={handleChange} placeholder="Enter invoice number" />
          </div>

          <div className="si-field">
            <label>Supplier Invoice Date</label>
            <input name="supplier_inv_date" type="date"
              value={form.supplier_inv_date} onChange={handleChange} />
          </div>

          <div className="si-field">
            <label>Amount</label>
            <input name="amount" type="number" min="0" step="0.01"
              value={form.amount} onChange={handleChange}
              placeholder="Enter amount" />
          </div>

          <div className="si-field">
            <label>Amount Paid Date</label>
            <input name="amount_paid_date" type="date"
              value={form.amount_paid_date} onChange={handleChange} />
          </div>

          <div className="si-field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>

        <div className="si-actions">
          <button className="si-btn si-btn--add" onClick={handleAdd} disabled={saving}>
            {saving ? "Saving…" : "+ Add Invoice"}
          </button>
          <button className="si-btn si-btn--clear" onClick={() => setForm(EMPTY)} disabled={saving}>
            Clear
          </button>
        </div>
      </div>

      {/* ══ FILTER ══ */}
      <div className="si-card">
        <h2 className="si-card-title">Filter</h2>
        <div className="si-filter-row">
          <div className="si-field">
            <label>Supplier Name</label>
            <input value={fSupplier} onChange={(e) => setFSupplier(e.target.value)}
              placeholder="Search supplier…" />
          </div>
          <div className="si-field">
            <label>Status</label>
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="">All</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="si-field si-field--btn">
            <button className="si-btn si-btn--clear" onClick={clearFilters}>
              ✕ Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="si-card">
        <div className="si-card-title-row">
          <h2 className="si-card-title">
            Invoices
            {filtered.length > 0 && <span className="si-count">{filtered.length}</span>}
          </h2>
          <button className="si-btn si-btn--refresh" onClick={fetchAll}>
            ↻ Refresh
          </button>
        </div>

        <div className="si-table-wrap">
          <table className="si-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Supplier Name</th>
                <th>Invoice No</th>
                <th>Invoice Date</th>
                <th>Amount</th>
                <th>Amount Paid Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="si-empty">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="si-empty">No invoices found.</td></tr>
              ) : filtered.map((row, i) =>
                editId === row.id ? (
                  /* ── inline edit ── */
                  <tr key={row.id} className="si-edit-row">
                    <td>{i + 1}</td>
                    <td>
                      <input className="si-inline" name="supplier_name"
                        value={editForm.supplier_name} onChange={handleEditChange} />
                    </td>
                    <td>
                      <input className="si-inline" name="supplier_inv_no"
                        value={editForm.supplier_inv_no} onChange={handleEditChange} />
                    </td>
                    <td>
                      <input className="si-inline si-inline--date" name="supplier_inv_date"
                        type="date" value={editForm.supplier_inv_date} onChange={handleEditChange} />
                    </td>
                    <td>
                      <input className="si-inline si-inline--sm" name="amount"
                        type="number" value={editForm.amount} onChange={handleEditChange} />
                    </td>
                    <td>
                      <input className="si-inline si-inline--date" name="amount_paid_date"
                        type="date" value={editForm.amount_paid_date} onChange={handleEditChange} />
                    </td>
                    <td>
                      <select className="si-inline si-inline--select"
                        name="status" value={editForm.status} onChange={handleEditChange}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="si-action-cell">
                      <button className="si-save-btn" onClick={handleUpdate} disabled={saving}>
                        {saving ? "…" : "Save"}
                      </button>
                      <button className="si-cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  /* ── display row ── */
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>{row.supplier_name   || "-"}</td>
                    <td>{row.supplier_inv_no || "-"}</td>
                    <td>{fmtDate(row.supplier_inv_date)}</td>
                    <td>
                      {row.amount != null
                        ? "₹ " + parseFloat(row.amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "-"}
                    </td>
                    <td>{fmtDate(row.amount_paid_date)}</td>
                    <td><span className={statusClass(row.status)}>{row.status || "Pending"}</span></td>
                    <td className="si-action-cell">
                      <button className="si-edit-btn" onClick={() => startEdit(row)}>Edit</button>
                      <button className="si-del-btn" onClick={() => handleDelete(row.id)}>Delete</button>
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

export default SupplierInvoice;
