import React from "react";
import logo from "../Assets/AandavarLogo2.png";
import watermark from "../Assets/AandavarLogo2.png";
import "../CSS/deliveryTemplate.css";

function ReturnDeliveryChallanTemplate({ challanData }) {
  const items = challanData?.items || [];

  return (
    <div className="dc-page">

      {/* ── WATERMARK ── */}
      <img src={watermark} alt="" className="dc-watermark" />

      {/* ── HEADER ── */}
      <div className="dc-header">
        <img src={logo} alt="Logo" className="dc-logo" />
        <div className="dc-company-info">
          <h2>SHREE AANDAVAR TOOLING</h2>
          <h4>Return Delivery Challan</h4>
          <p>📍 5/520 D, Kabeer Nagar MasthanPatti, Madurai - 20</p>
          <p>✉ prabusangari690@gmail.com &nbsp;|&nbsp; 📞 9944130610</p>
          <p>GSTIN: 33BVBPP7144R1Z0</p>
        </div>
      </div>

      <div className="dc-divider" />

      {/* ── CUSTOMER + CHALLAN META ── */}
      <div className="dc-meta-row">
        <div className="dc-meta-left">
          <div className="dc-meta-label">To</div>
          <div className="dc-meta-value dc-meta-value--lg">
            {challanData?.recipientName || "—"}
          </div>
          <div className="dc-meta-value">
            {challanData?.recipientAddress || "—"}
          </div>
        </div>

        <div className="dc-meta-right">
          <div className="dc-meta-field">
            <span className="dc-field-label">Challan No</span>
            <span className="dc-field-value">{challanData?.orderNo || "—"}</span>
          </div>
          <div className="dc-meta-field">
            <span className="dc-field-label">Date</span>
            <span className="dc-field-value">
              {challanData?.date
                ? new Date(challanData.date).toLocaleDateString("en-GB")
                : new Date().toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className="dc-meta-field">
            <span className="dc-field-label">Vehicle No</span>
            <span className="dc-field-value dc-field-blank" />
          </div>
        </div>
      </div>

      <div className="dc-divider dc-divider--thin" />

      {/* ── ITEMS TABLE ── */}
      <table className="dc-table">
        <thead>
          <tr>
            <th className="dc-th dc-th--sl">Sl. No</th>
            <th className="dc-th dc-th--particulars">Particulars</th>
            <th className="dc-th dc-th--qty">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index} className="dc-data-row">
                <td className="dc-td dc-td--center">{index + 1}</td>
                <td className="dc-td dc-td--left">{item.name}</td>
                <td className="dc-td dc-td--center">{item.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="dc-td dc-td--empty">No items</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── FOOTER SIGNATURE ── */}
      <div className="dc-footer">
        <div className="dc-footer-col">
          <p className="dc-footer-note">Received the goods in good condition</p>
          <div className="dc-sig-block">
            <div className="dc-sig-line-bar" />
            <span className="dc-sig-label">Party's Signature</span>
          </div>
        </div>
        <div className="dc-footer-col dc-footer-col--right">
          <p className="dc-footer-note">For SHREE AANDAVAR TOOLING</p>
          <div className="dc-sig-block">
            <div className="dc-sig-line-bar" />
            <span className="dc-sig-label">Authorized Signatory</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ReturnDeliveryChallanTemplate;
