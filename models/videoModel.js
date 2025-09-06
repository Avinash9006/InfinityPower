const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["upload", "link"], required: true },
  url: { type: String, required: true },
  thumbnail: String,
  level: { type: String, enum: ["free", "premium"], default: "free" },
  language: { type: String, default: "Hindi" },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },  
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
