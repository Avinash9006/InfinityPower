const express = require("express");
const router = express.Router({ mergeParams: true });
const { ROLES } = require("../constants");
const { auth, authorize } = require("../middlewares/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/courseController");

const subjectRoutes = require("./subjectRoutes");

// 🔹 Protect all course routes with authentication
router.use(auth);

/**
 * @route   POST /courses
 * @desc    Create a new course
 * @access  Teacher/Admin
 */
router.post("/", authorize(ROLES.teacher, ROLES.admin), createCourse);

/**
 * @route   GET /courses
 * @desc    Get all courses for the tenant
 * @access  Authenticated
 */
router.get("/", getCourses);

/**
 * @route   GET /courses/:id
 * @desc    Get single course by ID
 * @access  Authenticated
 */
router.get("/:id", getCourseById);

/**
 * @route   DELETE /courses/:id
 * @desc    Delete a course
 * @access  Teacher/Admin
 */
router.delete("/:id", authorize(ROLES.teacher, ROLES.admin), deleteCourse);

/**
 * 🔹 Nested subject routes
 * Example: /courses/:courseId/subjects/...
 */
router.use("/:courseId/subjects", subjectRoutes);

module.exports = router;
