const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // optional link to your existing Video model
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", chapterSchema);
