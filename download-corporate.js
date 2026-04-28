const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, 'apps/web/public/images/fnp/corporate');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = {
  // Categories
  'hampers.jpg': 'https://corporate.fnp.com/wp-content/uploads/2025/04/Festive-Hampers.jpg',
  'welcome-kits.jpg': 'https://corporate.fnp.com/wp-content/uploads/2025/03/Onboarding-Kits.jpg',
  'awards.jpg': 'https://corporate.fnp.com/wp-content/uploads/2025/03/Long-Service-awards-2.jpg',
  'diwali.jpg': 'https://corporate.fnp.com/wp-content/uploads/2025/04/image-2.png',
  'christmas.jpg': 'https://corporate.fnp.com/wp-content/uploads/2018/03/Christmas_Corporate-Banner_Mob_720x920.jpg',
  'promotional.jpg': 'https://corporate.fnp.com/wp-content/uploads/2025/04/image-4.jpg',
  
  // Products
  'utility-pack.jpg': 'https://corporate.fnp.com/wp-content/uploads/2021/10/CORP-HMP-084-428x428.jpg',
  'eco-chic.jpg': 'https://corporate.fnp.com/wp-content/uploads/2021/10/CORP-HMP-082-428x428.jpg',
  'copper-kit.jpg': 'https://corporate.fnp.com/wp-content/uploads/2022/02/lets-go-copper-kit-428x428.jpg',
  'brown-collection.jpg': 'https://corporate.fnp.com/wp-content/uploads/2023/05/4-3-428x408.jpg',
};

function download(filename, url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(path.join(targetDir, filename));
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded', filename);
          resolve();
        });
      } else {
        console.error('Failed to download', filename, 'Status:', res.statusCode);
        resolve();
      }
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