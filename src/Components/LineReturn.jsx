// import React, { useEffect, useState } from "react";
// import Sidebar from "../Components/Sidebar";
// import Topbar from "../Components/Topbar";
// import api from "../api";
// import "../CSS/LineOut.css";

// function WorkOrderHistory() {
//   const [list, setList] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [workerName, setWorkerName] = useState("");
//   const [workerOptions, setWorkerOptions] = useState([]);

//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/workorder/workorderhistory", {
//         params: {
//           from_date: fromDate,
//           to_date: toDate,
//           worker_name: workerName,
//         },
//       });

//       if (res.data.status === 1) {
//         setList(res.data.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchWorkers = async () => {
//     const res = await api.get("/activeworkers/getWorkers");
//     if (res.data.status === 1) {
//       setWorkerOptions(
//         res.data.data.map((w) => w.WorkerName || w.worker_name)
//       );
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//     fetchWorkers();
//   }, []);

//   return (
//     <div className="cs-page">
//       <Sidebar />
//       <Topbar />

//       <div className="cs-header">
//         <h1>Work Order History</h1>
//       </div>

//       {/* FILTER */}
//       <div className="cs-table-card">
//         <div className="cs-form">
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />

//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />

//           <select
//             value={workerName}
//             onChange={(e) => setWorkerName(e.target.value)}
//           >
//             <option value="">All Workers</option>
//             {workerOptions.map((w, i) => (
//               <option key={i} value={w}>{w}</option>
//             ))}
//           </select>

//           <button onClick={fetchHistory}>Filter</button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="cs-table-card">
//         <table className="cs-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Tool</th>
//               <th>Category</th>
//               <th>Qty</th>
//               <th>Machine</th>
//               <th>Worker</th>
//             </tr>
//           </thead>

//           <tbody>
//             {list.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No Data</td>
//               </tr>
//             ) : (
//               list.map((item, i) => (
//                 <tr key={i}>
//                   <td>{item.work_date}</td>
//                   <td>{item.tool_name}</td>
//                   <td>{item.category_name}</td>
//                   <td>{item.tool_qty}</td>
//                   <td>{item.machine_name}</td>
//                   <td>{item.worker_name}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default WorkOrderHistory;


// import React, { useEffect, useState } from "react";
// import Sidebar from "../Components/Sidebar";
// import Topbar from "../Components/Topbar";
// import api from "../api";
// import "../CSS/LineOut.css";

// // PDF Libraries
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// function WorkOrderHistory() {
//   const [list, setList] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [workerName, setWorkerName] = useState("");
//   const [workerOptions, setWorkerOptions] = useState([]);

//   // ================= FETCH HISTORY =================
//   const fetchHistory = async () => {
//     try {
//       const res = await api.get("/workorder/workorderhistory", {
//         params: {
//           from_date: fromDate,
//           to_date: toDate,
//           worker_name: workerName,
//         },
//       });

//       if (res.data.status === 1) {
//         setList(res.data.data);
//       } else {
//         setList([]);
//       }
//     } catch (err) {
//       console.error("Fetch History Error:", err);
//       setList([]);
//     }
//   };

//   // ================= FETCH WORKERS =================
//   const fetchWorkers = async () => {
//     try {
//       const res = await api.get("/activeworkers/getWorkers");
//       if (res.data.status === 1) {
//         setWorkerOptions(
//           res.data.data.map((w) => w.WorkerName || w.worker_name)
//         );
//       }
//     } catch (err) {
//       console.error("Fetch Workers Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//     fetchWorkers();
//   }, []);

//   // ================= DOWNLOAD PDF =================
//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Work Order History", 14, 15);

//     if (fromDate || toDate || workerName) {
//       let filterText = "Filters: ";
//       if (fromDate) filterText += `From: ${fromDate} `;
//       if (toDate) filterText += `To: ${toDate} `;
//       if (workerName) filterText += `Worker: ${workerName}`;
//       doc.text(filterText, 14, 22);
//     }

//     const tableColumn = ["Date", "Tool", "Category", "Qty", "Machine", "Worker"];
//     const tableRows = [];

//     list.forEach((item) => {
//       const row = [
//         item.work_date,
//         item.tool_name,
//         item.category_name,
//         item.tool_qty,
//         item.machine_name,
//         item.worker_name,
//       ];
//       tableRows.push(row);
//     });

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 28,
//     });

//     doc.save("WorkOrder_History.pdf");
//   };

