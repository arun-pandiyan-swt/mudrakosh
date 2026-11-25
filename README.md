# MudraKosh (মুদ্ৰাকোষ) · Government Press & Stationery Digital Platform
> **Challenge Stream 1 · Reference:** NESFIC-D-39  
> **Challenge Owner:** Directorate of Printing & Stationery, Department of Information, Public Relations, Printing & Stationery, Government of Assam  
> **Pilot Depot:** Central Store Depot & Government Press, Bamunimaidam, Guwahati - 781021  

---

## 🏛️ Project Overview

**MudraKosh (মুদ্ৰাকোষ)** digitizes the end-to-end inflow, warehouse storage, press floor consumption, and departmental distribution of paper reels, reams, official forms, gazettes, and stationery for the Government of Assam.

- **Central Append-Only Ledger:** Invariant formula $\text{Available Stock} = \text{Opening} + \sum\text{Inflows} - \sum\text{Outflows} \pm \sum\text{Adjustments}$ with zero direct overwrites.
- **Press Floor Spoilage Accounting:** Eliminates the press machinery "black hole" by tracking raw paper issued against printed copies, machine trimming spoilage (enforcing the official benchmark $<3.5\%$), and unprinted Return-to-Store (RTS) paper credits.
- **Cryptographic QR Movement & e-Challan:** Instant verifiable proof-of-delivery (POD) with digital touch/stylus signature capture across state offices (Janata Bhawan, Police HQ, District Commissioner offices).
- **Assam Gov-Tech Design Tokens:** Deep Navy (`#0F2942`) and Assam Muga Silk Gold (`#D49B24`) with bilingual English & অসমীয়া (Assamese) support.

---

## 📂 Repository Structure

```
mudrakosh/
├── apps/
│   ├── frontend/              # Directorate Desktop Web Portal & Unified Field PWA (Port 5173)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx                 # Top Gov bar, role switcher, same-port view toggle
│   │   │   │   ├── LoginView.tsx              # First Screen: GIGW & e-Pramaan Secure Login Gateway
│   │   │   │   ├── DashboardView.tsx          # Screen 02: Stock valuation, KPIs, 5-step flow
│   │   │   │   ├── StockLedgerView.tsx        # Screen 04: Perpetual stock catalog & audit drawer
│   │   │   │   ├── InwardGRNWizard.tsx        # Screen 03: 3-step GRN intake & batch QR printer
│   │   │   │   ├── PressFloorView.tsx         # Screen 05: Machine requisition & spoilage (<3.5%)
│   │   │   │   ├── DepartmentIndentsView.tsx  # Screen 06: Online indenting & Director sanctions
│   │   │   │   ├── DispatchChallanView.tsx    # Screen 07: Cryptographic e-Challan & manifest
│   │   │   │   ├── StatutoryReportsView.tsx   # Screen 09: CAG Form 18 compliance exports
│   │   │   │   ├── AlertsView.tsx             # Screen 08: Early warning feeds & thresholds
│   │   │   │   └── mobile/                    # Integrated Field Mobile Views (Same Port 5173)
│   │   │   │       ├── MobileHeader.tsx       # Handheld header & online/offline sync badge
│   │   │   │       ├── QRScannerView.tsx      # Warehouse floor camera inspection
│   │   │   │       ├── GatePassView.tsx       # Security gate intake & weighbridge
│   │   │   │       ├── DriverManifestView.tsx # Delivery carrier driver route & checklist
│   │   │   │       └── ProofOfDeliveryView.tsx# Touch/Stylus POD signature pad
│   │   │   ├── data/
│   │   │   │   └── mockData.ts                # Comprehensive Assam Gov-Tech dummy data & i18n
│   │   │   ├── App.tsx                        # Unified App (Login Screen first, Web + Mobile)
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── vite.config.ts                     # Port 5173
│   │
│   └── mobile/                                # Standalone Field PWA (Configured to Port 5173)
│       ├── src/
│       │   ├── components/
│       │   │   ├── LoginView.tsx              # First Screen: Mobile Secure Login Gateway
│       │   │   ├── MobileHeader.tsx
│       │   │   ├── QRScannerView.tsx
│       │   │   ├── GatePassView.tsx
│       │   │   ├── DriverManifestView.tsx
│       │   │   └── ProofOfDeliveryView.tsx
│       │   ├── App.tsx
│       │   └── ...
│       └── vite.config.ts                     # Port 5173
│
├── MUDRAKOSH_MASTER_SOLUTION_DOCUMENT.md      # Solution Architecture & PRD
├── MudraKosh_Proof_of_Work_NESFIC_D39.pdf     # Directorate Proof of Work & Wireframe Specs
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Launch MudraKosh Unified Platform (`apps/frontend`)
```bash
cd apps/frontend
npm install
npm run dev
```
👉 Open browser at: **`http://localhost:5173`**
- **Initial View:** Opens immediately to the **Secure Login Screen** (Directorate and Field personas supported).
- **Same Port for Web & Mobile:** After logging in, switch seamlessly between the **Directorate Desktop Portal** and the **Field Mobile App** directly on port `5173` via the top header button or `?view=mobile`.

### 2. Standalone Field Mobile PWA (`apps/mobile`)
```bash
cd apps/mobile
npm install
npm run dev
```
👉 Open browser at: **`http://localhost:5173`** (standardized same port)

---

## 👥 Personas Supported

| Persona | Frontend Portal | Mobile Field App | Key Operational Responsibilities |
| :--- | :---: | :---: | :--- |
| **Directorate Leadership (Director)** | ✅ | — | Executive KPI analytics, sanctioning department indents, budget allocations |
| **Store Officer** | ✅ | — | Verification, dual-authorization sign-off, CAG audit compliance |
| **Central Storekeeper** | ✅ | ✅ | GRN logging, bay/rack allocation, batch thermal QR label printing |
| **Press Floor Supervisor** | ✅ | ✅ | Material requisition (Weekly Gazette, Budget Books), trimming spoilage (Kg), RTS returns |
| **Security Gate Guard** | — | ✅ | Weighbridge gross/tare weighment, gate pass issuance, truck clearance |
| **Delivery Carrier Driver** | — | ✅ | Route manifest, stop checklist, displaying e-Challan QR to receiving cells |
| **Recipient Department DDO** | ✅ | ✅ | Online stationery requisition, digital signature proof-of-delivery (POD) |

---

## 🛡️ Built-in Government Compliance
- **GIGW 3.0:** High-contrast palette, accessible form elements, keyboard navigability.
- **CAG Statutory Reporting:** Automated Form 18 ledger, opening balance verification, audit trails.
- **DPDP Act 2023:** Role-restricted visibility and tamper-evident audit logs.
- **Bilingual Support:** 100% toggle between English and অসমীয়া (Assamese).
