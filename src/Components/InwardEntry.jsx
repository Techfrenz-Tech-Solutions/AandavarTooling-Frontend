import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/InwardEntry.css";
import api from "../api";

function ToolInwardEntry() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [uom, setUom] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  const [itemOptions, setItemOptions] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchUOMs();
  }, []);

  // Fetch active items — returns objects with ItemName, ItemCode, SI
  const fetchItems = async () => {
    try {
      const res = await api.get("/items/activeitem");
      const items = res.data?.data || [];
      setItemOptions(items);
      setFilteredItems(items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Fetch active UOMs — returns plain strings e.g. ["Nos", "Kg", ...]
  const fetchUOMs = async () => {
    try {
      const res = await api.get("/activeuoms/activeUOM");
      setUomOptions(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching UOMs:", err);
    }
  };

  // Filter items as user types; auto-fill ItemCode when exact match found
  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setItemName(value);

    const filtered = itemOptions.filter((item) =>
      (item.ItemName || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);

    const exact = itemOptions.find(
      (item) => (item.ItemName || "").toLowerCase() === value.toLowerCase()
    );
    if (exact) {
      setSelectedItem(exact);
      setItemCode(exact.ItemCode || "");
    } else {
      setSelectedItem(null);
      setItemCode("");
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!selectedItem || !uom || !quantity || !rate) {
      alert("Please select a valid Item and fill all fields");
      return;
    }

    try {
      const payload = {
        ItemName: selectedItem.ItemName,
        ItemCode: selectedItem.ItemCode,
        UOMName: uom,
        Quantity: Number(quantity),
        Rate: Number(rate),
        Status: "Completed",
      };

      await api.post("/inward/iteminward", payload);

      alert("Item Inward submitted & stock updated!");
      navigate("/current-stock");
    } catch (err) {
      console.error("Error:", err.response || err);
      alert("Error updating stock");
    }

    // Reset
    setItemName("");
    setItemCode("");
    setSelectedItem(null);
    setUom("");
    setQuantity("");
    setRate("");
    setFilteredItems(itemOptions);
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
          <div className="ie-group">
            <label>Item Name</label>
            <input
              list="itemList"
              value={itemName}
              onChange={handleItemNameChange}
              placeholder="Type to search item..."
              autoComplete="off"
            />
            <datalist id="itemList">
              {filteredItems.map((item) => (
                <option key={item.SI} value={item.ItemName} />
              ))}
            </datalist>
          </div>

          <div className="ie-group">
            <label>Item Code</label>
            <input
              type="text"
              value={itemCode}
              readOnly
              placeholder="Auto-filled"
            />
          </div>
        </div>

        <div className="ie-row">
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

          <div className="ie-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="ie-row">
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
