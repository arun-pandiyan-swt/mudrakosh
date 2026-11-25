const fs = require('fs');

function inspect(file) {
  console.log('=== ' + file + ' ===');
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('class="page"') || line.includes('class="page ') || line.includes('<!-- PAGE') || line.includes('<!-- ================= PAGE')) {
      console.log(`L${idx+1}: ${line.trim()}`);
    }
    if (line.toLowerCase().includes('workflow') || line.toLowerCase().includes('flow') || line.toLowerCase().includes('process')) {
      if (line.includes('header') || line.includes('title') || line.includes('h1') || line.includes('h2') || line.includes('h3')) {
        console.log(`Workflow/Flow header at L${idx+1}: ${line.trim()}`);
      }
    }
  });
}

inspect('docs/MudraKosh_Proof_of_Work_Report.html');
inspect('docs/MudraKosh_A4_Full_Document.html');
inspect('MUDRAKOSH_MASTER_SOLUTION_DOCUMENT.md');
