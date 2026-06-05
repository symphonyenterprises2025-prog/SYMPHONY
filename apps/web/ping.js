const https = require('https');

const url = process.env.PING_URL || 'https://symphonyenterprise.co.in/api/ping';

https.get(url, (res) => {
  console.log(`Pinged ${url} - Status: ${res.statusCode}`);
  process.exit(0);
}).on('error', (err) => {
  console.error(`Ping failed: ${err.message}`);
  process.exit(1);
});

setTimeout(() => {
  console.log('Ping timeout');
  process.exit(1);
}, 10000);
