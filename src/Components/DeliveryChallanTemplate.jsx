// import React from "react";
// import logo from "../Assets/AandavarLogo1.png";
// import "../CSS/InvoiceTemplate.css";

// function DeliveryChallanTemplate({ challanData }) {
//   return (
//     <div className="invoice-container">
//       {/* Header */}
//       <div className="company-header">
//         <img src={logo} alt="Logo" className="company-logo" />
//         <div className="company-info">
//           <h2>SHREE AANDAVAR TOOLING</h2>
//           <div>📍 5/520 D, Kabeer Nagar MasthanPatti Madurai - 20</div>
//           <div>✉ prabusangari690@gmail.com</div>
//           <div>📞 9944130610</div>
//         </div>
//       </div>

//       {/* Customer */}
//       <div className="bill-details">
//         <div>
//           <h4>To:</h4>
//           <p>{challanData?.recipientName}</p>
//           <p>{challanData?.recipientAddress}</p>
//         </div>
//         <div>
//           <p>Order No: {challanData?.orderNo}</p>
//           <p>Date: {challanData?.date}</p>
//         </div>
//       </div>

//       {/* Table */}
//       <table className="invoice-table">
//         <thead>
//           <tr>
//             <th>Sl No</th>
//             <th>Particulars</th>
//             <th>Quantity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {challanData?.items?.length > 0 ? (
//             challanData.items.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.quantity}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="3">No Items</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Footer */}
//       <div className="payment-wrapper">
//         <div>
//           <p>Received the goods in good condition</p>
//           <p>Party Signature: __________</p>
//         </div>
//         <div>
//           <p>For SHREE AANDAVAR TOOLING</p>
//           <p>Authorized Signatory</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DeliveryChallanTemplate;




import logo from "../Assets/AandavarLogo2.png";
import "../CSS/deliveryTemplate.css";

const MIN_ROWS = 12; // always show at least this many rows so footer stays near bottom

function DeliveryChallanTemplate({ challanData }) {
  const items = challanData?.items || [];

  // Pad with empty rows so the table always has MIN_ROWS rows
  const fillerCount = Math.max(0, MIN_ROWS - items.length);

  return (
    <div className="dc-page">

      {/* Watermark */}
      <img
        src={process.env.PUBLIC_URL + "/andavarwt.png"}
        alt=""
        className="dc-watermark"
      />

      {/* ── Header ── */}
      <div className="dc-header">
        <div className="dc-logo-wrap">
          <img src={logo} alt="Logo" className="dc-logo" />
        </div>
        <div className="dc-company-info">
          <h2>SHREE AANDAVAR TOOLING</h2>
          <h4>Delivery Challan</h4>
          <p>📍 5/520 D, Kabeer Nagar MasthanPatti Madurai - 20</p>
          <p>✉ prabusangari690@gmail.com &nbsp;&nbsp; 📞 9944130610</p>
          <p>GSTIN: 33BVBPP7144R1Z0</p>
        </div>
      </div>

      <div className="dc-divider" />

      {/* ── Customer + Order details ── */}
      <div className="dc-bill-row">
        <div className="dc-bill-left">
          <p><b>To:</b></p>
          <p>{challanData?.recipientName || "Customer Name"}</p>
          <p>{challanData?.recipientAddress || "Customer Address"}</p>
        </div>
        <div className="dc-bill-right">
          <p><b>Challan No:</b> {challanData?.orderNo || "NA"}</p>
          <p>
            <b>Date:</b>{" "}
            {challanData?.date
              ? new Date(challanData.date).toLocaleDateString("en-GB")
              : new Date().toLocaleDateString("en-GB")}
          </p>
          <p><b>Vehicle No:</b> _______________</p>
        </div>
      </div>

      {/* ── Items table ── */}
      <table className="dc-table">
        <thead>
          <tr>
            <th style={{ width: "8%" }}>Sl. No</th>
            <th style={{ width: "67%" }}>Particulars</th>
            <th style={{ width: "25%" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td style={{ textAlign: "left", paddingLeft: "8px" }}>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
          {/* Filler rows — keep footer on same page */}
          {Array.from({ length: fillerCount }).map((_, i) => (
            <tr key={"f" + i} className="dc-filler-row">
              <td>&nbsp;</td><td></td><td></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Footer — always on same page, directly after table ── */}
      <div className="dc-footer">
        <div className="dc-footer-left">
          <p>Received the goods in good condition</p>
          <p className="dc-sig-line">Party's Signature</p>
        </div>
        <div className="dc-footer-right">
          <p>For SHREE AANDAVAR TOOLING</p>
          <p className="dc-sig-line">Authorized Signatory</p>
        </div>
      </div>

    </div>
  );
}

export default DeliveryChallanTemplate;