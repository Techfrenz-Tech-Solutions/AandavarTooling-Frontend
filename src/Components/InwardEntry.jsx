import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/InwardEntry.css";
import api from "../api";

function InwardEntry() {
  const [selectedItem, setSelectedItem] = useState(null); // full item object
  const [toolName, setToolName] = useState("");
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

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── FETCH PRODUCTS from /activeitems/activeitem ──
  const fetchItems = async () => {
    try {
      const res = await api.get("/activeitems/activeitem");
      const raw = res.data?.data || res.data || [];
      const items = Array.isArray(raw) ? raw : [];
      setToolOptions(items);
      setFilteredTools(items);
    } catch (err) {
      console.error("fetchItems error:", err);
    }
  };

  // ── FETCH UOMs ──
  const fetchUOMs = async () => {
    try {
      const res = await api.get("/activeuoms/activeUOM");
      const raw = res.data?.data || res.data || [];
      setUomOptions(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error("fetchUOMs error:", err);
    }
  };

  // ── FETCH INWARD LIST ──
  const fetchInwards = async () => {
    try {
      const res = await api.get("/inward/getItemInwards");
      const data =
        res.data?.data ||
        res.data?.Data ||
        res.data?.result ||
        (Array.isArray(res.data) ? res.data : []);
      setInwardList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchInwards error:", err);
    }
  };

  // ── Get display name from any item shape ──
  const getItemName = (item) =>
    item?.ItemName || item?.product_name || item?.name || String(item);

  // ── Get numeric ID from any item shape ──
  const getItemId = (item) => {
    const val = item?.SI ?? item?.id ?? item?.ID ?? item?.ItemID ?? null;
    const n = Number(val);
    return !isNaN(n) && n > 0 ? n : null;
  };

  // ── DROPDOWN: typing ──
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setToolName(value);
    setSelectedItem(null);
    setDropdownOpen(true);
    setFilteredTools(
      toolOptions.filter((item) =>
        getItemName(item).toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // ── DROPDOWN: pick an item ──
  const handleSelectItem = (item) => {
    setToolName(getItemName(item));
    setSelectedItem(item);
    setDropdownOpen(false);
  };

  // ── SUBMIT ──
  const handleSubmit = async () => {
    // Validate — only check name, uom, quantity, rate (NOT toolId)
    if (!toolName.trim()) {
      alert("Please select a Product Name");
      return;
    }
    if (!uom) {
      alert("Please select UOM");
      return;
    }
    if (!quantity) {
      alert("Please enter Quantity");
      return;
    }
    if (!rate) {
      alert("Please enter Rate");
      return;
    }

    // Build payload — send ItemID if we have it, otherwise send ItemName
    const itemId = selectedItem ? getItemId(selectedItem) : null;

    const payload = itemId
      ? {
          ItemID: itemId,
          UOMName: uom,
          Quantity: Number(quantity),
          Rate: Number(rate),
        }
      : {
          ItemName: toolName.trim(),
          UOMName: uom,
          Quantity: Number(quantity),
          Rate: Number(rate),
        };

    try {
      const res = await api.post("/inward/iteminward", payload);

      if (res.data?.status === 0) {
        alert("Server error: " + (res.data?.message || JSON.stringify(res.data)));
        return;
      }

      alert("Item Inward submitted successfully!");
      resetForm();
      // Small delay so DB has time to commit before re-fetching
      setTimeout(() => fetchInwards(), 300);
    } catch (err) {
      alert("Submit failed: " + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setToolName("");
    setSelectedItem(null);
    setUom("");
    setQuantity("");
    setRate("");
    setFilteredTools(toolOptions);
  };

  // ── EDIT ──
  const openEdit = (item) => {
    setEditItem(item);
    setEditQty(item.Quantity ?? item.quantity ?? "");
    setEditRate(item.Rate ?? item.rate ?? "");
    setEditUOM(item.UOMName ?? item.uom_name ?? "");
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
      const res = await api.post("/inward/updateItemInward", {
        InwardID: editItem.InwardID,
        UOMName: editUOM,
        Quantity: Number(editQty),
        Rate: Number(editRate),
      });
      if (res.data?.status === 0) {
        alert("Update error: " + (res.data?.message || ""));
        return;
      }
      alert("Updated successfully");
      closeEdit();
      fetchInwards();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  // ── DELETE ──
  const handleDelete = async (inwardId) => {
    if (!window.confirm("Delete this inward record?")) return;
    try {
      await api.post("/inward/deleteItemInward", { InwardID: inwardId });
      alert("Deleted successfully");
      fetchInwards();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  // ── UOM option label (handles string or object) ──
  const getUomLabel = (opt) =>
    typeof opt === "string" ? opt : opt?.UOMName || opt?.uom_name || String(opt);

  // ── GRID FILTER ──
  const filteredList = inwardList.filter((item) => {
    const name = (item.ItemName || item.item_name || "").toLowerCase();
    const uomVal = (item.UOMName || item.uom_name || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || uomVal.includes(term);
  });

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
                        key={getItemId(item) ?? i}
                        className="ie-custom-option"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectItem(item);
                        }}
                      >
                        {getItemName(item)}
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
                <option key={i} value={getUomLabel(opt)}>
                  {getUomLabel(opt)}
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
              placeholder="Enter quantity"
            />
          </div>

          <div className="ie-group">
            <label>Rate</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter rate"
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
            <h3>Edit Inward — {editItem.ItemName || editItem.item_name}</h3>

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
              <button className="ie-save-btn" onClick={handleUpdate}>Save</button>
              <button className="ie-cancel-btn" onClick={closeEdit}>Cancel</button>
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
                <tr key={item.InwardID || item.inward_id || index}>
                  <td>{index + 1}</td>
                  <td>{item.ItemName || item.item_name || "-"}</td>
                  <td>{item.UOMName || item.uom_name || "-"}</td>
                  <td>{item.Quantity ?? item.quantity ?? "-"}</td>
                  <td>{item.Rate ?? item.rate ?? "-"}</td>
                  <td>
                    {item.CreatedDate || item.created_date
                      ? new Date(item.CreatedDate || item.created_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button className="ie-edit-btn" onClick={() => openEdit(item)}>
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="ie-delete-btn"
                      onClick={() => handleDelete(item.InwardID || item.inward_id)}
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
