import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
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
import InvoiceTemplate2 from "./Components/InvoiceTemplate2.jsx";
import InstrumentMaster from "./Components/Instrument";
import Page from "./Components/Page";
import SupplierDC from "./Components/SupplierDC";
import WorkOrderEntry from "./Components/WorkOrderEntry";
import ProductDC from "./Components/ProductDC";

function App() {
  // Mark this tab as "live" after React mounts.
  // index.js uses this to detect duplicate tabs on next cold start.
  useEffect(() => {
    sessionStorage.setItem("tabLive", "true");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Public routes (redirect to /dashboard if already logged in) ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ── Protected routes (redirect to /login if not logged in) ── */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard layout wraps all nested pages via <Outlet /> */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Page />} />

            {/* Masters */}
            <Route path="categories" element={<CategoryMaster />} />
            <Route path="machines" element={<MachineMaster />} />
            <Route path="workers" element={<WorkerMaster />} />
            <Route path="products" element={<ProductMaster />} />
            <Route path="salesproducts" element={<SalesProductMaster />} />
            <Route path="CustomerMaster" element={<CustomerMaster />} />
            <Route path="uom" element={<UOMMaster />} />
            <Route path="ToolMaster" element={<ToolMaster />} />
            <Route path="InstrumentMaster" element={<InstrumentMaster />} />

            {/* Transactions */}
            <Route path="lineout" element={<WorkOrder />} />
            <Route path="returns" element={<ReturnPage />} />
            <Route path="SalesPage" element={<SalesPage />} />
            <Route path="IGSTSalesPage" element={<IGSTSalesPage />} />
            <Route path="InvoiceHistory" element={<InvoiceHistory />} />

            {/* Inventory */}
            <Route path="InwardEntry" element={<InwardEntry />} />
            <Route path="ToolInwardEntry" element={<ToolInwardEntry />} />
            <Route path="DeliveryChallan" element={<DeliveryChallan />} />
            <Route path="DeliveryHistory" element={<DeliveryHistory />} />
            <Route path="Returndeliverychallan" element={<Returndeliverychallan />} />
            <Route path="CurrentStock" element={<CurrentStock />} />
            <Route path="Toolstack" element={<Toolstack />} />
            <Route path="Reports" element={<Reports />} />

            {/* Supplier Transaction */}
            <Route path="SupplierDC" element={<SupplierDC />} />
            <Route path="ProductDC" element={<ProductDC />} />

            {/* Work Order */}
            <Route path="WorkOrderEntry" element={<WorkOrderEntry />} />

            {/* Invoice templates — two separate printable routes */}
            <Route path="invoice/:invoiceNo" element={<InvoiceTemplate />} />
            <Route path="invoice2/:invoiceNo" element={<InvoiceTemplate2 />} />
          </Route>
        </Route>

        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
