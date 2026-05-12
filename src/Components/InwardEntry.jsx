import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/InwardEntry.css";
import api from "../api";

function ToolInwardEntry() {
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchItems();
    fetchUOMs();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const fetchUOMs = async () => {
    try {
      const res = await api.get("/activeuoms/activeUOM");
      setUomOptions(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching UOMs:", err);
    }
  };

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

  const handleSubmit = async () => {
    if (!toolId || !uom || !quantity || !rate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        ItemID: Number(toolId),
        UOMName: uom,
        Quantity: Number(quantity),
        Rate: Number(rate),
      };

      await api.post("/inward/iteminward", payload);
      alert("Item Inward submitted & stock updated!");
      navigate("/current-stock");
    } catch (err) {
      console.error("Error:", err.response || err);
      alert("Error updating stock");
    }

    setToolName("");
    setToolId("");
    setUom("");
    setQuantity("");
    setRate("");
    setFilteredTools(toolOptions);
  };

  return (
    <div className="ie-page">
      <Sidebar />
      <Topbar />

      <div className="ie-header">
        <h1>Item Inward Entry</h1>
      </div>

      <div className="ie-form">
        <div className="ie-row">

          {/* ── Product Name Custom Dropdown ── */}
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
                onClick={() => setDropdownOpen((prev) => !prev)}
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

          {/* ── UOM ── */}
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
    </div>
  );
}

export default ToolInwardEntry;
