const express = require("express");
const router = express.Router();
const { createTenant, getTenants, getTenantById, sendTenantInvite } = require("../controllers/tenantController");
const { auth, authorize } = require("../middlewares/authMiddleware");
const { uploadLogo } = require("../middlewares/multer");
const { ROLES } = require("../constants");

// Only admin can create tenants
router.post("/",uploadLogo, createTenant);
router.get("/", auth, authorize(ROLES.platform_admin), getTenants);
router.get("/:id", auth, authorize(ROLES.platform_admin), getTenantById);
router.post('/invite', auth, authorize(ROLES.admin), sendTenantInvite);

module.exports = router;
