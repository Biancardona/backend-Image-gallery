const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Define associations
Image.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

User.hasMany(Image, {
    foreignKey: 'userId'
});

module.exports = Image; 