const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */

const register = async (req, res) => {
  try {
    const { name, email, password, role, tenantId } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "anonymous", // default to anonymous for invited users
      tenantId: tenantId || null, // associate tenant if provided
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user for this tenant
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = { register, login };
