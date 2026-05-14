import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/InwardEntry.css";
import api from "../api";

function InwardEntry() {
  const [toolName, setToolName] = useState("");
  const [toolId, setToolId] = useState("");
  const [uom, setUom] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  const [toolOptions, setToolOptions] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const [inwardList, setInwardList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editUOM, setEditUOM] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const fetchItems = async () => {
    try {
      const res = await api.get("/activeitems/activeitem");
      const raw = res.data?.data || [];

      // Normalize: API may return plain strings or objects
      const items = raw.map((item) =>
        typeof item === "string"
          ? { product_name: item, SI: null }
          : item
      );

      console.log("=== ACTIVE ITEMS API RESPONSE ===");
      console.log("Full response:", res.data);
      console.log("First item sample:", items[0]);
      setToolOptions(items);
      setFilteredTools(items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const fetchUOMs = async () => {
    try {
      const res = await api.get("/activeuoms/activeUOM");
      setUomOptions(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching UOMs:", err);
    }
  };

  const fetchInwards = async () => {
    try {
      const res = await api.get("/inward/getItemInwards");
      console.log("=== GET INWARDS RESPONSE ===", res.data);
      // Accept data regardless of status field
      const data = res.data?.data || res.data?.Data || [];
      setInwardList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching inwards:", err);
    }
  };

  const getLabel = (item) => item.product_name || item.ItemName || item.name || String(item);
  // Always return the numeric SI — never fall back to a string name as ID
  const getId = (item) => {
    const id = item.SI ?? item.id ?? item.ItemID ?? null;
    console.log("getId for item:", item, "=> id:", id);
    return id;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setToolName(value);
    setToolId("");
    setDropdownOpen(true);
    setFilteredTools(
      toolOptions.filter((item) =>
        getLabel(item).toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelectItem = (item) => {
    setToolName(getLabel(item));
    setToolId(getId(item));
    setDropdownOpen(false);
  };

  const handleSubmit = async () => {
    if (!toolId || !uom || !quantity || !rate) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      ItemID: Number(toolId),
      UOMName: uom,
      Quantity: Number(quantity),
      Rate: Number(rate),
    };

    if (isNaN(payload.ItemID) || payload.ItemID === 0) {
      alert("Invalid product selected. Please select a product from the dropdown list.");
      return;
    }

    console.log("=== SUBMIT PAYLOAD ===", payload);

    try {
      const res = await api.post("/inward/iteminward", payload);
      console.log("=== SUBMIT RESPONSE ===", res.data);

      if (res.data?.status === 0) {
        alert("DB Error: " + (res.data?.message || "Unknown error from server"));
        return;
      }

      alert("Item Inward submitted successfully!");
      resetForm();
      fetchInwards();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      alert("Error submitting inward: " + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setToolName("");
    setToolId("");
    setUom("");
    setQuantity("");
    setRate("");
    setFilteredTools(toolOptions);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditQty(item.Quantity);
    setEditRate(item.Rate);
    setEditUOM(item.UOMName || "");
  };

  const closeEdit = () => {
    setEditItem(null);
    setEditQty("");
    setEditRate("");
    setEditUOM("");
  };

  const handleUpdate = async () => {
    if (!editQty || !editRate) {
      alert("Fill all fields");
      return;
    }
    try {
      await api.post("/inward/updateItemInward", {
        InwardID: editItem.InwardID,
        UOMName: editUOM,
        Quantity: Number(editQty),
        Rate: Number(editRate),
      });
      alert("Updated successfully");
      closeEdit();
      fetchInwards();
    } catch (err) {
      console.error("Update error:", err.response || err);
      alert("Error updating record");
    }
  };

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

  const filteredList = inwardList.filter(
    (item) =>
      (item.ItemName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.UOMName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {/* Product Name — searchable dropdown */}
          <div className="ie-group ie-dropdown-group" ref={dropdownRef}>
            <label>Product Name</label>
            <div className="ie-custom-select">
              <input
                type="text"
                className="ie-custom-input"
                value={toolName}
                onChange={handleSearchChange}
                onFocus={() => {
                  setFilteredTools(toolOptions);
                  setDropdownOpen(true);
                }}
                placeholder="Search or select product..."
                autoComplete="off"
              />
              <span
                className="ie-custom-arrow"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setFilteredTools(toolOptions);
                  setDropdownOpen((prev) => !prev);
                }}
              >
                ▾
              </span>

              {dropdownOpen && (
                <ul className="ie-custom-dropdown">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((item, i) => (
                      <li
                        key={getId(item) || i}
                        className="ie-custom-option"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectItem(item);
                        }}
                      >
                        {getLabel(item)}
                      </li>
                    ))
                  ) : (
                    <li className="ie-custom-option ie-no-result">
                      No items found
                    </li>
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
                <option key={i} value={opt}>
                  {opt}
                </option>
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

      {/* ── EDIT MODAL ── */}
      {editItem && (
        <div className="ie-modal-overlay">
          <div className="ie-modal">
            <h3>Edit Inward — {editItem.ItemName}</h3>

            <div className="ie-modal-group">
              <label>UOM</label>
              <input
                type="text"
                value={editUOM}
                onChange={(e) => setEditUOM(e.target.value)}
              />
            </div>

            <div className="ie-modal-group">
              <label>Quantity</label>
              <input
                type="number"
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
              />
            </div>

            <div className="ie-modal-group">
              <label>Rate</label>
              <input
                type="number"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
              />
            </div>

            <div className="ie-modal-actions">
              <button className="ie-save-btn" onClick={handleUpdate}>
                Save
              </button>
              <button className="ie-cancel-btn" onClick={closeEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="ie-search">
        <i className="fa fa-search"></i>
        <input
          type="text"
          placeholder="Search by item name or UOM..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── TABLE ── */}
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
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="7" className="ie-empty">
                  No inward records found
                </td>
              </tr>
            ) : (
              filteredList.map((item, index) => (
                <tr key={item.InwardID || index}>
                  <td>{index + 1}</td>
                  <td>{item.ItemName || "-"}</td>
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
                      className="ie-edit-btn"
                      onClick={() => openEdit(item)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
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
