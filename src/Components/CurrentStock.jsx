import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/CurrentStock.css";
import api from "../api";

function CurrentStock() {
  const [stockList, setStockList]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editItem, setEditItem]     = useState(null);   // item being edited
  const [editQty, setEditQty]       = useState("");
  const [editUOM, setEditUOM]       = useState("");

  const location = useLocation();

  // GET /currentstock/getCurrentStocks
  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await api.get("/currentstock/getCurrentStocks");
      if (res.data.status === 1 && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((item) => ({
          id:       item.StockID,
          itemID:   item.ItemID,
          itemName: item.ItemName,
          itemCode: item.ItemCode    || "-",
          category: item.CategoryName || "-",
          uom:      item.UOMName     || "-",
          quantity: item.AvailableQty,
          created:  item.CreatedDate
            ? new Date(item.CreatedDate).toLocaleString() : "-",
          updated:  item.LastUpdated
            ? new Date(item.LastUpdated).toLocaleString() : "-",
        }));
        setStockList(formatted);
      } else {
        setStockList([]);
      }
    } catch (error) {
      console.error("Stock fetch error:", error);
      setStockList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStock(); }, []);

  useEffect(() => {
    if (location.state?.refresh) fetchStock();
  }, [location.state]);

  // Open edit modal
  const openEdit = (item) => {
    setEditItem(item);
    setEditQty(item.quantity);
    setEditUOM(item.uom);
  };

  const closeEdit = () => {
    setEditItem(null);
    setEditQty("");
    setEditUOM("");
  };

  // POST /currentstock/updateCurrentStock
  const handleUpdate = async () => {
    if (!editQty) { alert("Enter quantity"); return; }
    try {
      await api.post("/currentstock/updateCurrentStock", {
        StockID:      editItem.id,
        AvailableQty: Number(editQty),
        UOMName:      editUOM,
      });
      alert("Stock updated successfully");
      closeEdit();
      fetchStock();
    } catch (err) {
      console.error("Update error:", err.response || err);
      alert("Error updating stock");
    }
  };

  // POST /currentstock/deleteCurrentStock
  const handleDelete = async (stockId) => {
    if (!window.confirm("Delete this stock record?")) return;
    try {
      await api.post("/currentstock/deleteCurrentStock", { StockID: stockId });
      alert("Deleted successfully");
      fetchStock();
    } catch (err) {
      console.error("Delete error:", err.response || err);
      alert("Error deleting stock");
    }
  };

  return (
    <div className="cs-page">
      <Sidebar />
      <Topbar />

      <div className="cs-header">
        <div>
          <h1>Current Stock</h1>
          <p>Real-time inventory levels</p>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editItem && (
        <div className="cs-modal-overlay">
          <div className="cs-modal">
            <h3>Edit Stock — {editItem.itemName}</h3>

            <div className="cs-modal-group">
              <label>Quantity</label>
              <input
                type="number"
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
              />
            </div>

            <div className="cs-modal-group">
              <label>UOM</label>
              <input
                type="text"
                value={editUOM}
                onChange={(e) => setEditUOM(e.target.value)}
              />
            </div>

            <div className="cs-modal-actions">
              <button className="cs-save-btn" onClick={handleUpdate}>Save</button>
              <button className="cs-cancel-btn" onClick={closeEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="cs-table-card">
        {loading ? (
          <p style={{ padding: "20px" }}>Loading stock data...</p>
        ) : (
          <table className="cs-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item Name</th>
                <th>Item Code</th>
                <th>Category</th>
                <th>UOM</th>
                <th>Quantity</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stockList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="cs-empty">No Stock Available</td>
                </tr>
              ) : (
                stockList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.category}</td>
                    <td>{item.uom}</td>
                    <td>{item.quantity}</td>
                    <td>{item.created}</td>
                    <td>{item.updated}</td>
                    <td>
                      <button
                        className="cs-edit-btn"
                        onClick={() => openEdit(item)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="cs-delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CurrentStock;
