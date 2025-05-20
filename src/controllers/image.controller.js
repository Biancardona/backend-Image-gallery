const fs = require('fs').promises;
const path = require('path');
const Image = require('../models/image.model');
const User = require('../models/user.model');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const image = await Image.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            description: req.body.description,
            isPublic: req.body.isPublic === 'true',
            userId: req.user.id
        });

        res.status(201).json({
            message: 'Image uploaded successfully',
            image
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error uploading image',
            error: error.message
        });
    }
};

exports.getImages = async (req, res) => {
    try {
        const whereClause = req.user.role === 'admin'
            ? {}
            : { userId: req.user.id };

        const images = await Image.findAll({
            where: whereClause,
            include: [{
                model: User,
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ images });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching images',
            error: error.message
        });
    }
};

exports.getImage = async (req, res) => {
    try {
        const image = await Image.findOne({
            where: {
                id: req.params.id,
                ...(req.user.role !== 'admin' && { userId: req.user.id })
            },
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ image });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching image',
            error: error.message
        });
    }
};

exports.updateImage = async (req, res) => {
    try {
        const image = await Image.findOne({
            where: {
                id: req.params.id,
                ...(req.user.role !== 'admin' && { userId: req.user.id })
            }
        });

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        await image.update({
            description: req.body.description,
            isPublic: req.body.isPublic
        });

        res.json({
            message: 'Image updated successfully',
            image
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating image',
            error: error.message
        });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findOne({
            where: {
                id: req.params.id,
                ...(req.user.role !== 'admin' && { userId: req.user.id })
            }
        });

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete file from filesystem
        await fs.unlink(image.path);

        // Delete from database
        await image.destroy();

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting image',
            error: error.message
        });
    }
}; 