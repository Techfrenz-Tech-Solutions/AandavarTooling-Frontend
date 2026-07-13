import { useEffect, useState, useRef } from "react";
import api from "../api";
import axios from "axios";
import logo from "../Assets/AandavarLogo1.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../CSS/SalesPage.css";
import "../CSS/InvoiceTemplate.css";
import "../CSS/InvoiceModal.css";

/* ── Number → Words ─────────────────────────────────────── */
function numberToWords(num) {
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight",
    "Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen",
    "Sixteen","Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

  const inWords = (n) => {
    if (n === 0)  return "";
    if (n < 20)   return a[n];
    if (n < 100)  return (b[Math.floor(n / 10)] + " " + a[n % 10]).trim();
    if (n < 1000) return (a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100)).trim();
    if (n < 100000)   return (inWords(Math.floor(n / 1000))   + " Thousand " + inWords(n % 1000)).trim();
    if (n < 10000000) return (inWords(Math.floor(n / 100000)) + " Lakh "     + inWords(n % 100000)).trim();
    return (inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000)).trim();
  };

  const rupees = Math.floor(num);
  const paise  = Math.round((num - rupees) * 100);
  let result   = inWords(rupees) + " Rupees";
  if (paise > 0) result += " and " + inWords(paise) + " Paise";
  return result + " Only";
}

/* ── Date format ─────────────────────────────────────────── */
const formatDate = (v) => {
  if (!v) return "-";
  const s = String(v);
  if (s.includes("T")) return s.split("T")[0];
  const d = new Date(s);
  return isNaN(d) ? "-" : d.toISOString().split("T")[0];
};

/* ════════════════════════════════════════════════════════════
   InvoiceHistory
   ════════════════════════════════════════════════════════════ */
