const testLoginLimit = async () => {
  let failed = 0;
  for (let i = 1; i <= 25; i++) {
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "wrong", password: "123" })
      });
      const data = await res.json();
      console.log(`Request ${i}: Status ${res.status} - ${JSON.stringify(data)}`);
      if (!res.ok) failed++;
    } catch (err) {
      console.error(`Request ${i} failed:`, err.message);
    }
  }
  console.log(`Total failed requests: ${failed}`);
};

testLoginLimit();
