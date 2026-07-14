import { useEffect, useState, useRef } from "react";
import api from "../api";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import DeliveryChallanTemplate from "./DeliveryChallanTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "../CSS/Deliverychallan.css";

function DeliveryHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Which row's date is being edited and its temp value
  const [editingDateRow, setEditingDateRow] = useState(null); // DeliveryChallanNo
  const [editingDateValue, setEditingDateValue] = useState("");

  const printRef = useRef();

  useEffect(() => {
    fetchHistory();
  }, []);

  /* DATE FORMAT — returns YYYY-MM-DD */
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const str = String(dateValue);
    if (str.includes("T")) return str.split("T")[0];
    const date = new Date(str);
    if (isNaN(date)) return "-";
    return date.toISOString().split("T")[0];
  };

  /* Display as DD/MM/YYYY */
  const displayDate = (dateValue) => {
    const iso = formatDate(dateValue);
    if (iso === "-") return "-";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/delivery/getDeliveryChallanHistory");
      if (res.data.status) setHistoryList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= VIEW ================= */
  const viewChallan = async (challanNo) => {
    try {
      const res = await api.get(`/delivery/getChallanByNumber/${challanNo}`);
      if (res.data.status) {
        const data = res.data.data;

        // Use the edited date from historyList if available
        const rowDate = historyList.find(
          (r) => r.DeliveryChallanNo === challanNo
        )?.created_date;

        setSelectedChallan({
          recipientName: data[0]?.customer_name,
          recipientAddress: data[0]?.address || "",
          orderNo: challanNo,
          date: formatDate(rowDate || data[0]?.created_date),
          items: data.map((item) => ({
            name: item.product_name,
            quantity: item.quantity,
          })),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= INLINE DATE EDIT ================= */
  const startEditDate = (challanNo, currentDate) => {
    setEditingDateRow(challanNo);
    setEditingDateValue(formatDate(currentDate));
  };

  const confirmDateEdit = (challanNo) => {
    if (!editingDateValue) return;

    // Update historyList locally
    setHistoryList((prev) =>
      prev.map((row) =>
        row.DeliveryChallanNo === challanNo
          ? { ...row, created_date: editingDateValue }
          : row
      )
    );

    // If this challan is currently open in preview, update the date there too
    if (selectedChallan?.orderNo === challanNo) {
      setSelectedChallan((prev) => ({ ...prev, date: editingDateValue }));
    }

    setEditingDateRow(null);
    setEditingDateValue("");
  };

  const cancelDateEdit = () => {
    setEditingDateRow(null);
    setEditingDateValue("");
  };

  /* ================= DELETE ================= */
  const deleteChallan = async (challanNo) => {
    if (!window.confirm("Are you sure you want to delete this challan?")) return;
    try {
      const res = await api.post("/delivery/deleteChallan", {
        challan_no: challanNo,
      });
      if (res.data.status) {
        alert("Challan deleted successfully");
        fetchHistory();
        setSelectedChallan(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Error deleting challan");
    }
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = async () => {
    if (!printRef.current) return alert("Nothing to download");

    try {
      // 1. Capture the template DOM (no watermark img — clean single-page capture)
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: printRef.current.scrollWidth,
        windowHeight: printRef.current.scrollHeight,
      });

      // 2. Draw watermark centered on the captured canvas
      const wmImg = new Image();
      wmImg.crossOrigin = "anonymous";
      wmImg.src = `${window.location.origin}/andavarwt.png`;
      await new Promise((resolve) => { wmImg.onload = resolve; wmImg.onerror = resolve; });

      if (wmImg.complete && wmImg.naturalWidth > 0) {
        const ctx = canvas.getContext("2d");
        const wmW = canvas.width * 0.55;           // 55% of page width
        const wmH = (wmImg.naturalHeight / wmImg.naturalWidth) * wmW;
        const wmX = (canvas.width  - wmW) / 2;
        const wmY = (canvas.height - wmH) / 2;

        ctx.save();
        ctx.globalAlpha = 0.07;                    // transparent watermark
        ctx.translate(wmX + wmW / 2, wmY + wmH / 2);
        ctx.rotate((-15 * Math.PI) / 180);         // -15deg rotation
        ctx.drawImage(wmImg, -wmW / 2, -wmH / 2, wmW, wmH);
        ctx.restore();
      }

      // 3. Generate PDF — single page, content + watermark composited
      const imgData  = canvas.toDataURL("image/jpeg", 0.98);
      const pdf      = new jsPDF("p", "mm", "a4");
      const pageW    = 210;
      const pageH    = 297;
      const imgH     = (canvas.height * pageW) / canvas.width;

      // Fit to one page — scale down if content is taller than A4
      if (imgH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
      }

      pdf.save(`Challan_${selectedChallan?.orderNo || "file"}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    if (!printRef.current) return;
    printRef.current.classList.add("dc-print-area");
    document.body.classList.add("dc-printing");
    window.print();
    printRef.current.classList.remove("dc-print-area");
    document.body.classList.remove("dc-printing");
  };

  /* ================= SEARCH ================= */
  const filteredHistory = historyList.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.DeliveryChallanNo?.toLowerCase().includes(search) ||
      item.customer_name?.toLowerCase().includes(search) ||
      item.created_date?.toLowerCase().includes(search) ||
      item.total_items?.toString().includes(search) ||
      item.total_quantity?.toString().includes(search)
    );
  });

  return (
    <div className="sales-page">
      <Sidebar />
      <Topbar />

      <div className="sales-header">
        <h1>Delivery Challan History</h1>
      </div>

      <div className="sales-table-card">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>History</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", width: "300px" }}
          />
        </div>

        <table className="sales-table">
          <thead>
            <tr>
              <th>SL No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Items</th>
              <th>Total Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6">No Challans Found</td>
              </tr>
            ) : (
              filteredHistory.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.customer_name}</td>

                  {/* ── INLINE EDITABLE DATE CELL ── */}
                  <td>
                    {editingDateRow === item.DeliveryChallanNo ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="date"
                          value={editingDateValue}
                          onChange={(e) => setEditingDateValue(e.target.value)}
                          style={{ padding: "4px 6px", fontSize: "13px", borderRadius: "4px", border: "1px solid #4f46e5" }}
                          autoFocus
                        />
                        <button
                          onClick={() => confirmDateEdit(item.DeliveryChallanNo)}
                          style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelDateEdit}
                          style={{ background: "#e0e0e0", color: "#333", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{displayDate(item.created_date)}</span>
                        <button
                          onClick={() => startEditDate(item.DeliveryChallanNo, item.created_date)}
                          title="Edit date"
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#4f46e5", padding: "0" }}
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </td>

                  <td>{item.total_items}</td>
                  <td>{item.total_quantity}</td>
                  <td>
                    <button onClick={() => viewChallan(item.DeliveryChallanNo)}>
                      View
                    </button>
                    <button
                      onClick={() => deleteChallan(item.DeliveryChallanNo)}
                      style={{ marginLeft: "10px", backgroundColor: "red", color: "#fff" }}
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

      {/* ── PREVIEW ── */}
      {selectedChallan && (
        <div className="sales-table-card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Challan Preview</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={downloadPDF}>Download PDF</button>
              <button onClick={handlePrint}>Print</button>
              <button onClick={() => setSelectedChallan(null)}>Close</button>
            </div>
          </div>

          <div ref={printRef}>
            <DeliveryChallanTemplate challanData={selectedChallan} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryHistory;




















// import React, { useEffect, useState, useRef } from "react";
// import api from "../api";
// import Sidebar from "../Components/Sidebar";
// import Topbar from "../Components/Topbar";
// import DeliveryChallanTemplate from "./DeliveryChallanTemplate";
// import html2pdf from "html2pdf.js";

// import "../CSS/Deliverychallan.css";

// function DeliveryHistory() {
//   const [historyList, setHistoryList] = useState([]);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const printRef = useRef();

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/delivery/getDeliveryChallanHistory");
//       if (res.data.status) setHistoryList(res.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ VIEW FUNCTION
//   const viewChallan = async (challanNo) => {
//     try {
//       const res = await api.get(`/delivery/getChallanByNumber/${challanNo}`);

//       if (res.data.status) {
//         const data = res.data.data;

//         const formattedData = {
//           recipientName: data[0]?.customer_name,
//           recipientAddress: data[0]?.address || "",
//           orderNo: challanNo,
//           date: data[0]?.created_date,
//           items: data.map((item) => ({
//             name: item.product_name,
//             quantity: item.quantity,
//           })),
//         };

//         setSelectedChallan(formattedData);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ DELETE FUNCTION
//   const deleteChallan = async (challanNo) => {
//     if (!window.confirm("Are you sure you want to delete this challan?")) return;

//     try {
//       const res = await api.post("/delivery/deleteChallan", {
//         challan_no: challanNo
//       });

//       if (res.data.status) {
//         alert("Challan deleted successfully");
//         fetchHistory(); // refresh table
//         setSelectedChallan(null); // close preview
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       console.error("Delete Error:", err);
//       alert("Error deleting challan");
//     }
//   };

//   // ✅ DOWNLOAD PDF
//   const downloadPDF = () => {
//     if (!printRef.current) {
//       alert("Nothing to download");
//       return;
//     }

//     const opt = {
//       margin: 10,
//       filename: `Challan_${selectedChallan?.orderNo || "file"}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     html2pdf().set(opt).from(printRef.current).save();
//   };

//   // ✅ PRINT
//   const handlePrint = () => {
//     const content = printRef.current.innerHTML;
//     const newWindow = window.open("", "", "width=900,height=700");

//     newWindow.document.write(`
//       <html>
//         <head>
//           <title>Challan</title>
//         </head>
//         <body>
//           ${content}
//         </body>
//       </html>
//     `);

//     newWindow.document.close();
//     newWindow.print();
//   };

//   // ✅ SEARCH FILTER
//   const filteredHistory = historyList.filter((item) => {
//     const search = searchTerm.toLowerCase();

//     return (
//       item.DeliveryChallanNo?.toLowerCase().includes(search) ||
//       item.customer_name?.toLowerCase().includes(search) ||
//       item.created_date?.toLowerCase().includes(search) ||
//       item.total_items?.toString().includes(search) ||
//       item.total_quantity?.toString().includes(search)
//     );
//   });

//   return (
//     <div className="sales-page">
//       <Sidebar />
//       <Topbar />

//       <div className="sales-header">
//         <h1>Delivery Challan History</h1>
//       </div>

//       <div className="sales-table-card">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <h2>History</h2>

//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               padding: "10px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               width: "300px"
//             }}
//           />
//         </div>

//         <table className="sales-table">
//           <thead>
//             <tr>
//               <th>Challan No</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Total Items</th>
//               <th>Total Quantity</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredHistory.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No Challans Found</td>
//               </tr>
//             ) : (
//               filteredHistory.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.DeliveryChallanNo}</td>
//                   <td>{item.customer_name}</td>
//                   <td>{item.created_date}</td>
//                   <td>{item.total_items}</td>
//                   <td>{item.total_quantity}</td>

//                   <td>
//                     <button onClick={() => viewChallan(item.DeliveryChallanNo)}>
//                       View
//                     </button>

//                     <button
//                       onClick={() => deleteChallan(item.DeliveryChallanNo)}
//                       style={{
//                         marginLeft: "10px",
//                         backgroundColor: "red",
//                         color: "#fff"
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ PREVIEW */}
//       {selectedChallan && (
//         <div className="sales-table-card">
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//             <h2>Challan Preview</h2>

//             <div style={{ display: "flex", gap: "10px" }}>
//               <button onClick={downloadPDF}>Download PDF</button>
//               <button onClick={handlePrint}>Print</button>
//               <button onClick={() => setSelectedChallan(null)}>Close</button>
//             </div>
//           </div>

//           <div ref={printRef}>
//             <DeliveryChallanTemplate challanData={selectedChallan} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeliveryHistory;








// import React, { useEffect, useState, useRef } from "react";
// import api from "../api";
// import Sidebar from "../Components/Sidebar";
// import Topbar from "../Components/Topbar";
// import DeliveryChallanTemplate from "./DeliveryChallanTemplate";
// import html2pdf from "html2pdf.js";

// import "../CSS/Deliverychallan.css";

// function DeliveryHistory() {
//   const [historyList, setHistoryList] = useState([]);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const printRef = useRef();

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/delivery/getDeliveryChallanHistory");
//       if (res.data.status) setHistoryList(res.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ VIEW FUNCTION
//   const viewChallan = async (challanNo) => {
//     try {
//       const res = await api.get(`/delivery/getChallanByNumber/${challanNo}`);

//       if (res.data.status) {
//         const data = res.data.data;

//         const formattedData = {
//           recipientName: data[0]?.customer_name,
//           recipientAddress: data[0]?.address || "",
//           orderNo: challanNo,
//           date: data[0]?.created_date,
//           items: data.map((item) => ({
//             name: item.product_name,
//             quantity: item.quantity,
//           })),
//         };

//         setSelectedChallan(formattedData);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ DOWNLOAD PDF (FIXED)
//   const downloadPDF = () => {
//     if (!printRef.current) {
//       alert("Nothing to download");
//       return;
//     }

//     const opt = {
//       margin: 10,
//       filename: `Challan_${selectedChallan?.orderNo || "file"}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//       },
//       jsPDF: {
//         unit: "mm",
//         format: "a4",
//         orientation: "portrait",
//       },
//     };

//     html2pdf().set(opt).from(printRef.current).save();
//   };

//   // ✅ PRINT OPTION (RECOMMENDED BACKUP)
//   const handlePrint = () => {
//     const content = printRef.current.innerHTML;
//     const newWindow = window.open("", "", "width=900,height=700");

//     newWindow.document.write(`
//       <html>
//         <head>
//           <title>Challan</title>
//         </head>
//         <body>
//           ${content}
//         </body>
//       </html>
//     `);

//     newWindow.document.close();
//     newWindow.print();
//   };

//   // ✅ SEARCH FILTER
//   const filteredHistory = historyList.filter((item) => {
//     const search = searchTerm.toLowerCase();

//     return (
//       item.DeliveryChallanNo?.toLowerCase().includes(search) ||
//       item.customer_name?.toLowerCase().includes(search) ||
//       item.created_date?.toLowerCase().includes(search) ||
//       item.total_items?.toString().includes(search) ||
//       item.total_quantity?.toString().includes(search)
//     );
//   });

//   return (
//     <div className="sales-page">
//       <Sidebar />
//       <Topbar />

//       <div className="sales-header">
//         <h1>Delivery Challan History</h1>
//       </div>

//       <div className="sales-table-card">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <h2>History</h2>

//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               padding: "10px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               width: "300px"
//             }}
//           />
//         </div>

//         <table className="sales-table">
//           <thead>
//             <tr>
//               <th>Challan No</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Total Items</th>
//               <th>Total Quantity</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredHistory.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No Challans Found</td>
//               </tr>
//             ) : (
//               filteredHistory.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.DeliveryChallanNo}</td>
//                   <td>{item.customer_name}</td>
//                   <td>{item.created_date}</td>
//                   <td>{item.total_items}</td>
//                   <td>{item.total_quantity}</td>
//                   <td>
//                     <button onClick={() => viewChallan(item.DeliveryChallanNo)}>
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ TEMPLATE PREVIEW */}
//       {selectedChallan && (
//         <div className="sales-table-card">
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//             <h2>Challan Preview</h2>

//             <div style={{ display: "flex", gap: "10px" }}>
//               <button onClick={downloadPDF}>Download PDF</button>
//               <button onClick={handlePrint}>Print</button>
//               <button onClick={() => setSelectedChallan(null)}>Close</button>
//             </div>
//           </div>

//           <div ref={printRef}>
//             <DeliveryChallanTemplate challanData={selectedChallan} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeliveryHistory;

// import React, { useEffect, useState } from "react";
// import api from "../api";
// import Sidebar from "../Components/Sidebar";
// import Topbar from "../Components/Topbar";

// import "../CSS/Deliverychallan.css"; // ✅ NEW: Import CSS for styling

// function DeliveryHistory() {
//   const [historyList, setHistoryList] = useState([]);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [challanProducts, setChallanProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // ✅ NEW

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/delivery/getDeliveryChallanHistory");
//       if (res.data.status) setHistoryList(res.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const viewChallan = async (challanNo) => {
//     try {
//       const res = await api.get(`/delivery/getChallanByNumber/${challanNo}`);
//       if (res.data.status) {
//         setSelectedChallan(challanNo);
//         setChallanProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ FILTER LOGIC (global search across all fields)
//   const filteredHistory = historyList.filter((item) => {
//     const search = searchTerm.toLowerCase();

//     return (
//       item.DeliveryChallanNo?.toLowerCase().includes(search) ||
//       item.customer_name?.toLowerCase().includes(search) ||
//       item.created_date?.toLowerCase().includes(search) ||
//       item.total_items?.toString().includes(search) ||
//       item.total_quantity?.toString().includes(search)
//     );
//   });

//   return (
//     <div className="sales-page">
//       <Sidebar />
//       <Topbar />

//       <div className="sales-header">
//         <h1>Delivery Challan History</h1>
//       </div>

//       <div className="sales-table-card">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <h2>History</h2>

//           {/* ✅ SEARCH INPUT (Top Right) */}
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               padding: "10px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               width: "300px"
//             }}
//           />
//         </div>

//         <table className="sales-table">
//           <thead>
//             <tr>
//               <th>Challan No</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Total Items</th>
//               <th>Total Quantity</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredHistory.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No Challans Found</td>
//               </tr>
//             ) : (
//               filteredHistory.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.DeliveryChallanNo}</td>
//                   <td>{item.customer_name}</td>
//                   <td>{item.created_date}</td>
//                   <td>{item.total_items}</td>
//                   <td>{item.total_quantity}</td>
//                   <td>
//                     <button onClick={() => viewChallan(item.DeliveryChallanNo)}>
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {selectedChallan && (
//         <div className="sales-table-card">
//           <h2>Challan Details: {selectedChallan}</h2>
//           <table className="sales-table">
//             <thead>
//               <tr>
//                 <th>Customer</th>
//                 <th>Product</th>
//                 <th>Quantity</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {challanProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan="4">No Products Found</td>
//                 </tr>
//               ) : (
//                 challanProducts.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.customer_name}</td>
//                     <td>{item.product_name}</td>
//                     <td>{item.quantity}</td>
//                     <td>{item.created_date}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeliveryHistory;










// import React, { useEffect, useState } from "react";
// import api from "../api";
// import Sidebar from "../Components/Sidebar";
// import Topbar from "../Components/Topbar";

// function DeliveryHistory() {
//   const [historyList, setHistoryList] = useState([]);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [challanProducts, setChallanProducts] = useState([]);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/delivery/getDeliveryChallanHistory");
//       if (res.data.status) setHistoryList(res.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const viewChallan = async (challanNo) => {
//     try {
//       const res = await api.get(`/delivery/getChallanByNumber/${challanNo}`);
//       if (res.data.status) {
//         setSelectedChallan(challanNo);
//         setChallanProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="sales-page">
//       <Sidebar />
//       <Topbar />

//       <div className="sales-header">
//         <h1>Delivery Challan History</h1>
//       </div>

//       <div className="sales-table-card">
//         <h2>History</h2>
//         <table className="sales-table">
//           <thead>
//             <tr>
//               <th>Challan No</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Total Items</th>
//               <th>Total Quantity</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {historyList.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No Challans Found</td>
//               </tr>
//             ) : (
//               historyList.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.DeliveryChallanNo}</td>
//                   <td>{item.customer_name}</td>
//                   <td>{item.created_date}</td>
//                   <td>{item.total_items}</td>
//                   <td>{item.total_quantity}</td>
//                   <td>
//                     <button onClick={() => viewChallan(item.DeliveryChallanNo)}>
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {selectedChallan && (
//         <div className="sales-table-card">
//           <h2>Challan Details: {selectedChallan}</h2>
//           <table className="sales-table">
//             <thead>
//               <tr>
//                 <th>Customer</th>
//                 <th>Product</th>
//                 <th>Quantity</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {challanProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan="4">No Products Found</td>
//                 </tr>
//               ) : (
//                 challanProducts.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.customer_name}</td>
//                     <td>{item.product_name}</td>
//                     <td>{item.quantity}</td>
//                     <td>{item.created_date}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeliveryHistory;