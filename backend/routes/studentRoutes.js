const express = require('express');
const router = express.Router();
const queries = require('../db/queries');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// GET /api/student/dashboard - Get student's dashboard data
router.get('/dashboard', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const enrollments = await queries.getEnrollmentsByStudent(req.user.user_id);
        const enrolledCount = enrollments.length;
        const completedCount = enrollments.filter(e => e.evaluation_score !== null).length;
        const avgScore = enrolledCount > 0 
            ? Math.round(enrollments.filter(e => e.evaluation_score !== null).reduce((sum, e) => sum + e.evaluation_score, 0) / completedCount)
            : 0;

        res.status(200).json({
            stats: { enrolledCount, completedCount, avgScore },
            enrollments,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/student/courses - Get all available courses
router.get('/courses', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const courses = await queries.getAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/student/courses/:id - Get course details
router.get('/courses/:id', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const course = await queries.getCourseById(parseInt(req.params.id));
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/student/enrollments - Get student's enrollments
router.get('/enrollments', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const enrollments = await queries.getEnrollmentsByStudent(req.user.user_id);
        res.status(200).json({ enrollments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/student/enroll - Enroll in a course
router.post('/enroll', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        let { course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        // Parse course_id as integer
        course_id = parseInt(course_id, 10);
        if (isNaN(course_id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        // Check if already enrolled
        const existing = await queries.checkEnrollment(req.user.user_id, course_id);
        if (existing) {
            return res.status(409).json({ error: 'Already enrolled in this course' });
        }

        // Check if course exists
        const course = await queries.getCourseById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Enroll student
        const enrollment = await queries.enrollStudent({
            student_id: req.user.user_id,
            course_id,
        });

        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/student/profile - Get student profile
router.get('/profile', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const student = await queries.getStudentById(req.user.user_id);
        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
