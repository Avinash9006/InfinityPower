const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ allow access to courseId from parent route
const { ROLES } = require("../constants");
const chapterRoutes = require("./chapterRoutes");
const { auth, authorize } = require("../middlewares/authMiddleware");
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// 🔹 All subject routes require authentication
router.use(auth);

/**
 * @route   GET /courses/:courseId/subjects
 * @desc    Get all subjects for a course
 * @access  Authenticated
 */
router.get("/", getSubjects);

/**
 * @route   POST /courses/:courseId/subjects
 * @desc    Create new subject under course
 * @access  Teacher/Admin
 */
router.post("/", authorize(ROLES.teacher, ROLES.admin), createSubject);

/**
 * @route   GET /courses/:courseId/subjects/:id
 * @desc    Get subject by ID
 * @access  Authenticated
 */
router.get("/:id", getSubjectById);

/**
 * @route   PUT /courses/:courseId/subjects/:id
 * @desc    Update subject
 * @access  Teacher/Admin
 */
router.put("/:id", authorize(ROLES.teacher, ROLES.admin), updateSubject);

/**
 * @route   DELETE /courses/:courseId/subjects/:id
 * @desc    Delete subject
 * @access  Teacher/Admin
 */
router.delete("/:id", authorize(ROLES.teacher, ROLES.admin), deleteSubject);
router.use("/:subjectId/chapters", chapterRoutes);

module.exports = router;
