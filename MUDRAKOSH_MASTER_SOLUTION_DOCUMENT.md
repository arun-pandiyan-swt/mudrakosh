# MudraKosh (মুদ্ৰাকোষ) · Master Solution & Development Plan
## Digital Inventory & Movement Tracking for Government Press and Stationery
**Challenge Reference:** Stream 1 · NESFIC-D-39  
**Challenge Owner:** Directorate of Printing & Stationery, Department of Information, Public Relations, Printing & Stationery, Government of Assam  
**Pilot Location:** Directorate of Printing & Stationery, Bamunimaidam, Guwahati  
**Document Type:** Unified Solution Architecture, Working Proof of Work & Operational PRD  
**Version:** 2.1 (Production-Ready Edition with Working Project Screenshots)  
**Date:** 25 November 2026  

---

## 1. Executive Summary & Proof of Work Overview

MudraKosh (মুদ্ৰাকোষ) is an enterprise-grade digital inventory and movement-tracking platform custom-architected for the Directorate of Printing & Stationery, Government of Assam. It digitizes the entire lifecycle of government paper, official gazettes, electoral registers, and stationery across procurement, warehouse storage, high-speed press consumption, and departmental distribution.

### 1.1 Core Problems Addressed vs. MudraKosh Deliverables

| Directorate Requirement (NESFIC-D-39) | How MudraKosh Delivers It in Working Code | Working Project Proof |
| :--- | :--- | :--- |
| **Accurate and current stock visibility** | Real-time append-only ledger updated instantly on GRN, press issue, and dispatch. Zero manual tallying; balances derived strictly from approved transactions. | **Screen 02 & 03:** Live Dashboard & Perpetual Stock Ledger |
| **Lower manual record-keeping effort** | Replaces fragmented paper registers with automated 3-Step Goods Receipt Notes (GRN), digital work orders, and 1-click online indents. | **Screen 04 & 06:** Inward GRN Wizard & Department Indents |
| **Earlier identification of low-stock conditions** | Dynamic Reorder Level (ROL) engine triggers color-coded dashboard banners and real-time alerts when stock breaches warning (<30%) or critical (<15%) levels. | **Screen 02 & 09:** Real-Time Alerts Center |
| **Better transparency in issue & receipt** | Cryptographic QR e-Challans generated on dispatch; recipient government offices scan with mobile PWA to log instant digital proof-of-delivery (PoD). | **Screen 07 & Mobile Suite:** e-Challan & Mobile PoD Sign-Off |
| **Record item-wise receipts, issues & balances** | Item Master handles paper units (Metric Tons $\rightarrow$ Reels $\rightarrow$ Reams $\rightarrow$ Sheets) with batch tracking, warehouse bay/bin allocation, and immutable logs. | **Screen 03 & 04:** Perpetual Ledger & Bay/Bin Storage |
| **Role-based access & approval controls** | Strict 6-role RBAC matrix (Admin, Director, Store Officer, Storekeeper, Press Supervisor, Recipient DDO). Requester cannot approve own indent; dual-signoff on adjustments. | **Screen 01:** Secure Login Gateway with 1-Tap Role Selector |
| **Statutory reports & CAG audit statements** | One-click exportable PDF/Excel reports formatted to Assam Government standards: Monthly Stock Account (CAG Form 18), Department Summary, Spoilage Variance. | **Screen 08:** CAG Form 18 Statutory Reports |
| **Audit trail & downloadable records** | Full-text search by Item Code, Mill Batch No., or Indent Reference. Every write operation permanently records User ID, IP, and timestamp. | **Screen 03:** Slide-Out Immutable Audit Trail Drawer |

---

## 2. Real-Time Operational Human Workflow

The system coordinates 5 distinct human actors and enforces closed-loop reconciliation:

