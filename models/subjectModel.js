// subjectModel.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // ✅
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
