const fs = require('fs');
const path = require('path');

// Read test workflow page content
const wfHtml = fs.readFileSync('docs/test_workflow_page.html', 'utf8');
const wfPageMatch = wfHtml.match(/<div class="page">([\s\S]*?)<\/div>\s*<\/body>/);
if (!wfPageMatch) throw new Error('Could not match page in test_workflow_page.html');
const newPage5Content = wfPageMatch[1];

// Update MudraKosh_A4_Full_Document.html
let doc = fs.readFileSync('docs/MudraKosh_A4_Full_Document.html', 'utf8');

// Update TOC
doc = doc.replace(
  '<strong>5</strong><span>End-to-end user journey: delivery to sign-off</span>',
  '<strong>5</strong><span>Workflow design: end-to-end operational movement</span>'
);

// Replace Page 5
const p5Start = doc.indexOf('<!-- ================= PAGE 5');
const p6Start = doc.indexOf('<!-- ================= PAGE 6');
if (p5Start === -1 || p6Start === -1) throw new Error('Could not find Page 5 boundaries');

// Extract CSS classes required for stage-card and flow-grid
const cssInject = `
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
`;

if (!doc.includes('.flow-grid {')) {
  doc = doc.replace('</style>', cssInject + '\n  </style>');
}

const page5Replacement = `<!-- ================= PAGE 5: WORKFLOW DESIGN ================= -->
  <div class="page">
${newPage5Content}
  </div>

  `;

doc = doc.substring(0, p5Start) + page5Replacement + doc.substring(p6Start);

fs.writeFileSync('docs/MudraKosh_A4_Full_Document.html', doc, 'utf8');
console.log('Successfully updated docs/MudraKosh_A4_Full_Document.html with Workflow Design!');
