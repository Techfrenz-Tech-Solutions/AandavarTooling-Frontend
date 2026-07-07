// import React, { useEffect, useState } from "react";
// import "../CSS/InvoiceTemplate.css";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// function InvoiceTemplate() {
//   const { invoiceNo } = useParams();
//   const [invoice, setInvoice] = useState(null);
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     if (invoiceNo) {
//       fetchInvoice();
//     }
//   }, [invoiceNo]);

//   const fetchInvoice = async () => {
//     try {
//       const res = await axios.get(
//         `https://admin.shreeaandavartooling.in/backend/sales/invoice/${encodeURIComponent(invoiceNo)}`
//       );

//       if (res.data.status === 1) {
//         setInvoice(res.data.invoice);
//         setItems(res.data.items);
//       }
//     } catch (error) {
//       console.log("Invoice fetch error:", error);
//     }
//   };

//   if (!invoice) return <div>Loading Invoice...</div>;

//   return (
//     <div id="invoice" className="invoice-container">
//       <img
//         src="/AandavarLogo2.png"
//         alt="Watermark Logo"
//         className="invoice-watermark"
//       />

//       <div className="top-bar">
//         <div>📞 9944130610</div>
//         <div>✉ prabusangari690@gmail.com</div>
//         <div>📍 5/520 D, kabeer Nagar MasthanPatti Madurai - 20</div>
//       </div>

//       <div className="company-header">
//         <div className="company-left">
//           <div className="logo-text-wrapper">
//             <img src="/AandavarLogo1.png" alt="Logo" className="company-logo" />
//             <div className="company-info">
//               <h2>SHREE AANDAVAR TOOLING</h2>
//               <p>GSTIN: 33BYPPP7144R1Z0</p>
//               <p>State: 33-Tamil Nadu</p>
//             </div>
//           </div>
//         </div>

//         <div className="invoice-title">
//           <h1>Tax Invoice</h1>
//         </div>
//       </div>

//       <div className="bill-details">
//         <div className="bill-left">
//           <h4>Bill To</h4>
//           <p><b>Company Name: {invoice.Customer_Name}</b></p>
//           <p>Address: {invoice.Customer_Address}</p>
//           <p>Contact No: {invoice.Customer_Phone}</p>
//           <p>GSTIN Number: {invoice.Customer_GSTIN}</p>
//           <p>State: Tamil Nadu</p>
//         </div>

//         <div className="bill-right">
//           <p>Invoice No: {invoice.Invoice_No}</p>
//           <p>Date: {invoice.Invoice_Date}</p>
//           <p>Place of Supply: Tamil Nadu</p>
//         </div>
//       </div>

//       <table className="invoice-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Item Name</th>
//             <th>HSN/SAC</th>
//             <th>Quantity</th>
//             <th>Price/unit</th>
//             <th>GST</th>
//             <th>Amount</th>
//           </tr>
//         </thead>

//         <tbody>
//           {items.map((item, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{item.Product_Name}</td>
//               <td>-</td>
//               <td>{item.Quantity}</td>
//               <td>{item.Price}</td>
//               <td>{item.SGST + item.CGST}%</td>
//               <td>{item.Total_Amount}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="payment-wrapper">
//         <div className="payto">
//           <h4>Pay To:</h4>
//           <p>Bank Name: BANK OF BARODA</p>
//           <p>Bank Account No: 75220200001446</p>
//           <p>Bank IFSC Code: BARBOVJMAAN</p>
//           <p>Account Holder's Name: SHREE AANDAVAR TOOLING</p>
//         </div>

//         <div className="total-box">
//           <table>
//             <tbody>
//               <tr>
//                 <td>Sub Total</td>
//                 <td>{invoice.Subtotal}</td>
//               </tr>
//               <tr>
//                 <td>GST Total</td>
//                 <td>{invoice.CGST }</td>
//               </tr>

//                 <tr>
//                 <td>GST Total</td>
//                 <td>{invoice.SGST }</td>
//               </tr>
//               <tr>

//                 <td>GST Total</td>
//                 <td>{invoice.GST_Total}</td>
//               </tr>
//               <tr className="total-row">
//                 <td>Total</td>
//                 <td>{invoice.Total_Amount}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InvoiceTemplate;






// // import React, { useEffect, useState } from "react";
// // import "../CSS/InvoiceTemplate.css";
// // import axios from "axios";
// // import { useParams } from "react-router-dom";

// // function InvoiceTemplate(props) {
// //   const params = useParams();
// //   const invoiceNo = props?.invoiceNo || params.invoiceNo;

// //   const [invoice, setInvoice] = useState(null);
// //   const [items, setItems] = useState([]);

// //   useEffect(() => {
// //     if (invoiceNo) {
// //       fetchInvoice();
// //     }
// //   }, [invoiceNo]);

// //   const fetchInvoice = async () => {
// //     try {
// //       const res = await axios.get(
// //         `https://admin.shreeaandavartooling.in/backend/sales/invoice/${encodeURIComponent(invoiceNo)}`
// //       );

// //       if (res.data.status === 1) {
// //         setInvoice(res.data.invoice);
// //         setItems(res.data.items);
// //       }
// //     } catch (error) {
// //       console.log("Invoice error:", error);
// //     }
// //   };

// //   if (!invoice) return <div>Loading Invoice...</div>;

// //   return (
// //     <div id="invoice" className="invoice-container">
// //       <img
// //         src="/AandavarLogo2.png"
// //         alt="Watermark Logo"
// //         className="invoice-watermark"
// //       />

// //       <div className="top-bar">
// //         <div>📞 9944130610</div>
// //         <div>✉ prabusangari690@gmail.com</div>
// //         <div>📍 Madurai</div>
// //       </div>

// //       <div className="company-header">
// //         <div className="logo-text-wrapper">
// //           <img src="/AandavarLogo1.png" alt="Logo" className="company-logo" />
// //           <div>
// //             <h2>SHREE AANDAVAR TOOLING</h2>
// //             <p>GSTIN: 33BYPPP7144R1Z0</p>
// //           </div>
// //         </div>

// //         <h1>Tax Invoice</h1>
// //       </div>

// //       <div className="bill-details">
// //         <div>
// //           <h4>Bill To</h4>
// //           <p><b>{invoice.Customer_Name}</b></p>
// //           <p>{invoice.Customer_Address}</p>
// //           <p>{invoice.Customer_Phone}</p>
// //           <p>{invoice.Customer_GSTIN}</p>
// //         </div>

// //         <div>
// //           <p>Invoice No: {invoice.Invoice_No}</p>
// //           <p>Date: {invoice.Invoice_Date}</p>
// //         </div>
// //       </div>

// //       <table className="invoice-table">
// //         <thead>
// //           <tr>
// //             <th>#</th>
// //             <th>Item</th>
// //             <th>Qty</th>
// //             <th>Price</th>
// //             <th>GST</th>
// //             <th>Amount</th>
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {items.map((item, index) => (
// //             <tr key={index}>
// //               <td>{index + 1}</td>
// //               <td>{item.Product_Name}</td>
// //               <td>{item.Quantity}</td>
// //               <td>{item.Price}</td>
// //               <td>{item.SGST + item.CGST}%</td>
// //               <td>{item.Total_Amount}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       <div className="total-box">
// //         <p>Sub Total: {invoice.Subtotal}</p>
// //         <p>GST Total: {invoice.GST_Total}</p>
// //         <h3>Total: {invoice.Total_Amount}</h3>
// //       </div>
// //     </div>
// //   );
// // }

// // export default InvoiceTemplate;


import React, { useEffect, useState } from "react";
import logo from "../Assets/AandavarLogo1.png";
import "../CSS/InvoiceTemplate.css";
import api from "../api";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* NUMBER TO WORDS */
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000)
      return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
    if (n < 10000000)
      return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000);
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let result = inWords(rupees) + " Rupees";
  if (paise > 0) {
    result += " and " + inWords(paise) + " Paise";
  }

  return result + " Only";
}

function InvoiceTemplate(props) {
  const params = useParams();
  const invoiceNo = props?.invoiceNo || params.invoiceNo;

  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(
        `/sales/invoice/${encodeURIComponent(
          invoiceNo
        )}`
      );

      if (res.data.status === 1) {
        setInvoice(res.data.invoice);
        setItems(res.data.items);
      }
    } catch (error) {
      console.log("Invoice fetch error:", error);
    }
  };

  useEffect(() => {
    if (invoiceNo) {
      fetchInvoice();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceNo]);

  /* ✅ DOWNLOAD PDF FUNCTION */
  const handleDownload = async () => {
    const input = document.getElementById("invoice");

    const canvas = await html2canvas(input, {
      scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice_${invoice.Invoice_No}.pdf`);
  };

  if (!invoice) return <div>Loading Invoice...</div>;

  const cgst = (invoice.GST_Total || 0) / 2;
  const sgst = (invoice.GST_Total || 0) / 2;

  const amountInWords = numberToWords(invoice.Total_Amount || 0);

  return (
    <div>

      {/* ✅ DOWNLOAD BUTTON TOP RIGHT */}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}>
        <button className="download-btn" onClick={handleDownload}>
          Download PDF
        </button>
      </div>

      <div id="invoice" className="invoice-container">

        {/* Watermark */}
        <img
          src="/AandavarLogo2.png"
          alt="Watermark"
          className="invoice-watermark"
        />

        {/* Top bar */}
        <div className="top-bar">
          <div>📞 9944130610</div>
          <div>✉ prabusangari690@gmail.com</div>
          <div>📍 5/520 D, Kabeer Nagar MasthanPatti Madurai - 20</div>
        </div>

        {/* Header */}
        <div className="company-header">
          <div className="company-left">
            <div className="logo-text-wrapper">
              <img src={logo} alt="Logo" className="company-logo" />
              <div className="company-info">
                <h2>SHREE AANDAVAR TOOLING</h2>
                <p>GSTIN: 33BVBPP7144R1Z0</p>
                <p>State: 33 - Tamil Nadu</p>
              </div>
            </div>
          </div>

          <div className="invoice-title">
            <h1>Tax Invoice</h1>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bill-details">
          <div className="bill-left">
            <h4>Bill To</h4>
            <p><b>{invoice.Customer_Name}</b></p>
            <p>{invoice.Customer_Address}</p>
            <p>Phone: {invoice.Customer_Phone}</p>
            <p>GSTIN: {invoice.Customer_GSTIN}</p>
          </div>

          <div className="bill-right">
            <p><b>Invoice No:</b> {invoice.Invoice_No}</p>
            <p>
              <b>Date:</b>{" "}
              {new Date(invoice.Invoice_Date).toLocaleDateString()}
            </p>
            <p><b>Place:</b> Tamil Nadu</p>
            <p><b>Vehicle No:______________</b> </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>GST %</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={item.Sale_ID}>
                <td>{index + 1}</td>
                <td>{item.Product_Name}</td>
                <td>{item.Quantity}</td>
                <td>{item.Price}</td>
                <td>{item.CGST + item.SGST}%</td>
                <td>{item.Total_Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment + Total */}
        <div className="payment-wrapper">
          <div className="payto">
            <h4>Bank Details</h4>
            <p>Bank: BANK OF BARODA</p>
            <p>A/C No: 75220200001446</p>
            <p>IFSC: BARB0VJMAAN</p>
            <p>Name: SHREE AANDAVAR TOOLING</p>
          </div>

          <div className="total-box">
            <table>
              <tbody>
                <tr>
                  <td>Sub Total</td>
                  <td>{invoice.Subtotal}</td>
                </tr>

                <tr>
                  <td>CGST</td>
                  <td>{cgst.toFixed(2)}</td>
                </tr>

                <tr>
                  <td>SGST</td>
                  <td>{sgst.toFixed(2)}</td>
                </tr>

                <tr>
                  <td>GST Total</td>
                  <td>{invoice.GST_Total}</td>
                </tr>

                <tr className="total-row">
                  <td>Total</td>
                  <td>{invoice.Total_Amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">

          <div className="footer-left">

            <div className="amount-words">
              <b>Invoice Amount In Words</b>
              <p>{amountInWords}</p>
            </div>

            <div className="authorized">
              <p>___________________________</p>
              <b>Receiver's Seal & Signature</b>
            </div>

          </div>

          <div className="footer-right">

            <div className="terms">
              <p>Thank you for doing business with us.</p>
              <p>For: SHREE AANDAVAR TOOLING</p>
            </div>

            <p>____________________</p>
            <b>Authorized Signatory</b>
            <p>M. PRABAHARAN</p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default InvoiceTemplate;