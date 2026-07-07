import React from "react";
import logo from "../../Assets/AandavarLogo1.png";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function InvoiceHeader() {
  return (
    <div>
      {/* ── Red top bar ── */}
      <div
        className="flex items-center justify-between px-4"
        style={{ background: "#d71920", height: "55px" }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Contact centre */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-white text-xs font-medium">
            <FiPhone size={13} />
            9944130610
          </span>
          <span className="flex items-center gap-1 text-white text-xs font-medium">
            <FiMail size={13} />
            prabusangari690@gmail.com
          </span>
        </div>

        {/* Address */}
        <span className="flex items-center gap-1 text-white text-xs font-medium text-right max-w-[180px]">
          <FiMapPin size={13} className="flex-shrink-0" />
          1/02A, Ulakam eri ambalakkaranpatti, Madurai
        </span>
      </div>

      {/* ── Dark navy company band ── */}
      <div className="flex items-stretch" style={{ background: "#1e2430", minHeight: "72px" }}>
        {/* Company info left */}
        <div
          className="flex flex-col justify-center px-5 py-3 text-white"
          style={{
            width: "52%",
            borderBottomRightRadius: "56px",
            background: "#1e2430",
          }}
        >
          <h1 className="text-lg font-extrabold tracking-wide leading-tight">
            SHREE AANDAVAR TOOLING
          </h1>
          <p className="text-xs text-gray-300 mt-0.5">GSTIN: 33BVBPP7144R1Z0</p>
          <p className="text-xs text-gray-300">State: 33 - Tamil Nadu</p>
        </div>

        {/* Title right */}
        <div className="flex-1 flex items-center justify-end pr-6 bg-white">
          <h2
            className="font-extrabold tracking-wide"
            style={{ fontSize: "26px", color: "#1e2430" }}
          >
            Tax Invoice
          </h2>
        </div>
      </div>
    </div>
  );
}
