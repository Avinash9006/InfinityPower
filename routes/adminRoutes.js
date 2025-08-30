// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole } = require("../controllers/adminController");
const { auth, authorize } = require("../middlewares/authMiddleware");
const { ROLES } = require("../constants");

// Protect all routes → only admins
router.use(auth, authorize(ROLES.admin));

router.get("/users", getAllUsers);
router.post("/assign-role", updateUserRole);

module.exports = router;
