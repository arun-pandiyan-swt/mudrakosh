const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const testHtml = path.resolve(__dirname, '..', 'docs', 'test.html');
const testPdf = path.resolve(__dirname, '..', 'docs', 'test.pdf');

const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  @page {
    size: A4 landscape;
    margin: 0;
  }
  body {
    margin: 0;
    padding: 10mm 14mm;
    font-family: sans-serif;
  }
</style>
</head>
<body>
  <h1>Testing zero margin</h1>
</body>
</html>
`;

fs.writeFileSync(testHtml, html, 'utf8');

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--print-to-pdf=${testPdf}`,
  testHtml
];

spawnSync(CHROME, args, { stdio: 'inherit' });

if (fs.existsSync(testPdf)) {
  const content = fs.readFileSync(testPdf, 'utf8');
  console.log('PDF generated! Size:', fs.statSync(testPdf).size);
  console.log('Contains test.html path:', content.includes('test.html'));
  console.log('Contains file path:', content.includes('USER') || content.includes('Documents'));
}
