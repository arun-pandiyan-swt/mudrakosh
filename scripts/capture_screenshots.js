const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');
const USER_DATA_DIR = path.resolve(SCREENSHOT_DIR, 'ud');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function createSpaServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  return http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (e) {
      res.writeHead(500);
      res.end('Error loading file');
    }
  }).listen(port, '127.0.0.1');
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capture() {
  const frontendDir = path.resolve(__dirname, '..', 'apps', 'frontend', 'dist');
  const mobileDir = path.resolve(__dirname, '..', 'apps', 'mobile', 'dist');

  console.log('Starting frontend server on 127.0.0.1:4173...');
  const serverFrontend = createSpaServer(frontendDir, 4173);

  console.log('Starting mobile server on 127.0.0.1:4174...');
  const serverMobile = createSpaServer(mobileDir, 4174);

  await sleep(1000);

  const desktopScreens = [
    { name: '01_secure_login_gateway.png', url: 'http://127.0.0.1:4173/', width: 1280, height: 850 },
    { name: '02_executive_dashboard.png', url: 'http://127.0.0.1:4173/?auth=true&tab=dashboard', width: 1280, height: 900 },
    { name: '03_perpetual_stock_ledger.png', url: 'http://127.0.0.1:4173/?auth=true&tab=stock', width: 1280, height: 900 },
    { name: '04_inward_grn_wizard.png', url: 'http://127.0.0.1:4173/?auth=true&tab=inward', width: 1280, height: 900 },
    { name: '05_press_floor_spoilage.png', url: 'http://127.0.0.1:4173/?auth=true&tab=press', width: 1280, height: 900 },
    { name: '06_department_indents.png', url: 'http://127.0.0.1:4173/?auth=true&tab=indents', width: 1280, height: 900 },
    { name: '07_dispatch_echallan.png', url: 'http://127.0.0.1:4173/?auth=true&tab=dispatch', width: 1280, height: 900 },
    { name: '08_statutory_reports.png', url: 'http://127.0.0.1:4173/?auth=true&tab=reports', width: 1280, height: 900 },
    { name: '09_alerts_center.png', url: 'http://127.0.0.1:4173/?auth=true&tab=alerts', width: 1280, height: 900 }
  ];

  const mobileScreens = [
    { name: 'm01_warehouse_qr_scanner.png', url: 'http://127.0.0.1:4174/?auth=true&tab=scanner', width: 420, height: 880 },
    { name: 'm02_gate_pass_weighbridge.png', url: 'http://127.0.0.1:4174/?auth=true&tab=gate', width: 420, height: 880 },
    { name: 'm03_driver_manifest.png', url: 'http://127.0.0.1:4174/?auth=true&tab=manifest', width: 420, height: 880 },
    { name: 'm04_proof_of_delivery_pod.png', url: 'http://127.0.0.1:4174/?auth=true&tab=pod', width: 420, height: 880 }
  ];

  console.log('Capturing Desktop screens...');
  for (const s of desktopScreens) {
    const outPath = path.join(SCREENSHOT_DIR, s.name);
    console.log(`Capturing ${s.name}...`);
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      `--user-data-dir=${USER_DATA_DIR}`,
      `--screenshot=${outPath}`,
      `--window-size=${s.width},${s.height}`,
      s.url
    ];
    spawnSync(CHROME_PATH, args);
  }

  console.log('Capturing Mobile screens...');
  for (const s of mobileScreens) {
    const outPath = path.join(SCREENSHOT_DIR, s.name);
    console.log(`Capturing ${s.name}...`);
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      `--user-data-dir=${USER_DATA_DIR}`,
      `--screenshot=${outPath}`,
      `--window-size=${s.width},${s.height}`,
      s.url
    ];
    spawnSync(CHROME_PATH, args);
  }

  console.log('All screenshots captured successfully!');
  serverFrontend.close();
  serverMobile.close();
  process.exit(0);
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
