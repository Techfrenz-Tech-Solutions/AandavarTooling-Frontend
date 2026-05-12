// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import "../CSS/InwardEntry.css";
// import api from "../api";

// function InwardEntry() {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [itemCodes, setItemCodes] = useState([]);
//   const [uoms, setUoms] = useState([]);

//   const [selectedItemName, setSelectedItemName] = useState("");
//   const [itemCode, setItemCode] = useState("");
//   const [uom, setUom] = useState("");
//   const [qty, setQty] = useState("");
//   const [rate, setRate] = useState("");

//   /* SAFE DATA EXTRACTOR */
//   const extractList = (res) => {
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.data?.data)) return res.data.data;

//     if (res?.data?.data) {
//       const nested = Object.values(res.data.data).find((v) =>
//         Array.isArray(v)
//       );
//       if (nested) return nested;
//     }

//     return [];
//   };

//   useEffect(() => {
//     loadProducts();
//     loadItemCodes();
//     loadUoms();
//   }, []);

//   /* PRODUCTS */
//   const loadProducts = async () => {
//     try {
//       const res = await api.get("/items/activeitem");

//       const list = extractList(res);

//       const normalized = list
//         .map((item) => ({
//           ItemName: String(
//             item.ItemName ||
//               item.itemName ||
//               item.item_name ||
//               ""
//           ).trim(),
//           ItemCode: String(
//             item.ItemCode ||
//               item.itemCode ||
//               item.item_code ||
//               ""
//           ).trim(),
//         }))
//         .filter((i) => i.ItemName && i.ItemCode);

//       console.log("Products:", normalized);

//       setProducts(normalized);
//     } catch (err) {
//       console.error("Product Load Error:", err);
//       setProducts([]);
//     }
//   };

//   const loadItemCodes = async () => {
//     try {
//       const res = await api.get("/activeitems/activeitemcode");
//       setItemCodes(extractList(res));
//     } catch {
//       setItemCodes([]);
//     }
//   };

//   const loadUoms = async () => {
//     try {
//       const res = await api.get("/activeuoms/activeUOM");
//       setUoms(extractList(res));
//     } catch {
//       setUoms([]);
//     }
//   };

//   /* HANDLERS */
//   const handleItemChange = (e) => {
//     const name = e.target.value;
//     setSelectedItemName(name);

//     const found = products.find((p) => p.ItemName === name);
//     setItemCode(found ? found.ItemCode : "");
//   };

//   const handleCodeChange = (e) => {
//     const code = e.target.value;
//     setItemCode(code);

//     const found = products.find((p) => p.ItemCode === code);
//     setSelectedItemName(found ? found.ItemName : "");
//   };

//   const handleSubmit = async () => {
//     if (!selectedItemName || !itemCode || !uom || !qty || !rate) {
//       alert("Fill all fields");
//       return;
//     }

//     const payload = {
//       ItemName: selectedItemName,
//       ItemCode: itemCode,
//       UOMName: uom,
//       Quantity: Number(qty),
//       Rate: Number(rate),
//       Status: "Completed",
//     };

//     try {
//       const res = await api.post("/inward/iteminward", payload);
//       alert(res.data.message || "Saved");

//       resetForm();
//       navigate("/current-stock", { state: { refresh: true } });
//     } catch (err) {
//       console.error(err);
//       alert("Error saving");
//     }
//   };

//   const resetForm = () => {
//     setSelectedItemName("");
//     setItemCode("");
//     setUom("");
//     setQty("");
//     setRate("");
//   };

//   return (
//     <div className="ie-page">
//       <Sidebar />
//       <Topbar />

//       <div className="ie-header">
//         <h1>Product Inward Entry</h1>
//       </div>

//       <div className="ie-form">
//         <div className="ie-row">
//           <div className="ie-group">
//             <label>Item Name</label>
//             <select value={selectedItemName} onChange={handleItemChange}>
//               <option value="">Select Item</option>

//               {products.length > 0 ? (
//                 products.map((item, index) => (
//                   <option
//                     key={item.ItemCode + index}
//                     value={item.ItemName}
//                   >
//                     {item.ItemName}
//                   </option>
//                 ))
//               ) : (
//                 <option disabled>No Items Found</option>
//               )}
//             </select>
//           </div>

