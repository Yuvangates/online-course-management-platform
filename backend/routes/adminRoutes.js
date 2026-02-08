const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// All admin routes require authentication and Admin role
router.use(verifyToken);
router.use(checkRole(['Admin']));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Course management
router.post('/courses', adminController.createCourse);
router.put('/courses/:courseId', adminController.updateCourse);
router.get('/courses', adminController.getAllCourses);
router.get('/courses/:courseId', adminController.getCourseDetails);

// Instructor management
router.post('/instructors', adminController.createInstructor);
router.get('/instructors', adminController.getAllInstructors);
router.get('/instructors/search', adminController.searchInstructors);

// Course-Instructor assignment
router.post('/courses/assign-instructor', adminController.assignInstructorToCourse);
router.delete('/courses/:courseId/instructors/:instructorId', adminController.removeInstructorFromCourse);

// Student management by course
router.get('/courses/:courseId/students', adminController.getStudentsByCourse);
router.get('/students/search', adminController.searchStudents);
router.delete('/enrollments/:enrollmentId', adminController.removeStudentFromCourse);

// Analyst management
router.post('/analyst', adminController.createAnalyst);
router.get('/analyst', adminController.getAnalyst);

// Universities
router.get('/universities', adminController.getAllUniversities);
router.post('/universities', adminController.createUniversity);
router.put('/universities/:universityId', adminController.updateUniversity);
router.delete('/universities/:universityId', adminController.deleteUniversity);

// TextBooks
router.get('/textbooks', adminController.getAllTextbooks);
router.post('/textbooks', adminController.createTextbook);
router.put('/textbooks/:isbn', adminController.updateTextbook);
router.delete('/textbooks/:isbn', adminController.deleteTextbook);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/search', adminController.searchUsers);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;
