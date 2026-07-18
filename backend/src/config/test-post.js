const http = require('http');

const data = JSON.stringify({
  code: 'TEST',
  name: 'Test Company Tbk.',
  pe_ratio: 12.5,
  roe: 15.2,
  der: 0.8,
  dividend_yield: 4.2
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/stocks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  console.log(`STATUS: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
