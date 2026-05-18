import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceTemplate from "./InvoiceTemplate";
import "../CSS/InvoiceTemplate.css";
 
function InvoicePDF() {
  const invoiceRef = useRef();
 
  const downloadPDF = async () => {
    const element = invoiceRef.current;
 
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
 
    const imgData = canvas.toDataURL("image/png");
 
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
 
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
 
    let scale = 1;
    if (imgHeight > pdfHeight) {
      scale = pdfHeight / imgHeight;
    }
 
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth * scale, imgHeight * scale);
    pdf.save("Invoice.pdf");
  };
 
  return (
    <div>
      {/* Your button design is exactly preserved */}
      <button
        onClick={downloadPDF}
        style={{
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          padding: "12px 25px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
 
      {/* Invoice off-screen for capture */}
      <div
        ref={invoiceRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          minHeight: "297mm",
        }}
      >
        <InvoiceTemplate />
      </div>
    </div>
  );
}
 
export default InvoicePDF;