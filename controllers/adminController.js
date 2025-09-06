// controllers/adminController.js
const mongoose = require("mongoose");
const User = require("../models/userModel");
const { ROLES } = require("../constants");

// Get all users for current tenant (from JWT)
const getAllUsers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId; // ✅ Tenant from token
    const currentUserId = req.user.userId;

    if (!tenantId) {
      return res
        .status(400)
        .json({ success: false, message: "Tenant not found in token" });
    }

    const users = await User.find({ tenantId, _id: { $ne: currentUserId } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, users, tenantId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user role within tenant (from JWT)
const updateUserRole = async (req, res) => {
  try {
    const tenantId = req.user.tenantId; // ✅ Tenant from token
    const { userId, role } = req.body;

    // Validate tenantId
    if (!tenantId) {
      return res
        .status(400)
        .json({ success: false, message: "Tenant not found in token" });
    }

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    // Update only within tenant
    const user = await User.findOneAndUpdate(
      { _id: userId, tenantId },
      { role, status:'approved' },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in your tenant" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const generateInviteLink = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant not found in token" });
    }

    // Create a unique token or random string (simple example)
    const inviteToken = require("crypto").randomBytes(16).toString("hex");

    // Optional: store this token in DB to validate later
    // await InviteToken.create({ token: inviteToken, tenantId, expiresAt: Date.now() + 24*60*60*1000 });

    const inviteLink = `${process.env.FRONTEND_URL}/register?invite=${inviteToken}&tenant=${tenantId}`;

    res.json({ success: true, inviteLink });
  } catch (err) {
    console.error("Failed to generate invite link:", err);
    res.status(500).json({ success: false, message: "Failed to generate invite link" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { getAllUsers, updateUserRole, generateInviteLink, deleteUser };
