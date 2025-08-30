const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(auth); // All routes require authentication

router.get("/me", getProfile);       // GET logged-in user profile
router.put("/me", updateProfile);    // UPDATE profile

module.exports = router;
