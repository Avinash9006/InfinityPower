const express = require("express");
const router = express.Router();
const { uploadProfileImage } = require("../middlewares/multer");
const { auth } = require("../middlewares/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

// 🔹 Protect all user routes
router.use(auth);

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user's profile
 * @access  Authenticated
 */
router.get("/me", getProfile);

/**
 * @route   PUT /api/users/me
 * @desc    Update logged-in user's profile
 * @access  Authenticated
 */
router.put("/me", uploadProfileImage, updateProfile);

module.exports = router;
