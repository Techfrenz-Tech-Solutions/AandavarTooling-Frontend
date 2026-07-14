
import { useState, useEffect, useRef } from "react";
import api from "../api";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import "../CSS/Returndeliverychallan.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import DeliveryChallanTemplate from "./DeliveryChallanTemplate";

function DeliveryChallan() {
  const [challanNo, setChallanNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");

  const [productsList, setProductsList] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  const challanRef = useRef();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/custdrop/getdropCustomers");
      setCustomerOptions(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Add product (same)
  const addProduct = async () => {
    if (!challanNo || !customerName || !productName || !quantity) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      customerName,
      productName,
      quantity,
      created: new Date().toLocaleDateString(),
    };

    try {
      await api.post("/delivery/createDeliveryChallanItem", {
        DeliveryChallanNo: challanNo,
        customer_name: customerName,
        product_name: productName,
        quantity,
        created_date: new Date().toISOString().split("T")[0],
      });

      setProductsList([...productsList, newItem]);
      setProductName("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  // 🔥 NEW PDF (Template based, watermark composited on canvas)
  const generatePDF = async () => {
    if (!challanNo || productsList.length === 0) {
      alert("Add products first");
      return;
    }

    try {
      // Capture template without watermark img
      const canvas = await html2canvas(challanRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: challanRef.current.scrollWidth,
        windowHeight: challanRef.current.scrollHeight,
      });

      // Composite watermark onto canvas
      const wmImg = new Image();
      wmImg.crossOrigin = "anonymous";
      wmImg.src = `${window.location.origin}/andavarwt.png`;
      await new Promise((resolve) => { wmImg.onload = resolve; wmImg.onerror = resolve; });

      if (wmImg.complete && wmImg.naturalWidth > 0) {
        const ctx = canvas.getContext("2d");
        const wmW = canvas.width * 0.55;
        const wmH = (wmImg.naturalHeight / wmImg.naturalWidth) * wmW;
        const wmX = (canvas.width  - wmW) / 2;
        const wmY = (canvas.height - wmH) / 2;
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.translate(wmX + wmW / 2, wmY + wmH / 2);
        ctx.rotate((-15 * Math.PI) / 180);
        ctx.drawImage(wmImg, -wmW / 2, -wmH / 2, wmW, wmH);
        ctx.restore();
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210;
      const pageH = 297;
      const imgH  = (canvas.height * pageW) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH <= pageH ? imgH : pageH);
      pdf.save(`DeliveryChallan_${challanNo}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF failed");
    }
  };

  // 🔁 Data for template
  const challanData = {
    orderNo: challanNo,
    recipientName: customerName,
    recipientAddress: "Customer Address",
    date: new Date().toLocaleDateString(),
    items: productsList.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
    })),
  };

  return (
    <div className="sales-page">
      <Sidebar />
      <Topbar />

      {/* ✅ SAME OLD UI */}
      <div className="sales-header">
        <h1>Delivery Challan</h1>
        <p>Add multiple products for a single customer</p>
      </div>

      <div className="sales-form">
        <div className="sales-row">
          <div className="sales-group">
            <label>Challan Number</label>
            <input
              type="text"
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
              placeholder="Enter Challan Number"
              disabled={productsList.length > 0}
            />
          </div>

          <div className="sales-group">
            <label>Customer Name</label>
            <select
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={productsList.length > 0}
            >
              <option value="">Select Customer</option>
              {customerOptions.map((c, i) => (
                <option key={i} value={c.customer_name || c}>
                  {c.customer_name || c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sales-row">
          <div className="sales-group">
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div className="sales-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter Quantity"
            />
          </div>
        </div>

        <button className="sales-add-btn" onClick={addProduct}>
          Add Product
        </button>

        {/* 🔥 SAME BUTTON UI but new logic */}
        <button className="sales-pdf-btn" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>

      <div className="sales-table-card">
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {productsList.length === 0 ? (
              <tr>
                <td colSpan="5">No Products Added</td>
              </tr>
            ) : (
              productsList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.customerName}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.created}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 Hidden Template (ONLY for PDF) */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={challanRef}>
          <DeliveryChallanTemplate challanData={challanData} />
        </div>
      </div>
    </div>
  );
}

export default DeliveryChallan;