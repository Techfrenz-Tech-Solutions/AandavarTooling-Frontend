import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import CategoryMaster from "./Components/CategoryMaster";
import MachineMaster from "./Components/MachineMaster";
import WorkerMaster from "./Components/WorkerMaster";
import ProductMaster from "./Components/ProductMaster";
import SalesProductMaster from "./Components/SalesProductMaster";
import CustomerMaster from "./Components/CustomerMaster";
import WorkOrder from "./Components/LineOut";
import ReturnPage from "./Components/LineReturn";
import SalesPage from "./Components/SalesPage";
import IGSTSalesPage from "./Components/IGSTSalesPage";
import CurrentStock from "./Components/CurrentStock";
import Reports from "./Components/Reports";
import InwardEntry from "./Components/InwardEntry";
import UOMMaster from "./Components/UOMMaster";
import ToolMaster from "./Components/ToolMaster";
import ToolInwardEntry from "./Components/ToolInwardEntry";
import DeliveryChallan from "./Components/Deliverychallan";
import DeliveryHistory from "./Components/DeliveryHistory";
import Returndeliverychallan from "./Components/Returndeliverychallan";
import Toolstack from "./Components/Toolstack";
import InvoiceHistory from "./Components/InvoiceHistory";
import InvoiceTemplate from "./Components/InvoiceTemplate";
import InvoiceTemplate2 from "./Components/InvoiceTemplate2";
import InstrumentMaster from "./Components/Instrument";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard/*" element={<Dashboard />} />

        <Route path="/dashboard/categories" element={<CategoryMaster />} />
        <Route path="/dashboard/machines" element={<MachineMaster />} />
        <Route path="/dashboard/workers" element={<WorkerMaster />} />
        <Route path="/dashboard/products" element={<ProductMaster />} />
        <Route path="/dashboard/lineout" element={<WorkOrder />} />
        <Route path="/dashboard/returns" element={<ReturnPage />} />
        <Route path="/dashboard/CurrentStock" element={<CurrentStock />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="/dashboard/InwardEntry" element={<InwardEntry />} />
        <Route path="/dashboard/uom" element={<UOMMaster />} />
        <Route path="/dashboard/salesproducts" element={<SalesProductMaster />} />
        <Route path="/dashboard/CustomerMaster" element={<CustomerMaster />} />
        <Route path="/dashboard/SalesPage" element={<SalesPage />} />
        <Route path="/dashboard/IGSTSalesPage" element={<IGSTSalesPage/>} />
        <Route path="/dashboard/ToolMaster" element={<ToolMaster />} />
        <Route path="/dashboard/ToolInwardEntry" element={<ToolInwardEntry />} />
        <Route path="/dashboard/DeliveryChallan" element={<DeliveryChallan />} />
        <Route path="/dashboard/DeliveryHistory" element={<DeliveryHistory />} />
        <Route path="/dashboard/Returndeliverychallan" element={<Returndeliverychallan />} />
        <Route path="/dashboard/Toolstack" element={<Toolstack />} />
        <Route path="/dashboard/InvoiceHistory" element={<InvoiceHistory />} />
        <Route path="/dashboard/InstrumentMaster" element={<InstrumentMaster />} />

        {/* FIXED ROUTE */}
        <Route path="/dashboard/invoice/:invoiceNo" element={<InvoiceTemplate />} />
        <Route path="/dashboard/invoice/:invoiceNo" element={<InvoiceTemplate2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;