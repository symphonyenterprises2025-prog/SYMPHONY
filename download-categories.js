const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, 'apps/web/public/images/fnp/products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = {
  'mugs.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/Mugs-02-04-2025.png',
  'cushions.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/cushions-02-04-2025.png',
  'sippers.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/sippers-02-04-2025.png',
  'frames.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/Photo-frames-02-04-2025.png',
  'neon.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/neon-lights-02-04-2025.png',
  'flowers.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/Flowers-02-04-2025.png',
  'stationery.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/Stationary-02-04-2025.png',
  'caricatures.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/personalise_your_moments_with/Caricatures-02-04-2025.png',
  
  // product samples
  'tabletops.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/tailor_made_treasures/Table_tops-02-02-2025.png',
  'speakers.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/tailor_made_treasures/Speakers-02-02-2025.png',
  'lamps.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/tailor_made_treasures/Lamps-02-02-2025.png',
  'clocks.png': 'https://www.fnp.com/assets/images/custom/personalised_24/v2/tailor_made_treasures/Clocks-02-02-2025.png'
};

function download(filename, url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const file = fs.createWriteStream(path.join(targetDir, filename));
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded', filename);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const [filename, url] of Object.entries(images)) {
    try {
      await download(filename, url);
    } catch (e) {
      console.error('Failed', filename, e.message);
    }
  }
}
run();