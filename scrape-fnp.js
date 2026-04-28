const https = require('https');

https.get('https://www.fnp.com/personalised-gifts-lp?promo=personalised-gifts_tab_dt_hm', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // Look for any fnp.com image URLs
    const imgRegex = /https?:\/\/[a-zA-Z0-9_\-\.]*fnp\.com\/[^"'\s]+?\.(?:jpg|png|webp|jpeg)/ig;
    let matches = [...new Set(data.match(imgRegex) || [])];
    console.log(JSON.stringify(matches.slice(0, 50), null, 2));
    
    // Also let's try to extract some product titles
    const titleRegex = /"name"\s*:\s*"([^"]+)"/g;
    let titles = [];
    let match;
    while ((match = titleRegex.exec(data)) !== null) {
      titles.push(match[1]);
    }
    console.log("Titles:", [...new Set(titles)].slice(0, 20));
    
    // Check if we got anything
    if (matches.length === 0) {
      console.log("First 1000 chars of HTML to debug:", data.substring(0, 1000));
    }
  });
}).on('error', (e) => {
  console.error(e);
});