function InvoiceHistory() {
  const [invoices,       setInvoices]       = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [showModal,      setShowModal]      = useState(false);
  const [modalInvoice,   setModalInvoice]   = useState(null);
  const [modalItems,     setModalItems]     = useState([]);
  const [modalLoading,   setModalLoading]   = useState(false);
  const [downloading,    setDownloading]    = useState(false);
  const invoiceRef = useRef(null);

  /* ── Fetch list ─────────────────────────────────────────── */
  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sales/invoices");
      setInvoices(res.data.status === 1 ? res.data.data : []);
    } catch (err) {
      console.error("Invoice Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Open modal ─────────────────────────────────────────── */
  const viewInvoice = async (invoiceNo) => {
    setShowModal(true);
    setModalInvoice(null);
    setModalItems([]);
    setModalLoading(true);
    try {
      const res = await axios.get(
        `https://admin.shreeaandavartooling.in/backend/sales/invoice/${encodeURIComponent(invoiceNo)}`
      );
      if (res.data.status === 1) {
        setModalInvoice(res.data.invoice);
        setModalItems(res.data.items);
      }
    } catch (err) {
      console.error("Invoice detail error:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalInvoice(null);
    setModalItems([]);
  };

  /* ── Download PDF ───────────────────────────────────────── */
  const handleDownload = async () => {
    if (!invoiceRef.current || !modalInvoice) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
      const imgData  = canvas.toDataURL("image/png");
      const pdf      = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${modalInvoice.Invoice_No}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  /* ── Delete ─────────────────────────────────────────────── */
  const deleteInvoice = async (invoiceNo) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await api.post("/sales/deleteinvoice", { invoice_no: invoiceNo });
      if (res.data.status === 1) {
        alert("Invoice deleted successfully");
        fetchInvoices();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Error deleting invoice");
    }
  };

  /* ── GST helpers ────────────────────────────────────────── */
  const cgst = modalInvoice ? (modalInvoice.GST_Total || 0) / 2 : 0;
  const sgst = modalInvoice ? (modalInvoice.GST_Total || 0) / 2 : 0;
  const amountInWords = modalInvoice
    ? numberToWords(parseFloat(modalInvoice.Total_Amount) || 0)
    : "";

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="sales-page">

      <div className="sales-header">
        <h1>Invoice History</h1>
      </div>

      <div className="sales-form">
        <div className="sales-table-container">
          <h2>Invoice List</h2>

          <table className="sales-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="7">No invoices found</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.Invoice_ID}>
                    <td>{inv.Invoice_No}</td>
                    <td>{formatDate(inv.Invoice_Date)}</td>
                    <td>{inv.Customer_Name}</td>
                    <td>{inv.Customer_Phone}</td>
                    <td>{inv.Total_Amount}</td>
                    <td>{inv.Status}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => viewInvoice(inv.Invoice_No)}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteInvoice(inv.Invoice_No)}
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

          <div style={{ marginTop: "20px" }}>
            <button className="sales-add-btn" onClick={fetchInvoices}>Refresh</button>
          </div>
        </div>
      </div>

      {/* ══════════════ MODAL ══════════════ */}
      {showModal && (
        <div className="invoice-modal-overlay" onClick={closeModal}>
          <div
            className="invoice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header bar */}
            <div className="invoice-modal-header">
              <span className="invoice-modal-title">Invoice Preview</span>
              <div className="invoice-modal-actions">
                <button
                  className="download-btn"
                  onClick={handleDownload}
                  disabled={downloading || modalLoading || !modalInvoice}
                >
                  {downloading ? "Generating..." : "⬇ Download PDF"}
                </button>
                <button className="modal-close-btn" onClick={closeModal} aria-label="Close">✕</button>
              </div>
            </div>

            {/* Modal body */}
            <div className="invoice-modal-body">
              {modalLoading ? (
                <div className="modal-loading">Loading invoice...</div>
              ) : !modalInvoice ? (
                <div className="modal-loading">Invoice not found.</div>
              ) : (
                /* ── Invoice template rendered inside modal ── */
                <div ref={invoiceRef} id="invoice-print" className="invoice-container">

                  {/* Watermark */}
                  <img src="/AandavarLogo2.png" alt="" className="invoice-watermark" />

                  {/* Top bar */}
                  <div className="top-bar">
                    <div>📞 9944130610</div>
                    <div>✉ prabusangari690@gmail.com</div>
                    <div>📍 5/520 D, Kabeer Nagar MasthanPatti Madurai - 20</div>
                  </div>

                  {/* Company header */}
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

                  {/* Bill details */}
                  <div className="bill-details">
                    <div className="bill-left">
                      <h4>Bill To</h4>
                      <p><b>{modalInvoice.Customer_Name}</b></p>
                      <p>{modalInvoice.Customer_Address}</p>
                      <p>Phone: {modalInvoice.Customer_Phone}</p>
                      <p>GSTIN: {modalInvoice.Customer_GSTIN}</p>
                    </div>
                    <div className="bill-right">
                      <p><b>Invoice No:</b> {modalInvoice.Invoice_No}</p>
                      <p><b>Date:</b> {new Date(modalInvoice.Invoice_Date).toLocaleDateString()}</p>
                      <p><b>Place:</b> Tamil Nadu</p>
                      <p><b>Vehicle No: ______________</b></p>
                    </div>
                  </div>

                  {/* Items table */}
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
                      {modalItems.map((item, index) => (
                        <tr key={item.Sale_ID || index}>
                          <td>{index + 1}</td>
                          <td>{item.Product_Name}</td>
                          <td>{item.Quantity}</td>
                          <td>{item.Price}</td>
                          <td>{(item.CGST || 0) + (item.SGST || 0)}%</td>
                          <td>{item.Total_Amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Payment + totals */}
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
                          <tr><td>Sub Total</td><td>{modalInvoice.Subtotal}</td></tr>
                          <tr><td>CGST</td><td>{cgst.toFixed(2)}</td></tr>
                          <tr><td>SGST</td><td>{sgst.toFixed(2)}</td></tr>
                          <tr><td>GST Total</td><td>{modalInvoice.GST_Total}</td></tr>
                          <tr className="total-row"><td>Total</td><td>{modalInvoice.Total_Amount}</td></tr>
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
                        <b>Receiver's Seal &amp; Signature</b>
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
                /* ── end invoice-container ── */
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceHistory;
