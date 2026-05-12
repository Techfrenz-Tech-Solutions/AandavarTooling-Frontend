import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchItems();
    fetchUOMs();
  }, []);

  // Fetch Items from API
  const fetchItems = async () => {
    try {
      const res = await api.get("/items/activeitem");
      console.log("✅ Items API Response:", res.data);

      const items = res.data?.data || [];
      console.log("✅ Parsed Items:", items);

      setToolOptions(items);
      setFilteredTools(items);
    } catch (err) {
      console.error("❌ Error fetching items:", err);
    }
  };

  // Fetch UOMs from API
  const fetchUOMs = async () => {
    try {
      const res = await api.get("/activeuoms/activeUOM");
      console.log("✅ UOM API Response:", res.data);

      const uoms = res.data?.data || [];
      console.log("✅ Parsed UOMs:", uoms);

      setUomOptions(uoms);
    } catch (err) {
      console.error("❌ Error fetching UOMs:", err);
    }
  };

  // Handle Item Name Input Change
  const handleFilter = (e) => {
    const value = e.target.value;
    setToolName(value);

    const filtered = toolOptions.filter((item) => {
      const name = item.ItemName || item.itemName || item.Name || "";
      return name.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredTools(filtered);

    // Auto-select if exact match
    const selected = toolOptions.find((item) => {
      const name = item.ItemName || item.itemName || item.Name || "";
      return name.toLowerCase() === value.toLowerCase();
    });

    setToolId(selected ? selected.SI || selected.id : "");
  };

  // Submit Form
  const handleSubmit = async () => {
    if (!toolId || !uom || !quantity || !rate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        ItemName: toolName,
        ItemCode: toolOptions.find(t => t.SI === toolId)?.ItemCode || "",
        UOMName: uom,
        Quantity: Number(quantity),
        Rate: Number(rate),
        Status: "Completed",
      };

      console.log("📤 Submitting Payload:", payload);

      await api.post("/inward/iteminward", payload);

      alert("Item Inward submitted & stock updated!");
      navigate("/current-stock");
    } catch (err) {
      console.error("❌ Submit Error:", err.response || err);
      alert("Error updating stock");
    }

    // Reset form
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
          <div className="ie-group">
            <label>Item Name</label>
            <input
              list="toolList"
              value={toolName}
              onChange={handleFilter}
              placeholder="Type to search item..."
              autoComplete="off"
            />
            <datalist id="toolList">
              {filteredTools.length > 0 ? (
                filteredTools.map((item) => {
                  const name = item.ItemName || item.itemName || item.Name || "Unnamed";
                  return <option key={item.SI || item.id} value={name} />;
                })
              ) : (
                <option value="No items found" />
              )}
            </datalist>
          </div>

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
