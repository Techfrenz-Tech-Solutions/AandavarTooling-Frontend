import React from "react";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
};

export default function Acknowledgement({ invoice, total }) {
  return (
    <div>
      {/* ── Dotted cut divider ── */}
      <div className="flex items-center px-2 my-1">
        <span className="text-gray-400 mr-1.5 text-base">✂</span>
        <div className="flex-1 border-t border-dashed border-gray-400" />
      </div>

      {/* ── Dark navy header band ── */}
      <div className="flex items-stretch" style={{ minHeight: "58px" }}>
        {/* Left — dark navy with curved bottom-right */}
        <div
          className="flex items-center px-5 py-2"
          style={{
            background: "#1e2430",
            borderBottomRightRadius: "56px",
            minWidth: "46%",
          }}
        >
          <h3
            className="font-extrabold tracking-widest uppercase"
            style={{ fontSize: "20px", color: "#c0c4cc", letterSpacing: "3px" }}
          >
            ACKNOWLEDGEMENT
          </h3>
        </div>

        {/* Right — white, company info right-aligned */}
        <div className="flex-1 flex flex-col items-end justify-center pr-5 bg-white">
          <p className="text-sm font-extrabold" style={{ color: "#1e2430" }}>
            SHREE AANDAVAR TOOLING
          </p>
          <p className="text-xs text-gray-500">GSTIN: 33BVBPP7144R1Z0</p>
          <p className="text-xs text-gray-500">STATE: 33-TAMIL NADU</p>
        </div>
      </div>

      {/* ── Body: 3 columns ── */}
      <div className="flex items-start gap-4 px-5 py-4 bg-white">
        {/* Invoice To */}
        <div className="flex-1 text-xs leading-6" style={{ color: "#333" }}>
          <p className="font-bold text-xs mb-0.5" style={{ color: "#d71920" }}>
            Invoice To:
          </p>
          <p className="font-extrabold text-sm" style={{ color: "#1e2430" }}>
            {invoice.Customer_Name}
          </p>
          <p>{invoice.Customer_Address}</p>
        </div>

        {/* Invoice Details */}
        <div className="flex-1 text-xs leading-6" style={{ color: "#333" }}>
          <p className="font-bold text-xs mb-0.5" style={{ color: "#d71920" }}>
            Invoice Details:
          </p>
          <p>Invoice No. : {invoice.Invoice_No}</p>
          <p>Invoice Date : {fmtDate(invoice.Invoice_Date)}</p>
          <p>Invoice Amount : {(parseFloat(total) || 0).toFixed(1)}</p>
        </div>

        {/* Receiver Seal */}
        <div
          className="flex flex-col items-center justify-end"
          style={{ minWidth: "150px", paddingTop: "28px" }}
        >
          <div
            className="border-t border-gray-500 mb-1"
            style={{ width: "130px" }}
          />
          <p className="text-xs text-gray-500 whitespace-nowrap">
            Receiver's Seal &amp; Sign
          </p>
        </div>
      </div>

      {/* ── Footer bar: red strip + dark navy curved ── */}
      <FooterDesign />
    </div>
  );
}

export function FooterDesign() {
  return (
    <div className="flex items-stretch" style={{ height: "30px" }}>
      {/* Red left strip */}
      <div style={{ background: "#d71920", width: "25%" }} />
      {/* Dark navy right — curved top-left */}
      <div
        style={{
          background: "#1e2430",
          flex: 1,
          borderTopLeftRadius: "52px",
        }}
      />
    </div>
  );
}
