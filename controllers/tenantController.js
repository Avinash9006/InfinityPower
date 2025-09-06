const Tenant = require("../models/tenantModel");
const User = require("../models/userModel"); // for admin user creation
const { upload } = require("../middlewares/multer"); // multer middleware
const sendInvite = require("../utils/invite");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

/**
 * ✅ Create a new tenant + admin user
 * Accepts multipart/form-data for optional logo upload
 */
const createTenant = async (req, res) => {
  try {
    const { name, companyName, email, password } = req.body;


    // ✅ Validation
    if (!name || !companyName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tenant name and admin info (name, email, password) are required",
      });
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Admin email already exists" });
    }

    const slug = await generateSlug(name);
    // If logo file uploaded
    let logoUrl = null;
    if (req.file) {
      logoUrl = req.file.path; // local path, can switch to cloud storage
    }

    // ✅ Create Tenant
     const tenant = await Tenant.create({
      name,
      clientInfo: { companyName }, // updated clientInfo
      logo: logoUrl,
      slug
    });
    // ✅ Hash admin password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create Admin user for this tenant
    const adminUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: "admin",
      tenantId: tenant._id,
    });

    res.status(201).json({
      success: true,
      tenant,
      adminUser: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (err) {
    console.error("Error creating tenant:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create tenant",
      error: err.message,
    });
  }
};

const generateSlug = async (name) => {
  let slug = name.toLowerCase().replace(/\s+/g, '-'); // basic slug
  let exists = await Tenant.findOne({ slug });
  let counter = 1;

  while (exists) {
    slug = `${slug}-${counter}`;
    exists = await Tenant.findOne({ slug });
    counter++;
  }

  return slug;
};


/**
 * ✅ Get all tenants
 */
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json({ success: true, tenants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch tenants", error: err.message });
  }
};

/**
 * ✅ Get tenant by ID
 */
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });
    res.json({ success: true, tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch tenant", error: err.message });
  }
};

/**
 * ✅ Send invite to join tenant
 */
const sendTenantInvite = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    await sendInvite(email, req.user.tenantId);
    res.json({ success: true, message: "Invite sent successfully" });
  } catch (err) {
    console.error("Error sending tenant invite:", err);
    res.status(500).json({ success: false, message: "Failed to send invite", error: err.message });
  }
};

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
  sendTenantInvite,
};
