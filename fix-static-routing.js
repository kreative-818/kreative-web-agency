
const fs = require('fs');
const path = require('path');

// Pages that need both /page and /page/ to work
const pages = [
  'thank-you',
  'quote',
  'get-quote',
  'request-quote',
  'about',
  'services',
  'portfolio',
  'pricing',
  'login',
  'landing',
  'get-started',
  'onboarding',
  'customer-journey',
  'customer-roadmap',
  'roadmap',
  'privacy',
  'terms'
];

const buildDir = path.join(__dirname, '.build');
const serverAppDir = path.join(buildDir, 'server', 'app');

console.log('🔧 Fixing routing structure for static hosting...');

pages.forEach(pageName => {
  const htmlFile = path.join(serverAppDir, `${pageName}.html`);
  const pageDir = path.join(serverAppDir, pageName);
  const indexHtml = path.join(pageDir, 'index.html');

  if (fs.existsSync(htmlFile)) {
    // Ensure directory exists
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Copy HTML file as index.html
    fs.copyFileSync(htmlFile, indexHtml);
    console.log(`✅ ${pageName}/index.html`);
  }
});

console.log('✨ Routing structure fixed! Both /page and /page/ will now work.');
