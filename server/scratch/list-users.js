import mongoose from "mongoose";

const URI = "mongodb+srv://Soumi:aagbankoGJykziFB@cluster0.reuzsje.mongodb.net/securenet";

mongoose.connect(URI).then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection("users").find({}).toArray();
  console.log("Users in DB:");
  users.forEach(u => console.log(`- ${u.email} (pwd hash: ${u.password})`));
  process.exit(0);
});
