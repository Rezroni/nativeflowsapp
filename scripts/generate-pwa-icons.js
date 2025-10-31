// Script to generate PWA icons from Logo.png
// This script requires sharp package: npm install --save-dev sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_IMAGE = path.join(__dirname, '../styles/Logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Maskable icons (with safe zone padding)
const maskableSizes = [
  { size: 192, name: 'icon-maskable-192x192.png' },
  { size: 512, name: 'icon-maskable-512x512.png' },
];

async function generateIcons() {
  try {
    console.log('🎨 Generating PWA icons...\n');

    // Generate regular icons
    for (const { size, name } of sizes) {
      await sharp(INPUT_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 139, g: 92, b: 246, alpha: 1 } // #8b5cf6
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, name));
      console.log(`✓ Generated ${name}`);
    }

    // Generate maskable icons (with 20% padding for safe zone)
    for (const { size, name } of maskableSizes) {
      const iconSize = Math.floor(size * 0.8); // 80% of total size
      const padding = Math.floor((size - iconSize) / 2);

      await sharp(INPUT_IMAGE)
        .resize(iconSize, iconSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 139, g: 92, b: 246, alpha: 1 } // #8b5cf6
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, name));
      console.log(`✓ Generated ${name} (maskable)`);
    }

    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
