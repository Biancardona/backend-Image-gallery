const User = require('../models/user.model');
const Image = require('../models/image.model');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Image,
                attributes: ['id', 'filename']
            }]
        });

        res.json({ users });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Image,
                attributes: ['id', 'filename', 'description', 'isPublic', 'createdAt']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, role, isActive } = req.body;

        await user.update({
            username: username || user.username,
            email: email || user.email,
            role: role || user.role,
            isActive: isActive !== undefined ? isActive : user.isActive
        });

        res.json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all user's images
        await Image.destroy({ where: { userId: user.id } });

        // Delete user
        await user.destroy();

        res.json({ message: 'User and associated images deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
}; 