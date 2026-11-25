const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, '..', 'docs', 'MudraKosh_A4_Full_Document.html');
const outScreenshot = path.resolve(__dirname, '..', 'docs', 'page12_verification.png');

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');
function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOT_DIR, filename);
  if (fs.existsSync(filePath)) {
    return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
  }
  return '';
}

const images = {
  mScanner: getBase64Image('m01_warehouse_qr_scanner.png'),
  mGate: getBase64Image('m02_gate_pass_weighbridge.png'),
  mManifest: getBase64Image('m03_driver_manifest.png'),
  mPod: getBase64Image('m04_proof_of_delivery_pod.png')
};

const page12Html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { size: 297mm 210mm; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1e293b;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 11px;
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
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }
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
  }
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
  .screen-layout {
    display: flex;
    flex-direction: column;
  }
  .screen-lead {
    font-size: 10.5px;
    color: #475569;
    margin-bottom: 8px;
  }
  .screen-lead strong {
    color: #0f2942;
  }
  .mobile-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 12px;
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
  .annotations-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    padding-top: 4px;
  }
  .annotation-item {
    display: flex;
    gap: 6px;
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
</style>
</head>
<body>

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

      <!-- 4 Mobile Screenshots Grid -->
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

      <!-- 5-Column Callout Annotations -->
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
      <span>Page 12 of 15</span>
    </div>
  </div>

</body>
</html>
`;

const page12File = path.resolve(__dirname, '..', 'docs', 'page12.html');
fs.writeFileSync(page12File, page12Html, 'utf8');

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  `--screenshot=${outScreenshot}`,
  '--window-size=1122,793',
  page12File
];
spawnSync(CHROME, args, { stdio: 'inherit' });
console.log('Page 12 verification screenshot captured!');
