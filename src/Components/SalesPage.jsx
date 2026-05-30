import { useState, useEffect } from "react";
import api from "../api";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import InvoicePDF from "../Components/InvoicePDF";
import "../CSS/SalesPage.css";

function SalesPage() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [customer, setCustomer] = useState({});
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [itemList, setItemList] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  const sgst = 9;
  const cgst = 9;

  const [loading, setLoading] = useState(false);

  /* LOAD PAGE */
  useEffect(() => {
    getInvoiceNumber();
    fetchCustomers();
  }, []);

  /* GET INVOICE NUMBER */
  const getInvoiceNumber = async () => {
    try {
      const res = await api.get("/sales/getInvoiceNumber");

      if (res.data.status === 1) {
        setInvoiceNo(res.data.invoiceNo);
      }

      setInvoiceDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error(error);
    }
  };

  /* FETCH CUSTOMERS */
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers/getCustomers");
      setCustomerOptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* GET CUSTOMER DETAILS */
  const handleCustomerChange = async (id) => {
    try {
      const res = await api.post("/customers/getCustomer", { S_No: id });

      if (res.data.status === 1) {
        setCustomer(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ADD ITEM + SAVE TO DATABASE */
  const addItem = async () => {
    if (!productName || !quantity || !price) {
      alert("Enter product details");
      return;
    }

    if (!customer?.Cus_Name) {
      alert("Select customer first");
      return;
    }

    setLoading(true);

    try {
      const subTotal = Number(quantity) * Number(price);
      const gstAmount = subTotal * ((sgst + cgst) / 100);
      const total = subTotal + gstAmount;

      await api.post("/sales/addsales", {
        Invoice_No: invoiceNo,
        Invoice_Date: invoiceDate,
        Customer_Name: customer.Cus_Name,
        Customer_Address: customer.Cus_Address,
        Customer_Phone: customer.Cus_Phno,
        Customer_GSTIN: customer.Cus_GSTIN,
        Product_Name: productName,
        Quantity: quantity,
        Price: price,
        SGST: sgst,
        CGST: cgst,
        Sub_Total: subTotal,
        GST_Total: gstAmount,
        Total_Amount: total,
      });

      const newItem = {
        productName,
        quantity,
        price,
        subTotal,
        gstAmount,
        total,
      };

      setItemList([...itemList, newItem]);

      setProductName("");
      setQuantity("");
      setPrice("");
    } catch (error) {
      console.error(error);
      alert("Item save failed");
    }

    setLoading(false);
  };

  /* DELETE ITEM (ONLY FRONTEND) */
  const deleteItem = (index) => {
    const updated = itemList.filter((_, i) => i !== index);
    setItemList(updated);
  };

  /* TOTALS */
  const subTotal = itemList.reduce((sum, item) => sum + item.subTotal, 0);
  const gstAmount = itemList.reduce((sum, item) => sum + item.gstAmount, 0);
  const totalAmount = itemList.reduce((sum, item) => sum + item.total, 0);

  /* CLEAR FORM */
  const clearForm = () => {
    setCustomer({});
    setProductName("");
    setQuantity("");
    setPrice("");
    setItemList([]);
    getInvoiceNumber();
  };

  /* SAVE INVOICE (NO API NOW) */
  const saveInvoice = () => {
    if (itemList.length === 0) {
      alert("No items added");
      return;
    }

    alert("Invoice Completed Successfully");
    clearForm();
  };

  /* PDF DATA */
  const saleData = {
    invoiceNo,
    invoiceDate,
    customerName: customer?.Cus_Name,
    address: customer?.Cus_Address,
    phone: customer?.Cus_Phno,
    gst: customer?.Cus_GSTIN,
    items: itemList,
    subtotal: subTotal,
    gstAmount,
    total: totalAmount,
  };

  return (
    <div className="sales-page">
      <Sidebar />
      <Topbar />

      <div className="sales-header">
        <h1>Sales</h1>
      </div>

      <div className="sales-form">
        <div className="sales-row">
          <div className="sales-group">
            <label>Invoice No</label>
            <input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>

          <div className="sales-group">
            <label>Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>
        </div>

        <div className="sales-row">
          <div className="sales-group">
            <label>Customer</label>
            <select
              value={customer?.S_No || ""}
              onChange={(e) => handleCustomerChange(e.target.value)}
            >
              <option value="">Select</option>
              {customerOptions.map((c) => (
                <option key={c.S_No} value={c.S_No}>
                  {c.Cus_Name}
                </option>
              ))}
            </select>
          </div>

          <div className="sales-group">
            <label>Product</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
        </div>

        <div className="sales-row">
          <div className="sales-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="sales-group">
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <button className="add-btn" onClick={addItem}>
          {loading ? "Saving..." : "Add Item"}
        </button><br></br>

        <table className="sales-table">
          <thead><br></br>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>GST</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {itemList.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.subTotal}</td>
                <td>{item.gstAmount}</td>
                <td>{item.total}</td>
                <td>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals"><br></br>
          <p>Subtotal: {subTotal}</p>
          <p>GST: {gstAmount}</p>
          <p>Total: {totalAmount}</p>
        </div><br></br>

        <InvoicePDF sale={saleData} /><br></br>

        <button className="save-btn" onClick={saveInvoice}>
          Finish Invoice
        </button>
      </div>
    </div>
  );
}

export default SalesPage;