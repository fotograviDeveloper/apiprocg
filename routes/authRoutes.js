const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;