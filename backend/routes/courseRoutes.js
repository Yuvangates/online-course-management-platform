const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// All course routes require authentication
router.use(authMiddleware.verifyToken);

// Get all courses
router.get('/', courseController.getAllCourses);

// Search courses (must come before :id routes)
router.get('/search', courseController.searchCourses);

// Get course by ID
router.get('/:id', courseController.getCourseById);

// Get course with modules and content
router.get('/:id/details', courseController.getCourseDetails);

// Get module content
router.get('/:id/modules/:moduleNumber/content', courseController.getModuleContent);

// Get course modules
router.get('/:id/modules', courseController.getModules);

// Get course universities
router.get('/:id/universities', courseController.getUniversities);

// Get course rating
router.get('/:id/rating', courseController.getRating);

// Get course reviews
router.get('/:id/reviews', courseController.getReviews);

module.exports = router;
