const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

// GET /api/analyst/dashboard - Get analyst dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Will require auth middleware
        res.status(501).json({ message: 'Dashboard endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analyst/courses - Get course statistics
router.get('/courses', async (req, res) => {
    try {
        const courses = await queries.getAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analyst/enrollments - Get enrollment statistics
router.get('/enrollments', async (req, res) => {
    try {
        // Will require auth middleware
        res.status(501).json({ message: 'Enrollments endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
