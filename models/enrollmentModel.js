const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  type: { type: String, enum: ["internal", "external"], required: true },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
  progress: {
    completedChapters: { type: Number, default: 0 },
    completedVideos: { type: Number, default: 0 }
  },
  enrolledAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
