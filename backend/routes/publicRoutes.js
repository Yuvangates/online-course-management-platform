const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

/**
 * Public Routes for Landing Page
 * These endpoints do NOT require authentication
 */

// Get top rated courses (limit: default 3)
router.get('/top-courses', publicController.getTopCourses);

// Get top universities by course count (limit: default 3)
router.get('/top-universities', publicController.getTopUniversities);

// Get all public course data (without enrollment info)
router.get('/courses', publicController.getAllCourses);

// Get all universities
router.get('/universities', publicController.getAllUniversities);

module.exports = router;
