const https = require('https');

https.get('https://www.fnp.com/corporate/?promo=corporate_enquiry', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const imgRegex = /https?:\/\/[a-zA-Z0-9_\-\.]*fnp\.com\/[^"'\s]+?\.(?:jpg|png|webp|jpeg)/ig;
    let matches = [...new Set(data.match(imgRegex) || [])];
    console.log(JSON.stringify(matches.slice(0, 50), null, 2));
  });
}).on('error', (e) => {
  console.error(e);
});