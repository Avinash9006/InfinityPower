const Chapter = require("../models/chapterModel");
const Subject = require("../models/subjectModel");

// ✅ Create a chapter under a subject
const createChapter = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, description, videoUrl } = req.body;

    // Ensure subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Create chapter with subject reference
    const chapter = new Chapter({
      title,
      description,
      videoUrl,
      subject: subjectId,
      createdBy: req.user._id,
    });

    await chapter.save();

    // Push chapter reference into subject
    subject.chapters.push(chapter._id);
    await subject.save();

    res.status(201).json(chapter);
  } catch (err) {
    console.error("Error creating chapter:", err);
    res.status(500).json({ error: "Failed to create chapter" });
  }
};

// ✅ Get all chapters under a subject
const getChapters = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId).populate("chapters");
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(subject.chapters);
  } catch (err) {
    console.error("Error fetching chapters:", err);
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
};

// ✅ Get a single chapter by ID
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;

    const chapter = await Chapter.findById(id)
      .populate("subject", "title")
      .populate("createdBy", "name email role");

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.json(chapter);
  } catch (err) {
    console.error("Error fetching chapter:", err);
    res.status(500).json({ error: "Failed to fetch chapter" });
  }
};

// ✅ Update chapter
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      { title, description, videoUrl },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.json(chapter);
  } catch (err) {
    console.error("Error updating chapter:", err);
    res.status(500).json({ error: "Failed to update chapter" });
  }
};

// ✅ Delete chapter
const deleteChapter = async (req, res) => {
  try {
    const { subjectId, id } = req.params;

    // Remove chapter from subject if exists
    const subject = await Subject.findById(subjectId);
    if (subject) {
      subject.chapters.pull(id);
      await subject.save();
    }

    // Delete chapter itself
    const chapter = await Chapter.findByIdAndDelete(id);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.json({ message: "Chapter deleted successfully" });
  } catch (err) {
    console.error("Error deleting chapter:", err);
    res.status(500).json({ error: "Failed to delete chapter" });
  }
};

module.exports = {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
};
