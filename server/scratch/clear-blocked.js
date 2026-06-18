import mongoose from "mongoose";

const URI = "mongodb+srv://Soumi:aagbankoGJykziFB@cluster0.reuzsje.mongodb.net/securenet";

mongoose.connect(URI).then(async () => {
  const db = mongoose.connection.db;
  await db.collection("blockedips").deleteMany({ ip: { $in: ["::1", "127.0.0.1"] } });
  console.log("Cleared localhost from blocked IPs");
  process.exit(0);
});
