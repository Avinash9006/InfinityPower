const Course = require("../models/courseModel");

// ✅ Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      createdBy: req.user._id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// ✅ Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("subjects")
      .populate("createdBy", "name email role");
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// ✅ Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .populate("subjects")
      .populate("createdBy", "name email role");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// ✅ Add subject to a course
const addSubjectToCourse = async (req, res) => {
  try {
    const { id } = req.params; // course id
    const { subjectId } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { $addToSet: { subjects: subjectId } },
      { new: true }
    ).populate("subjects");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).json({ error: "Failed to add subject" });
  }
};

// ✅ Remove subject from a course
const removeSubjectFromCourse = async (req, res) => {
  try {
    const { id } = req.params; // course id
    const { subjectId } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { $pull: { subjects: subjectId } },
      { new: true }
    ).populate("subjects");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error("Error removing subject:", err);
    res.status(500).json({ error: "Failed to remove subject" });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  addSubjectToCourse,
  removeSubjectFromCourse,
};
