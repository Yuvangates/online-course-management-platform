const express = require('express');
const router = express.Router();
const queries = require('../db/queries');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const instructorController = require('../controllers/instructorController');

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

// Apply auth middleware to all routes
router.use(verifyToken, checkRole(['Instructor']));

// Profile
router.put('/profile', instructorController.updateProfile);
router.put('/profile/password', instructorController.updatePassword);

// Dashboard
router.get('/dashboard', instructorController.getDashboard);

// Courses
router.get('/courses', instructorController.getAssignedCourses);
router.get('/courses/:id/enrollments', instructorController.getCourseEnrollments);

// Modules
router.get('/courses/:id/modules', ensureTeachesCourse, instructorController.getCourseModules);
router.post('/courses/:id/modules', ensureTeachesCourse, instructorController.createModule);
router.put('/courses/:id/modules/:num', ensureTeachesCourse, instructorController.updateModule);
router.delete('/courses/:id/modules/:num', ensureTeachesCourse, instructorController.deleteModule);
router.post('/courses/:id/modules/swap', ensureTeachesCourse, instructorController.swapModules);

// Content
router.get('/courses/:id/modules/:num/content', ensureTeachesCourse, instructorController.getModuleContent);
router.post('/courses/:id/modules/:num/content', ensureTeachesCourse, instructorController.createModuleContent);
router.put('/courses/:id/modules/:num/content/:contentId', ensureTeachesCourse, instructorController.updateModuleContent);
router.delete('/courses/:id/modules/:num/content/:contentId', ensureTeachesCourse, instructorController.deleteModuleContent);
router.post('/courses/:id/modules/:num/content/swap', ensureTeachesCourse, instructorController.swapModuleContent);

// Grading
router.put('/enrollments/:id/grade', instructorController.updateEnrollmentGrade);

module.exports = router;
