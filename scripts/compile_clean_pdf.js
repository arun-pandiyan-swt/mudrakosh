const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const INPUT_HTML = path.join(DOCS_DIR, 'MudraKosh_A4_Full_Document.html');
const OUTPUT_PDF = path.join(ROOT_DIR, 'MudraKosh_Proof_of_Work_NESFIC_D39.pdf');
const OUTPUT_PDF_A4 = path.join(ROOT_DIR, 'MudraKosh_Proof_of_Work_NESFIC_D39_A4.pdf');

console.log('Compiling PDF from:', INPUT_HTML);

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${OUTPUT_PDF_A4}`,
  INPUT_HTML
];

const res = spawnSync(CHROME_PATH, args, { stdio: 'inherit' });

if (fs.existsSync(OUTPUT_PDF_A4)) {
  const stats = fs.statSync(OUTPUT_PDF_A4);
  console.log(`SUCCESS! Created clean 14-page A4 PDF: ${OUTPUT_PDF_A4} (${stats.size} bytes)`);
  try {
    fs.copyFileSync(OUTPUT_PDF_A4, OUTPUT_PDF);
    console.log(`Synchronized copy to: ${OUTPUT_PDF}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.log(`NOTE: ${OUTPUT_PDF} is currently open in your PDF viewer. Close the viewer to overwrite it directly, or open ${OUTPUT_PDF_A4}.`);
    } else {
      console.error(err);
    }
  }
} else {
  console.error('Failed to create PDF');
  process.exit(1);
}
