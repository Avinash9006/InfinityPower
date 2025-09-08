const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: String,
  image:String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
