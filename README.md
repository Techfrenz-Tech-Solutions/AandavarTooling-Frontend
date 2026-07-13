# Shree Aandavar Tooling — ERP Frontend

React-based ERP management system for Shree Aandavar Tooling. Handles inventory, sales, delivery challans, invoicing, and master data management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Create React App) |
| Routing | React Router DOM v7 |
| HTTP | Axios |
| PDF Generation | jsPDF + html2canvas, html2pdf.js |
| Excel Export | xlsx, jspdf-autotable |
| Styling | Plain CSS (component-scoped) |
| Icons | react-icons |
| Notifications | react-toastify |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm start
```
Runs on `http://localhost:3000`

### Production build
```bash
npm run build
```
Output goes to the `build/` folder.

---

## Project Structure

```
src/
├── api.js                    # Axios instance — base URL: /backend
├── App.js                    # Route definitions (protected + public)
├── index.js                  # Entry point — tab auth guard
│
├── Components/
│   ├── Login.jsx             # Login page
│   ├── Dashboard.jsx         # Layout shell (Sidebar + Topbar + Outlet)
│   ├── Sidebar.jsx           # Navigation sidebar
│   ├── Topbar.jsx            # Top bar with breadcrumb + logout
│   │
│   ├── ProtectedRoute.jsx    # Auth guard — redirects to /login if not authenticated
│   ├── PublicRoute.jsx       # Redirects to /dashboard if already authenticated
│   │
│   ├── -- Masters --
│   ├── CategoryMaster.jsx
│   ├── MachineMaster.jsx
│   ├── WorkerMaster.jsx
│   ├── ProductMaster.jsx
│   ├── SalesProductMaster.jsx
│   ├── CustomerMaster.jsx
│   ├── UOMMaster.jsx
│   ├── ToolMaster.jsx
│   ├── Instrument.jsx        # Instrument Master
│   │
│   ├── -- Transactions --
│   ├── LineOut.jsx           # Line Out (Work Order)
│   ├── LineReturn.jsx        # Line Out History
│   ├── SalesPage.jsx         # GST Sales (CGST/SGST)
│   ├── IGSTSalesPage.jsx     # IGST Sales
│   ├── InvoiceHistory.jsx    # Invoice list + view modal + PDF download
│   ├── InvoiceTemplate.jsx   # CGST/SGST invoice template
│   ├── InvoiceTemplate2.jsx  # IGST invoice template
│   ├── InvoicePDF.jsx        # Standalone invoice PDF wrapper
│   ├── InvoicePDF1.jsx       # Standalone IGST invoice PDF wrapper
│   │
│   ├── -- Inventory --
│   ├── InwardEntry.jsx       # Product inward entry
│   ├── ToolInwardEntry.jsx   # Tool inward entry
│   ├── DeliveryChallan.jsx   # Create delivery challan
│   ├── DeliveryHistory.jsx   # Challan history + view + PDF download
│   ├── DeliveryChallanTemplate.jsx  # Delivery challan A4 template
│   ├── Returndeliverychallan.jsx    # Return delivery challan
│   ├── ReturnDeliveryChallanTemplate.jsx
│   ├── CurrentStock.jsx      # Current stock view
│   ├── Toolstack.jsx         # Tool stock view
│   │
│   ├── -- Reports --
│   └── Reports.jsx
│
├── CSS/                      # Component-scoped stylesheets
│   ├── deliveryTemplate.css  # Delivery challan A4 template styles
│   ├── InvoiceTemplate.css   # Invoice A4 template styles
│   ├── InvoiceModal.css      # Invoice preview modal styles
│   └── ...
│
└── Assets/
    ├── AandavarLogo1.png     # Primary logo
    └── AandavarLogo2.png     # Secondary/watermark logo
```

---

## Authentication

Uses a **tab-scoped session** strategy:

- `sessionStorage.isLoggedIn` — set at login, cleared when tab closes
- `sessionStorage.authTabKey` — bound to the tab's unique `tabKey` generated in `index.js`
- `sessionStorage.tabLive` — set after React mounts; used to detect duplicate tabs

**Behaviour:**
| Scenario | Result |
|---|---|
| Login on Tab 1 | Authenticated, full access |
| Refresh Tab 1 | Session preserved — still logged in |
| Open new tab → paste URL | New tab has empty sessionStorage → redirected to `/login` |
| Duplicate tab (right-click) | `index.js` detects `tabLive=true` on cold start → clears auth → `/login` |
| Logout | Clears `isLoggedIn` + `authTabKey` → all routes blocked |

---

## Route Structure

```
/login                          ← PublicRoute (redirects to /dashboard if logged in)
/dashboard                      ← ProtectedRoute > Dashboard layout
  /dashboard                    → Dashboard home (Page.jsx)
  /dashboard/categories         → Category Master
  /dashboard/machines           → Machine Master
  /dashboard/workers            → Worker Master
  /dashboard/products           → Product Master
  /dashboard/salesproducts      → Sales Product Master
  /dashboard/CustomerMaster     → Customer Master
  /dashboard/uom                → UOM Master
  /dashboard/ToolMaster         → Tool Master
  /dashboard/InstrumentMaster   → Instrument Master
  /dashboard/lineout            → Line Out
  /dashboard/returns            → Line Out History
  /dashboard/SalesPage          → Sales (CGST/SGST)
  /dashboard/IGSTSalesPage      → Sales (IGST)
  /dashboard/InvoiceHistory     → Invoice History
  /dashboard/InwardEntry        → Product Inward Entry
  /dashboard/ToolInwardEntry    → Tool Inward Entry
  /dashboard/DeliveryChallan    → Delivery Challan
  /dashboard/DeliveryHistory    → Challan History
  /dashboard/Returndeliverychallan → Return Delivery Challan
  /dashboard/CurrentStock       → Current Stock
  /dashboard/Toolstack          → Tool Stock
  /dashboard/Reports            → Reports
  /dashboard/invoice/:invoiceNo → Invoice Template (CGST/SGST)
  /dashboard/invoice2/:invoiceNo → Invoice Template (IGST)
```

---

## API Configuration

All API calls go through `src/api.js`:

```js
baseURL: "/backend"
```

The development proxy is configured in `package.json` (or via a reverse proxy in production) to forward `/backend/*` requests to the backend server at `https://admin.shreeaandavartooling.in`.

---

## PDF Generation

| Document | Method | Library |
|---|---|---|
| Tax Invoice (CGST/SGST) | `html2canvas` → `jsPDF` | jsPDF + html2canvas |
| Tax Invoice (IGST) | `html2canvas` → `jsPDF` | jsPDF + html2canvas |
| Delivery Challan | `html2pdf.js` | html2pdf.js |

---

## Credentials

> Default credentials are hardcoded in `Login.jsx` for single-user access. Replace with a backend authentication API before production deployment.

---

## Deployment

The project is configured for GitHub Actions deployment via `.github/workflows/deploy.yml`.

```bash
npm run build
# deploy the build/ folder to your hosting target
```
