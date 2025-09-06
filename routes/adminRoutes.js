// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole, generateInviteLink, deleteUser } = require("../controllers/adminController");
const { auth, authorize } = require("../middlewares/authMiddleware");
const { ROLES } = require("../constants");

// Protect all routes → only admins
router.use(auth, authorize(ROLES.admin, ROLES.platform_admin));

// ✅ Get all users within the same tenant
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);


// ✅ Update user role (within tenant)
router.post("/assign-role", updateUserRole);

router.get("/invite", generateInviteLink)

module.exports = router;
