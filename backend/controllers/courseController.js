const queries = require('../db/queries');

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        console.log('[courseController] GET /api/courses/ called by user:', req.user?.user_id);
        const courses = await queries.getAllCourses();
        console.log('[courseController] getAllCourses returned count =', courses?.length);
        res.status(200).json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
};

// Search courses
const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;
        console.log('[courseController] GET /api/courses/search q=', q, 'by user:', req.user?.user_id);
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const courses = await queries.searchCourses(q);
        console.log('[courseController] searchCourses returned count =', courses?.length);
        res.status(200).json({ courses });
    } catch (error) {
        console.error('Error searching courses:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log('[courseController] GET /api/courses/:id id=', req.params.id, 'parsed=', id, 'user=', req.user?.user_id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const course = await queries.getCourseById(id);
        console.log('[courseController] getCourseById returned', !!course);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course details with modules and instructors
const getCourseDetails = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log('[courseController] GET /api/courses/:id/details id=', req.params.id, 'user=', req.user?.user_id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const course = await queries.getCourseById(id);
        console.log('[courseController] getCourseById returned', !!course);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const instructors = await queries.getInstructorsByCourse(id);
        console.log('[courseController] getInstructorsByCourse returned count =', instructors?.length);
        const modules = await queries.getModulesByCourse(id);
        console.log('[courseController] getModulesByCourse returned count =', modules?.length);
        res.status(200).json({ course, modules, instructors });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get module content
const getModuleContent = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const moduleNumber = parseInt(req.params.moduleNumber, 10);
        console.log('[courseController] GET /api/courses/:id/modules/:moduleNumber/content id=', req.params.id, 'module=', req.params.moduleNumber, 'user=', req.user?.user_id);
        if (isNaN(id) || isNaN(moduleNumber)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }
        const content = await queries.getModuleContent(id, moduleNumber);
        console.log('[courseController] getModuleContent returned count =', content?.length);
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error fetching module content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course modules
const getModules = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log('[courseController] GET /api/courses/:id/modules id=', req.params.id, 'user=', req.user?.user_id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const modules = await queries.getModulesByCourse(id);
        console.log('[courseController] getModulesByCourse returned count =', modules?.length);
        res.status(200).json({ modules });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course universities
const getUniversities = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log('[courseController] GET /api/courses/:id/universities id=', req.params.id, 'user=', req.user?.user_id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const universities = await queries.getCourseUniversities(id);
        console.log('[courseController] getCourseUniversities returned count =', universities?.length);
        res.status(200).json({ universities });
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course rating
const getRating = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log('[courseController] GET /api/courses/:id/rating id=', req.params.id, 'user=', req.user?.user_id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const ratingData = await queries.getCourseRating(id);
        console.log('[courseController] getCourseRating returned', ratingData);
        res.status(200).json(ratingData);
    } catch (error) {
        console.error('Error fetching rating:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course reviews
const getReviews = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log('[courseController] GET /api/courses/:id/reviews id=', req.params.id, 'user=', req.user?.user_id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const reviews = await queries.getCourseReviewsDetailed(id);
        console.log('[courseController] getCourseReviewsDetailed returned count =', reviews?.length);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllCourses,
    searchCourses,
    getCourseById,
    getCourseDetails,
    getModuleContent,
    getModules,
    getUniversities,
    getRating,
    getReviews,
};
