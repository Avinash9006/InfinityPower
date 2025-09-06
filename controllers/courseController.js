const Course = require("../models/courseModel");
const Subject = require("../models/subjectModel");

// ✅ Create a new course
const createCourse = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { title, description, price, isFree } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const course = new Course({
      tenantId,
      title,
      description,
      price,
      isFree,
      createdBy: req.user.userId,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// ✅ Get all courses for tenant
const getCourses = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const courses = await Course.find({ tenantId })
      .populate("createdBy", "name email role");

    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// ✅ Get single course by ID with subjects
const getCourseById = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, tenantId })
      .populate("createdBy", "name email role");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // 🔑 Fetch subjects separately
    const subjects = await Subject.find({ courseId: course._id });

    res.json({ ...course.toObject(), subjects });
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// ✅ Delete course (tenant scoped)
const deleteCourse = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const course = await Course.findOneAndDelete({ _id: id, tenantId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // ❗ Optional: cascade delete subjects/chapters/videos for cleanup
    await Subject.deleteMany({ courseId: id });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourse,
};
