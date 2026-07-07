import React from "react";

export default function PaymentDetails() {
  return (
    <div className="px-4 py-3 text-xs leading-6" style={{ color: "#333" }}>
      <p className="font-bold text-sm mb-1" style={{ color: "#d71920" }}>
        Pay To:
      </p>
      <p>
        <span className="font-semibold">Bank Name : </span>
        Bank Of Baroda, Annanagar
      </p>
      <p>
        <span className="font-semibold">Bank Account No. : </span>
        75220200001446
      </p>
      <p>
        <span className="font-semibold">Bank IFSC Code : </span>
        BARB0VJMAAN
      </p>
      <p>
        <span className="font-semibold">Account Holder's Name : </span>
        SHREE AANDAVAR TOOLING
      </p>
    </div>
  );
}
