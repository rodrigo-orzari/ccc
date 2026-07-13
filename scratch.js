const http = require('http');

http.get('http://localhost:3000/api/workloads', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log("Error parsing JSON");
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
