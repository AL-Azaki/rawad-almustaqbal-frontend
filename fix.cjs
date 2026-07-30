const fs = require('fs');
const files = [
  'src/pages/admin/marketing/Campaigns.tsx',
  'src/pages/admin/marketing/Guide.tsx',
  'src/pages/admin/marketing/Overview.tsx',
  'src/pages/admin/marketing/Tracking.tsx',
  'src/pages/admin/marketing/UrlBuilder.tsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(f, c);
  console.log('Fixed', f);
});
