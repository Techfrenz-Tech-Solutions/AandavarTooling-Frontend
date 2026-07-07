import React from "react";

const fmtRs = (n) => {
  const v = parseFloat(n) || 0;
  return "₹ " + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function TotalsCard({ subtotal, sgst, cgst, total, received, balance, paymentMode, gstLabel = "SGST" }) {
  return (
    <table className="w-full border-collapse text-xs">
      <tbody>
        <tr>
          <td className="py-1.5 px-3 border border-gray-200 text-gray-600">Sub Total</td>
          <td className="py-1.5 px-3 border border-gray-200 text-right font-semibold">{fmtRs(subtotal)}</td>
        </tr>
        <tr>
          <td className="py-1.5 px-3 border border-gray-200 text-gray-600">
            {gstLabel === "IGST" ? "IGST@12.0%" : "SGST@6.0%"}
          </td>
          <td className="py-1.5 px-3 border border-gray-200 text-right font-semibold">{fmtRs(sgst)}</td>
        </tr>
        {gstLabel !== "IGST" && (
          <tr>
            <td className="py-1.5 px-3 border border-gray-200 text-gray-600">CGST@6.0%</td>
            <td className="py-1.5 px-3 border border-gray-200 text-right font-semibold">{fmtRs(cgst)}</td>
          </tr>
        )}
        {/* Grand Total — red bg */}
        <tr style={{ background: "#d71920", color: "#fff" }}>
          <td className="py-2 px-3 border font-extrabold text-sm" style={{ borderColor: "#b5151b" }}>
            Total
          </td>
          <td className="py-2 px-3 border text-right font-extrabold text-sm" style={{ borderColor: "#b5151b" }}>
            {fmtRs(total)}
          </td>
        </tr>
        <tr>
          <td className="py-1.5 px-3 border border-gray-200 text-gray-600">Received</td>
          <td className="py-1.5 px-3 border border-gray-200 text-right font-semibold">{fmtRs(received)}</td>
        </tr>
        <tr>
          <td className="py-1.5 px-3 border border-gray-200 text-gray-600">Balance</td>
          <td className="py-1.5 px-3 border border-gray-200 text-right font-semibold">{fmtRs(balance)}</td>
        </tr>
        <tr>
          <td className="py-1.5 px-3 border border-gray-200 text-gray-600">Payment Mode</td>
          <td className="py-1.5 px-3 border border-gray-200 text-right font-semibold">{paymentMode}</td>
        </tr>
      </tbody>
    </table>
  );
}
