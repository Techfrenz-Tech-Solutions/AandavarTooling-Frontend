import React from "react";

export default function InvoiceNote({ amountInWords }) {
  return (
    <div className="px-5 py-2 border-t border-gray-200">
      <p className="text-xs font-bold mb-0.5" style={{ color: "#16a34a" }}>
        Invoice Amount In Words
      </p>
      <p className="text-xs italic font-semibold" style={{ color: "#333" }}>
        {amountInWords}
      </p>
    </div>
  );
}
