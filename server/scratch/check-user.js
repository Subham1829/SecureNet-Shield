import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const userSchema = new mongoose.Schema({
  email: String,
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date
}, { strict: false });
const User = mongoose.model("User", userSchema);

async function run() {
  await mongoose.connect("mongodb+srv://Soumi:aagbankoGJykziFB@cluster0.reuzsje.mongodb.net/securenet");
  const users = await User.find({ email: "soumiisc2020@gmail.com" });
  console.log("Found users:", users);
  process.exit(0);
}
run();