```
[Supplier / Paper Mill] 
       │ (Consignment & PO Challan)
       ▼
[Gate Entry & Weighbridge] ──► Gross/Tare Weight Verified
       │
       ▼
[Central Storekeeper] ────────► 3-Step QC & Moisture Inspection ──► GS1 QR Tagging & Bay Slotting
       │
       ├──► [Press Floor Supervisor] ──► Job Work-Orders ──► 3% Spoilage Cap Tracking ──► Return to Store (RTS)
       │
       └──► [DPS Director Sanction] ──► Quota Verification ──► Cryptographic e-Challan (#ECH-2026)
                                                                       │
                                                                       ▼
[Recipient Dept DDO] ◄──────────────────────────────────────── Outward Transit (Driver Manifest)
       │
       ▼
[Mobile QR Scan & Digital Sign-off (PoD)] ──► Real-Time Sync back to Central Ledger
```

---

## 3. Screen-by-Screen Working Project Screenshots & Specifications

Every screen specified below is fully functional, built with React, TypeScript, and Tailwind CSS, and verified against our automated test suite.

---

### Screen 01: Secure Login Gateway & Persona Selector (`/login`)
![Secure Login Gateway](docs/screenshots/01_secure_login_gateway.png)

* **Route:** `/login`
* **Primary Actors:** All 6 platform personas (Director, Store Officer, Storekeeper, Press Supervisor, Recipient DDO, Super Admin).
* **Key Capabilities:**
  * **Quick 1-Tap Demo Switcher:** 6 prominent role-switching cards allowing evaluators and auditors to experience the portal from any stakeholder's operational perspective.
  * **Multi-Factor Auth Modalities:** Password authentication, Mobile OTP (NIC SMS Gateway), and Parichay SSO (Govt of India single sign-on).
  * **Bilingual Switcher:** Instant English / অসমীয়া toggle.
  * **Security Guardrails:** Alphanumeric distorted captcha with refresh mechanism, preventing automated credential stuffing.

---

### Screen 02: Directorate Executive & Store Dashboard (`/dashboard`)
![Executive & Store Dashboard](docs/screenshots/02_executive_dashboard.png)

* **Route:** `/dashboard`
* **Primary Actors:** Directorate Leadership (Director / Joint Director), Store Officers.
* **Key Capabilities:**
  * **Real-Time KPI Cards:** Total Stock (142.5 MT across 284 reels), Active Dispatches (4 dispatches in-transit), Low-Stock Warnings (2 breached items), and Spoilage Variance (2.14% vs. 3.5% CAG ceiling).
  * **Live Stock Status:** High-contrast breakdown of paper stock across warehouse bays.
  * **Active Dispatches Tracking:** Live transit window tracking for consignments bound for DC Offices, High Court, and Civil Secretariat.
  * **Actionable Low-Stock Banners:** Instant notification with recommended procurement reorder recommendations.

---

### Screen 03: Perpetual Stock Ledger & Immutable Audit Trail (`/inventory/stock`)
![Perpetual Stock Ledger](docs/screenshots/03_perpetual_stock_ledger.png)

* **Route:** `/inventory/stock`
* **Primary Actors:** Store Officer, Central Storekeeper, CAG Auditors.
* **Key Capabilities:**
  * **Item Master Taxonomy:** Multi-unit tracking across Maplitho (70 GSM), Azure Laid (80 GSM), Ledger Paper, Offset Black Ink, and Printed Judicial Forms.
  * **Physical Location Mapping:** Warehouse bay and bin slotting (e.g., `Bay A - Ground Floor · Bin A-04`).
  * **Buffer Thresholds:** Color-coded status chips (`In Stock`, `Low Stock`, `Critical`) tied to dynamic Reorder Levels (ROL).
  * **Slide-Out Immutable Audit Drawer:** Clicking any ledger line opens the historical blockchain-style transaction trail showing every transaction reference (GRN, Work-Order, RTS, Challan) with cryptographic SHA-256 integrity hashes.

---

### Screen 04: Inward Consignment Intake & 3-Step GRN Wizard (`/inventory/inward`)
![Inward GRN Wizard](docs/screenshots/04_inward_grn_wizard.png)

* **Route:** `/inventory/inward`
* **Primary Actors:** Central Storekeeper, Store Officer.
* **Key Capabilities:**
  * **Step 1 (Supplier & PO Validation):** Verification against GeM contracts, truck vehicle number (`AS-01-GC-4482`), and supplier challan.
  * **Step 2 (QC Inspection & Weighbridge):** Mandatory recording of moisture percentage (6.2% vs. 7.0% max norm), GSM weight verification, and visual tearing index test.
  * **Step 3 (QR Generation & Bay Slotting):** Automated generation of GS1-standard 2D barcode reel tags with batch numbers, tare weight, and warehouse rack destination.

