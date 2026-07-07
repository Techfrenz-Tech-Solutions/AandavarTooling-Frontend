import React from "react";

export default function CustomerDetails({ invoice }) {
  const fmtDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
  };

  return (
    <div className="flex justify-between px-5 py-3 border-b border-gray-200">
      {/* Bill To */}
      <div className="text-xs leading-6" style={{ color: "#333" }}>
        <p className="font-bold text-sm mb-0.5" style={{ color: "#d71920" }}>
          Bill To
        </p>
        <p className="font-extrabold text-sm" style={{ color: "#1e2430" }}>
          {invoice.Customer_Name}
        </p>
        <p>{invoice.Customer_Address}</p>
        <p>
          <span className="font-semibold">Contact No. : </span>
          {invoice.Customer_Phone}
        </p>
        <p>
          <span className="font-semibold">GSTIN Number : </span>
          {invoice.Customer_GSTIN}
        </p>
        <p>
          <span className="font-semibold">State : </span>
          33 - Tamil Nadu
        </p>
      </div>

      {/* Invoice Meta */}
      <div className="text-xs leading-7 min-w-[210px]" style={{ color: "#333" }}>
        <div className="flex justify-between gap-4">
          <span className="font-semibold">Invoice No. :</span>
          <span className="font-bold">{invoice.Invoice_No}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-semibold">Date :</span>
          <span className="font-bold">{fmtDate(invoice.Invoice_Date)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-semibold">Place of Supply :</span>
          <span className="font-bold">33 - Tamil Nadu</span>
        </div>
      </div>
    </div>
  );
}
