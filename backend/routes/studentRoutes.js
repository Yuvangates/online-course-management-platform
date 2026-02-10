const express = require('express');
const router = express.Router();
const queries = require('../db/queries');
const { verifyToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
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


// PUT /api/student/profile - Update student profile (name, country, date_of_birth, skill_level)
router.put('/profile', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const { name, email, country, date_of_birth, skill_level, password, currentPassword } = req.body;

        if (!name && !email && !country && !date_of_birth && !skill_level && !password) {
            return res.status(400).json({ error: 'No fields provided to update' });
        }

        // Get current profile to preserve existing values
        const currentProfile = await queries.getStudentById(req.user.user_id);
        if (!currentProfile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Update user table (name, country, email) - use existing values if not provided
        const updateUserData = {
            name: name !== undefined ? name : currentProfile.name,
            country: country !== undefined ? country : currentProfile.country,
            email: email !== undefined ? email : currentProfile.email
        };
        await queries.updateUserProfile(req.user.user_id, updateUserData);

        if (password) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password.' });
            }
            const user = await queries.getUserById(req.user.user_id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect current password.' });
            }

            const hashed = await bcrypt.hash(password, 10);
            await queries.updateUserPassword(req.user.user_id, hashed);
        }

        // Update student-specific fields
        const updatedProfile = await queries.updateStudentProfile(req.user.user_id, { date_of_birth, skill_level });

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: error.message });
    }
});


// POST /api/student/courses/:id/review - Submit a review/rating for an enrollment (only once)
router.post('/courses/:id/review', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const courseId = parseInt(req.params.id, 10);
        const { review, rating } = req.body;

        if (isNaN(courseId)) return res.status(400).json({ error: 'Invalid course ID' });
        if (!review && (rating === undefined || rating === null)) return res.status(400).json({ error: 'Review or rating required' });

        // Check enrollment
        const enrollment = await queries.checkEnrollment(req.user.user_id, courseId);
        if (!enrollment) return res.status(403).json({ error: 'You are not enrolled in this course' });

        // Prevent multiple reviews: if Review already set, disallow
        if (enrollment.Review) {
            return res.status(409).json({ error: 'Review already submitted for this enrollment' });
        }

        // Update enrollment with review/rating
        const updated = await queries.updateEnrollmentReview(enrollment.enrollment_id, { review, rating });
        res.status(201).json({ message: 'Review submitted', review: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/student/progress/mark-complete - Mark content as complete
router.post('/progress/mark-complete', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const { course_id, module_number, content_id } = req.body;

        if (!course_id || module_number === undefined || !content_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await queries.markContentAsComplete({
            student_id: req.user.user_id,
            course_id,
            module_number,
            content_id
        });

        res.status(201).json({ message: 'Content marked as complete', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/student/progress/:courseId - Get student progress for a course
router.get('/progress/:courseId', verifyToken, checkRole(['Student']), async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        const progressData = await queries.getStudentProgress(req.user.user_id, courseId);
        const completedContent = await queries.getStudentCompletedContent(req.user.user_id, courseId);

        res.status(200).json({
            progress: progressData?.progress_percentage || 0,
            completedContent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
