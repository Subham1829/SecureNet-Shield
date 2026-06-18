(async () => {
  try {
    const regRes = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Test User', email: `test${Date.now()}@test.com`, password: 'StrongPassword123!' })
    });
    const regData = await regRes.json();
    const token = regData.token;
    console.log("Logged in with token", token);
    
    const analyzeRes = await fetch('http://localhost:4000/api/analyze/8.8.8.8', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const analyzeData = await analyzeRes.json();
    console.log(analyzeRes.status, analyzeData);
  } catch (err) {
    console.error(err);
  }
})();
