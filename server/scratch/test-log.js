import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const AuditLogSchema = new mongoose.Schema({
  actionType: { type: String, required: true },
  details: { type: String, required: true },
  username: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);

async function addTestLog() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await AuditLog.create({
      actionType: "SYSTEM_START",
      details: "Audit logging system initialized successfully.",
      username: "System",
    });

    console.log("Test log added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addTestLog();
