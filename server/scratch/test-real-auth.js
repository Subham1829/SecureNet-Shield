const testRealAuth = async () => {
  console.log("1. Testing Registration...");
  const regRes = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: "Test User", email: `test${Date.now()}@test.com`, password: "StrongPassword123!" })
  });
  const regData = await regRes.json();
  console.log(`Registration Status: ${regRes.status}`, regData);

  console.log("\n2. Testing Login...");
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: regData.user.email, password: "StrongPassword123!" })
  });
  
  // Check if cookie is set
  const cookieHeader = loginRes.headers.get("set-cookie");
  console.log(`Cookie set: ${cookieHeader ? "YES" : "NO"} (${cookieHeader})`);
  
  const loginData = await loginRes.json();
  console.log(`Login Status: ${loginRes.status}`, loginData);
};

testRealAuth();
