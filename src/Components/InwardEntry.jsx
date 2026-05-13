import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/InwardEntry.css";
import api from "../api";

function InwardEntry() {
  const navigate = useNavigate();

  const [toolName, setToolName]     = useState("");
  const [toolId, setToolId]         = useState("");
  const [uom, setUom]               = useState("");
  const [quantity, setQuantity]     = useState("");
  const [rate, setRate]             = useState("");

  const [toolOptions, setToolOptions]     = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [uomOptions, setUomOptions]       = useState([]);

  const [inwardList, setInwardList] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchItems();
    fetchUOMs();
    fetchInwards();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // GET /activeitems/activeitem
  const fetchItems = async () => {
    try {
      const res = await api.get("/activeitems/activeitem");
      const items = res.data?.data || [];
      setToolOptions(items);
      setFilteredTools(items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // GET /activeuoms/activeUOM
  const fetchUOMs = async () => {
    try {
      const res = await api.get("/activeuoms/activeUOM");
      setUomOptions(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching UOMs:", err);
    }
  };

  // GET /inward/getItemInwards
  const fetchInwards = async () => {
    try {
      const res = await api.get("/inward/getItemInwards");
      setInwardList(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching inwards:", err);
    }
  };

  // Search filter for product dropdown
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setToolName(value);
    setToolId("");
    setDropdownOpen(true);
    const filtered = toolOptions.filter((item) =>
      (item.product_name || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTools(filtered);
  };

  const handleSelectItem = (item) => {
    setToolName(item.product_name || "");
    setToolId(item.SI || item.id || "");
    setDropdownOpen(false);
  };

  // POST /inward/iteminward
  const handleSubmit = async () => {
    if (!toolId || !uom || !quantity || !rate) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/inward/iteminward", {
        ItemID:   Number(toolId),
        UOMName:  uom,
        Quantity: Number(quantity),
        Rate:     Number(rate),
      });

      alert("Item Inward submitted & stock updated!");
      setToolName("");
      setToolId("");
      setUom("");
      setQuantity("");
      setRate("");
      setFilteredTools(toolOptions);
      fetchInwards();
    } catch (err) {
      console.error("Submit error:", err.response || err);
      alert("Error submitting inward");
    }
  };

  // POST /inward/deleteItemInward
  const handleDelete = async (inwardId) => {
    if (!window.confirm("Delete this inward record?")) return;
    try {
      await api.post("/inward/deleteItemInward", { InwardID: inwardId });
      alert("Deleted successfully");
      fetchInwards();
    } catch (err) {
      console.error("Delete error:", err.response || err);
      alert("Error deleting record");
    }
  };

  return (
    <div className="ie-page">
      <Sidebar />
      <Topbar />

      <div className="ie-header">
        <h1>Item Inward Entry</h1>
      </div>

      {/* ── FORM ── */}
      <div className="ie-form">
        <div className="ie-row">

          {/* Product Name — custom searchable dropdown */}
          <div className="ie-group" ref={dropdownRef}>
            <label>Product Name</label>
            <div className="ie-custom-select">
              <input
                type="text"
                className="ie-custom-input"
                value={toolName}
                onChange={handleSearchChange}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Select the Product Name"
                autoComplete="off"
              />
              <span
                className="ie-custom-arrow"
                onClick={() => setDropdownOpen((p) => !p)}
              >
                ▾
              </span>
              {dropdownOpen && (
                <ul className="ie-custom-dropdown">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((item, i) => (
                      <li
                        key={item.SI || i}
                        className="ie-custom-option"
                        onMouseDown={() => handleSelectItem(item)}
                      >
                        {item.product_name}
                      </li>
                    ))
                  ) : (
                    <li className="ie-custom-option ie-no-result">No items found</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* UOM */}
          <div className="ie-group">
            <label>UOM</label>
            <select value={uom} onChange={(e) => setUom(e.target.value)}>
              <option value="">Select UOM</option>
              {uomOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ie-row">
          <div className="ie-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="ie-group">
            <label>Rate</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
        </div>

        <button className="ie-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* ── INWARD HISTORY TABLE ── */}
      <div className="ie-table-card">
        <table className="ie-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>UOM</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inwardList.length === 0 ? (
              <tr>
                <td colSpan="7" className="ie-empty">No inward records found</td>
              </tr>
            ) : (
              inwardList.map((item, index) => (
                <tr key={item.InwardID || index}>
                  <td>{index + 1}</td>
                  <td>{item.ItemName || item.product_name || "-"}</td>
                  <td>{item.UOMName || "-"}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.Rate}</td>
                  <td>
                    {item.CreatedDate
                      ? new Date(item.CreatedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="ie-delete-btn"
                      onClick={() => handleDelete(item.InwardID)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InwardEntry;
