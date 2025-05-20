const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);

module.exports = router; 