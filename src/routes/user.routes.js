const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// All routes require admin authentication
router.use(adminAuth);

// Admin user management routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 