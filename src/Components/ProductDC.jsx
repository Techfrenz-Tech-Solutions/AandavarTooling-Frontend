import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";
import "../CSS/ProductDC.css";

const EMPTY = {
  item_name:        "",
  uom:              "",
  name:             "",
  qty:              "",
  Customer_name:    "",
  Customer_dc_no:   "",
  Customer_dc_date: "",
  dc_entry_date:    "",
};

function ProductDC() {
  const [form,     setForm]     = useState(EMPTY);
  const [entries,  setEntries]  = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  /* inline edit — only the row id and whichever cells the user touches */
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchAll(); }, []);

  /* ── GET /productdc/getProductDCs ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customerdc/getCustomerDCs");
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

  /* ── POST /productdc/createProductDC ── */
  const handleAdd = async () => {
    /* no mandatory validation — just skip totally empty submits */
    const hasAny = Object.values(form).some((v) => String(v).trim() !== "");
    if (!hasAny) {
      alert("Please fill at least one field.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/customerdc/createCustomerDC", form);
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
      Customer_name:    row.Customer_name    ?? "",
      Customer_dc_no:   row.Customer_dc_no   ?? "",
      Customer_dc_date: (row.Customer_dc_date ?? "").split("T")[0],
      dc_entry_date:    (row.dc_entry_date    ?? "").split("T")[0],
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  /* ── POST /productdc/updateProductDC  — send only changed fields + id ── */
  const handleUpdate = async () => {
    setSaving(true);
    try {
      /* send full editForm; backend ignores blank fields if needed */
      const res = await api.post("/customerdc/updateCustomerDC", editForm);
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

  /* ── POST /productdc/deleteProductDC  — send { id } ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const res = await api.post("/customerdc/deleteCustomerDC", { id });
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
    <div className="pdc-page">
      <Sidebar />
      <Topbar />

      <div className="pdc-header">
        <h1>Product DC</h1>
        <p>Customer Transaction — Product Delivery Challan Entry</p>
      </div>

      {/* ══════ FORM CARD ══════ */}
      <div className="pdc-card">
        <h2 className="pdc-card-title">New Entry</h2>

        <div className="pdc-grid">
          <div className="pdc-field">
            <label>Item Name</label>
            <input name="item_name" value={form.item_name}
              onChange={handleChange} placeholder="Enter item name" />
          </div>

          <div className="pdc-field">
            <label>UOM</label>
            <input name="uom" value={form.uom}
              onChange={handleChange} placeholder="e.g. Nos, Kg, Mtr" />
          </div>

          <div className="pdc-field">
            <label>Name</label>
            <input name="name" value={form.name}
              onChange={handleChange} placeholder="Enter name" />
          </div>

          <div className="pdc-field">
            <label>Qty</label>
            <input name="qty" type="number" min="0" value={form.qty}
              onChange={handleChange} placeholder="Enter quantity" />
          </div>

          <div className="pdc-field">
            <label>Customer Name</label>
            <input name="Customer_name" value={form.Customer_name}
              onChange={handleChange} placeholder="Enter Customer name" />
          </div>

          <div className="pdc-field">
            <label>Customer DC No</label>
            <input name="Customer_dc_no" value={form.Customer_dc_no}
              onChange={handleChange} placeholder="Enter DC number" />
          </div>

          <div className="pdc-field">
            <label>Customer DC Date</label>
            <input name="Customer_dc_date" type="date"
              value={form.Customer_dc_date} onChange={handleChange} />
          </div>

          <div className="pdc-field">
            <label>DC Entry Date</label>
            <input name="dc_entry_date" type="date"
              value={form.dc_entry_date} onChange={handleChange} />
          </div>
        </div>

        <div className="pdc-actions">
          <button className="pdc-btn pdc-btn--add"
            onClick={handleAdd} disabled={saving}>
            {saving ? "Saving…" : "+ Add Entry"}
          </button>
          <button className="pdc-btn pdc-btn--clear"
            onClick={() => setForm(EMPTY)} disabled={saving}>
            Clear
          </button>
        </div>
      </div>

      {/* ══════ GRID CARD ══════ */}
      <div className="pdc-card">
        <div className="pdc-card-title-row">
          <h2 className="pdc-card-title">
            Entries
            {entries.length > 0 && (
              <span className="pdc-count">{entries.length}</span>
            )}
          </h2>
          <button className="pdc-btn pdc-btn--refresh" onClick={fetchAll}>
            ↻ Refresh
          </button>
        </div>

        <div className="pdc-table-wrap">
          <table className="pdc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>UOM</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Customer Name</th>
                <th>Customer DC No</th>
                <th>Customer DC Date</th>
                <th>DC Entry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="pdc-empty">Loading…</td></tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="pdc-empty">
                    No entries yet. Fill the form above and click Add Entry.
                  </td>
                </tr>
              ) : (
                entries.map((row, i) =>
                  editId === row.id ? (
                    /* ── inline edit row — edit any cell you want ── */
                    <tr key={row.id} className="pdc-edit-row">
                      <td>{i + 1}</td>
                      <td>
                        <input className="pdc-inline" name="item_name"
                          value={editForm.item_name} onChange={handleEditChange}
                          placeholder="Item name" />
                      </td>
                      <td>
                        <input className="pdc-inline pdc-inline--sm" name="uom"
                          value={editForm.uom} onChange={handleEditChange}
                          placeholder="UOM" />
                      </td>
                      <td>
                        <input className="pdc-inline" name="name"
                          value={editForm.name} onChange={handleEditChange}
                          placeholder="Name" />
                      </td>
                      <td>
                        <input className="pdc-inline pdc-inline--sm" name="qty"
                          type="number" value={editForm.qty}
                          onChange={handleEditChange} placeholder="Qty" />
                      </td>
                      <td>
                        <input className="pdc-inline" name="Customer_name"
                          value={editForm.Customer_name} onChange={handleEditChange}
                          placeholder="Customer name" />
                      </td>
                      <td>
                        <input className="pdc-inline" name="Customer_dc_no"
                          value={editForm.Customer_dc_no} onChange={handleEditChange}
                          placeholder="DC No" />
                      </td>
                      <td>
                        <input className="pdc-inline pdc-inline--date"
                          name="Customer_dc_date" type="date"
                          value={editForm.Customer_dc_date}
                          onChange={handleEditChange} />
                      </td>
                      <td>
                        <input className="pdc-inline pdc-inline--date"
                          name="dc_entry_date" type="date"
                          value={editForm.dc_entry_date}
                          onChange={handleEditChange} />
                      </td>
                      <td className="pdc-action-cell">
                        <button className="pdc-save-btn"
                          onClick={handleUpdate} disabled={saving}>
                          {saving ? "…" : "Save"}
                        </button>
                        <button className="pdc-cancel-btn" onClick={cancelEdit}>
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
                      <td>{row.Customer_name || "-"}</td>
                      <td>{row.Customer_dc_no || "-"}</td>
                      <td>{fmtDate(row.Customer_dc_date)}</td>
                      <td>{fmtDate(row.dc_entry_date)}</td>
                      <td className="pdc-action-cell">
                        <button className="pdc-edit-btn"
                          onClick={() => startEdit(row)}>
                          Edit
                        </button>
                        <button className="pdc-del-btn"
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

export default ProductDC;
