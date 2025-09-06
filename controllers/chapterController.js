const Chapter = require("../models/chapterModel");
const Subject = require("../models/subjectModel");
const Video = require("../models/videoModel")

/**
 * Create a chapter under a subject
 * Only Teacher/Admin
 */
const createChapter = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, description, videos, order } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Ensure subject exists and belongs to tenant
    const subject = await Subject.findOne({ _id: subjectId });
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const chapter = await Chapter.create({
      title,
      description,
      order: order || 0,
      subjectId,
      tenantId: req.user.tenantId,
      createdBy: req.user.userId,
    });

    // Update the chapterId for all videos
    if (videos && videos.length > 0) {
      await Promise.all(
        videos.map(async (videoId) => {
          await Video.findOneAndUpdate(
            { _id: videoId, tenantId: req.user.tenantId },
            { chapterId: chapter._id }
          );
        })
      );
    }

    res.status(201).json({ success: true, chapter });
  } catch (err) {
    console.error("Error creating chapter:", err);
    res.status(500).json({ success: false, message: "Failed to create chapter", error: err.message });
  }
};


/**
 * Get all chapters under a subject
 */
const getChapters = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!subjectId) {
      return res.status(400).json({ success: false, message: "Subject ID required" });
    }

    const chapters = await Chapter.find({ subjectId })
      .sort({ order: 1, createdAt: 1 });

    res.json({ success: true, chapters });
  } catch (err) {
    console.error("Error fetching chapters:", err);
    res.status(500).json({ success: false, message: "Failed to fetch chapters", error: err.message });
  }
};

/**
 * Get a single chapter by ID
 */
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Chapter ID required" });
    }

    const chapter = await Chapter.findOne({ _id: id })

    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    res.json({ success: true, chapter });
  } catch (err) {
    console.error("Error fetching chapter:", err);
    res.status(500).json({ success: false, message: "Failed to fetch chapter", error: err.message });
  }
};

/**
 * Update a chapter
 * Only Teacher/Admin
 */
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoId, order } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Chapter ID required" });
    }

    const chapter = await Chapter.findOneAndUpdate(
      { _id: id, tenantId: req.user.tenantId },
      {
        title,
        description,
        order: order || 0,
        videos: videoId ? [videoId] : [],
      },
      { new: true, runValidators: true }
    ).populate("videos");

    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    res.json({ success: true, chapter });
  } catch (err) {
    console.error("Error updating chapter:", err);
    res.status(500).json({ success: false, message: "Failed to update chapter", error: err.message });
  }
};

/**
 * Delete a chapter
 * Only Teacher/Admin
 */
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Chapter ID required" });
    }

    const chapter = await Chapter.findOneAndDelete({ _id: id, tenantId: req.user.tenantId });

    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    res.json({ success: true, message: "Chapter deleted successfully" });
  } catch (err) {
    console.error("Error deleting chapter:", err);
    res.status(500).json({ success: false, message: "Failed to delete chapter", error: err.message });
  }
};

module.exports = {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
};
