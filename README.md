# Shree Aandavar Tooling — ERP Frontend

React-based ERP management system for **Shree Aandavar Tooling**. Covers inventory management, sales invoicing, delivery challans, master data, and reporting — all in a single-page application.

---

## Tech Stack

| Category | Technology / Library | Version |
|---|---|---|
| Framework | React | ^19.2.4 |
| Routing | React Router DOM | ^7.13.1 |
| HTTP Client | Axios | ^1.13.6 |
| PDF (canvas) | jsPDF + html2canvas | ^4.2.1 / ^1.4.1 |
| PDF (DOM) | html2pdf.js | ^0.14.0 |
| PDF tables | jspdf-autotable | ^5.0.7 |
| Excel | xlsx | ^0.18.5 |
| Icons | react-icons | ^5.6.0 |
| Notifications | react-toastify | ^11.0.5 |
| Styling | Plain CSS (component-scoped) | — |
| Build Tool | react-scripts (CRA) | ^5.0.1 |
| CSS Utilities | Tailwind CSS (config only) | ^3.4.19 |

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Production build (output: build/)
npm run build

# Run tests
npm test
```

---

## Environment & API

All API requests are routed through `src/api.js`:

```js
baseURL: "/backend"
```

In development, configure a proxy in `package.json` or a reverse proxy to forward `/backend/*` to the backend server at:

```
https://admin.shreeaandavartooling.in
```

---

## Authentication

Uses a **tab-scoped session** strategy — no `localStorage` for auth, only `sessionStorage`.

### Keys used

| Key | Storage | Purpose |
|---|---|---|
| `tabKey` | sessionStorage | Unique tab identity, generated in `index.js` on first load |
| `authTabKey` | sessionStorage | Bound to `tabKey` at login time |
| `isLoggedIn` | sessionStorage | `"true"` when authenticated |
| `tabLive` | sessionStorage | Set after React mounts — detects duplicate tabs |

### Behaviour

| Scenario | Result |
|---|---|
| Login | Sets `isLoggedIn`, `authTabKey`, `tabKey`, `tabLive` in sessionStorage |
| Page refresh | sessionStorage preserved — still logged in ✅ |
| New tab → paste URL | Empty sessionStorage → redirected to `/login` 🔒 |
| Duplicate tab | `index.js` detects `tabLive=true` on cold start → clears auth → `/login` 🔒 |
| Logout | Clears `isLoggedIn` + `authTabKey` → all routes blocked 🔒 |

### Route Guards

| Component | File | Behaviour |
|---|---|---|
| `ProtectedRoute` | `src/Components/ProtectedRoute.jsx` | Checks `isLoggedIn` + `authTabKey === tabKey` → renders or redirects to `/login` |
| `PublicRoute` | `src/Components/PublicRoute.jsx` | If authenticated → redirects to `/dashboard`, else renders login |

---

## Project Structure

```
src/
├── index.js                        # Entry — tab auth guard, React root mount
├── App.js                          # All route definitions
├── api.js                          # Axios instance (baseURL: /backend)
│
├── Components/
│   ├── Login.jsx                   # Login page (hardcoded credentials)
│   ├── Dashboard.jsx               # Layout shell — Sidebar + Topbar + <Outlet/>
│   ├── Sidebar.jsx                 # Navigation menu + logout
│   ├── Topbar.jsx                  # Breadcrumb + refresh + logout
│   ├── Page.jsx                    # Dashboard home page
│   ├── ProtectedRoute.jsx          # Auth guard
│   ├── PublicRoute.jsx             # Redirect if already logged in
│   │
│   ├── ── Masters ──
│   ├── CategoryMaster.jsx          # /dashboard/categories
│   ├── MachineMaster.jsx           # /dashboard/machines
│   ├── WorkerMaster.jsx            # /dashboard/workers
│   ├── ProductMaster.jsx           # /dashboard/products
│   ├── SalesProductMaster.jsx      # /dashboard/salesproducts
│   ├── CustomerMaster.jsx          # /dashboard/CustomerMaster
│   ├── UOMMaster.jsx               # /dashboard/uom
│   ├── ToolMaster.jsx              # /dashboard/ToolMaster
│   ├── Instrument.jsx              # /dashboard/InstrumentMaster
│   │
│   ├── ── Transactions ──
│   ├── LineOut.jsx                 # /dashboard/lineout — Line Out (work order)
│   ├── LineReturn.jsx              # /dashboard/returns — Line Out History
│   ├── SalesPage.jsx               # /dashboard/SalesPage — CGST/SGST sales
│   ├── IGSTSalesPage.jsx           # /dashboard/IGSTSalesPage — IGST sales
│   ├── InvoiceHistory.jsx          # /dashboard/InvoiceHistory — list + modal preview + PDF download
│   ├── InvoiceTemplate.jsx         # /dashboard/invoice/:id — CGST/SGST invoice (standalone)
│   ├── InvoiceTemplate2.jsx        # /dashboard/invoice2/:id — IGST invoice (standalone)
│   ├── InvoicePDF.jsx              # PDF wrapper for CGST/SGST invoice
│   ├── InvoicePDF1.jsx             # PDF wrapper for IGST invoice
│   │
│   ├── ── Inventory ──
│   ├── InwardEntry.jsx             # /dashboard/InwardEntry — Product inward entry
│   ├── ToolInwardEntry.jsx         # /dashboard/ToolInwardEntry — Tool inward entry
│   ├── Deliverychallan.jsx         # /dashboard/DeliveryChallan — Create challan + PDF
│   ├── DeliveryChallanTemplate.jsx # A4 template for delivery challan
│   ├── DeliveryHistory.jsx         # /dashboard/DeliveryHistory — Challan history + view + PDF + print
│   ├── Returndeliverychallan.jsx   # /dashboard/Returndeliverychallan
│   ├── ReturnDeliveryChallanTemplate.jsx  # A4 template for return challan
│   ├── CurrentStock.jsx            # /dashboard/CurrentStock
│   ├── Toolstack.jsx               # /dashboard/Toolstack
│   │
│   └── ── Reports ──
│       └── Reports.jsx             # /dashboard/Reports
│
├── CSS/                            # Component-scoped stylesheets
│   ├── InvoiceTemplate.css         # Invoice A4 template + acknowledgement section
│   ├── InvoiceModal.css            # Invoice preview modal
│   ├── deliveryTemplate.css        # Delivery challan A4 template + watermark
│   ├── SalesPage.css               # Shared table/form styles
│   └── ...                         # One CSS file per component
│
├── Assets/
│   ├── AandavarLogo1.png           # Primary company logo (used in invoice header)
│   ├── AandavarLogo2.png           # Secondary logo (used in challan header)
│   └── ...
│
└── public/
    ├── andavarwt.png               # Watermark image (transparent background)
    ├── AandavarLogo2.png           # Watermark logo variant
    ├── Murugan.jpg                 # Login page left panel image
    └── index.html
```

---

## Route Map

```
/                               → redirect to /login
/login                          → Login page (PublicRoute)

/dashboard                      → ProtectedRoute > Dashboard layout
  /dashboard                    → Home (Page.jsx)

  Masters
  /dashboard/categories         → Category Master
  /dashboard/machines           → Machine Master
  /dashboard/workers            → Worker Master
  /dashboard/products           → Product Master
  /dashboard/salesproducts      → Sales Product Master
  /dashboard/CustomerMaster     → Customer Master
  /dashboard/uom                → UOM Master
  /dashboard/ToolMaster         → Tool Master
  /dashboard/InstrumentMaster   → Instrument Master

  Transactions
  /dashboard/lineout            → Line Out
  /dashboard/returns            → Line Out History
  /dashboard/SalesPage          → Sales (CGST/SGST)
  /dashboard/IGSTSalesPage      → Sales (IGST)
  /dashboard/InvoiceHistory     → Invoice History + PDF preview

  Inventory
  /dashboard/InwardEntry        → Product Inward Entry
  /dashboard/ToolInwardEntry    → Tool Inward Entry
  /dashboard/DeliveryChallan    → Create Delivery Challan
  /dashboard/DeliveryHistory    → Challan History + PDF + Print
  /dashboard/Returndeliverychallan → Return Delivery Challan
  /dashboard/CurrentStock       → Current Stock
  /dashboard/Toolstack          → Tool Stock

  Reports
  /dashboard/Reports            → Reports

  Invoice templates (standalone)
  /dashboard/invoice/:invoiceNo   → CGST/SGST Tax Invoice
  /dashboard/invoice2/:invoiceNo  → IGST Tax Invoice

* → redirect to /login
```

---

## PDF Generation

### Invoice (InvoiceHistory modal)
- `html2canvas` captures the invoice DOM at `scale: 2`
- `jsPDF` generates A4 PDF (210mm × 297mm)
- Watermark composited directly onto the canvas after capture (avoids two-page issue)
- Includes **Acknowledgement section** at the bottom of the invoice

### Delivery Challan (DeliveryHistory + Deliverychallan)
- `html2canvas` captures the `.dc-page` template at `scale: 2`
- Preview watermark (`<img class="dc-watermark-preview">`) is hidden via `.dc-capturing` CSS class during capture
- Watermark is composited programmatically onto the canvas using `offsetWidth` (pre-transform size) for pixel-accurate matching
- `jsPDF` generates single-page A4 PDF
- Print opens an isolated popup window — single copy, single page

---

## Watermark Strategy

The `andavarwt.png` watermark (from `public/`) is handled in two stages:

| Stage | Method |
|---|---|
| **Screen preview** | `<img class="dc-watermark dc-watermark-preview">` positioned absolute, `opacity: 0.07`, `width: 35%`, centered via `top:50%; left:50%; translate(-50%,-50%)` |
| **PDF / Download** | Watermark `<img>` hidden via `.dc-capturing` class → canvas captured clean → watermark drawn onto canvas via `ctx.drawImage()` at `offsetWidth × scale` dimensions, centered at `containerWidth/2 × scale` |

This ensures **preview and PDF show identical watermark size and position**, and the PDF is always a **single page** (no absolute-positioned elements extending the canvas height).

---

## CI/CD — GitHub Actions

Triggered on push to `main` branch. Connects to the production server via SSH and runs the deploy script.

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

steps:
  - SSH into server
  - Run: bash /cicd/deploy-aandavar-frontend.sh
```

**Required GitHub Secrets:**
- `SERVER_HOST` — production server IP/hostname
- `SERVER_USER` — SSH username
- `SERVER_SSH_KEY` — private SSH key

---

## Credentials

> Login credentials are hardcoded in `Login.jsx` for single-user access.
> Replace with a backend authentication API before expanding to multi-user deployment.

---

## Known Configurations

### Tailwind CSS
Installed but content path is not configured (`tailwind.config.js` has empty content array). Tailwind utility classes will not generate styles until content sources are added. Currently all styling uses plain CSS.

### `CI=false` build flag
The Jenkins build uses `CI=false npm run build` to prevent ESLint warnings from failing the build.

---

## Backend API Base

| Environment | Base URL |
|---|---|
| Development (proxy) | `/backend` → `https://admin.shreeaandavartooling.in` |
| Production | Served from same origin via reverse proxy |

All endpoints are prefixed `/backend/` — e.g. `/backend/sales/invoices`, `/backend/delivery/getChallanByNumber/:id`
