const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user.model');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching profile',
            error: error.message
        });
    }
}; 