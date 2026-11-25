# MudraKosh (মুদ্ৰাকোষ) · Master Solution & Development Plan
## Digital Inventory & Movement Tracking for Government Press and Stationery
**Challenge Reference:** Stream 1 · NESFIC-D-39  
**Challenge Owner:** Directorate of Printing & Stationery, Department of Information, Public Relations, Printing & Stationery, Government of Assam  
**Pilot Location:** Directorate of Printing & Stationery, Bamunimaidam, Guwahati  
**Document Type:** Unified Solution Architecture, Workflow Specification & Operational PRD  
**Version:** 2.0 (Master Unified Edition)  
**Date:** November 2026  

---

## Visual Workflow Diagram

Below is the real-time operational flow showing the 5 key human actors, their responsibilities, and how the central append-only ledger synchronizes across all stages.

![MudraKosh Real-Time Operational Flow](workflow-flow-diagram.svg)

---

## 1. Executive Summary & Document Evolution

### 1.1 Document Comparison: What Was Added & Upgraded
This document combines and upgrades the baseline 12-section proposal structure (`eager-bumblebee.md`) with our comprehensive operational and design specifications:

| Baseline Outline (`eager-bumblebee.md`) | Upgraded Master Specification (MudraKosh) |
| :--- | :--- |
| Generic project title | **MudraKosh (মুদ্ৰাকোষ)** — culturally resonant & government-aligned |
| Abstract flow ("paper in, paper out") | **Real Press Domain Rules:** Paper GSM (70/80 GSM), Reels vs. Reams, Machine Spoilage/Wastage tracking (Kg), and Return-to-Store (RTS) |
| QR/Barcodes postponed to P2 | **QR & Mobile Verification Elevated to Core (P0/P1):** Auto-generated reel tags & cryptographic QR e-Challan proof-of-delivery |
| Brief 1-line mention of 9 screens | **Complete Frontend Specification:** Detailed fields, steps, drawers, carts, and state machines |
| Generic styling | **Official Assam Gov-Tech Design Tokens:** Navy (`#0F2942`) + Assam Muga Silk Gold (`#D49B24`) |
| Single-department focus | **Multi-Tenant State Scalability:** Reusable for Health (Medicines), Education (Textbooks), and Police Logistics |

---

## 2. Real-Time Operational Human Workflow

Below is the dedicated operational human workflow illustrating the handoffs between all 5 human roles, the physical artifacts generated at each stage, and the live reconciliation loop with the central ledger.

![MudraKosh Real-Time Operational Human Workflow](human-operational-workflow.svg)

### Operational Handoff Summary

| Step & Human Role | Physical & Digital Input Artifact | Action Performed in Platform | Resulting Output & Next Handoff |
| :--- | :--- | :--- | :--- |
| **Step 01: Supplier / Mill Rep** | Paper Mills / Stationery Vendors with Truck | Verifies Purchase Order (PO) & submits Delivery Challan at security gate | Gate Entry Passed; Consignment queued for inspection |
| **Step 02: Central Storekeeper** | Delivery Challan & Weight Slips | Conducts GSM & bundle count check, enters GRN, and auto-prints QR tags | Bins & Reels QR-tagged; Stock becomes available on system |
| **Step 03: Press Floor Supervisor** | Print Work-Order Requisition (e.g., Weekly Gazette) | Runs offset/web printing machinery, logs machine trimming & spoilage (Kg) | Finished forms received back to store; Unprinted balance paper returned (RTS) |
| **Step 04: DPS Director / Joint Director** | Online Department Indent Requisition | Reviews state department demand against annual quotas & budget allocations | Indent Sanctioned; Authorizes digital outward e-Challan |
| **Step 05: Recipient Department DDO** | Physical Delivery Truck & QR-coded e-Challan | Scans QR code using mobile phone / PWA and signs digital delivery receipt | Instant Proof-of-Delivery; Stock automatically deducted from Central Ledger |


---

## 3. The 12 Portal Components (Uniform Solution Proposal Requirements)

### Component 01: Problem Understanding, Multi-User Personas & Access Control

#### 1. Baseline Operational Bottlenecks Addressed
* **Fragmented Ledgers:** Physical paper registers cause delayed reporting, stock reconciliation discrepancies, and weeks of audit cross-checking.
* **Untracked Press Consumption:** Paper moved to the press machinery lacks digital linkage to actual print runs versus machine trimming wastage.
* **Disputed Dispatches:** Inter-department deliveries lack verifiable proof-of-delivery, leading to lost challans and disputed stationery receipts.

#### 2. The Six User Roles & Operational Responsibilities
1. **Super Admin:** System configuration, role assignment, user directory setup, and security oversight.
2. **Directorate Leadership (Supervisory Officer / Director):** High-level KPI dashboards, consumption analytics, budget monitoring, and executive sanctions.
3. **Store Officer:** Transaction authorization, quota enforcement, stock discrepancy verification, and adjustment sign-off.
4. **Storekeeper:** Gate receipt logging, Goods Receipt Notes (GRN), physical bay/rack allocation, QR label printing, and dispatch packaging.
5. **Press User (Govt Press Floor Supervisor):** Material requisition for print work-orders (Gazettes, budget papers), machine wastage/trimming recording, and unconsumed stock returns (RTS).
6. **Recipient Office User (DDO / Government Departments):** Online stationery indenting, shipment tracking, and mobile QR delivery sign-off.

