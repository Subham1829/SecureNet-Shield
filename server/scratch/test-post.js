fetch("http://localhost:4000/api/blocked-ips", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ ip: "1.1.1.1", reason: "test via script" })
}).then(res => res.json()).then(console.log).catch(console.error);
