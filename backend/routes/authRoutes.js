const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - User login
router.post('/login', login);

// GET /api/auth/profile - Get current user profile (requires auth)
router.get('/profile', verifyToken, getProfile);

// POST /api/auth/logout - User logout
router.post('/logout', verifyToken, logout);

module.exports = router;
