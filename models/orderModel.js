const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentGateway: { type: String, enum: ["razorpay", "stripe"], required: true },
  paymentId: String,
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