//           <div className="ie-group">
//             <label>Item Code</label>
//             <select value={itemCode} onChange={handleCodeChange}>
//               <option value="">Select Code</option>
//               {itemCodes.map((code, i) => (
//                 <option key={i} value={code}>
//                   {code}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="ie-row">
//           <div className="ie-group">
//             <label>UOM</label>
//             <select value={uom} onChange={(e) => setUom(e.target.value)}>
//               <option value="">Select UOM</option>
//               {uoms.map((u, i) => (
//                 <option key={i} value={u.UOMName || u}>
//                   {u.UOMName || u}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="ie-group">
//             <label>Quantity</label>
//             <input
//               type="number"
//               value={qty}
//               onChange={(e) => setQty(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="ie-row">
//           <div className="ie-group">
//             <label>Rate</label>
//             <input
//               type="number"
//               value={rate}
//               onChange={(e) => setRate(e.target.value)}
//             />
//           </div>
//         </div>

//         <button className="ie-btn" onClick={handleSubmit}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

// export default InwardEntry;











// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import "../CSS/InwardEntry.css";
// import api from "../api";

// function ToolInwardEntry() {
//   const navigate = useNavigate();

//   const [toolName, setToolName] = useState("");
//   const [uom, setUom] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [rate, setRate] = useState("");

//   const [toolOptions, setToolOptions] = useState([]);
//   const [filteredTools, setFilteredTools] = useState([]);

//   const [uomOptions, setUomOptions] = useState([]);

//   useEffect(() => {
//     fetchTools();
//     fetchUOMs();
//   }, []);

//   const fetchTools = async () => {
//     try {
//       const res = await api.get("/items/activeitem");
//       const tools = res.data.data || [];
//       setToolOptions(tools);
//       setFilteredTools(tools);
//     } catch (err) {
//       console.error("Error fetching tools:", err);
//     }
//   };

//   const fetchUOMs = async () => {
//     try {
//       const res = await api.get("/Toolstock/activeuom");
//       setUomOptions(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching UOMs:", err);
//     }
//   };

//   /* FILTER WHILE TYPING IN DROPDOWN */
//   const handleFilter = (e) => {
//     const value = e.target.value;
//     setToolName(value);

//     const filtered = toolOptions.filter((tool) =>
//       tool.toLowerCase().includes(value.toLowerCase())
//     );

//     setFilteredTools(filtered);
//   };

//   const handleSubmit = async () => {
//     if (!toolName || !uom || !quantity || !rate) {
//       alert("Enter all fields");
//       return;
//     }

//     try {
//       const payload = {
//         ToolName: toolName,
//         UOMName: uom,
//         Quantity: Number(quantity),
//         Rate: Number(rate),
//       };

//       await api.post("/toolinward/toolinwards", payload);

//       alert("Tool Inward submitted & stock updated!");
//       navigate("/tool-stock");
//     } catch (err) {
//       console.error("Error submitting Tool Inward:", err);
//       alert("Error updating Tool stock");
//     }

//     setToolName("");
//     setUom("");
//     setQuantity("");
//     setRate("");
//     setFilteredTools(toolOptions);
//   };

//   return (
//     <div className="ie-page">
//       <Sidebar />
//       <Topbar />

//       <div className="ie-header">
//         <h1>Tool Inward Entry</h1>
//       </div>

//       <div className="ie-form">
//         <div className="ie-row">
//           <div className="ie-group">
//             <label>Tool Name</label>

//             {/* Single Searchable Dropdown */}
//             <input
//               list="toolList"
//               value={toolName}
//               onChange={handleFilter}
//               placeholder="Select Tool"
//             />

//             <datalist id="toolList">
//               {filteredTools.map((tool, i) => (
//                 <option key={i} value={tool} />
//               ))}
//             </datalist>
//           </div>

//           <div className="ie-group">
//             <label>UOM</label>
//             <select value={uom} onChange={(e) => setUom(e.target.value)}>
//               <option value="">Select UOM</option>
//               {uomOptions.map((opt, i) => (
//                 <option key={i} value={opt}>
//                   {opt}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="ie-row">
//           <div className="ie-group">
//             <label>Quantity</label>
//             <input
//               type="number"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//           </div>

