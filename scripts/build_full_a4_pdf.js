const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const SCREENSHOT_DIR = path.join(DOCS_DIR, 'screenshots');
const OUTPUT_HTML = path.join(DOCS_DIR, 'MudraKosh_A4_Full_Document.html');
const OUTPUT_PDF = path.join(ROOT_DIR, 'MudraKosh_Proof_of_Work_NESFIC_D39.pdf');
const OUTPUT_PDF_A4 = path.join(ROOT_DIR, 'MudraKosh_Proof_of_Work_NESFIC_D39_A4.pdf');

function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOT_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

const images = {
  login: getBase64Image('01_secure_login_gateway.png'),
  dashboard: getBase64Image('02_executive_dashboard.png'),
  stock: getBase64Image('03_perpetual_stock_ledger.png'),
  inward: getBase64Image('04_inward_grn_wizard.png'),
  press: getBase64Image('05_press_floor_spoilage.png'),
  indents: getBase64Image('06_department_indents.png'),
  dispatch: getBase64Image('07_dispatch_echallan.png'),
  reports: getBase64Image('08_statutory_reports.png'),
  alerts: getBase64Image('09_alerts_center.png'),
  mScanner: getBase64Image('m01_warehouse_qr_scanner.png'),
  mGate: getBase64Image('m02_gate_pass_weighbridge.png'),
  mManifest: getBase64Image('m03_driver_manifest.png'),
  mPod: getBase64Image('m04_proof_of_delivery_pod.png')
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MudraKosh - Proof of Work (NESFIC-D-39)</title>
  <style>
    @page {
      size: 297mm 210mm;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11px;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 297mm;
      height: 210mm;
      max-height: 210mm;
      padding: 10mm 14mm 10mm 14mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }
    .page:last-child {
      page-break-after: avoid;
    }

    /* Top Standard Header */
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1.5px solid #0f2942;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .top-header-left {
      font-size: 14.5px;
      font-weight: 800;
      color: #0f2942;
    }
    .top-header-left span {
      font-size: 11.5px;
      font-weight: 500;
      color: #64748b;
      margin-left: 8px;
    }
    .top-header-right {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Bottom Standard Footer */
    .bottom-footer {
      position: absolute;
      bottom: 8mm;
      left: 14mm;
      right: 14mm;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      font-size: 9px;
      color: #64748b;
    }

    /* Typography & Utilities */
    h1 { margin: 0; font-size: 20px; font-weight: 900; color: #0f2942; }
    h2 { margin: 0; font-size: 15px; font-weight: 800; color: #0f2942; }
    h3 { margin: 0; font-size: 12.5px; font-weight: 700; color: #0f2942; }
    h4 { margin: 0; font-size: 10.5px; font-weight: 700; color: #0f2942; }
    p { margin: 0 0 5px 0; }
    .badge-pill {
      background: #d49b24;
      color: #07131f;
      font-weight: 800;
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .tag-green { background: #dcfce7; color: #15803d; font-weight: 700; padding: 2px 5px; border-radius: 3px; font-size: 9px; }
    .tag-blue { background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 2px 5px; border-radius: 3px; font-size: 9px; }
    .tag-amber { background: #fef3c7; color: #b45309; font-weight: 700; padding: 2px 5px; border-radius: 3px; font-size: 9px; }
    .tag-red { background: #fee2e2; color: #b91c1c; font-weight: 700; padding: 2px 5px; border-radius: 3px; font-size: 9px; }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      margin-top: 5px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
      text-align: left;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #0f2942;
      font-weight: 700;
    }
    table.data-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* Screen Presentation Container */
    .screen-layout {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-bottom: 12px;
    }
    .screen-lead {
      font-size: 10.5px;
      color: #475569;
      margin-bottom: 5px;
    }
    .screen-lead strong {
      color: #0f2942;
    }
    .screenshot-frame {
      width: 100%;
      height: 114mm;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .screenshot-frame img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* 5-Column Callout Annotations Footer */
    .annotations-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-top: 7px;
    }
    .annotation-item {
      display: flex;
      gap: 5px;
      align-items: flex-start;
      font-size: 8.5px;
      line-height: 1.25;
      color: #334155;
    }
    .annotation-num {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #0f2942;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .annotation-text strong {
      display: block;
      color: #0f2942;
      font-size: 9px;
      margin-bottom: 1px;
    }

    /* Mobile 4-Grid */
    .mobile-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 8px;
    }
    .mobile-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mobile-card-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #0f2942;
      margin-bottom: 4px;
      text-align: center;
    }
    .mobile-card-img-box {
      width: 100%;
      height: 94mm;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile-card-img-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* Workflow Page 5 Styles */
    .flow-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-bottom: 8px;
      position: relative;
    }
    .stage-card {
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 7px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .stage-card::after {
      content: "➔";
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 11px;
      font-weight: 900;
      color: #0284c7;
      z-index: 10;
      background: #ffffff;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #cbd5e1;
    }
    .stage-card:last-child::after {
      display: none;
    }
    .stage-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 5px;
      border-radius: 3px;
      margin-bottom: 5px;
      width: fit-content;
    }
    .stage-title {
      font-size: 10px;
      font-weight: 800;
      color: #0f2942;
      margin-bottom: 2px;
      line-height: 1.2;
    }
    .stage-actor {
      font-size: 8px;
      font-weight: 700;
      color: #0284c7;
      margin-bottom: 5px;
      display: block;
    }
    .step-list {
      list-style: none;
      padding: 0;
      margin: 0 0 6px 0;
      font-size: 8px;
      color: #334155;
      line-height: 1.35;
    }
    .step-list li {
      margin-bottom: 3px;
      padding-left: 10px;
      position: relative;
    }
    .step-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #0284c7;
      font-weight: bold;
    }
    .artifact-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 3px 5px;
      font-size: 7.5px;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }
    .artifact-pill strong {
      color: #0f2942;
    }
  </style>
</head>
<body>

  <!-- ================= PAGE 1: COVER PAGE ================= -->
  <div class="page" style="justify-content: space-between; padding-top: 25mm; padding-bottom: 15mm;">
    <!-- Abstract circle graphics in corner -->
    <div style="position: absolute; right: -50mm; top: -40mm; width: 140mm; height: 140mm; border-radius: 50%; background: #e0f2fe; opacity: 0.7; z-index: 0;"></div>
    <div style="position: absolute; right: 20mm; top: 50mm; width: 85mm; height: 85mm; border-radius: 50%; background: #bae6fd; opacity: 0.6; z-index: 0;"></div>

    <div style="position: relative; z-index: 1;">
      <div style="width: 42px; height: 5px; background: #0284c7; margin-bottom: 18px;"></div>
      <div style="font-size: 48px; font-weight: 900; color: #0f2942; line-height: 1.1;">MudraKosh</div>
      <div style="font-size: 20px; font-weight: 700; color: #0284c7; margin-top: 4px; margin-bottom: 22px;">
        "Press &amp; Stationery Treasury" (মুদ্ৰাকোষ)
      </div>
      <div style="font-size: 22px; font-weight: 600; color: #1e293b; max-width: 650px; line-height: 1.35; margin-bottom: 28px;">
        Proof of Work: Digital Inventory &amp; Movement Tracking for Government Press and Stationery
      </div>
      <div style="font-size: 12px; color: #475569; line-height: 1.6; max-width: 600px;">
        <strong>NESFIC26 problem statement D-39</strong><br>
        Directorate of Printing &amp; Stationery, Department of Information, Public Relations,<br>
        Printing &amp; Stationery, Government of Assam
      </div>
    </div>

    <div style="position: relative; z-index: 1; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9.5px; color: #64748b;">
      Contents: requirements mapping, architecture, user journey, annotated working screens, clickable prototype, validation plan. Evidence date: 25 November 2026.
    </div>
  </div>

  <!-- ================= PAGE 2: EXECUTIVE SUMMARY & TOC ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        MudraKosh <span>"Press &amp; Stationery Treasury" (মুদ্ৰাকোষ)</span>
      </div>
      <div class="top-header-right">Directorate Executive Dashboard · 25 Nov 2026</div>
    </div>

    <div style="display: flex; gap: 16px; flex: 1;">
      <!-- Left Column -->
      <div style="flex: 1.1; display: flex; flex-direction: column;">
        <h2 style="font-size: 14.5px; margin-bottom: 5px;">Proof of Work: Digital Inventory &amp; Movement Tracking for Government Press and Stationery</h2>
        <p style="font-size: 9.5px; color: #64748b; margin-bottom: 7px;">
          Submitted for NESFIC26 problem statement D-39, posted by the Directorate of Printing &amp; Stationery, Department of Information, Public Relations, Printing &amp; Stationery, Government of Assam.
        </p>
        <p style="font-size: 10px; color: #1e293b; line-height: 1.4; margin-bottom: 8px;">
          MudraKosh digitises the end-to-end inflow, warehouse storage, press machinery consumption, and departmental distribution of paper, forms, gazettes and stationery. An append-only ledger guarantees stock accuracy, automated alerts eliminate stockouts, and cryptographic QR e-Challans provide verifiable proof of delivery across state offices.
        </p>

        <!-- What this document contains (14 Pages) -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 10px; margin-bottom: 8px;">
          <h4 style="font-size: 9.5px; text-transform: uppercase; color: #0f2942; margin-bottom: 5px;">What this document contains</h4>
          <div style="display: grid; grid-template-columns: 24px 1fr 24px 1fr; font-size: 9px; row-gap: 3px; color: #334155;">
            <strong>3</strong><span>Directorate requirements mapped to outputs</span>
            <strong>9</strong><span>Web 4: Department Indent &amp; e-Challan</span>
            <strong>4</strong><span>Solution architecture &amp; transactional data flow</span>
            <strong>10</strong><span>Web 5: Stock Ledger &amp; Immutable Audit</span>
            <strong>5</strong><span>Workflow design: end-to-end operational movement</span>
            <strong>11</strong><span>Web 6: Secure Authentication &amp; RBAC</span>
            <strong>6</strong><span>Web 1: Central Store &amp; Directorate Dashboard</span>
            <strong>12</strong><span>Mobile Suite: Scanner, Gate &amp; Proof-of-Delivery</span>
            <strong>7</strong><span>Web 2: Inward Stock Intake &amp; GRN Wizard</span>
            <strong>13</strong><span>Clickable prototype &amp; state transitions</span>
            <strong>8</strong><span>Web 3: Press Floor Machine Requisition &amp; Spoilage</span>
            <strong>14</strong><span>Validation plan and KPIs</span>
          </div>
        </div>

        <!-- Evidence submitted -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 7px 10px; font-size: 8.5px; color: #166534;">
          <h4 style="font-size: 9.5px; text-transform: uppercase; color: #15803d; margin-bottom: 3px;">Evidence submitted with this proposal</h4>
          <ul style="margin: 0; padding-left: 12px; line-height: 1.35;">
            <li>Annotated production screenshots of 6 web screens and 4 mobile PWA screens (this PDF)</li>
            <li>Working code prototype with append-only ledger and closed-loop state transitions</li>
            <li>Interactive supply chain flow infographic: 8 nodes from Suppliers to Recipient DDOs</li>
            <li>Full implementation blueprint: bilingual English/Assamese, GIGW 3.0 &amp; CERT-In compliant</li>
          </ul>
        </div>
      </div>

      <!-- Right Column: Directorate Executive Dashboard Live Summary -->
      <div style="flex: 0.9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; background: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <div>
            <h3 style="font-size: 11.5px;">Directorate Executive Dashboard</h3>
            <span style="font-size: 8.5px; color: #64748b;">Bamunimaidam Central Depot · Guwahati</span>
          </div>
          <span class="badge-pill">Live Sample Data</span>
        </div>

        <!-- 4 KPI Metrics Cards -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px; margin-bottom: 10px;">
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px; background: #f8fafc;">
            <div style="font-size: 8.5px; color: #64748b; font-weight: 600;">Active SKUs</div>
            <div style="font-size: 17px; font-weight: 900; color: #0f2942;">248</div>
            <div style="font-size: 8px; color: #15803d; font-weight: 600;">● All categories mapped</div>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px; background: #f8fafc;">
            <div style="font-size: 8.5px; color: #64748b; font-weight: 600;">Paper Stock</div>
            <div style="font-size: 17px; font-weight: 900; color: #0284c7;">142 MT</div>
            <div style="font-size: 8px; color: #64748b;">284 Reels in Bay 2 &amp; 3</div>
          </div>
          <div style="border: 1px solid #fecaca; border-radius: 6px; padding: 8px; background: #fef2f2;">
            <div style="font-size: 8.5px; color: #b91c1c; font-weight: 600;">Low-Stock Alerts</div>
            <div style="font-size: 17px; font-weight: 900; color: #b91c1c;">2</div>
            <div style="font-size: 8px; color: #b91c1c;">1 Critical (Stamp Paper)</div>
          </div>
          <div style="border: 1px solid #fed7aa; border-radius: 6px; padding: 8px; background: #fff7ed;">
            <div style="font-size: 8.5px; color: #c2410c; font-weight: 600;">Pending Indents</div>
            <div style="font-size: 17px; font-weight: 900; color: #c2410c;">12</div>
            <div style="font-size: 8px; color: #c2410c;">Awaiting Sanction</div>
          </div>
        </div>

        <!-- Live Ledger Transactions Table -->
        <h4 style="font-size: 9.5px; text-transform: uppercase; color: #0f2942; margin-bottom: 3px;">Live Ledger Transactions</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>Ref No.</th>
              <th>Item Description</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>GRN-0812</strong></td>
              <td>Maplitho 70 GSM Reel</td>
              <td><span class="tag-green">INWARD</span></td>
              <td>+20 Reels</td>
              <td>142 MT</td>
              <td><span class="tag-green">VERIFIED</span></td>
            </tr>
            <tr>
              <td><strong>WO-GAZ-48</strong></td>
              <td>Azure Laid 80 GSM (Gazette)</td>
              <td><span class="tag-blue">PRESS ISSUE</span></td>
              <td>-6 Reels</td>
              <td>34 Reels</td>
              <td><span class="tag-blue">ON PRESS</span></td>
            </tr>
            <tr>
              <td><strong>IND-1049</strong></td>
              <td>Judicial Forms #7</td>
              <td><span class="tag-amber">OUTWARD</span></td>
              <td>-50 Bdls</td>
              <td>450 Bdls</td>
              <td><span class="tag-amber">IN TRANSIT</span></td>
            </tr>
            <tr>
              <td><strong>CHL-8810</strong></td>
              <td>A4 Copier Paper (75 GSM)</td>
              <td><span class="tag-green">DELIVERED</span></td>
              <td>-100 Reams</td>
              <td>1,482 Reams</td>
              <td><span class="tag-green">QR SIGNED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 2 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 3: REQUIREMENTS MAPPING ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Directorate requirements and MudraKosh outputs <span>Problem statement D-39</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <p style="font-size: 9.5px; color: #475569; margin-bottom: 6px;">
      The left column quotes directly what the Directorate of Printing &amp; Stationery's challenge overview asks for. The right columns show how MudraKosh delivers it and where it is demonstrated in this document.
    </p>

    <table class="data-table" style="font-size: 9.5px;">
      <thead>
        <tr>
          <th style="width: 28%;">Directorate asks for</th>
          <th style="width: 60%;">How MudraKosh delivers it</th>
          <th style="width: 12%; text-align: center;">Shown on</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Accurate and current stock visibility</strong></td>
          <td>Real-time append-only ledger updated instantly upon inward GRN, press floor issue, and dispatch. Zero manual tallying; balances derived strictly from approved transactions.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 6, 10</span></td>
        </tr>
        <tr>
          <td><strong>Lower manual record-keeping effort</strong></td>
          <td>Replaces fragmented physical ledgers with automated Goods Receipt Notes (GRN), digital print job work-orders, and online departmental indents with 1-click approvals.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 7, 9</span></td>
        </tr>
        <tr>
          <td><strong>Earlier identification of low-stock conditions</strong></td>
          <td>Dynamic Reorder Level (ROL) engine triggers color-coded dashboard banners, automated SMS, and email alerts when stock breaches 30% warning or 15% critical thresholds.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 6, 13</span></td>
        </tr>
        <tr>
          <td><strong>Better transparency in issue and receipt of materials</strong></td>
          <td>Cryptographic QR-coded e-Challans printed on dispatch; recipient government offices scan with mobile PWA to log instant digital proof-of-delivery back to the ledger.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 9, 12</span></td>
        </tr>
        <tr>
          <td><strong>Record item-wise receipts, issues, balances and transaction history</strong></td>
          <td>Item Master handles paper units (Metric Tons &rarr; Reels &rarr; Reams &rarr; Sheets) with batch tracking, warehouse bay/rack allocation, and immutable transaction logs.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 7, 10</span></td>
        </tr>
        <tr>
          <td><strong>Provide role-based access and approval controls</strong></td>
          <td>Strict 6-role RBAC matrix (Admin, Director, Store Officer, Storekeeper, Press Supervisor, Recipient DDO). Requester can never approve own indent; dual-signoff on stock adjustments.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 4, 11</span></td>
        </tr>
        <tr>
          <td><strong>Generate basic inventory reports and CAG audit statements</strong></td>
          <td>One-click exportable PDF and Excel reports formatted to Assam Government standards: Monthly Stock Ledger (CAG Form 18), Departmental Issue Summary, and Machine Spoilage Variance.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 6, 10</span></td>
        </tr>
        <tr>
          <td><strong>Support search, audit trail and downloadable records</strong></td>
          <td>Full-text search by Item Code, Mill Batch No., or Indent Reference. Every write operation permanently records User ID, IP address, and timestamp in tamper-evident ledger.</td>
          <td style="text-align: center;"><span class="tag-blue">PAGES 10, 13</span></td>
        </tr>
      </tbody>
    </table>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 3 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 4: SOLUTION ARCHITECTURE ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Solution architecture and data flow <span>Five layers, open standards, transactional integrity</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <!-- 5 Layers Grid -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 12px;">
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #f8fafc;">
        <h4 style="color: #0284c7; margin-bottom: 6px;">1. Inflow &amp; Physical Gate</h4>
        <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
          <li>Paper Mill consignment delivery with PO invoice</li>
          <li>Gate weighment slip recording gross &amp; tare weight</li>
          <li>Thermal barcode / QR printer for physical reel tags</li>
          <li>Mobile camera QR scanner on warehouse floor</li>
        </ul>
      </div>

      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #f8fafc;">
        <h4 style="color: #0284c7; margin-bottom: 6px;">2. Ingestion &amp; API Gateway</h4>
        <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
          <li>REST API with NestJS &amp; DTO schema validation</li>
          <li>Strict rate limiting &amp; JWT / e-Pramaan SSO auth</li>
          <li>CSV / Excel bulk opening stock import validator</li>
          <li>Unit conversion engine: MT &rarr; Reels &rarr; Reams</li>
        </ul>
      </div>

      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #f8fafc;">
        <h4 style="color: #0284c7; margin-bottom: 6px;">3. Append-Only Ledger</h4>
        <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
          <li>PostgreSQL 16 with ACID transactional guarantees</li>
          <li>Row-level locking: zero overselling under concurrency</li>
          <li>Immutable ledger: no direct update/delete allowed</li>
          <li>MinIO private object storage for PDF e-Challans</li>
        </ul>
      </div>

      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #f8fafc;">
        <h4 style="color: #0284c7; margin-bottom: 6px;">4. Press &amp; Alert Engine</h4>
        <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
          <li>Press Job Work-Order material consumption tracker</li>
          <li>Machine trimming &amp; spoilage variance (CAG 3.5% norm)</li>
          <li>Automated low-stock threshold monitor (30% / 15%)</li>
          <li>Queue worker: SMS &amp; email delivery alerts</li>
        </ul>
      </div>

      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #f8fafc;">
        <h4 style="color: #0284c7; margin-bottom: 6px;">5. Applications</h4>
        <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
          <li>Directorate Executive Web Portal (React &amp; Tailwind)</li>
          <li>Central Storekeeper Inventory &amp; GRN interface</li>
          <li>Assam Govt Press Floor production logger</li>
          <li>Offline-capable PWA / CLI for Recipient DDO sign-off</li>
        </ul>
      </div>
    </div>

    <!-- Closed-Loop Banner -->
    <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 8px 14px; margin-bottom: 12px;">
      <h4 style="color: #15803d; font-size: 10px; text-transform: uppercase; margin-bottom: 2px;">Closed-Loop Reconciliation &amp; Proof of Delivery</h4>
      <p style="font-size: 9.5px; color: #166534; margin: 0;">
        Every outbound dispatch is accompanied by a cryptographic QR e-Challan. When the recipient department scans upon delivery, the confirmation instantly syncs back to the central ledger, closing the transaction and archiving digital delivery proof.
      </p>
    </div>

    <!-- 3 Bottom Metadata Cards -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
      <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; background: #ffffff;">
        <h4 style="color: #0f2942; font-size: 10px; margin-bottom: 2px;">Government Hosting</h4>
        <p style="font-size: 9px; color: #475569; margin: 0;">
          Docker containers deployed on MeitY-empanelled cloud or the Assam State Data Centre (SDC). All data stays in India.
        </p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; background: #ffffff;">
        <h4 style="color: #0f2942; font-size: 10px; margin-bottom: 2px;">Security &amp; Compliance</h4>
        <p style="font-size: 9px; color: #475569; margin: 0;">
          TLS 1.3, AES-256 at rest, GIGW 3.0 accessibility, CERT-In VAPT audit before launch, and strict DPDP Act 2023 compliance.
        </p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; background: #ffffff;">
        <h4 style="color: #0f2942; font-size: 10px; margin-bottom: 2px;">Progressive Rollout</h4>
        <p style="font-size: 9px; color: #475569; margin: 0;">
          Level 1: Guwahati Store opening balances. Level 2: Press Floor job-tracking. Level 3: Multi-tenant rollout to Health &amp; Education stores.
        </p>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 4 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 5: WORKFLOW DESIGN ================= -->
  <div class="page" style="justify-content: space-between; padding: 10mm 14mm 8mm 14mm;">
    <div class="top-header">
      <div class="top-header-left">
        Workflow design <span>End-to-end multi-actor movement tracking: from supplier consignment to digital proof-of-delivery</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <!-- Summary Intro Banner -->
    <div style="background: #f8fafc; border-left: 3px solid #d49b24; padding: 5px 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
      <p style="font-size: 9px; color: #334155; margin: 0; line-height: 1.35;">
        <strong>Closed-Loop Operational Lifecycle:</strong> MudraKosh synchronizes 6 government personas across physical weighbridges, QR-tagged store bays, machine print lines, online departmental indenting, and mobile field dispatches with tamper-evident cryptographic sign-off.
      </p>
      <div style="display: flex; gap: 8px; font-size: 8px; font-weight: 700; white-space: nowrap;">
        <span style="color: #0284c7;">● Physical Flow (MT/Reels)</span>
        <span style="color: #15803d;">● Cryptographic Audit (e-Challan)</span>
        <span style="color: #b45309;">● 100% Closed Loop</span>
      </div>
    </div>

    <!-- 5-Stage Multi-Actor Process Flow Pipeline -->
    <div class="flow-grid">
      <!-- Stage 1 -->
      <div class="stage-card" style="border-top: 3px solid #0284c7;">
        <div>
          <span class="stage-badge" style="background: #e0f2fe; color: #0369a1;">Stage 1 · Inward Inflow</span>
          <div class="stage-title">Gate In &amp; QC Verification</div>
          <span class="stage-actor">Gate Guard &amp; Storekeeper</span>
          <ul class="step-list">
            <li>Mill consignment arrival with GeM PO</li>
            <li>Digital weighbridge gross &amp; tare logging</li>
            <li>3-step QC: GSM, tear, moisture testing</li>
            <li>System auto-generates <strong>GRN-2026</strong></li>
            <li>Batch GS1 QR adhesive stickers printed</li>
          </ul>
        </div>
        <div class="artifact-pill">
          <span>Artifact:</span>
          <strong>Inward GRN &amp; Bay QR</strong>
        </div>
      </div>

      <!-- Stage 2 -->
      <div class="stage-card" style="border-top: 3px solid #0f2942;">
        <div>
          <span class="stage-badge" style="background: #e2e8f0; color: #0f2942;">Stage 2 · Storage &amp; Ledger</span>
          <div class="stage-title">Warehouse Allocation &amp; Ledger</div>
          <span class="stage-actor">Store Officer &amp; Append Ledger</span>
          <ul class="step-list">
            <li>Physical reel slotting: Bay 2 / Rack B</li>
            <li>ACID ledger increments instantly (+20 Reels)</li>
            <li>Deterministic unit conversion (MT &rarr; Reams)</li>
            <li>Automated Reorder Level (ROL) monitoring</li>
            <li>Banners alert if stock drops &lt;30% / &lt;15%</li>
          </ul>
        </div>
        <div class="artifact-pill">
          <span>Artifact:</span>
          <strong>Perpetual Ledger Lock</strong>
        </div>
      </div>

      <!-- Stage 3 -->
      <div class="stage-card" style="border-top: 3px solid #d97706;">
        <div>
          <span class="stage-badge" style="background: #fef3c7; color: #b45309;">Stage 3 · Press Conversion</span>
          <div class="stage-title">Govt Press Floor &amp; Spoilage</div>
          <span class="stage-actor">Press Supervisor &amp; Operator</span>
          <ul class="step-list">
            <li>Gazette / Form job work-order linked</li>
            <li>Mounted reel QR scanned at machine feeder</li>
            <li>Daily production: 10,000 gazette copies</li>
            <li>Trimming wastage tracked against <strong>3.5% CAG</strong></li>
            <li>Unused paper returned via Return-to-Store</li>
          </ul>
        </div>
        <div class="artifact-pill">
          <span>Artifact:</span>
          <strong>WO Job Card &amp; Spoilage Act</strong>
        </div>
      </div>

      <!-- Stage 4 -->
      <div class="stage-card" style="border-top: 3px solid #7c3aed;">
        <div>
          <span class="stage-badge" style="background: #f3e8ff; color: #6b21a8;">Stage 4 · Requisition</span>
          <div class="stage-title">Department Indents &amp; Sanction</div>
          <span class="stage-actor">Recipient DDO &amp; DPS Director</span>
          <ul class="step-list">
            <li>Online catalog indent submitted by DC Office</li>
            <li>System verifies annual quota entitlement</li>
            <li>DPS Director reviews &amp; grants 1-click sanction</li>
            <li>Warehouse packs bundles &amp; prints e-Challan</li>
            <li>Cryptographic HMAC-SHA256 QR encoded</li>
          </ul>
        </div>
        <div class="artifact-pill">
          <span>Artifact:</span>
          <strong>e-Challan #CHL-2026</strong>
        </div>
      </div>

      <!-- Stage 5 -->
      <div class="stage-card" style="border-top: 3px solid #16a34a;">
        <div>
          <span class="stage-badge" style="background: #dcfce7; color: #15803d;">Stage 5 · Transit &amp; PoD</span>
          <div class="stage-title">Dispatch Exit &amp; Mobile PoD</div>
          <span class="stage-actor">Driver &amp; Recipient Nodal DDO</span>
          <ul class="step-list">
            <li>Gate security exit weighment &amp; pass</li>
            <li>Driver manifest navigates delivery route</li>
            <li>Recipient DDO scans QR on mobile PWA</li>
            <li>Digital sign-off on glass / OTP verification</li>
            <li><strong>Auto-Reconcile:</strong> Closes transit, syncs ledger</li>
          </ul>
        </div>
        <div class="artifact-pill">
          <span>Artifact:</span>
          <strong>Mobile Digital PoD</strong>
        </div>
      </div>
    </div>

    <!-- Bottom 3-Column Governance & Architectural Grid -->
    <div style="display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 8px; margin-top: 2px;">
      <!-- Column 1: 5 Decision Gates -->
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; background: #ffffff;">
        <h4 style="font-size: 9px; text-transform: uppercase; color: #0f2942; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
          <span style="color: #d49b24;">🛡️</span> 5 Zero-Leakage Decision Gates
        </h4>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 8px; color: #334155;">
          <div style="background: #f8fafc; border-left: 2px solid #0284c7; padding: 3px 5px;">
            <strong>Gate 1 (Weighbridge):</strong> Rejects PO variance exceeding &plusmn;0.5% net weight tolerance.
          </div>
          <div style="background: #f8fafc; border-left: 2px solid #0f2942; padding: 3px 5px;">
            <strong>Gate 2 (Row-Lock):</strong> Blocks concurrent issue exceeding live uncommitted balances.
          </div>
          <div style="background: #f8fafc; border-left: 2px solid #d97706; padding: 3px 5px;">
            <strong>Gate 3 (CAG Norm):</strong> Trimming spoilage &gt;3.5% requires directorate inquiry justification.
          </div>
          <div style="background: #f8fafc; border-left: 2px solid #7c3aed; padding: 3px 5px;">
            <strong>Gate 4 (Dual-Signoff):</strong> Requester cannot sanction own indent (Strict RBAC segregation).
          </div>
          <div style="background: #f8fafc; border-left: 2px solid #16a34a; padding: 3px 5px;">
            <strong>Gate 5 (Closed-Loop PoD):</strong> Transit status closes only upon verified recipient mobile sign-off.
          </div>
        </div>
      </div>

      <!-- Column 2: Material & Data Flow Synchronization -->
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; background: #ffffff;">
        <h4 style="font-size: 9px; text-transform: uppercase; color: #0f2942; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
          <span style="color: #0284c7;">🔄</span> Physical vs Digital Sync
        </h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: left;">
              <th style="padding: 2px 0;">Physical Material</th>
              <th style="padding: 2px 0;">Digital Twin Artifact</th>
            </tr>
          </thead>
          <tbody style="color: #334155; line-height: 1.4;">
            <tr style="border-bottom: 1px dashed #f1f5f9;">
              <td style="padding: 3px 0;">Raw Paper Reels (500 Kg)</td>
              <td style="padding: 3px 0; color: #0284c7; font-weight: 600;">GS1 Batch QR Code</td>
            </tr>
            <tr style="border-bottom: 1px dashed #f1f5f9;">
              <td style="padding: 3px 0;">Warehouse Bins &amp; Racks</td>
              <td style="padding: 3px 0; color: #0284c7; font-weight: 600;">PostgreSQL Bay Map</td>
            </tr>
            <tr style="border-bottom: 1px dashed #f1f5f9;">
              <td style="padding: 3px 0;">Press Job Consumption</td>
              <td style="padding: 3px 0; color: #0284c7; font-weight: 600;">Machine Spoilage Ledger</td>
            </tr>
            <tr style="border-bottom: 1px dashed #f1f5f9;">
              <td style="padding: 3px 0;">Dispatched Parcel Bundles</td>
              <td style="padding: 3px 0; color: #0284c7; font-weight: 600;">HMAC-SHA256 e-Challan</td>
            </tr>
            <tr>
              <td style="padding: 3px 0;">Delivery Acknowledgment</td>
              <td style="padding: 3px 0; color: #16a34a; font-weight: 700;">Mobile Sign-off / OTP</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 5px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 3px 6px; font-size: 7.5px; color: #166534;">
          <strong>Zero Manual Registers:</strong> Replaces peon delivery books &amp; fragmented registers statewide.
        </div>
      </div>

      <!-- Column 3: Statutory Audit & Compliance -->
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; background: #ffffff;">
        <h4 style="font-size: 9px; text-transform: uppercase; color: #0f2942; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
          <span style="color: #16a34a;">📋</span> Statutory Compliance &amp; Audit
        </h4>
        <div style="display: flex; flex-direction: column; gap: 4.5px; font-size: 8px; color: #334155; line-height: 1.35;">
          <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 3px;">
            <strong style="color: #0f2942;">CAG Form 18 Stock Accounts:</strong> Automated monthly generation ready for principal accountant general scrutiny.
          </div>
          <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 3px;">
            <strong style="color: #0f2942;">Tamper-Evident Audit Trail:</strong> Every write records User ID, IP address, role, and pre/post transaction balances.
          </div>
          <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 3px;">
            <strong style="color: #0f2942;">GIGW 3.0 &amp; DPDP Act 2023:</strong> Full Indian government UI compliance, high contrast, bilingual English / অসমীয়া.
          </div>
          <div>
            <strong style="color: #0f2942;">Guwahati Pilot Deployment:</strong> Ready for immediate pilot at Bamunimaidam Central Depot with zero disruption.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 5 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 6: WEB 1 - DASHBOARD (REAL SCREENSHOT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Directorate dashboard, screen 1 of 6: master inventory &amp; alerts overview</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Web 1: Central Store &amp; Directorate Overview</strong> &mdash; The director and store officers' live morning view. Displays stock health, active alerts, fast-moving items, and pending departmental indents.
      </div>
      <div class="screenshot-frame">
        <img src="${images.dashboard}" alt="Executive Dashboard Screen">
      </div>
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>Universal Search</strong>
            Search by item code, delivery challan no., or department.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Headline Metrics</strong>
            Live paper tonnage, reels, and category-wise valuations.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Dynamic Alert Queue</strong>
            Early warning before budget/legislative stockouts occur.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Pending Indent Counter</strong>
            Direct access for Directorate sanctioning authority.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>Real-Time Stock Grid</strong>
            Instant visibility into physical warehouse bay/rack allocations.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 6 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 7: WEB 2 - INWARD GRN (REAL SCREENSHOT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Inward consignment &amp; GRN, screen 2 of 6: 3-step intake &amp; QR label generation</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Web 2: Inward Stock Intake &amp; GRN Wizard</strong> &mdash; Where storekeepers record incoming consignments, verify tare weighment against purchase orders, and generate batch QR labels.
      </div>
      <div class="screenshot-frame">
        <img src="${images.inward}" alt="Inward GRN Wizard Screen">
      </div>
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>PO Verification</strong>
            Maps vendor delivery challan against authorized GeM contracts.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Unit Conversion</strong>
            Automatically converts metric tons to reel counts and sheet equivalents.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Storage Allocation</strong>
            Assigns physical warehouse bays to prevent lost stock.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Cryptographic Batch Tag</strong>
            Each reel gets a unique QR tag containing GSM, mill lot, and tare.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>1-Click Thermal Print</strong>
            Generates bulk adhesive stickers for warehouse personnel.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 7 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 8: WEB 3 - PRESS FLOOR (REAL SCREENSHOT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Assam Govt Press floor, screen 3 of 6: print work-order &amp; spoilage reconciliation</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Web 3: Press Floor Machine Requisition &amp; Wastage Ledger</strong> &mdash; Eliminates the press floor black hole: tracks paper issued to offset/web machines against printed output and machine trimming spoilage.
      </div>
      <div class="screenshot-frame">
        <img src="${images.press}" alt="Press Floor Spoilage Screen">
      </div>
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>Work-Order Link</strong>
            Paper issuance tied directly to specific legislative or gazette jobs.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Reel Tracking</strong>
            Tracks specific QR serial numbers mounted onto press feeder rollers.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Finished Form Ledger</strong>
            Automatically checks newly printed forms into central stock.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Spoilage Compliance</strong>
            Automatically flags trimming wastage exceeding government norms.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>Return-to-Store (RTS)</strong>
            Re-credits unprinted paper back to the storekeeper's ledger.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 8 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 9: WEB 4 - INDENTS & E-CHALLAN (REAL SCREENSHOT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Department indent &amp; e-Challan, screen 4 of 6: online requisition &amp; QR dispatch</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Web 4: Department Requisition Portal &amp; Outward e-Challan Generator</strong> &mdash; Replaces slow paper letters with an online stationery catalog, quota checks, multi-tier approvals, and QR-coded dispatch notes.
      </div>
      <div class="screenshot-frame">
        <img src="${images.indents}" alt="Department Indents Screen">
      </div>
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>Online Indent ID</strong>
            Generated automatically with department timestamp and priority tag.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Quota Validation</strong>
            System checks requested quantity against annual department entitlement.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Director Sanction</strong>
            Approving authority can sanction in full, partially approve, or reject.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Cryptographic e-Challan</strong>
            QR code contains digital signature of dispatch contents and serial.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>Gate Security Pass</strong>
            Exit gate scans QR to verify loaded items match manifest before departure.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 9 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 10: WEB 5 - STOCK LEDGER & AUDIT (REAL SCREENSHOT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Perpetual stock ledger, screen 5 of 6: multi-unit inventory &amp; audit trail</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Web 5: Perpetual Stock Ledger &amp; Immutable Audit Trail Drawer</strong> &mdash; Complete stock catalog with physical warehouse bay slotting, minimum reorder thresholds, and slide-out blockchain-style transaction trail.
      </div>
      <div class="screenshot-frame">
        <img src="${images.stock}" alt="Stock Ledger Screen">
      </div>
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>Item Master Taxonomy</strong>
            Multi-unit catalog for Maplitho, Azure Laid, Newsprint, Inks, and Forms.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Warehouse Bay &amp; Bin</strong>
            Physical storage mapping ensuring zero misplaced paper stock.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Dynamic Thresholds</strong>
            In Stock, Low Stock, and Critical buffer levels with instant alerts.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Immutable Audit Drawer</strong>
            Historical drawer showing cryptographic SHA-256 hashes per line.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>Audit Integrity</strong>
            Zero direct manual quantity overwrites; strictly transaction-backed.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 10 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 11: WEB 6 - AUTHENTICATION GATEWAY (REAL SCREENSHOT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Secure authentication gateway, screen 6 of 6: 1-tap demo switcher &amp; RBAC</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Web 6: Secure Authentication Gateway (/login)</strong> &mdash; Enterprise government access portal featuring 1-tap demo role switching, distorted security captcha, and multiple authentication modalities.
      </div>
      <div class="screenshot-frame">
        <img src="${images.login}" alt="Login Gateway Screen">
      </div>
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>1-Tap Role Selector</strong>
            Instant persona switching between Director, Store Officer, Storekeeper, Press Sup., and DDO.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Multi-Modal Auth</strong>
            Supports Password, NIC Mobile OTP, and Parichay SSO gateway.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Security Captcha</strong>
            Distorted security code preventing bot/automated credential attacks.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Bilingual Localization</strong>
            One-click switch between English and অসমীয়া language interfaces.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>Gov-Tech Compliance</strong>
            Complies with GIGW 3.0 accessibility rules and DPDP Act 2023.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 11 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 12: MOBILE FIELD SUITE (PERFECT CLEAN ALIGNMENT) ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Annotated system screens <span>Field mobile suite: gate pass, QR delivery scanner &amp; digital sign-off</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <div class="screen-layout">
      <div class="screen-lead">
        <strong>Mobile Field Suite: Dispatch, Delivery Verification &amp; Proof-of-Delivery</strong> &mdash; Lightweight, offline-capable mobile app for delivery drivers, security gate guards, and recipient department Nodal Officers.
      </div>

      <!-- 4 Mobile Screenshots Grid (Header at TOP, clean image box with zero overlap) -->
      <div class="mobile-grid">
        <!-- Card 1 -->
        <div class="mobile-card">
          <div class="mobile-card-title">1. Warehouse QR Scanner</div>
          <div class="mobile-card-img-box">
            <img src="${images.mScanner}" alt="Scanner">
          </div>
        </div>

        <!-- Card 2 -->
        <div class="mobile-card">
          <div class="mobile-card-title">2. Gate Pass &amp; Weighment</div>
          <div class="mobile-card-img-box">
            <img src="${images.mGate}" alt="Gate Pass">
          </div>
        </div>

        <!-- Card 3 -->
        <div class="mobile-card">
          <div class="mobile-card-title">3. Driver Delivery Manifest</div>
          <div class="mobile-card-img-box">
            <img src="${images.mManifest}" alt="Manifest">
          </div>
        </div>

        <!-- Card 4 -->
        <div class="mobile-card">
          <div class="mobile-card-title">4. Proof-of-Delivery (POD)</div>
          <div class="mobile-card-img-box">
            <img src="${images.mPod}" alt="Proof of Delivery">
          </div>
        </div>
      </div>

      <!-- 5-Column Callout Annotations clearly separated -->
      <div class="annotations-grid">
        <div class="annotation-item">
          <div class="annotation-num">1</div>
          <div class="annotation-text">
            <strong>Driver Manifest</strong>
            Shows assigned delivery stops, parcel counts, and recipient addresses.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">2</div>
          <div class="annotation-text">
            <strong>Instant QR Scanning</strong>
            Reads physical e-Challan without requiring bulky handheld hardware.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">3</div>
          <div class="annotation-text">
            <strong>Item Verification</strong>
            Recipient officer confirms received cartons match dispatch invoice.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">4</div>
          <div class="annotation-text">
            <strong>Digital Sign-off</strong>
            Recipient signs on screen or validates via OTP; replaces paper peon books.
          </div>
        </div>
        <div class="annotation-item">
          <div class="annotation-num">5</div>
          <div class="annotation-text">
            <strong>Real-Time Sync</strong>
            Confirmation immediately closes the transit record and updates state inventory.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 12 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 13: CLICKABLE PROTOTYPE ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Clickable prototype <span>Flow map of the interactive prototype and live state transitions</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <p style="font-size: 9.5px; color: #475569; margin-bottom: 14px;">
      The MudraKosh prototype links 9 interactive screens across desktop and mobile, demonstrating the complete "Reel-to-Requisition" journey.
    </p>

    <!-- Flow Map Diagram -->
    <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white; text-align: center; min-width: 90px;">
        <strong style="color: #0f2942; font-size: 10px; display: block;">W1: Login</strong>
        <span style="font-size: 8px; color: #64748b;">Auth &amp; RBAC</span>
      </div>
      <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white; text-align: center; min-width: 90px;">
        <strong style="color: #0f2942; font-size: 10px; display: block;">W2: Dashboard</strong>
        <span style="font-size: 8px; color: #64748b;">Overview &amp; Alerts</span>
      </div>
      <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white; text-align: center; min-width: 90px;">
        <strong style="color: #0f2942; font-size: 10px; display: block;">W3: Inward GRN</strong>
        <span style="font-size: 8px; color: #64748b;">Intake &amp; QR Print</span>
      </div>
      <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white; text-align: center; min-width: 90px;">
        <strong style="color: #0f2942; font-size: 10px; display: block;">W4: Press Job</strong>
        <span style="font-size: 8px; color: #64748b;">Reel Issue &amp; Wastage</span>
      </div>
      <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white; text-align: center; min-width: 90px;">
        <strong style="color: #0f2942; font-size: 10px; display: block;">W5: Indents</strong>
        <span style="font-size: 8px; color: #64748b;">Director Sanction</span>
      </div>
      <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white; text-align: center; min-width: 90px;">
        <strong style="color: #0f2942; font-size: 10px; display: block;">W6: e-Challan</strong>
        <span style="font-size: 8px; color: #64748b;">QR Dispatch Note</span>
      </div>
      <div style="color: #94a3b8; font-weight: 800;">&rarr;</div>
      <div style="border: 1.5px solid #86efac; border-radius: 6px; padding: 8px 12px; background: #f0fdf4; text-align: center; min-width: 90px;">
        <strong style="color: #15803d; font-size: 10px; display: block;">M1: Mobile Sign-off</strong>
        <span style="font-size: 8px; color: #166534;">DDO Acknowledged</span>
      </div>
    </div>

    <!-- State Transition A & B Cards -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
      <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #ffffff;">
        <h4 style="color: #b91c1c; font-size: 11px; margin-bottom: 6px;">State A: Low-Stock Condition Detected</h4>
        <p style="font-size: 9.5px; color: #475569; margin-bottom: 10px; line-height: 1.4;">
          When stock drops below threshold (e.g., Judicial Stamp Paper &lt; 15%), an automated alert fires on the dashboard and SMS notification is queued.
        </p>
        <div style="background: #fef2f2; border-left: 3px solid #b91c1c; padding: 8px 10px; font-size: 9px; color: #991b1b; font-family: monospace;">
          CRITICAL ALERT: STP-100-01 has 8 reams left (Minimum ROL: 50). Outward issue blocked for non-emergency indents.
        </div>
      </div>

      <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #ffffff;">
        <h4 style="color: #15803d; font-size: 11px; margin-bottom: 6px;">State B: Inward Restock &amp; Alert Auto-Clearing</h4>
        <p style="font-size: 9.5px; color: #475569; margin-bottom: 10px; line-height: 1.4;">
          Upon authorized GRN creation (+100 reams received from Security Mill), stock balance recalculates to 108 reams and the warning clears immediately.
        </p>
        <div style="background: #f0fdf4; border-left: 3px solid #15803d; padding: 8px 10px; font-size: 9px; color: #166534; font-family: monospace;">
          RESTOCK VERIFIED: GRN-2026-0814 posted. Balance 108 reams. Alert cleared. Normal department indents unblocked.
        </div>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 13 of 14</span>
    </div>
  </div>

  <!-- ================= PAGE 14: VALIDATION PLAN & KPIS ================= -->
  <div class="page">
    <div class="top-header">
      <div class="top-header-left">
        Validation plan and KPIs <span>How performance, accuracy and transparency will be proven</span>
      </div>
      <div class="top-header-right">Proof of Work</div>
    </div>

    <table class="data-table" style="font-size: 9.5px; margin-bottom: 12px;">
      <thead>
        <tr>
          <th style="width: 22%;">Measure</th>
          <th style="width: 38%;">How it is measured</th>
          <th style="width: 30%;">Where the evidence comes from</th>
          <th style="width: 10%; text-align: center;">Milestone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Stock Ledger Accuracy</strong></td>
          <td>Physical bin count compared against running ledger balance</td>
          <td>Store audit discrepancy reports at Guwahati Depot</td>
          <td style="text-align: center;"><span class="tag-blue">M3, M5</span></td>
        </tr>
        <tr>
          <td><strong>Zero Overselling</strong></td>
          <td>Simultaneous concurrency tests attempting to issue beyond stock</td>
          <td>Automated regression concurrency test logs</td>
          <td style="text-align: center;"><span class="tag-blue">M3, M6</span></td>
        </tr>
        <tr>
          <td><strong>Low-Stock Early Warning</strong></td>
          <td>Time elapsed from stock threshold breach to notification delivery</td>
          <td>SMS and dashboard alert dispatch logs</td>
          <td style="text-align: center;"><span class="tag-blue">M4, M6</span></td>
        </tr>
        <tr>
          <td><strong>Delivery Traceability</strong></td>
          <td>Share of dispatches with confirmed mobile QR proof-of-delivery</td>
          <td>Recipient DDO acknowledgment audit trail</td>
          <td style="text-align: center;"><span class="tag-blue">M5, M6</span></td>
        </tr>
        <tr>
          <td><strong>Press Spoilage Control</strong></td>
          <td>Machine trimming spoilage % tracked against 3.5% CAG ceiling</td>
          <td>Weekly Gazette &amp; Form job completion ledgers</td>
          <td style="text-align: center;"><span class="tag-blue">M4, M5</span></td>
        </tr>
        <tr>
          <td><strong>Sub-2-Second Search</strong></td>
          <td>Latency to query item code, challan or department requisition</td>
          <td>Server performance monitoring logs</td>
          <td style="text-align: center;"><span class="tag-blue">M6, M7</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Bottom 2 Evidence Panels -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 14px;">
        <h4 style="color: #15803d; font-size: 10px; text-transform: uppercase; margin-bottom: 4px;">Evidence available now (Done)</h4>
        <ul style="margin: 0; padding-left: 14px; font-size: 9px; line-height: 1.4; color: #166534;">
          <li>End-to-end user journey and 6 annotated production web screens + 4 mobile screens</li>
          <li>Working code prototype with append-only ledger and closed-loop state transitions</li>
          <li>Full supply chain closed-loop circular infographic (8 illustrated nodes)</li>
          <li>Complete 6-role multi-user RBAC security and approval matrix</li>
        </ul>
      </div>

      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 10px 14px;">
        <h4 style="color: #b45309; font-size: 10px; text-transform: uppercase; margin-bottom: 4px;">Evidence produced next (Planned for Pilot)</h4>
        <ul style="margin: 0; padding-left: 14px; font-size: 9px; line-height: 1.4; color: #92400e;">
          <li><strong>M3:</strong> Baseline opening stock verification with Guwahati storekeeper sign-off</li>
          <li><strong>M4:</strong> Live print job reconciliation on Assam Gazette printing lines</li>
          <li><strong>M5:</strong> Pilot QR e-Challan rollout across 5 pilot recipient departments</li>
          <li><strong>M6:</strong> CAG statutory audit compliance report with state-wide replication plan</li>
        </ul>
      </div>
    </div>

    <div class="bottom-footer">
      <span>MudraKosh | NESFIC26 problem statement D-39 (Directorate of Printing &amp; Stationery, Assam)</span>
      <span>All figures in screens are sample data for illustration</span>
      <span>Page 14 of 14</span>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
console.log(`Generated updated HTML without automated test report at: ${OUTPUT_HTML}`);

console.log('Rendering 14-page clean A4 PDF via Chrome...');
const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${OUTPUT_PDF_A4}`,
  OUTPUT_HTML
];

spawnSync(CHROME_PATH, args, { stdio: 'inherit' });

if (fs.existsSync(OUTPUT_PDF_A4)) {
  const stats = fs.statSync(OUTPUT_PDF_A4);
  console.log(`SUCCESS! Created clean 14-page A4 PDF: ${OUTPUT_PDF_A4} (${stats.size} bytes)`);
  try {
    fs.copyFileSync(OUTPUT_PDF_A4, OUTPUT_PDF);
    console.log(`Synchronized copy: ${OUTPUT_PDF}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.log(`NOTE: ${OUTPUT_PDF} is currently open in your viewer. Close the viewer or check ${OUTPUT_PDF_A4}.`);
    } else {
      console.error(err);
    }
  }
} else {
  console.error('Failed to create PDF');
}
