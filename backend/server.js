const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Environment Variables:', {
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET ? '***' : 'Not Set',
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not Set',
});

// CORS setup
const cors = require('cors');

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'https://learnspherekgp.netlify.app',
            'http://localhost:5173',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/instructor', require('./routes/instructorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analyst', require('./routes/analystRoutes'));

// Basic health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
