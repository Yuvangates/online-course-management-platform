const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require('../db/queries');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
};

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, name, role, country, date_of_birth, skill_level, expertise } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Only students can self-register
        if (role && role !== 'Student') {
            return res.status(403).json({ error: 'Only students can self-register. Other roles are created by admins.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with Student role
        const user = await queries.createUser({
            email,
            password_hash: hashedPassword,
            name,
            role: 'Student', // Force Student role
            country,
        });

        // Create student record
        await queries.createStudent({
            userId: user.user_id,
            university_id: null,
            skill_level: skill_level || 'Beginner',
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role: 'Student',
                country: user.country,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Get user by email
        const user = await queries.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                country: user.country,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await queries.getUserById(req.user.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get role-specific data
        let roleData = {};
        if (user.role === 'Student') {
            roleData = await queries.getStudentById(user.user_id);
        } else if (user.role === 'Instructor') {
            roleData = await queries.getInstructorById(user.user_id);
        }

        res.status(200).json({
            user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role,
                country: user.country,
                date_of_birth: user.date_of_birth,
                created_at: user.created_at,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Logout (frontend will delete token)
const logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = { register, login, getProfile, logout };
