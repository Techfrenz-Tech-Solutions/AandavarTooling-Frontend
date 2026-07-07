import React from "react";

export default function Signature() {
  return (
    <div className="px-5 py-3">
      <p className="text-xs font-semibold mb-1" style={{ color: "#333" }}>
        For: SHREE AANDAVAR TOOLING
      </p>
      {/* Signature box */}
      <div
        className="border border-gray-300 bg-white"
        style={{ width: "130px", height: "54px" }}
      />
      <p className="text-xs font-bold mt-1" style={{ color: "#1e2430" }}>
        M.PRABAHARAN
      </p>
      <p className="text-xs text-gray-500">Authorized Signatory</p>
    </div>
  );
}
