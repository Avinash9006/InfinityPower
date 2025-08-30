const Subject = require("../models/subjectModel");
const Course = require("../models/courseModel");

// ✅ Create a subject under a course
const createSubject = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, image } = req.body;

    // Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create subject with course reference
    const subject = new Subject({
      title,
      description,
      image,
      course: courseId, // ✅ Link subject to course
      createdBy: req.user._id,
    });

    await subject.save();

    // Push subject reference into course
    course.subjects.push(subject._id);
    await course.save();

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

    const course = await Course.findById(courseId).populate({
      path: "subjects",
      populate: { path: "chapters" },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course.subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

// ✅ Get a single subject by ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id)
      .populate("chapters")
      .populate("createdBy", "name email role")
      .populate("course", "title"); // ✅ optional: show which course it belongs to

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

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

    const subject = await Subject.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(subject);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ error: "Failed to update subject" });
  }
};

// ✅ Delete subject
const deleteSubject = async (req, res) => {
  try {
    const { courseId, id } = req.params;

    // Remove subject from course if exists
    const course = await Course.findById(courseId);
    if (course) {
      course.subjects.pull(id);
      await course.save();
    }

    // Delete subject itself
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

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
