import logo from "../Assets/AandavarLogo2.png";
import "../CSS/deliveryTemplate.css";

function DeliveryChallanTemplate({ challanData }) {
  const items = challanData?.items || [];

  const formatDate = (d) => {
    if (!d) return new Date().toLocaleDateString("en-GB");
    try { return new Date(d).toLocaleDateString("en-GB"); }
    catch { return d; }
  };

  return (
    <div className="dc-page">

      {/* Watermark — visible in preview, hidden during PDF capture via .dc-capturing class */}
      <img
        src={`${process.env.PUBLIC_URL}/andavarwt.png`}
        alt=""
        className="dc-watermark dc-watermark-preview"
        aria-hidden="true"
      />
      <div className="dc-header">
        <img src={logo} alt="Shree Aandavar Tooling" className="dc-logo" />
        <div className="dc-company-info">
          <h2>SHREE AANDAVAR TOOLING</h2>
          <h4>Delivery Challan</h4>
          <p>5/520 D, Kabeer Nagar MasthanPatti, Madurai - 20</p>
          <p>prabusangari690@gmail.com &nbsp;|&nbsp; 9944130610</p>
          <p>GSTIN: 33BVBPP7144R1Z0</p>
        </div>
      </div>

      <div className="dc-divider" />

      {/* ══ CUSTOMER + CHALLAN META ══ */}
      <div className="dc-meta-row">

        {/* Left — recipient */}
        <div className="dc-meta-left">
          <div className="dc-meta-label">Bill To</div>
          <div className="dc-meta-value dc-meta-value--lg">
            {challanData?.recipientName || "—"}
          </div>
          {challanData?.recipientAddress && (
            <div className="dc-meta-value">{challanData.recipientAddress}</div>
          )}
        </div>

        {/* Right — challan details */}
        <div className="dc-meta-right">
          <div className="dc-meta-field">
            <span className="dc-field-label">Challan No :</span>
            <span className="dc-field-value">{challanData?.orderNo || "—"}</span>
          </div>
          <div className="dc-meta-field">
            <span className="dc-field-label">Date :</span>
            <span className="dc-field-value">{formatDate(challanData?.date)}</span>
          </div>
          <div className="dc-meta-field">
            <span className="dc-field-label">Vehicle No :</span>
            <span className="dc-field-value">
              <span className="dc-field-blank" />
            </span>
          </div>
        </div>

      </div>

      <div className="dc-divider dc-divider--thin" />

      {/* ══ ITEMS TABLE ══ */}
      <div className="dc-table-wrap">
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
              items.map((item, i) => (
                <tr key={i} className="dc-data-row">
                  <td className="dc-td dc-td--center">{i + 1}</td>
                  <td className="dc-td dc-td--left">{item.name}</td>
                  <td className="dc-td dc-td--center">{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="dc-td dc-td--empty">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ══ SIGNATURE FOOTER ══ */}
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

export default DeliveryChallanTemplate;
