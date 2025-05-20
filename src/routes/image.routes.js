const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const imageController = require('../controllers/image.controller');

// All routes require authentication
router.use(auth);

// Image routes
router.post('/upload', upload.single('image'), imageController.uploadImage);
router.get('/', imageController.getImages);
router.get('/:id', imageController.getImage);
router.put('/:id', imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router; 