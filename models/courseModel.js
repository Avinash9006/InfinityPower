const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  title: { type: String, required: true },
  description: String,
  price: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" }
  },
  isFree: { type: Boolean, default: false }, // for internal students
  published: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
