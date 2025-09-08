const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // Upload or external link
    type: { type: String, enum: ["upload", "link"], required: true },

    // Category of resource
    category: { type: String, enum: ["notes", "dpp", "other"], default: "other" },

    // Resource path
    url: { type: String, required: true }, // file path or external link

    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
