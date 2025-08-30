const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.get('/status', (req, res) => {
  res.json({ status: 'OK' });
});
router.post('/register', register);
router.post('/login', login);

module.exports = router;

