// Simple PWA validation script
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating PWA Setup...\n');

const checks = [];

// Check 1: Manifest exists
const manifestPath = path.join(__dirname, '../public/manifest.json');
if (fs.existsSync(manifestPath)) {
  console.log('✅ manifest.json exists');
  checks.push(true);

  // Validate manifest content
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.name && manifest.short_name && manifest.start_url) {
    console.log('✅ manifest.json has required fields');
    checks.push(true);
  } else {
    console.log('❌ manifest.json missing required fields');
    checks.push(false);
  }
} else {
  console.log('❌ manifest.json not found');
  checks.push(false);
}

// Check 2: Service worker exists
const swPath = path.join(__dirname, '../public/service-worker.js');
if (fs.existsSync(swPath)) {
  console.log('✅ service-worker.js exists');
  checks.push(true);
} else {
  console.log('❌ service-worker.js not found');
  checks.push(false);
}

// Check 3: Icons exist
const iconsDir = path.join(__dirname, '../public/icons');
const requiredIcons = [
  'icon-192x192.png',
  'icon-512x512.png',
  'icon-maskable-192x192.png',
  'icon-maskable-512x512.png',
  'apple-touch-icon.png'
];

if (fs.existsSync(iconsDir)) {
  const existingIcons = fs.readdirSync(iconsDir);
  const missingIcons = requiredIcons.filter(icon => !existingIcons.includes(icon));

  if (missingIcons.length === 0) {
    console.log('✅ All required icons exist');
    checks.push(true);
  } else {
    console.log(`❌ Missing icons: ${missingIcons.join(', ')}`);
    checks.push(false);
  }
} else {
  console.log('❌ Icons directory not found');
  checks.push(false);
}

// Check 4: Offline page exists
const offlinePath = path.join(__dirname, '../app/offline/page.tsx');
if (fs.existsSync(offlinePath)) {
  console.log('✅ Offline page exists');
  checks.push(true);
} else {
  console.log('❌ Offline page not found');
  checks.push(false);
}

// Check 5: PWA components exist
const componentsDir = path.join(__dirname, '../components/pwa');
const requiredComponents = [
  'pwa-provider.tsx',
  'install-prompt.tsx',
  'notification-prompt.tsx'
];

if (fs.existsSync(componentsDir)) {
  const existingComponents = fs.readdirSync(componentsDir);
  const missingComponents = requiredComponents.filter(comp => !existingComponents.includes(comp));

  if (missingComponents.length === 0) {
    console.log('✅ All PWA components exist');
    checks.push(true);
  } else {
    console.log(`❌ Missing components: ${missingComponents.join(', ')}`);
    checks.push(false);
  }
} else {
  console.log('❌ PWA components directory not found');
  checks.push(false);
}

// Check 6: Push notification API exists
const pushApiPath = path.join(__dirname, '../app/api/push/subscribe/route.ts');
if (fs.existsSync(pushApiPath)) {
  console.log('✅ Push notification API exists');
  checks.push(true);
} else {
  console.log('❌ Push notification API not found');
  checks.push(false);
}

// Summary
console.log('\n' + '='.repeat(50));
const passed = checks.filter(Boolean).length;
const total = checks.length;
console.log(`\n📊 PWA Validation: ${passed}/${total} checks passed`);

if (passed === total) {
  console.log('\n✅ PWA setup is complete! Ready to test.\n');
  console.log('Next steps:');
  console.log('1. Generate VAPID keys: npx web-push generate-vapid-keys');
  console.log('2. Add keys to .env.local');
  console.log('3. Run: npm run dev');
  console.log('4. Open Chrome DevTools → Lighthouse → PWA audit');
  console.log('\nSee PWA_SETUP.md for detailed instructions.\n');
} else {
  console.log('\n⚠️  Some PWA components are missing. Please check the errors above.\n');
  process.exit(1);
}
