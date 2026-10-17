// import React, { useState, useEffect } from "react";
// import api from "../api"; // ✅ use base API
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import "../CSS/CurrentStock.css";

// function ToolStack() {
//   const [stockList, setStockList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   /* ========== FETCH TOOL CURRENT STOCK FROM API ========== */
//   const fetchStock = async () => {
//     try {
//       const res = await api.get("/Toolstock/getToolStock");

//       if (res.data.status === 1 && Array.isArray(res.data.data)) {
//         const formatted = res.data.data.map((item) => ({
//           id: item.StockID,
//           toolName: item.ToolName,
//           uom: item.UOMName || "-",
//           quantity: item.AvailableQty,
//           updated: item.LastUpdated
//             ? new Date(item.LastUpdated).toLocaleString()
//             : "-",
//         }));

//         setStockList(formatted);
//         setFilteredList(formatted);
//       } else {
//         setStockList([]);
//         setFilteredList([]);
//       }
//     } catch (err) {
//       console.error("Error fetching tool stock:", err);
//       setStockList([]);
//       setFilteredList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStock();
//   }, []);

//   /* ========== HANDLE SEARCH ========== */
//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     const filtered = stockList.filter(
//       (item) =>
//         item.toolName.toLowerCase().includes(term) ||
//         item.uom.toLowerCase().includes(term) ||
//         item.id.toString().includes(term)
//     );

//     setFilteredList(filtered);
//   };

//   /* DELETE (UI only, optional) */
//   const handleDelete = (index) => {
//     const data = filteredList.filter((_, i) => i !== index);
//     setFilteredList(data);
//   };

//   return (
//     <div className="cs-page">
//       <Sidebar />
//       <Topbar />

//       {/* HEADER */}
//       <div className="cs-header">
//         <div>
//           <h1>Tool Stock</h1>
//           <p>Real-time tool inventory levels</p>
//         </div>
//       </div>

//       {/* SEARCH */}
//       <div className="cs-search">
//         <input
//           type="text"
//           placeholder="Search by Tool Name, UOM or ID"
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>

//       {/* TABLE */}
//       <div className="cs-table-card">
//         {loading ? (
//           <p>Loading tool stock data...</p>
//         ) : (
//           <table className="cs-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Tool Name</th>
//                 <th>UOM</th>
//                 <th>Quantity</th>
//                 <th>Action</th>
//                 <th>Updated</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredList.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="cs-empty">
//                     No Tool Stock Available
//                   </td>
//                 </tr>
//               ) : (
//                 filteredList.map((item, index) => (
//                   <tr key={item.id}>
//                     <td>{item.id}</td>
//                     <td>{item.toolName}</td>
//                     <td>{item.uom}</td>
//                     <td>{item.quantity}</td>
//                     <td>
//                       <button
//                         className="cs-delete-btn"
//                         onClick={() => handleDelete(index)}
//                       >
//                         <i className="fa fa-trash"></i>
//                       </button>
//                     </td>
//                     <td>{item.updated}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ToolStack;









import React, { useState, useEffect } from "react";
import api from "../api";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/CurrentStock.css";

function ToolStack() {
  const [stockList, setStockList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* ========== FETCH TOOL CURRENT STOCK FROM API ========== */
  const fetchStock = async () => {
    try {
      const res = await api.get("/Toolstock/getToolStock");

      if (res.data.status === 1 && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((item) => ({
          id: item.StockID,
          toolName: item.ToolName,
          uom: item.UOMName || "-",
          quantity: item.AvailableQty,
          updated: item.LastUpdated
            ? new Date(item.LastUpdated).toLocaleString()
            : "-",
        }));

        setStockList(formatted);
        setFilteredList(formatted);
      } else {
        setStockList([]);
        setFilteredList([]);
      }
    } catch (err) {
      console.error("Error fetching tool stock:", err);
      setStockList([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  /* ========== HANDLE SEARCH ========== */
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = stockList.filter(
      (item) =>
        item.toolName.toLowerCase().includes(term) ||
        item.uom.toLowerCase().includes(term) ||
        item.id.toString().includes(term)
    );

    setFilteredList(filtered);
  };

  /* DELETE (UI only) */
  const handleDelete = (index) => {
    const data = filteredList.filter((_, i) => i !== index);
    setFilteredList(data);
  };

  return (
    <div className="cs-page">
      <Sidebar />
      <Topbar />

      {/* HEADER */}
      <div className="cs-header">
        <div>
          <h1>Tool Stock</h1>
          <p>Real-time tool inventory levels</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="cs-search">
        <i className="fa fa-search"></i>
        <input
          type="text"
          placeholder="Search by Tool Name, UOM or ID..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* TABLE */}
      <div className="cs-table-card">
        {loading ? (
          <p>Loading tool stock data...</p>
        ) : (
          <table className="cs-table">
            <thead>
              <tr>
                <th>S.No</th> {/* ✅ SERIAL NUMBER */}
                <th>Tool Name</th>
                <th>UOM</th>
                <th>Quantity</th>
                <th>Action</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="cs-empty">
                    No Tool Stock Available
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td> {/* ✅ SERIAL */}
                    <td>{item.toolName}</td>
                    <td>{item.uom}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        className="cs-delete-btn"
                        onClick={() => handleDelete(index)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                    <td>{item.updated}</td>
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

export default ToolStack;