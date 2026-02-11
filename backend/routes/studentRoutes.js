const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// All student routes require authentication and Student role
router.use(verifyToken);
router.use(checkRole(['Student']));

// Dashboard
router.get('/dashboard', studentController.getDashboard);

// Courses
router.get('/courses', studentController.getAllCourses);
router.get('/courses/:id', studentController.getCourseById);

// Enrollments
router.get('/enrollments', studentController.getEnrollments);
router.post('/enroll', studentController.enrollCourse);

// Profile
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// Reviews
router.post('/courses/:id/review', studentController.submitReview);

// Progress
router.post('/progress/mark-complete', studentController.markContentComplete);
router.get('/progress/:courseId', studentController.getProgress);

module.exports = router;

