require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const imageRoutes = require('./routes/image.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// CORS configuration
const allowedOrigins = [
    'https://frontend-image-gallery.vercel.app',
    'http://localhost:3000'
];

// Enable CORS for all routes
// Middleware CORS mejorado
app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');

        // Cache CORS preflight para 1 hora (reduce solicitudes OPTIONS)
        res.header('Access-Control-Max-Age', '3600');
    }

    // Respuesta inmediata para preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).send(); // 204 No Content es mejor para OPTIONS
    }

    next();
});

app.options('*', cors(corsOptions)); // Maneja todas las solicitudes OPTIONS
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 3001;

// Database connection and server start
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = app; 