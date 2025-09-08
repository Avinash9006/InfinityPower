const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  description: String,
  image:String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Chapter", chapterSchema);
