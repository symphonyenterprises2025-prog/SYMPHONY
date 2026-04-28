// Script to download FNP personalized gifts images
// Run this script in the project root: node download-fnp-images.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// FNP personalized gifts image URLs (extracted from their page)
const fnpImages = [
  // Personalized Cushions
  'https://img.fnp.com/images/pr/l/new-year-personalised-cushion_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-cushion-photo-cushion_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-photo-frame-cushion_1.jpg',
  
  // Personalized Caricatures
  'https://img.fnp.com/images/pr/l/personalised-caricature-mug_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-caricature-keychain_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-caricature-cushion_1.jpg',
  
  // Personalized Jewellery
  'https://img.fnp.com/images/pr/l/personalised-bracelet_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-pendant_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-ring_1.jpg',
  
  // Personalized Stationery
  'https://img.fnp.com/images/pr/l/personalised-pen_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-diary_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-power-bank_1.jpg',
  
  // Personalized Chocolates
  'https://img.fnp.com/images/pr/l/personalised-ferrero-rocher_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-chocolate-box_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-chocolate-photo-wrap_1.jpg',
  
  // Personalized Flowers
  'https://img.fnp.com/images/pr/l/personalised-flower-mug_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-rose-bouquet_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-orchid-pot_1.jpg',
  
  // Personalized Cakes
  'https://img.fnp.com/images/pr/l/personalised-photo-cake_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-birthday-cake_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-theme-cake_1.jpg',
  
  // Personalized Frames
  'https://img.fnp.com/images/pr/l/personalised-wooden-frame_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-desk-frame_1.jpg',
  'https://img.fnp.com/images/pr/l/personalised-map-frame_1.jpg',
  
  // Banner/Hero Images
  'https://img.fnp.com/images/pr/l/personalised-gifts-banner.jpg',
  'https://img.fnp.com/images/pr/l/personalised-gifts-hero.jpg',
];

const targetDir = path.join(__dirname, 'apps/web/public/images/fnp');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filepath = path.join(targetDir, filename);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download: ${url} (Status: ${response.statusCode})`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAll() {
  console.log('Starting download of FNP images...');
  console.log(`Target directory: ${targetDir}`);
  console.log(`Total images to download: ${fnpImages.length}`);
  console.log('');
  
  for (let i = 0; i < fnpImages.length; i++) {
    const url = fnpImages[i];
    const filename = `fnp-${i + 1}${path.extname(url) || '.jpg'}`;
    
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`Error downloading ${url}:`, error.message);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('');
  console.log('Download complete!');
  console.log(`Images saved to: ${targetDir}`);
}

downloadAll().catch(console.error);
