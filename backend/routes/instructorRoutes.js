const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

// GET /api/instructor/dashboard - Get instructor's dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Will require auth middleware
        res.status(501).json({ message: 'Dashboard endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/instructor/courses - Get instructor's courses
router.get('/courses', async (req, res) => {
    try {
        // Will require auth middleware
        res.status(501).json({ message: 'Courses endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/instructor/courses - Create a course
router.post('/courses', async (req, res) => {
    try {
        // Will require auth middleware
        res.status(501).json({ message: 'Create course endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/instructor/courses/:id/enrollments - Get course enrollments
router.get('/courses/:id/enrollments', async (req, res) => {
    try {
        const enrollments = await queries.getEnrollmentsByCourse(parseInt(req.params.id));
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