#### 3. Granular Multi-User Role-Based Access Control (RBAC) Matrix
The platform strictly enforces role-based permissions, data segregation, and dual-authorization rules across all operations:

| System Feature / Operation | Super Admin | Directorate Director | Store Officer | Central Storekeeper | Press Floor Supervisor | Recipient Dept DDO |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Executive Analytics Dashboard** | Full | Full | Store-wide | Store-wide | Press-only | Own Indents Only |
| **Item Master & Unit Conversions** | Manage | View | Manage | View | View | View Catalog |
| **Record Inward Consignment** | View | View | Verify | **Create (Draft)**| No Access | No Access |
| **Authorize Goods Receipt Note (GRN)** | View | View | **Approve** | Submit | No Access | No Access |
| **Raise Print Material Request** | View | View | Review | Issue Stock | **Create Request**| No Access |
| **Log Press Wastage & RTS Return** | View | View | Verify | Receive RTS | **Log Spoilage** | No Access |
| **Submit Department Indent** | View | View | View | View | No Access | **Create Indent** |
| **Approve / Sanction Indent** | View | **Sanction** | **Approve** | No Access | No Access | No Access |
| **Generate Outward e-Challan & QR** | View | View | Authorize | **Generate** | No Access | No Access |
| **Digital Proof-of-Delivery Sign-off** | View | View | View | View | No Access | **Acknowledge (QR)**|
| **Stock Discrepancy Adjustment** | Audit | Sanction | **Approve** | Propose Count | No Access | No Access |
| **Statutory & CAG Audit Reports** | Full Export | Full Export | Full Export | Own Depot | Own Press | Own Issues |
| **User Directory & Role Assignment** | **Manage** | View | View | No Access | No Access | No Access |

> **Critical Safety Invariant:** Requester cannot approve their own requests. All transactions are immutable, tamper-evident, and cryptographically mapped to user IDs and timestamps.

---

### Component 02: Key Features & Phased Prioritization
* **P0 — Core MVP (Weeks 1–5):**
  - Role-based authentication (RBAC) with English/Assamese bilingual interface.
  - Item Master: Standard codes (`PPR-70G-01`, `INK-BLK-04`), GSM categories, and unit conversions (Metric Tons $\rightarrow$ Reels $\rightarrow$ Reams).
  - One-time verified opening stock entry with approval locks.
  - Inward GRN creation with auto-generated printable QR tags.
  - Append-only stock ledger with transactional row locking.
* **P1 — Operational Workflow (Weeks 6–8):**
  - Departmental online requisition with quota verification.
  - Multi-tier approval (Approve, Partial Approve, Return for Correction, Reject).
  - Outward dispatch with cryptographic QR-coded e-Challan.
  - Recipient mobile sign-off (camera QR scan / OTP confirmation).
  - Press conversion tracking: Raw paper issued $\rightarrow$ Print output produced $\rightarrow$ Spoilage recorded $\rightarrow$ Unused paper returned.
  - Automated low-stock thresholds (Warning $<30\%$, Critical $<15\%$) via SMS and email.
* **P2 — Scalability & Enhancements (Post-Pilot):**
  - Offline mobile count sync, automated reorder recommendations based on historical seasonal trends (budget/election periods), and inter-depot transfers.

---

### Component 03: Screen-by-Screen Frontend Specification
The platform includes 9 core user-friendly screens:
1. **`/login` — Secure Gateway:** Role selection, Captcha/OTP, and Assamese/English toggle.
2. **`/dashboard` — Role-Specific Analytics:** Real-time stock valuation, critical stockout cards, inflow vs. outflow charts, and top consuming departments.
3. **`/inventory/inward` — 3-Step GRN Wizard:** PO details $\rightarrow$ Item & Bay/Rack allocation $\rightarrow$ Inspection status & QR sticker printing.
4. **`/inventory/stock` — Live Stock Catalog:** Filterable table with color-coded chips (`In Stock`, `Low Stock`, `Critical`), search, and slide-out audit drawers.
5. **`/press/jobs` — Press Job Work-Orders:** Issue paper to machinery, record finished copies, log machine wastage in Kg, and log Return-to-Store (RTS).
6. **`/indents` — Department Indent Portal:** E-commerce style requisition cart for government offices, quota tracking, and director approval interface.
7. **`/dispatch` — Dispatch & e-Challan:** Outward queue, vehicle assignment, and printable PDF challan with QR code.
8. **`/alerts` — Notification Center:** Live warning feeds for low stock, dead stock ($>180$ days inactive), and pending approvals.
9. **`/reports` — Statutory Audit & Exports:** One-click exports (PDF/Excel) for CAG audit ledgers, monthly consumption, and department issue summaries.

---

