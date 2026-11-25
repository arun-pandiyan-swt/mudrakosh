const fs = require('fs');

const html = fs.readFileSync('docs/MudraKosh_A4_Full_Document.html', 'utf8');
const parts = html.split('<div class="page"');
console.log('Total pages found:', parts.length - 1);

parts.slice(1).forEach((p, idx) => {
  const footer = p.match(/Page \d+ of \d+/);
  const header = p.match(/class="top-header-left">([\s\S]*?)<\/div>/);
  console.log(`Page ${idx + 1}: ${footer ? footer[0] : 'Cover'} | ${header ? header[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'Cover Page'}`);
});
