const Subject = require("../models/subjectModel");
const Course = require("../models/courseModel");

// ✅ Create a subject under a course
const createSubject = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { courseId } = req.params;
    const { title, description, image } = req.body;
  
    if (!title) return res.status(400).json({ error: "Title is required" });

    // Ensure course exists and belongs to tenant
    const course = await Course.findOne({ _id: courseId, tenantId });
    if (!course) return res.status(404).json({ error: "Course not found in your tenant" });

    const subject = await Subject.create({
      tenantId,
      title,
      description,
      image,
      courseId: courseId,
      createdBy: req.user.userId,
    });

    res.status(201).json(subject);
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ error: "Failed to create subject" });
  }
};

// ✅ Get all subjects for a course
const getSubjects = async (req, res) => {
  try {
    const { courseId } = req.params;

    const subjects = await Subject.find({ course: courseId })
      .populate("chapters")
      .populate("createdBy", "name email role");

    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

// ✅ Get a single subject by ID
const getSubjectById = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const subject = await Subject.findOne({ _id: id })

    if (!subject) return res.status(404).json({ error: "Subject not found in your tenant" });

    res.json(subject);
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
};

// ✅ Update subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: id },
      { title, description, image },
      { new: true, runValidators: true }
    );

    if (!subject) return res.status(404).json({ error: "Subject not found in your tenant" });

    res.json(subject);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ error: "Failed to update subject" });
  }
};

// ✅ Delete subject
const deleteSubject = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const subject = await Subject.findOneAndDelete({ _id: id, tenantId });
    if (!subject) return res.status(404).json({ error: "Subject not found in your tenant" });

    // Optional: delete chapters and videos under this subject
    // await Chapter.deleteMany({ subject: id });

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: "Failed to delete subject" });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
