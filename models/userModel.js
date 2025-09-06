const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true }, // 🔑 multi-tenant
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // store hashed
  role: { type: String, enum: ["admin", "teacher", "student", "platform_admin", "anonymous"], default: "student" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
