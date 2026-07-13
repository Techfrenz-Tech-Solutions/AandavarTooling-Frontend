import React, { useEffect, useState } from "react";
import logo from "../Assets/AandavarLogo1.png";
import "../CSS/InvoiceTemplate.css";
import api from "../api";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ── NUMBER TO WORDS ── */
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    if (!n) return "";
    if (n < 20) return a[n];
    if (n < 100) return (b[Math.floor(n / 10)] + " " + a[n % 10]).trim();
    if (n < 1000)
      return (a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100)).trim();
    if (n < 100000)
      return (inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000)).trim();
    if (n < 10000000)
      return (inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000)).trim();
    return (inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000)).trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let result = (inWords(rupees) || "Zero") + " Rupees";
  if (paise > 0) result += " and " + inWords(paise) + " Paise";
  return result + " Only";
}

/* ── FORMAT DATE ── */
function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/* ── FORMAT RUPEES ── */
function fmtRs(n) {
  const v = parseFloat(n) || 0;
  return "₹ " + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function InvoiceTemplate(props) {
  const params = useParams();
  const invoiceNo = props?.invoiceNo || params?.invoiceNo;

  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoiceNo) fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceNo]);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(
        `/sales/invoice/${encodeURIComponent(invoiceNo)}`
      );
      if (res.data.status === 1) {
        setInvoice(res.data.invoice);
        setItems(res.data.items);
      }
    } catch (err) {
      console.error("Invoice fetch error:", err);
    }
  };

  /* ── DOWNLOAD PDF ── */
  const handleDownload = async () => {
    setLoading(true);
    try {
      const input = document.getElementById("inv-print-area");
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = pdfW;
      const imgH = (canvas.height * pdfW) / canvas.width;
      const scale = imgH > pdfH ? pdfH / imgH : 1;
      pdf.addImage(imgData, "PNG", 0, 0, imgW * scale, imgH * scale);
      pdf.save(`Invoice_${invoice?.Invoice_No || "file"}.pdf`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!invoice) return <div className="inv-loading">Loading Invoice…</div>;

  const subtotal = parseFloat(invoice.Subtotal) || 0;
  const gstTotal = parseFloat(invoice.GST_Total) || 0;
  const sgst = gstTotal / 2;
  const cgst = gstTotal / 2;
  const total = parseFloat(invoice.Total_Amount) || 0;
  const received = parseFloat(invoice.Received) || 0;
  const balance = total - received;
  const paymentMode = invoice.Payment_Mode || "Credit";

  const amountInWords = numberToWords(total);

  /* fill rows to minimum 5 for table appearance */
  const MIN_ROWS = 5;
  const fillerCount = Math.max(0, MIN_ROWS - items.length);

  return (
    <div className="inv-page-wrap">
      {/* ── DOWNLOAD BUTTON ── */}
      <div className="inv-btn-row">
        <button
          className="inv-download-btn"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? "Generating…" : "⬇ Download PDF"}
        </button>
      </div>

      {/* ══════════════════════════════════════
          PRINT AREA
      ══════════════════════════════════════ */}
      <div id="inv-print-area" className="inv-root">

        {/* ── TOP CONTACT BAR ── */}
        <div className="inv-topbar">
          <div className="inv-topbar-logo-box">
            <img src={logo} alt="Logo" className="inv-topbar-logo" />
          </div>
          <div className="inv-topbar-contacts">
            <span className="inv-topbar-item">
              <span className="inv-topbar-icon">📞</span> 9944130610
            </span>
            <span className="inv-topbar-divider" />
            <span className="inv-topbar-item">
              <span className="inv-topbar-icon">✉</span> prabusangari690@gmail.com
            </span>
            <span className="inv-topbar-divider" />
            <span className="inv-topbar-item">
              <span className="inv-topbar-icon">📍</span>
              1/02A,ulakam eri ambalakkaranpatti Madurai
            </span>
          </div>
          <div className="inv-topbar-original">ORIGINAL</div>
        </div>

        {/* ── COMPANY + TITLE ROW ── */}
        <div className="inv-company-row">
          <div className="inv-company-panel">
            <div className="inv-company-inner">
              <div className="inv-company-text">
                <div className="inv-company-name">SHREE AANDAVAR TOOLING</div>
                <div className="inv-company-gstin">GSTIN: 33BVBPP7144R1Z0</div>
                <div className="inv-company-state">State: 33-Tamil Nadu</div>
              </div>
            </div>
          </div>
          <div className="inv-title-panel">
            <div className="inv-tax-invoice-title">Tax Invoice</div>
          </div>
        </div>

        {/* ── BILL TO + INVOICE META ── */}
        <div className="inv-bill-meta-row">
          <div className="inv-bill-to">
            <div className="inv-section-label">Bill To</div>
            <div className="inv-customer-name">{invoice.Customer_Name}</div>
            <div className="inv-customer-addr">{invoice.Customer_Address}</div>
            <div className="inv-customer-row">
              <span className="inv-customer-field-label">Contact No.:</span>
              <span>{invoice.Customer_Phone}</span>
            </div>
            <div className="inv-customer-row">
              <span className="inv-customer-field-label">GSTIN Number:</span>
              <span>{invoice.Customer_GSTIN}</span>
            </div>
            <div className="inv-customer-row">
              <span className="inv-customer-field-label">State:</span>
              <span>33-Tamil Nadu</span>
            </div>
          </div>

          <div className="inv-meta">
            <div className="inv-meta-row">
              <span className="inv-meta-label">Invoice No.:</span>
              <span className="inv-meta-val">{invoice.Invoice_No}</span>
            </div>
            <div className="inv-meta-row">
              <span className="inv-meta-label">Date:</span>
              <span className="inv-meta-val">{fmtDate(invoice.Invoice_Date)}</span>
            </div>
            <div className="inv-meta-row">
              <span className="inv-meta-label">Place of Supply:</span>
              <span className="inv-meta-val">33-Tamil Nadu</span>
            </div>
          </div>
        </div>

        {/* ── ITEMS TABLE ── */}
        <table className="inv-items-table">
          <thead>
            <tr>
              <th className="inv-th inv-th-sno">#</th>
              <th className="inv-th inv-th-item">Item name</th>
              <th className="inv-th inv-th-hsn">HSN/ SAC</th>
              <th className="inv-th inv-th-qty">Quantity</th>
              <th className="inv-th inv-th-price">Price/ unit</th>
              <th className="inv-th inv-th-gst">GST</th>
              <th className="inv-th inv-th-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const gstPct = (parseFloat(item.CGST) || 0) + (parseFloat(item.SGST) || 0);
              const itemGstAmt = parseFloat(item.GST_Amount) || (parseFloat(item.Total_Amount) - parseFloat(item.Sub_Total)) || 0;
              return (
                <tr key={item.Sale_ID || i} className="inv-td-row">
                  <td className="inv-td inv-td-center">{i + 1}</td>
                  <td className="inv-td inv-td-left">{item.Product_Name}</td>
                  <td className="inv-td inv-td-center">{item.HSN_SAC || ""}</td>
                  <td className="inv-td inv-td-center">{item.Quantity}</td>
                  <td className="inv-td inv-td-right">
                    ₹ {parseFloat(item.Price).toFixed(1)}
                  </td>
                  <td className="inv-td inv-td-right">
                    {fmtRs(itemGstAmt)} ({gstPct}.0%)
                  </td>
                  <td className="inv-td inv-td-right">
                    {fmtRs(item.Total_Amount)}
                  </td>
                </tr>
              );
            })}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <tr key={"filler-" + i} className="inv-td-row inv-filler-row">
                <td className="inv-td">&nbsp;</td>
                <td className="inv-td">&nbsp;</td>
                <td className="inv-td">&nbsp;</td>
                <td className="inv-td">&nbsp;</td>
                <td className="inv-td">&nbsp;</td>
                <td className="inv-td">&nbsp;</td>
                <td className="inv-td">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── BANK + TOTALS ROW ── */}
        <div className="inv-bank-totals-row">
          {/* Bank / Pay To */}
          <div className="inv-bank-section">
            <div className="inv-pay-to-label">Pay To:</div>
            <div className="inv-bank-line">
              <span className="inv-bank-field">Bank Name</span>
              <span>Bank Of Baroda, Annanagar</span>
            </div>
            <div className="inv-bank-line">
              <span className="inv-bank-field">Bank Account No.:</span>
              <span>75220200001446</span>
            </div>
            <div className="inv-bank-line">
              <span className="inv-bank-field">Bank IFSC code:</span>
              <span>BARB0VJMAAN</span>
            </div>
            <div className="inv-bank-line">
              <span className="inv-bank-field">Account Holder's Name:</span>
              <span>SHREE AANDAVAR TOOLING</span>
            </div>
          </div>

          {/* Totals */}
          <div className="inv-totals-section">
            <table className="inv-totals-table">
              <tbody>
                <tr>
                  <td className="inv-tot-label">Sub Total</td>
                  <td className="inv-tot-val">{fmtRs(subtotal)}</td>
                </tr>
                <tr>
                  <td className="inv-tot-label">SGST@6.0%</td>
                  <td className="inv-tot-val">{fmtRs(sgst)}</td>
                </tr>
                <tr>
                  <td className="inv-tot-label">CGST@6.0%</td>
                  <td className="inv-tot-val">{fmtRs(cgst)}</td>
                </tr>
                <tr className="inv-tot-total-row">
                  <td className="inv-tot-label">Total</td>
                  <td className="inv-tot-val">{fmtRs(total)}</td>
                </tr>
                <tr>
                  <td className="inv-tot-label">Received</td>
                  <td className="inv-tot-val">{fmtRs(received)}</td>
                </tr>
                <tr>
                  <td className="inv-tot-label">Balance</td>
                  <td className="inv-tot-val">{fmtRs(balance)}</td>
                </tr>
                <tr>
                  <td className="inv-tot-label">Payment Mode</td>
                  <td className="inv-tot-val">{paymentMode}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── AMOUNT IN WORDS ── */}
        <div className="inv-words-section">
          <div className="inv-words-title">Invoice Amount In Words</div>
          <div className="inv-words-text">{amountInWords}</div>
        </div>

        {/* ── TERMS ── */}
        <div className="inv-terms-section">
          <div className="inv-terms-title">Terms And Conditions</div>
          <div className="inv-terms-text">Thank you for doing business with us.</div>
        </div>

        {/* ── SIGNATURE FOOTER ── */}
        <div className="inv-sig-footer">
          <div className="inv-sig-left">
            <div className="inv-sig-for">For: SHREE AANDAVAR TOOLING</div>
            <div className="inv-sig-box"></div>
            <div className="inv-sig-name">M.PRABAHARAN</div>
          </div>
        </div>

        {/* ── SCISSOR CUT LINE ── */}
        <div className="inv-cut-line">
          <span className="inv-scissors">✂</span>
          <div className="inv-dashed-line"></div>
        </div>

        {/* ══════════════════════════════════════
            ACKNOWLEDGEMENT SECTION
        ══════════════════════════════════════ */}
        <div className="inv-ack-root">
          {/* Dark header bar */}
          <div className="inv-ack-header">
            <div className="inv-ack-title-panel">
              <span className="inv-ack-title">ACKNOWLEDGEMENT</span>
            </div>
            <div className="inv-ack-company-panel">
              <div className="inv-ack-company-name">SHREE AANDAVAR TOOLING</div>
              <div className="inv-ack-company-sub">GSTIN: 33BVBPP7144R1Z0</div>
              <div className="inv-ack-company-sub">STATE: 33-TAMIL NADU</div>
            </div>
          </div>

          {/* Ack body */}
          <div className="inv-ack-body">
            <div className="inv-ack-col">
              <div className="inv-ack-field-title">Invoice To:</div>
              <div className="inv-ack-customer-name">{invoice.Customer_Name}</div>
              <div className="inv-ack-customer-addr">{invoice.Customer_Address}</div>
            </div>

            <div className="inv-ack-col">
              <div className="inv-ack-field-title">Invoice Details:</div>
              <div>Invoice No. : {invoice.Invoice_No}</div>
              <div>Invoice Date : {fmtDate(invoice.Invoice_Date)}</div>
              <div>Invoice Amount : {total.toFixed(1)}</div>
            </div>

            <div className="inv-ack-col inv-ack-sign-col">
              <div className="inv-ack-sign-line"></div>
              <div className="inv-ack-sign-label">Receiver's Seal & Sign</div>
            </div>
          </div>

          {/* Bottom red bar */}
          <div className="inv-ack-footer-bar"></div>
        </div>

      </div>
      {/* end inv-print-area */}
    </div>
  );
}

export default InvoiceTemplate;