//           <div className="ie-group">
//             <label>Rate</label>
//             <input
//               type="number"
//               value={rate}
//               onChange={(e) => setRate(e.target.value)}
//             />
//           </div>
//         </div>

//         <button className="ie-btn" onClick={handleSubmit}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ToolInwardEntry;


// 




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../CSS/InwardEntry.css";
import api from "../api";

function ToolInwardEntry() {
  const navigate = useNavigate();

  const [toolName, setToolName] = useState("");
  const [toolId, setToolId] = useState("");

  const [uom, setUom] = useState("");
  const [uomId, setUomId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  const [toolOptions, setToolOptions] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);

  const [uomOptions, setUomOptions] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchUOMs();
  }, []);

  // ✅ FETCH ITEMS
  const fetchItems = async () => {
    try {
      const res = await api.get("/items/activeitem");

      console.log("Items API:", res.data);

      const items = res.data?.data || [];

      setToolOptions(items);
      setFilteredTools(items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // ✅ FETCH UOM
  const fetchUOMs = async () => {
    try {
      const res = await api.get("/Toolstock/activeuom");

      console.log("UOM API:", res.data);

      setUomOptions(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching UOMs:", err);
    }
  };

  // ✅ HANDLE INPUT CHANGE
  const handleFilter = (e) => {
    const value = e.target.value;
    setToolName(value);

    const filtered = toolOptions.filter((item) => {
      const name =
        item.ItemName || item.itemName || item.Name || "";
      return name.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredTools(filtered);

    const selected = toolOptions.find((item) => {
      const name =
        item.ItemName || item.itemName || item.Name || "";
      return name.toLowerCase() === value.toLowerCase();
    });

    setToolId(selected ? selected.SI || selected.id : "");
  };

  // ✅ HANDLE UOM
  const handleUOMChange = (e) => {
    const selectedId = e.target.value;
    setUomId(selectedId);

    const selected = uomOptions.find(
      (u) => Number(u.UOMID) === Number(selectedId)
    );

    setUom(selected ? selected.UOMName : "");
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!toolId || !uomId || !quantity || !rate) {
      alert("Select valid Item and UOM");
      return;
    }

    try {
      const payload = {
        ItemID: Number(toolId),
        UOMID: Number(uomId),
        Quantity: Number(quantity),
        Rate: Number(rate),
      };

      console.log("Payload:", payload);

      await api.post("/items/iteminward", payload);

      alert("Item Inward submitted & stock updated!");
      navigate("/tool-stock");
    } catch (err) {
      console.error("Error:", err.response || err);
      alert("Error updating stock");
    }

    // RESET
    setToolName("");
    setToolId("");
    setUom("");
    setUomId("");
    setQuantity("");
    setRate("");
    setFilteredTools(toolOptions);
  };

  return (
    <div className="ie-page">
      <Sidebar />
      <Topbar />

      <div className="ie-header">
        <h1>Item Inward Entry</h1>
      </div>

      <div className="ie-form">
        <div className="ie-row">
          <div className="ie-group">
            <label>Item Name</label>

            <input
              list="toolList"
              value={toolName}
              onChange={handleFilter}
              placeholder="Type to search item..."
              autoComplete="off"
            />

            {/* ✅ IMPORTANT FIX */}
            <datalist id="toolList">
              {filteredTools.length > 0 ? (
                filteredTools.map((item) => {
                  const name =
                    item.ItemName ||
                    item.itemName ||
                    item.Name ||
                    "Unnamed";

                  return (
                    <option
                      key={item.SI || item.id}
                      value={name}
                    />
                  );
                })
              ) : (
                <option value="No items found" />
              )}
            </datalist>
          </div>

          <div className="ie-group">
            <label>UOM</label>
            <select value={uomId} onChange={handleUOMChange}>
              <option value="">Select UOM</option>
              {uomOptions.map((opt) => (
                <option key={opt.UOMID} value={opt.UOMID}>
                  {opt.UOMName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ie-row">
          <div className="ie-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="ie-group">
            <label>Rate</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
        </div>

        <button className="ie-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ToolInwardEntry;

