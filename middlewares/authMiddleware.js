const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach user info and tenantId to request
    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: decoded.tenantId || user.tenantId, // fallback to user tenant
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};

module.exports = { auth, authorize };
