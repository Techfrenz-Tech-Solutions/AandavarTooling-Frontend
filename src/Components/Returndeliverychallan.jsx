import { useState, useEffect, useRef } from "react";
import api from "../api";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import "../CSS/Returndeliverychallan.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ReturnDeliveryChallanTemplate from "./ReturnDeliveryChallanTemplate";

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

  // 🔥 NEW PDF (Template based, UI unchanged)
  const generatePDF = async () => {
    if (!challanNo || productsList.length === 0) {
      alert("Add products first");
      return;
    }

    try {
      const canvas = await html2canvas(challanRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`ReturnDeliveryChallan_${challanNo}.pdf`);
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
        <h1>Return Delivery Challan</h1>
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
          <ReturnDeliveryChallanTemplate challanData={challanData} />
        </div>
      </div>
    </div>
  );
}

export default DeliveryChallan;