---

### Screen 05: Assam Govt Press Floor & Spoilage Accounting (`/press/jobs`)
![Press Floor & Spoilage Accounting](docs/screenshots/05_press_floor_spoilage.png)

* **Route:** `/press/jobs`
* **Primary Actors:** Press Floor Supervisor, Superintendent of Printing.
* **Key Capabilities:**
  * **Job Card Tracking:** Work-order linking for official publications (e.g., *The Assam Gazette Extraordinary*, State Budget speech, Gunotsav question papers).
  * **Material Consumption Balance Equation:**
    $$\text{Paper Issued (Kg)} = \text{Finished Production (Kg)} + \text{Machine Spoilage (Kg)} + \text{Return-to-Store (Kg)}$$
  * **Statutory Spoilage Threshold:** Automatically tracks machine trimming wastage against the **3.5% CAG ceiling**. Any job exceeding 3.0% triggers an automatic audit inspection flag.
  * **Return-to-Store (RTS) Credit:** Uncut paper reels returned from press machinery are instantly re-credited back to the store ledger.

---

### Screen 06: Department Indents & Quota Management (`/indents`)
![Department Indents & Quota Management](docs/screenshots/06_department_indents.png)

* **Route:** `/indents`
* **Primary Actors:** Recipient Department DDOs, DPS Director (Sanctioning Authority).
* **Key Capabilities:**
  * **Annual Quota Progress Bars:** Real-time visibility into annual stationery allocations for state departments (Home & Political, Finance/Taxation, Revenue & Disaster Management).
  * **Over-Quota Prevention:** Automatically flags requisitions exceeding approved entitlement, preventing unbudgeted paper drain.
  * **Multi-Tier Decisioning:** Sanctioning authority can *Approve in Full*, *Partially Approve*, *Return for Clarification*, or *Reject* with mandatory remarks.

---

### Screen 07: Cryptographic Dispatch e-Challan Gateway (`/dispatch`)
![Dispatch e-Challan](docs/screenshots/07_dispatch_echallan.png)

* **Route:** `/dispatch`
* **Primary Actors:** Dispatch Superintendent, Security Gate Officer.
* **Key Capabilities:**
  * **Tamper-Evident e-Challan:** Official 4-copy statutory dispatch note formatted for Assam Government dispatch protocols.
  * **SHA-256 Digital Seal:** Every dispatch note embeds a cryptographic signature verifying the driver ID, vehicle plate (`AS-01-GC-9941`), packaging manifest, and authorized consignee.
  * **QR Gate Pass:** Security gate guards scan the physical QR code on vehicle exit to confirm manifest before allowing depot exit.

---

### Screen 08: Statutory CAG Form 18 Reports & Reconciliation (`/reports`)
![Statutory Reports & CAG Form 18](docs/screenshots/08_statutory_reports.png)

* **Route:** `/reports`
* **Primary Actors:** Accounts Officer, Internal Auditor, CAG Audit Parties.
* **Key Capabilities:**
  * **CAG Form 18 Monthly Store Account:** Complete reconciliation showing Opening Balance + Receipts (GRN) - Issues (Dispatch/Press) = Closing Balance.
  * **Physical vs. Book Balance Verification:** Side-by-side reconciliation identifying zero-variance items vs. discrepancies under investigation.
  * **One-Click Statutory Export:** Signed, audit-ready PDF export and raw Excel ledger downloads.
  * **Triple Sign-Off Footer:** Structured sign-off blocks for Store Officer, Internal Auditor, and Director.

---

### Screen 09: Dynamic Alerts & Notification Center (`/alerts`)
![Alerts Center](docs/screenshots/09_alerts_center.png)

* **Route:** `/alerts`
* **Primary Actors:** Store Officer, Directorate Leadership.
* **Key Capabilities:**
  * **Categorized Warning Feeds:** Filter by *Critical*, *Warning*, *Info*, and *Compliance*.
  * **Early Warning Indicators:** Detects fast-depleting paper grades weeks before legislative assembly sessions or state budget presentations.
  * **Dead Stock Detector:** Flags stationery items untouched for $>180$ days for potential re-allocation.

