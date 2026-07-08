const http = require('http');

http.get('http://localhost:3000/settings', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (data.includes('Next.js Error')) {
      console.log('Found Next.js Error!');
    }
    const match = data.match(/<title>(.*?)<\/title>/);
    console.log('Title:', match ? match[1] : 'No title');
    // Check if it's an error page
    if (data.includes('Error:')) {
      console.log('Contains Error string in HTML. Snippet:');
      const idx = data.indexOf('Error:');
      console.log(data.substring(idx - 50, idx + 200));
    }
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
