import { useState } from "react";
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
  const [form,    setForm]    = useState(EMPTY);
  const [entries, setEntries] = useState([]);
  const [saving,  setSaving]  = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const required = [
      "item_name", "uom", "name", "qty",
      "supplier_name", "supplier_dc_no",
      "supplier_dc_date", "dc_entry_date",
    ];
    return required.every((k) => String(form[k]).trim() !== "");
  };

  const handleAdd = async () => {
    if (!validate()) {
      alert("Please fill all fields before adding.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/supplier/addSupplierDC", form);
      setEntries((prev) => [...prev, { ...form, id: Date.now() }]);
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  return (
    <div className="sdc-page">
      <Sidebar />
      <Topbar />

      {/* ── Page header ── */}
      <div className="sdc-header">
        <h1>Supplier DC</h1>
        <p>Supplier Transaction — Delivery Challan Entry</p>
      </div>

      {/* ── Form card ── */}
      <div className="sdc-card">
        <h2 className="sdc-card-title">New Entry</h2>

        <div className="sdc-grid">
          {/* Item Name */}
          <div className="sdc-field">
            <label>Item Name <span className="sdc-req">*</span></label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </div>

          {/* UOM */}
          <div className="sdc-field">
            <label>UOM <span className="sdc-req">*</span></label>
            <input
              name="uom"
              value={form.uom}
              onChange={handleChange}
              placeholder="e.g. Nos, Kg, Mtr"
            />
          </div>

          {/* Name */}
          <div className="sdc-field">
            <label>Name <span className="sdc-req">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          {/* Qty */}
          <div className="sdc-field">
            <label>Qty <span className="sdc-req">*</span></label>
            <input
              name="qty"
              type="number"
              min="0"
              value={form.qty}
              onChange={handleChange}
              placeholder="Enter quantity"
            />
          </div>

          {/* Supplier Name */}
          <div className="sdc-field">
            <label>Supplier Name <span className="sdc-req">*</span></label>
            <input
              name="supplier_name"
              value={form.supplier_name}
              onChange={handleChange}
              placeholder="Enter supplier name"
            />
          </div>

          {/* Supplier DC No */}
          <div className="sdc-field">
            <label>Supplier DC No <span className="sdc-req">*</span></label>
            <input
              name="supplier_dc_no"
              value={form.supplier_dc_no}
              onChange={handleChange}
              placeholder="Enter DC number"
            />
          </div>

          {/* Supplier DC Date */}
          <div className="sdc-field">
            <label>Supplier DC Date <span className="sdc-req">*</span></label>
            <input
              name="supplier_dc_date"
              type="date"
              value={form.supplier_dc_date}
              onChange={handleChange}
            />
          </div>

          {/* DC Entry Date */}
          <div className="sdc-field">
            <label>DC Entry Date <span className="sdc-req">*</span></label>
            <input
              name="dc_entry_date"
              type="date"
              value={form.dc_entry_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="sdc-actions">
          <button
            className="sdc-btn sdc-btn--add"
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? "Saving…" : "+ Add Entry"}
          </button>
          <button
            className="sdc-btn sdc-btn--clear"
            onClick={() => setForm(EMPTY)}
            disabled={saving}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="sdc-card">
        <h2 className="sdc-card-title">
          Entries
          {entries.length > 0 && (
            <span className="sdc-count">{entries.length}</span>
          )}
        </h2>

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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="sdc-empty">
                    No entries yet. Fill the form above and click Add Entry.
                  </td>
                </tr>
              ) : (
                entries.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>{row.item_name}</td>
                    <td>{row.uom}</td>
                    <td>{row.name}</td>
                    <td>{row.qty}</td>
                    <td>{row.supplier_name}</td>
                    <td>{row.supplier_dc_no}</td>
                    <td>{fmtDate(row.supplier_dc_date)}</td>
                    <td>{fmtDate(row.dc_entry_date)}</td>
                    <td>
                      <button
                        className="sdc-del-btn"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SupplierDC;
