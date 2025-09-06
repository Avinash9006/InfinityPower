const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Health check
router.get('/status', (req, res) => {
  res.json({ success: true, status: 'OK' });
});

// Register a new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

module.exports = router;
