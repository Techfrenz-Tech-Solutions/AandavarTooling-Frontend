import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../api";

import InvoiceHeader      from "./Invoice/InvoiceHeader";
import CustomerDetails    from "./Invoice/CustomerDetails";
import InvoiceTable       from "./Invoice/InvoiceTable";
import TotalsCard         from "./Invoice/TotalsCard";
import PaymentDetails     from "./Invoice/PaymentDetails";
import InvoiceNote        from "./Invoice/InvoiceNote";
import Terms              from "./Invoice/Terms";
import Signature          from "./Invoice/Signature";
import Acknowledgement    from "./Invoice/Acknowledgement";

function numberToWords(num) {
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const w = (n) => {
    if (!n) return "";
    if (n < 20) return a[n];
    if (n < 100) return (b[Math.floor(n/10)]+" "+a[n%10]).trim();
    if (n < 1000) return (a[Math.floor(n/100)]+" Hundred "+w(n%100)).trim();
    if (n < 100000) return (w(Math.floor(n/1000))+" Thousand "+w(n%1000)).trim();
    if (n < 10000000) return (w(Math.floor(n/100000))+" Lakh "+w(n%100000)).trim();
    return (w(Math.floor(n/10000000))+" Crore "+w(n%10000000)).trim();
  };
  const rupees = Math.floor(num);
  const paise  = Math.round((num - rupees) * 100);
  let res = (w(rupees) || "Zero") + " Rupees";
  if (paise > 0) res += " and " + w(paise) + " Paise";
  return res + " Only";
}

export default function InvoiceTemplate2(props) {
  const params    = useParams();
  const invoiceNo = props?.invoiceNo || params?.invoiceNo;

  const [invoice,  setInvoice]  = useState(null);
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(false);

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
    } catch (err) { console.error(err); }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const el     = document.getElementById("inv-a4");
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
      const pdf    = new jsPDF("p", "mm", "a4");
      const pdfW   = pdf.internal.pageSize.getWidth();
      const pdfH   = pdf.internal.pageSize.getHeight();
      const imgH   = (canvas.height * pdfW) / canvas.width;
      const scale  = imgH > pdfH ? pdfH / imgH : 1;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pdfW * scale, imgH * scale);
      pdf.save(`Invoice_${invoice?.Invoice_No || "file"}.pdf`);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-sm">
        Loading Invoice…
      </div>
    );
  }

  const subtotal    = parseFloat(invoice.Subtotal)      || 0;
  const igst        = parseFloat(invoice.GST_Total)     || 0;
  const total       = parseFloat(invoice.Total_Amount)  || 0;
  const received    = parseFloat(invoice.Received)      || 0;
  const balance     = total - received;
  const paymentMode = invoice.Payment_Mode              || "Credit";

  return (
    <div
      className="min-h-screen flex flex-col items-center py-6 print:bg-white print:py-0"
      style={{ background: "#f0f0f0" }}
    >
      <div className="mb-3 flex justify-end print:hidden" style={{ width: "794px" }}>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="text-white text-sm font-bold px-5 py-2 rounded transition-colors"
          style={{ background: loading ? "#999" : "#d71920", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating…" : "⬇ Download PDF"}
        </button>
      </div>

      <div
        id="inv-a4"
        className="bg-white shadow-lg print:shadow-none overflow-hidden flex flex-col"
        style={{ width: "794px", minHeight: "1123px", fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <InvoiceHeader />
        <CustomerDetails invoice={invoice} />

        <div className="flex border-t border-gray-200">
          <div className="flex-1 flex flex-col border-r border-gray-200">
            <InvoiceTable items={items} />
            <div className="border-t border-gray-200 flex-1">
              <PaymentDetails />
            </div>
          </div>
          <div style={{ width: "240px", flexShrink: 0 }}>
            <TotalsCard
              subtotal={subtotal}
              sgst={igst}
              cgst={0}
              total={total}
              received={received}
              balance={balance}
              paymentMode={paymentMode}
              gstLabel="IGST"
            />
          </div>
        </div>

        <InvoiceNote amountInWords={numberToWords(total)} />
        <Terms />
        <Signature />

        <div className="mt-auto">
          <Acknowledgement invoice={invoice} total={total} />
        </div>
      </div>
    </div>
  );
}