//   // ================= UI =================
//   return (
//     <div className="cs-page">
//       <Sidebar />
//       <Topbar />

//       <div className="cs-header">
//         <h1>Work Order History</h1>
//       </div>

//       {/* FILTER */}
//       <div className="cs-table-card">
//         <div className="cs-form">
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />

//           <select
//             value={workerName}
//             onChange={(e) => setWorkerName(e.target.value)}
//           >
//             <option value="">All Workers</option>
//             {workerOptions.map((w, i) => (
//               <option key={i} value={w}>{w}</option>
//             ))}
//           </select>

//           <button onClick={fetchHistory}>Filter</button>
//           <button onClick={downloadPDF}>Download PDF</button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="cs-table-card">
//         <table className="cs-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Tool</th>
//               <th>Category</th>
//               <th>Qty</th>
//               <th>Machine</th>
//               <th>Worker</th>
//             </tr>
//           </thead>

//           <tbody>
//             {list.length === 0 ? (
//               <tr>
//                 <td colSpan="6">No Data</td>
//               </tr>
//             ) : (
//               list.map((item, i) => (
//                 <tr key={i}>
//                   <td>{item.work_date}</td>
//                   <td>{item.tool_name}</td>
//                   <td>{item.category_name}</td>
//                   <td>{item.tool_qty}</td>
//                   <td>{item.machine_name}</td>
//                   <td>{item.worker_name}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default WorkOrderHistory;



import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import api from "../api";
import "../CSS/LineOut.css";

// PDF Libraries
import jsPDF from "jspdf";
import "jspdf-autotable";

function WorkOrderHistory() {
  const [list, setList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [workerOptions, setWorkerOptions] = useState([]);

  /* ✅ DATE FORMAT FIX */
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const str = String(dateValue);

    if (str.includes("T")) {
      return str.split("T")[0];
    }

    const date = new Date(str);
    if (isNaN(date)) return "-";

    return date.toISOString().split("T")[0];
  };

  // ================= FETCH HISTORY =================
  const fetchHistory = async () => {
    try {
      const res = await api.get("/workorder/workorderhistory", {
        params: {
          from_date: fromDate,
          to_date: toDate,
          worker_name: workerName,
        },
      });

      if (res.data.status === 1) {
        setList(res.data.data);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Fetch History Error:", err);
      setList([]);
    }
  };

  // ================= FETCH WORKERS =================
  const fetchWorkers = async () => {
    try {
      const res = await api.get("/activeworkers/getWorkers");
      if (res.data.status === 1) {
        setWorkerOptions(
          res.data.data.map((w) => w.WorkerName || w.worker_name)
        );
      }
    } catch (err) {
      console.error("Fetch Workers Error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchWorkers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= DOWNLOAD PDF =================
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Work Order History", 14, 15);

    if (fromDate || toDate || workerName) {
      let filterText = "Filters: ";
      if (fromDate) filterText += `From: ${fromDate} `;
      if (toDate) filterText += `To: ${toDate} `;
      if (workerName) filterText += `Worker: ${workerName}`;
      doc.text(filterText, 14, 22);
    }

    const tableColumn = ["Date", "Tool", "Category", "Qty", "Machine", "Worker"];
    const tableRows = [];

    list.forEach((item) => {
      const row = [
        formatDate(item.work_date), // ✅ FIX
        item.tool_name,
        item.category_name,
        item.tool_qty,
        item.machine_name,
        item.worker_name,
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
    });

    doc.save("WorkOrder_History.pdf");
  };

  // ================= UI =================
  return (
    <div className="cs-page">
      <Sidebar />
      <Topbar />

      <div className="cs-header">
        <h1>Work Order History</h1>
      </div>

      {/* FILTER */}
      <div className="cs-table-card">
        <div className="cs-form">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <select
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
          >
            <option value="">All Workers</option>
            {workerOptions.map((w, i) => (
              <option key={i} value={w}>{w}</option>
            ))}
          </select>

          <button onClick={fetchHistory}>Filter</button>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="cs-table-card">
        <table className="cs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Tool</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Machine</th>
              <th>Worker</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="6">No Data</td>
              </tr>
            ) : (
              list.map((item, i) => (
                <tr key={i}>
                  <td>{formatDate(item.work_date)}</td> {/* ✅ FIX */}
                  <td>{item.tool_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.tool_qty}</td>
                  <td>{item.machine_name}</td>
                  <td>{item.worker_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkOrderHistory;