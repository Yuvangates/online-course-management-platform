const express = require('express');
const router = express.Router();
const queries = require('../db/queries');
const authMiddleware = require('../middleware/authMiddleware');

// Get all courses
router.get('/', authMiddleware.verifyToken, async (req, res) => {
    try {
        const courses = await queries.getAllCourses();
        res.status(200).json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search courses (must come before :id routes)
router.get('/search', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const courses = await queries.searchCourses(q);
        res.status(200).json({ courses });
    } catch (error) {
        console.error('Error searching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get course by ID
router.get('/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const course = await queries.getCourseById(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get course with modules and content
router.get('/:id/details', authMiddleware.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const course = await queries.getCourseById(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const instructors = await queries.getInstructorsByCourse(id);
        const modules = await queries.getModulesByCourse(id);
        res.status(200).json({ course, modules, instructors });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get module content
router.get('/:id/modules/:moduleNumber/content', authMiddleware.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const moduleNumber = parseInt(req.params.moduleNumber, 10);
        if (isNaN(id) || isNaN(moduleNumber)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }
        const content = await queries.getModuleContent(id, moduleNumber);
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error fetching module content:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get course modules
router.get('/:id/modules', authMiddleware.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const modules = await queries.getModulesByCourse(id);
        res.status(200).json({ modules });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
