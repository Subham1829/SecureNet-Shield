async function test() {
  try {
    const res = await fetch(
      "https://server-tan-delta.vercel.app/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Test User 2",
          email: "test2_9999@test.com",
          password: "Test12345!",
        }),
      },
    );
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
