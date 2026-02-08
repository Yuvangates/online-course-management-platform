const express = require('express');
const router = express.Router();
const queries = require('../db/queries');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const ensureTeachesCourse = async (req, res, next) => {
    try {
        const instructorId = req.user.user_id;
        const courseId = parseInt(req.params.id, 10);
        if (isNaN(courseId)) return res.status(400).json({ error: 'Invalid course ID' });
        const assigned = await queries.getCoursesByInstructor(instructorId);
        if (!assigned.some(c => c.course_id === courseId)) {
            return res.status(403).json({ error: 'You do not teach this course' });
        }
        req.courseId = courseId;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/instructor/dashboard - Get instructor's dashboard (courses with counts)
router.get('/dashboard', verifyToken, checkRole(['Instructor']), async (req, res) => {
    try {
        const instructorId = req.user.user_id;
        const courses = await queries.getCoursesByInstructorWithCounts(instructorId);
        const totalStudents = courses.reduce((sum, c) => sum + parseInt(c.student_count || 0, 10), 0);
        res.status(200).json({ courses, totalStudents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/instructor/courses - Get instructor's assigned courses
router.get('/courses', verifyToken, checkRole(['Instructor']), async (req, res) => {
    try {
        const instructorId = req.user.user_id;
        const courses = await queries.getCoursesByInstructorWithCounts(instructorId);
        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/instructor/courses/:id/enrollments - Get course enrollments (only for instructor's course)
router.get('/courses/:id/enrollments', verifyToken, checkRole(['Instructor']), async (req, res) => {
    try {
        const instructorId = req.user.user_id;
        const courseId = parseInt(req.params.id, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const assigned = await queries.getCoursesByInstructor(instructorId);
        const teaches = assigned.some(c => c.course_id === courseId);
        if (!teaches) {
            return res.status(403).json({ error: 'You do not teach this course' });
        }
        const enrollments = await queries.getEnrollmentsByCourse(courseId);
        res.status(200).json({ enrollments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/instructor/courses/:id/modules - List modules (instructor must teach course)
router.get('/courses/:id/modules', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const modules = await queries.getModulesByCourse(req.courseId);
        res.status(200).json({ modules });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/instructor/courses/:id/modules - Create module
router.post('/courses/:id/modules', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const { module_number, name, duration_weeks } = req.body;
        if (module_number === undefined || module_number === null || !name) {
            return res.status(400).json({ error: 'module_number and name are required' });
        }
        const num = parseInt(module_number, 10);
        if (isNaN(num) || num < 1) return res.status(400).json({ error: 'module_number must be a positive integer' });
        const module = await queries.createModule({
            course_id: req.courseId,
            module_number: num,
            name: String(name).trim(),
            duration_weeks: duration_weeks != null ? parseInt(duration_weeks, 10) : null,
        });
        res.status(201).json({ module });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/instructor/courses/:id/modules/:num - Update module
router.put('/courses/:id/modules/:num', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) return res.status(400).json({ error: 'Invalid module number' });
        const { name, duration_weeks } = req.body;
        const updated = await queries.updateModule(req.courseId, moduleNumber, {
            name: name != null ? String(name).trim() : undefined,
            duration_weeks: duration_weeks != null ? parseInt(duration_weeks, 10) : undefined,
        });
        if (!updated) return res.status(404).json({ error: 'Module not found' });
        res.status(200).json({ module: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/instructor/courses/:id/modules/swap - Swap two modules (reorder)
router.post('/courses/:id/modules/swap', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const { num1, num2 } = req.body;
        const n1 = parseInt(num1, 10);
        const n2 = parseInt(num2, 10);
        if (isNaN(n1) || isNaN(n2) || n1 < 1 || n2 < 1) {
            return res.status(400).json({ error: 'num1 and num2 must be positive integers' });
        }
        await queries.swapModuleOrder(req.courseId, n1, n2);
        const modules = await queries.getModulesByCourse(req.courseId);
        res.status(200).json({ modules });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/instructor/courses/:id/modules/:num/content - List content for a module
router.get('/courses/:id/modules/:num/content', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) return res.status(400).json({ error: 'Invalid module number' });
        const content = await queries.getModuleContent(req.courseId, moduleNumber);
        res.status(200).json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/instructor/courses/:id/modules/:num/content - Create content
router.post('/courses/:id/modules/:num/content', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) return res.status(400).json({ error: 'Invalid module number' });
        const { content_id, title, content_type, url } = req.body;
        if (content_id === undefined || content_id === null || !title) {
            return res.status(400).json({ error: 'content_id and title are required' });
        }
        const cid = parseInt(content_id, 10);
        if (isNaN(cid) || cid < 1) return res.status(400).json({ error: 'content_id must be a positive integer' });
        const validTypes = ['Video', 'Note', 'assignment'];
        const type = content_type && validTypes.includes(content_type) ? content_type : 'Note';
        const item = await queries.createModuleContent({
            course_id: req.courseId,
            module_number: moduleNumber,
            content_id: cid,
            title: String(title).trim(),
            content_type: type,
            url: url != null ? String(url).trim() : null,
        });
        res.status(201).json({ content: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/instructor/courses/:id/modules/:num/content/:contentId - Update content
router.put('/courses/:id/modules/:num/content/:contentId', verifyToken, checkRole(['Instructor']), ensureTeachesCourse, async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        const contentId = parseInt(req.params.contentId, 10);
        if (isNaN(moduleNumber) || isNaN(contentId)) return res.status(400).json({ error: 'Invalid parameters' });
        const { title, content_type, url } = req.body;
        const updated = await queries.updateModuleContent(req.courseId, moduleNumber, contentId, {
            title: title != null ? String(title).trim() : undefined,
            content_type: content_type != null ? content_type : undefined,
            url: url !== undefined ? (url == null ? null : String(url).trim()) : undefined,
        });
        if (!updated) return res.status(404).json({ error: 'Content not found' });
        res.status(200).json({ content: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/instructor/enrollments/:id/grade - Update evaluation score for an enrollment
router.put('/enrollments/:id/grade', verifyToken, checkRole(['Instructor']), async (req, res) => {
    try {
        const enrollmentId = parseInt(req.params.id, 10);
        let { evaluation_score } = req.body;
        if (isNaN(enrollmentId)) {
            return res.status(400).json({ error: 'Invalid enrollment ID' });
        }
        if (evaluation_score === undefined || evaluation_score === null || evaluation_score === '') {
            return res.status(400).json({ error: 'evaluation_score (0-100) is required' });
        }
        const score = parseInt(evaluation_score, 10);
        if (isNaN(score) || score < 0 || score > 100) {
            return res.status(400).json({ error: 'evaluation_score must be between 0 and 100' });
        }
        await queries.updateEnrollmentScore(enrollmentId, score);
        res.status(200).json({ message: 'Grade updated', evaluation_score: score });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