### Component 04: Technical Architecture & Ledger Integrity Rules
* **Frontend:** Next.js 14 / React, TypeScript, Tailwind CSS, Shadcn UI, HTML5 QR/Barcode camera scanner.
* **Backend API:** Node.js (NestJS) REST API with strict DTO validation and business rule engines.
* **Database:** PostgreSQL 16 with Row-Level Security (RLS) and transactional ACID guarantees.
* **Ledger Invariant Rule:**
  $$\text{Available Stock} = \text{Opening Balance} + \sum \text{Approved Inflows} - \sum \text{Confirmed Outflows} \pm \sum \text{Approved Adjustments}$$
* **No Direct Edits:** Quantities can never be overwritten directly. Every correction requires an approved reversal or adjustment entry.
* **Zero Overselling:** Row-level locks (`SELECT ... FOR UPDATE`) prevent simultaneous issues from exceeding physical availability.

---

### Component 05: Development Methodology
* **Agile 2-Week Sprints:**
  - Sprint 1: Discovery & Master Data Modeling.
  - Sprint 2: Core Auth & Inward GRN Engine.
  - Sprint 3: Press Floor & Wastage Reconciliation Module.
  - Sprint 4: Indent, Approval & QR e-Challan Outflow.
  - Sprint 5: Testing, Security Hardening & Pilot Go-Live.
* **Continuous Stakeholder Demos:** Fortnightly reviews with Directorate storekeepers and press supervisors.

---

### Component 06: 10-Week Implementation Timeline

| Week | Phase | Deliverable | Milestone |
| :--- | :--- | :--- | :--- |
| **W1** | Discovery | Item master taxonomy, conversion rules, user roles | M1: Requirements Sign-off |
| **W2–W3** | UX & Prototype | Clickable Figma wireframes, DB schema, API design | M2: Interactive Prototype |
| **W4–W5** | P0 Build | Auth, opening stock, inward GRN, append-only ledger | M3: Core MVP Complete |
| **W6–W7** | P1 Build | Online indents, approvals, QR e-Challans, Press jobs | M4: End-to-End Workflow |
| **W8** | Reports & UI | PDF/Excel reporting, bilingual Assamese/English UI | M5: Feature Complete |
| **W9** | Security & QA | Concurrency tests, CERT-In compliance audit, UAT | M6: Audit Passed |
| **W10** | Pilot Go-Live | Pilot deployment at Bamunimaidam, user training | M7: Pilot Operational |

---

### Component 07: Data & Information Requirements
* **Item Taxonomy:** Standardized catalog of paper (Maplitho, White Printing, Azure Laid, Art Paper, Kraft Paper), inks, chemicals, bindery wire, and official forms.
* **Master Units:** Metric Ton, Reel, Ream (500 sheets), Gross, Packet, Box.
* **Data Migration:** Cleanse historical register data with a validation dry-run before opening stock sign-off.
* **Synthetic Data:** Full test suite executed with synthetic data; real state data loaded only under authorized supervision.

---

### Component 08: Team & Manpower
* **Business Analyst / Gov Process Expert (1):** Requirements elicitation and store SOP alignment.
* **Tech Lead & DevOps Engineer (1):** Architecture, CI/CD, and server hardening.
* **Backend Developer (1):** NestJS APIs, ledger transactions, and concurrency locking.
* **Frontend Developer (1):** Next.js PWA, responsive design, and QR scanner integration.
* **UI/UX Designer (1):** Wireframes, design tokens, and bilingual ergonomics.
* **QA & Security Engineer (1):** Concurrency testing, boundary checks, and security verification.

---

### Component 09: Testing, Validation & Concurrency Guarantees
* **Deterministic Calculations:** $100\%$ mathematical verification on ledger balances.
* **Concurrency Stress Tests:** Simultaneous multi-client dispatch attempts on boundary stock must result in 0 oversold inventory.
* **Tamper-Evident Traceability:** $100\%$ of transactions logged with user ID, IP address, and timestamp.
* **Sub-2-Second Response:** Stock search and dashboard rendering within 2 seconds under peak load.

---

### Component 10: Security, Privacy & Government Compliance
* **GIGW 3.0:** Adherence to Guidelines for Indian Government Websites (contrast, accessibility, keyboard navigation).
* **CERT-In Compliance:** Third-party vulnerability assessment (VAPT) prior to production deployment.
* **DPDP Act 2023:** Data minimization, role-restricted PII visibility, and encrypted audit logs.
* **Hosting:** State Data Centre (SDC) Assam or NIC-empanelled cloud infrastructure.

---

### Component 11: Innovation & Press Floor Spoilage Accounting
1. **Closed-Loop Press Reconciliation:** Unifies raw paper supply with finished print production and calculates machine trimming spoilage against approved government norms ($<3.5\%$).
2. **Cryptographic QR Delivery e-Challan:** Eliminates lost paper challans and disputes between recipient departments.
3. **Multi-Tenant Directorates Reuse:** Architecture ready to deploy for State Medical Depots, Textbook Warehouses, and Police Central Stores.


