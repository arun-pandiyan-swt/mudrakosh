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
│   ├── frontend/              # Directorate Desktop Web Portal (Port 5173)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx                 # Top Gov bar, role switcher, language toggle
│   │   │   │   ├── DashboardView.tsx          # Screen 02: Stock valuation, KPIs, 5-step flow
│   │   │   │   ├── StockLedgerView.tsx        # Screen 04: Perpetual stock catalog & audit drawer
│   │   │   │   ├── InwardGRNWizard.tsx        # Screen 03: 3-step GRN intake & batch QR printer
│   │   │   │   ├── PressFloorView.tsx         # Screen 05: Machine requisition & spoilage (<3.5%)
│   │   │   │   ├── DepartmentIndentsView.tsx  # Screen 06: Online indenting & Director sanctions
│   │   │   │   ├── DispatchChallanView.tsx    # Screen 07: Cryptographic e-Challan & manifest
│   │   │   │   ├── StatutoryReportsView.tsx   # Screen 09: CAG Form 18 compliance exports
│   │   │   │   └── AlertsView.tsx             # Screen 08: Early warning feeds & thresholds
│   │   │   ├── data/
│   │   │   │   └── mockData.ts                # Comprehensive Assam Gov-Tech dummy data & i18n
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── vite.config.ts
│   │
│   └── mobile/                # Field PWA / Mobile Handheld App (Port 5174)
│       ├── src/
│       │   ├── components/
│       │   │   ├── MobileHeader.tsx           # Status bar, online/offline sync badge, role select
│       │   │   ├── QRScannerView.tsx          # Warehouse floor camera viewfinder & reel inspection
│       │   │   ├── GatePassView.tsx           # Security gate intake, weighbridge (gross/tare/net)
│       │   │   ├── DriverManifestView.tsx     # Delivery carrier driver route & checklist
│       │   │   └── ProofOfDeliveryView.tsx    # Touch/Stylus Canvas signature pad & cryptographic POD
│       │   ├── data/
│       │   │   └── mockData.ts                # Unified domain data models
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.ts
│
├── MUDRAKOSH_MASTER_SOLUTION_DOCUMENT.md      # Solution Architecture & PRD
├── MudraKosh_Proof_of_Work_NESFIC_D39.pdf     # Directorate Proof of Work & Wireframe Specs
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Launch Directorate Desktop Portal (`apps/frontend`)
```bash
cd apps/frontend
npm install
npm run dev
```
👉 Open browser at: **`http://localhost:5173`**

### 2. Launch Field Mobile PWA (`apps/mobile`)
```bash
cd apps/mobile
npm install
npm run dev
```
👉 Open browser at: **`http://localhost:5174`**

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
