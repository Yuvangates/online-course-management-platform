const queries = require('../db/queries');

// Get top rated courses (limit: default 3)
const getTopCourses = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const courses = await queries.getTopCoursesByRating(limit);
        res.status(200).json({
            success: true,
            data: courses,
            count: courses.length
        });
    } catch (error) {
        console.error('Error fetching top courses:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get top universities by course count (limit: default 3)
const getTopUniversities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const universities = await queries.getTopUniversitiesByCoursesCount(limit);
        res.status(200).json({
            success: true,
            data: universities,
            count: universities.length
        });
    } catch (error) {
        console.error('Error fetching top universities:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all public course data (without enrollment info)
const getAllCourses = async (req, res) => {
    try {
        const courses = await queries.getAllCourses();
        res.status(200).json({
            success: true,
            data: courses,
            count: courses.length
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all universities
const getAllUniversities = async (req, res) => {
    try {
        const universities = await queries.getAllUniversities();
        res.status(200).json({
            success: true,
            data: universities,
            count: universities.length
        });
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getTopCourses,
    getTopUniversities,
    getAllCourses,
    getAllUniversities,
};
