const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG content for the icon
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="256" cy="256" r="256" fill="#3B82F6"/>
  
  <!-- Book icon -->
  <rect x="128" y="160" width="256" height="192" rx="8" fill="white" stroke="#1E40AF" stroke-width="4"/>
  
  <!-- Book pages -->
  <rect x="144" y="176" width="224" height="160" fill="#F3F4F6"/>
  
  <!-- Text lines representing English learning -->
  <line x1="160" y1="200" x2="352" y2="200" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="220" x2="320" y2="220" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="240" x2="336" y2="240" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="260" x2="304" y2="260" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="280" x2="344" y2="280" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
  <line x1="160" y1="300" x2="312" y2="300" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Star for achievement/gamification -->
  <path d="M256 120 L268 148 L300 148 L276 168 L284 200 L256 184 L228 200 L236 168 L212 148 L244 148 Z" fill="#FCD34D"/>
  
  <!-- Small stars around -->
  <path d="M180 100 L184 108 L192 108 L186 114 L188 122 L180 118 L172 122 L174 114 L168 108 L176 108 Z" fill="#FCD34D"/>
  <path d="M340 100 L344 108 L352 108 L346 114 L348 122 L340 118 L332 122 L334 114 L328 108 L336 108 Z" fill="#FCD34D"/>
</svg>`;

async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Generate 192x192 icon
    await sharp(Buffer.from(svgContent))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'pwa-192x192.png'));

    // Generate 512x512 icon
    await sharp(Buffer.from(svgContent))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'pwa-512x512.png'));

    // Generate favicon
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));

    // Generate apple-touch-icon
    await sharp(Buffer.from(svgContent))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('✅ PWA icons generated successfully!');
    console.log('Generated files:');
    console.log('- pwa-192x192.png');
    console.log('- pwa-512x512.png');
    console.log('- favicon.ico');
    console.log('- apple-touch-icon.png');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();