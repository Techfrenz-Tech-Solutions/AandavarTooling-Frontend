import React, { useEffect, useState } from "react";
import logo from "../Assets/AandavarLogo1.png";
import "../CSS/InvoiceTemplate.css";
import api from "../api";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ── Number to words ── */
function numberToWords(num) {
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const inWords = (n) => {
    if (n === 0) return "";
    if (n < 20)  return a[n];
    if (n < 100) return (b[Math.floor(n/10)] + " " + a[n%10]).trim();
    if (n < 1000) return (a[Math.floor(n/100)] + " Hundred " + inWords(n%100)).trim();
    if (n < 100000) return (inWords(Math.floor(n/1000)) + " Thousand " + inWords(n%1000)).trim();
    if (n < 10000000) return (inWords(Math.floor(n/100000)) + " Lakh " + inWords(n%100000)).trim();
    return (inWords(Math.floor(n/10000000)) + " Crore " + inWords(n%10000000)).trim();
  };
  const rupees = Math.floor(num);
  const paise  = Math.round((num - rupees) * 100);
  let result   = inWords(rupees) + " Rupees";
  if (paise > 0) result += " and " + inWords(paise) + " Paise";
  return result + " Only";
}

function InvoiceTemplate(props) {
  const params    = useParams();
  const invoiceNo = props?.invoiceNo || params?.invoiceNo;

  const [invoice,     setInvoice]     = useState(null);
  const [items,       setItems]       = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (invoiceNo) fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceNo]);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/sales/invoice/${encodeURIComponent(invoiceNo)}`);
      if (res.data.status === 1) {
        setInvoice(res.data.invoice);
        setItems(res.data.items);
      }
    } catch (err) { console.error("Invoice fetch error:", err); }
  };

  // const handleDownload = async () => {
  //   if (!invoice) return;
  //   setDownloading(true);
  //   try {
  //     const el     = document.getElementById("invoice-print");
  //     const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
  //     const pdf    = new jsPDF("p", "mm", "a4");
  //     const w      = 210;
  //     const h      = (canvas.height * w) / canvas.width;
  //     pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, h);
  //     pdf.save(`Invoice_${invoice.Invoice_No}.pdf`);
  //   } catch (err) { console.error(err); }
  //   setDownloading(false);
  // };


  const handleDownload = async () => {
  if (!invoice) return;

  setDownloading(true);

  try {
    const element = document.getElementById("invoice-print");

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`Invoice_${invoice.Invoice_No}.pdf`);
  } catch (err) {
    console.error(err);
  }

  setDownloading(false);
};


  if (!invoice) return <div style={{ padding: 40, textAlign: "center" }}>Loading Invoice…</div>;

  const cgst          = (invoice.GST_Total || 0) / 2;
  const sgst          = (invoice.GST_Total || 0) / 2;
  const amountInWords = numberToWords(parseFloat(invoice.Total_Amount) || 0);

  return (
    <div>
      {/* ── Download button ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}>
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Generating…" : "⬇ Download PDF"}
        </button>
      </div>

      {/* ══════════════ INVOICE ══════════════ */}
      <div id="invoice-print" className="invoice-container">

        {/* Watermark */}
        <img src="/AandavarLogo2.png" alt="" className="invoice-watermark" />

        {/* ── Top header strip ── */}
        <div className="inv-header">
          <div className="inv-header-dark">
            <span>📞 9944130610</span>
          </div>
          <div className="inv-header-red">
            <span>✉ prabusangari690@gmail.com</span>
            <span>📍 5/520 D, Kabeer Nagar MasthanPatti, Madurai - 20</span>
          </div>
        </div>

        {/* ── Company band ── */}
        <div className="inv-company-band">
          <div className="inv-company-panel">
            <img src={logo} alt="Logo" className="inv-company-logo" />
            <div className="inv-company-text">
              <h2>SHREE AANDAVAR TOOLING</h2>
              <p>GSTIN: 33BVBPP7144R1Z0</p>
              <p>State: 33-Tamil Nadu</p>
            </div>
          </div>
          <div className="inv-title-panel">
            <h1>Tax Invoice</h1>
          </div>
        </div>

        {/* ── Invoice meta (right side) ── */}
        {/* removed standalone meta-block — merged into bill-section below */}

        {/* ── Bill To + Invoice Meta side by side ── */}
        <div style={{ display: "flex", alignItems: "flex-start", borderBottom: "1px solid #ddd" }}>
          {/* Bill To — left */}
          <div className="inv-bill-section" style={{ flex: 1 }}>
            <div className="inv-section-title">Bill To</div>
            <p><b>Company Name: </b><span>{invoice.Customer_Name}</span></p>
            <p>Address: <span>{invoice.Customer_Address}</span></p>
            <p>Contact No: <span>{invoice.Customer_Phone}</span></p>
            <p>GSTIN Number: <span>{invoice.Customer_GSTIN}</span></p>
            <p>State: <span>Tamil Nadu</span></p>
          </div>

          {/* Invoice meta — right */}
          <div style={{ minWidth: 220, padding: "10px 20px", fontSize: 12, lineHeight: 2 }}>
            <p style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#c0392b" }}>Invoice No:</span>
              <span style={{ fontWeight: 700 }}>{invoice.Invoice_No}</span>
            </p>
            <p style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#c0392b" }}>Date:</span>
              <span style={{ fontWeight: 700 }}>{new Date(invoice.Invoice_Date).toLocaleDateString("en-IN")}</span>
            </p>
            <p style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#c0392b" }}>Place of Supply:</span>
              <span style={{ fontWeight: 700 }}>33-Tamil Nadu</span>
            </p>
          </div>
        </div>

        {/* ── Items table ── */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "30%" }}>Item Name</th>
              <th style={{ width: "12%" }}>HSN/SAC</th>
              <th style={{ width: "11%" }}>Quantity</th>
              <th style={{ width: "13%" }}>Price/unit</th>
              <th style={{ width: "12%" }}>GST</th>
              <th style={{ width: "13%" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.Sale_ID || i}>
                <td>{i + 1}</td>
                <td>{item.Product_Name}</td>
                <td>{item.HSN || "-"}</td>
                <td>{item.Quantity}</td>
                <td>{item.Price}</td>
                <td>{((item.CGST || 0) + (item.SGST || 0))}%</td>
                <td>{item.Total_Amount}</td>
              </tr>
            ))}
            {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
              <tr key={"f" + i} className="filler-row">
                <td /><td /><td /><td /><td /><td /><td />
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Pay To + Totals ── */}
        <div className="inv-bottom">
          <div className="inv-payto">
            <div className="inv-section-title">Pay To:</div>
            <p>Bank Name: BANK OF BARODA</p>
            <p>Bank Account No: 75220200001446</p>
            <p>Bank IFSC Code: BARB0VJMAAN</p>
            <p>Account Holder's Name: SHREE AANDAVAR TOOLING</p>
          </div>
          <div className="inv-totals">
            <table>
              <tbody>
                <tr><td>Sub Total</td><td>{invoice.Subtotal}</td></tr>
                <tr><td>SGST@6.0%</td><td>{sgst.toFixed(2)}</td></tr>
                <tr><td>CGST@6.0%</td><td>{cgst.toFixed(2)}</td></tr>
                <tr className="inv-total-final">
                  <td>Total</td><td>{invoice.Total_Amount}</td>
                </tr>
                <tr><td>Received</td><td>{invoice.Received || 0}</td></tr>
                <tr><td>Balance</td><td>{invoice.Total_Amount}</td></tr>
                <tr><td>Payment Mode</td><td>{invoice.Payment_Mode || "Credit"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Amount in words ── */}
        <div className="inv-words-section">
          <div className="inv-words-label">Invoice Amount In Words</div>
          <div className="inv-words-line">{amountInWords}</div>
        </div>

        {/* ── Terms ── */}
        <div className="inv-terms">
          <div className="inv-terms-title">Terms And Conditions</div>
          <p>Thank you for doing business with us.</p>
          <p>For: SHREE AANDAVAR TOOLING</p>
        </div>

        {/* ── Signature footer ── */}
        <div className="inv-sig-footer">
          <div className="inv-sig-left">
            <div className="inv-sig-line-full" />
            <p>Authorized Signatory</p>
            <p>M. PRABAHARAN</p>
          </div>
          <div className="inv-sig-right">
            <div className="inv-sig-line-full" />
            <p>Receiver's Seal &amp; Sign</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default InvoiceTemplate;
