const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinaryConfig");

// GET /api/users/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { name, email, designation, password } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (designation) user.designation = designation;

    // Hash password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    // Handle profile image upload if file exists
    if (req.file) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      user.profileImage = result.secure_url;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
        designation: updatedUser.designation,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