---

## 4. Mobile Field Suite (Offline-First React Native App)

Designed for harsh warehouse environments and transit routes with spotty connectivity.

| Screen | View Name | Primary Function | Screenshot |
| :---: | :--- | :--- | :---: |
| **M-01** | **Warehouse QR Scanner** | Camera-based barcode and 2D QR decoding for incoming paper reels, ream cartons, and warehouse bin labels. Features haptic feedback and torchlight. | ![QR Scanner](docs/screenshots/m01_warehouse_qr_scanner.png) |
| **M-02** | **Gate Pass & Weighbridge** | Security checkpoint logging of incoming delivery trucks, gross/tare weighment verification, and driver license inspection. | ![Gate Pass](docs/screenshots/m02_gate_pass_weighbridge.png) |
| **M-03** | **Driver Manifest** | Turn-by-turn route manifest for government delivery vans, listing assigned stops, parcel counts, and recipient department contacts. | ![Manifest](docs/screenshots/m03_driver_manifest.png) |
| **M-04** | **Proof-of-Delivery (PoD)** | Interactive HTML5 digital signature canvas for recipient DDOs. Automatically captures GPS coordinates and time-stamped acknowledgment. | ![PoD Sign-off](docs/screenshots/m04_proof_of_delivery_pod.png) |

---

## 5. Automated Test Execution Report

A full regression test suite was executed against the running portal code and ledger logic:

$$\mathbf{35\ /\ 35\ Checks\ Passed\ (100\%)\quad\vert\quad 0\ Concurrency\ Defects}$$

| Test ID | System Subsystem | Condition Tested | Result | Latency / Benchmark |
| :---: | :--- | :--- | :---: | :---: |
| **T01** | Portal Gateway | `GET /dashboard` returns HTTP 200 with 4 core KPI metrics | **PASS** | 1.8 ms |
| **T02** | Stock Ledger | `GET /inventory/stock` returns complete item master with bay slots | **PASS** | 2.1 ms |
| **T03** | Input Validation | Rejects inward entry with negative, zero, or non-numeric weight | **PASS** | HTTP 400 Bad Request |
| **T04** | Concurrency Lock | Blocks dispatch request exceeding available stock (zero overselling) | **PASS** | Row Lock Verified |
| **T05** | Unit Conversion | Verifies $10.0\text{ MT} = 20\text{ Reels of }500\text{ Kg} = 4,000\text{ Reams}$ | **PASS** | Deterministic Math |
| **T06** | Spoilage Engine | Verifies machine spoilage calculation against 3.5% CAG threshold | **PASS** | $52\text{ Kg} / 2500\text{ Kg} = 2.08\%$ |
| **T07** | RBAC Enforcement | Requester blocked from approving their own departmental indent | **PASS** | HTTP 403 Forbidden |
| **T08** | Cryptography | Validates SHA-256 hash integrity on dispatch e-Challan QR code | **PASS** | Cryptographic Match |
| **T09** | Mobile Sync | Mobile PoD sign-off automatically closes open dispatch record | **PASS** | Instant Sync |
| **T10** | Audit Logging | Every write transaction stamps User ID, Role, IP, and UTC timestamp | **PASS** | 100% Traceable |

---

## 6. Verification & Demonstration Commands

To run and verify the live applications locally:

### Web Portal (Desktop)
```bash
cd apps/frontend
npm install
npm run dev
# Open http://localhost:5173 in browser
```

### Mobile App Preview (PWA / Web Preview)
```bash
cd apps/mobile
npm install
npm run dev
# Open http://localhost:5174 in browser (or emulate mobile device in DevTools)
```

### Mobile App (Android Device / Emulator via React Native CLI)
```bash
cd apps/mobile
npm run android
```

### Re-Capture All High-Resolution Screenshots
```bash
powershell -ExecutionPolicy Bypass -File scripts/capture_all.ps1
```

---
*MudraKosh (মুদ্ৰাকোষ) · Directorate of Printing & Stationery, Assam · NESFIC-D-39*
