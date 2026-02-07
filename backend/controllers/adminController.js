const bcrypt = require('bcryptjs');
const queries = require('../db/queries');

// Dashboard - Get stats
const getDashboard = async (req, res) => {
    try {
        const courses = await queries.getAllCourses();
        const students = await queries.getAllStudents();
        const instructors = await queries.getAllInstructors();
        const analyst = await queries.getAnalyst();

        res.status(200).json({
            totalCourses: courses.length,
            totalStudents: students.length,
            totalInstructors: instructors.length,
            hasAnalyst: !!analyst,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { name, description, duration, university_id } = req.body;

        // Validation
        if (!name || !university_id) {
            return res.status(400).json({ error: 'Name and university are required' });
        }

        const course = await queries.createCourse({
            name,
            description: description || '',
            duration: duration || 30,
            university_id,
            textbook_isbn: null,
        });

        res.status(201).json(course);
    } catch (error) {
        console.error('Create course error:', error);
        if (error.message.includes('unique')) {
            return res.status(400).json({ error: 'Course name already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await queries.getAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get course details with instructors
const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await queries.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const instructors = await queries.getInstructorsByCourse(courseId);
        const students = await queries.getStudentsByCourse(courseId);

        res.status(200).json({
            ...course,
            instructors,
            students,
        });
    } catch (error) {
        console.error('Get course details error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create a new instructor
const createInstructor = async (req, res) => {
    try {
        const { email, password, name, country, expertise } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if user already exists
        const existingUser = await queries.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and instructor
        const user = await queries.createUserAndInstructorInTransaction({
            userData: {
                email,
                password_hash: hashedPassword,
                name,
                role: 'Instructor',
                country: country || '',
            },
            instructorData: {
                expertise: expertise || '',
                start_date: new Date(),
            },
        });

        res.status(201).json({
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
        });
    } catch (error) {
        console.error('Create instructor error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all instructors
const getAllInstructors = async (req, res) => {
    try {
        const instructors = await queries.getAllInstructors();
        res.status(200).json(instructors);
    } catch (error) {
        console.error('Get instructors error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Search instructors
const searchInstructors = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            const instructors = await queries.getAllInstructors();
            return res.status(200).json(instructors);
        }

        const instructors = await queries.searchInstructors(q.trim());
        res.status(200).json(instructors);
    } catch (error) {
        console.error('Search instructors error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Assign instructor to course
const assignInstructorToCourse = async (req, res) => {
    try {
        const { courseId, instructorId } = req.body;

        // Validation
        if (!courseId || !instructorId) {
            return res.status(400).json({ error: 'Course and instructor are required' });
        }

        // Check if already assigned
        const existing = await queries.checkInstructorAssignment(courseId, instructorId);
        if (existing) {
            return res.status(400).json({ error: 'Instructor already assigned to this course' });
        }

        // Verify course and instructor exist
        const course = await queries.getCourseById(courseId);
        const instructor = await queries.getInstructorById(instructorId);

        if (!course || !instructor) {
            return res.status(404).json({ error: 'Course or instructor not found' });
        }

        const assignment = await queries.assignInstructorToCourse({
            course_id: courseId,
            instructor_id: instructorId,
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.error('Assign instructor error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Remove instructor from course
const removeInstructorFromCourse = async (req, res) => {
    try {
        const { courseId, instructorId } = req.params;

        if (!courseId || !instructorId) {
            return res.status(400).json({ error: 'Course and instructor are required' });
        }

        const result = await queries.removeInstructorFromCourse({
            course_id: parseInt(courseId),
            instructor_id: parseInt(instructorId),
        });

        if (!result) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Instructor removed from course' });
    } catch (error) {
        console.error('Remove instructor error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get students by course
const getStudentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await queries.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const students = await queries.getStudentsByCourse(courseId);
        res.status(200).json(students);
    } catch (error) {
        console.error('Get students by course error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Search students
const searchStudents = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            const students = await queries.getAllStudents();
            return res.status(200).json(students);
        }

        const students = await queries.searchStudents(q.trim());
        res.status(200).json(students);
    } catch (error) {
        console.error('Search students error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Remove student from course
const removeStudentFromCourse = async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        if (!enrollmentId) {
            return res.status(400).json({ error: 'Enrollment ID is required' });
        }

        const result = await queries.removeStudentFromEnrollment(parseInt(enrollmentId));

        if (!result) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        res.status(200).json({ message: 'Student removed from course' });
    } catch (error) {
        console.error('Remove student error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create analyst
const createAnalyst = async (req, res) => {
    try {
        const { email, password, name, country } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if analyst already exists
        const existingAnalyst = await queries.getAnalyst();
        if (existingAnalyst) {
            return res.status(400).json({ error: 'An analyst already exists in the system' });
        }

        // Check if email already in use
        const existingUser = await queries.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and analyst
        const user = await queries.createUserAndAnalystInTransaction({
            userData: {
                email,
                password_hash: hashedPassword,
                name,
                role: 'Analyst',
                country: country || '',
            },
        });

        res.status(201).json({
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
        });
    } catch (error) {
        console.error('Create analyst error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get analyst
const getAnalyst = async (req, res) => {
    try {
        const analyst = await queries.getAnalyst();
        
        if (!analyst) {
            return res.status(404).json({ error: 'No analyst found' });
        }

        res.status(200).json({
            user_id: analyst.user_id,
            email: analyst.email,
            name: analyst.name,
            role: analyst.role,
            country: analyst.country,
        });
    } catch (error) {
        console.error('Get analyst error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all universities
const getAllUniversities = async (req, res) => {
    try {
        const universities = await queries.getAllUniversities();
        res.status(200).json(universities);
    } catch (error) {
        console.error('Get universities error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await queries.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Search users by name or email
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            const users = await queries.getAllUsers();
            return res.status(200).json(users);
        }

        const users = await queries.searchUsersByName(q.trim());
        res.status(200).json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Prevent deleting yourself
        if (parseInt(userId) === req.user.user_id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = await queries.getUserById(parseInt(userId));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await queries.deleteUser(parseInt(userId));

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboard,
    createCourse,
    getAllCourses,
    getCourseDetails,
    createInstructor,
    getAllInstructors,
    searchInstructors,
    assignInstructorToCourse,
    removeInstructorFromCourse,
    getStudentsByCourse,
    searchStudents,
    removeStudentFromCourse,
    createAnalyst,
    getAnalyst,
    getAllUniversities,
    getAllUsers,
    searchUsers,
    deleteUser,
};
