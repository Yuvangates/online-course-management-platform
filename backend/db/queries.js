const pool = require('../config/db'); // Assuming this points to your node-postgres pool


// ==========================================
// USER QUERIES
// ==========================================


const getUserById = async (userId) => {
    // Corrected table name from "Users" to "user" (quoted as USER is a reserved keyword)
    const result = await pool.query('SELECT * FROM user_ WHERE user_id = $1', [userId]);
    return result.rows[0];
};


const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM user_ WHERE email = $1', [email]);
    return result.rows[0];
};


const createUser = async ({ email, password_hash, name, role, country }) => {
    const result = await pool.query(
            'INSERT INTO user_ (email, password_hash, name, role, country) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [email, password_hash, name, role, country]
    );
    return result.rows[0];
};


// New transactional function for robust user+student creation
const createUserAndStudentInTransaction = async ({ userData, studentData }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');


        // 1. Create user
        const userRes = await client.query(
            'INSERT INTO user_ (email, password_hash, name, role, country) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userData.email, userData.password_hash, userData.name, userData.role, userData.country]
        );
        const newUser = userRes.rows[0];


        // 2. Create student using the new user's ID
        await client.query(
            'INSERT INTO student (student_id, date_of_birth, skill_level) VALUES ($1, $2, $3)',
            [newUser.user_id, studentData.date_of_birth, studentData.skill_level]
        );


        await client.query('COMMIT');
        return newUser;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e; // Re-throw the error to be caught by the controller
    } finally {
        client.release();
    }
};


const updateUser = async (userId, { name, country }) => {
    const result = await pool.query(
            'UPDATE user_ SET name = $2, country = $3 WHERE user_id = $1 RETURNING *',
        [userId, name, country]
    );
    return result.rows[0];
};


// ==========================================
// STUDENT QUERIES
// ==========================================


const getStudentById = async (studentId) => {
    const result = await pool.query(`
        SELECT u.*, s.date_of_birth, s.skill_level
        FROM user_ u
        LEFT JOIN student s ON u.user_id = s.student_id
        WHERE u.user_id = $1 AND u.role = 'Student'
    `, [studentId]);
    return result.rows[0];
};


const createStudent = async ({ student_id, date_of_birth, skill_level }) => {
    const result = await pool.query(
            'INSERT INTO student (student_id, date_of_birth, skill_level) VALUES ($1, $2, $3) RETURNING *',
        [student_id, date_of_birth, skill_level]
    );
    return result.rows[0];
};


const getAllStudents = async () => {
    // Corrected table names
    const result = await pool.query(`
        SELECT u.*, s.date_of_birth, s.skill_level
        FROM user_ u
        JOIN student s ON u.user_id = s.student_id
        WHERE u.role = 'Student'
    `);
    return result.rows;
};


// ==========================================
// INSTRUCTOR QUERIES
// ==========================================


const getInstructorById = async (instructorId) => {
    const result = await pool.query(`
        SELECT u.*, i.expertise, i.start_date
        FROM user_ u
        LEFT JOIN instructor i ON u.user_id = i.instructor_id
        WHERE u.user_id = $1 AND u.role = 'Instructor'
    `, [instructorId]);
    return result.rows[0];
};


const createInstructor = async ({ instructor_id, expertise, start_date }) => {
    const result = await pool.query(
            'INSERT INTO instructor (instructor_id, expertise, start_date) VALUES ($1, $2, $3) RETURNING *',
        [instructor_id, expertise, start_date || new Date()]
    );
    return result.rows[0];
};


const getAllInstructors = async () => {
    // Corrected table names
    const result = await pool.query(`
        SELECT u.*, i.expertise, i.start_date
        FROM user_ u
        JOIN instructor i ON u.user_id = i.instructor_id
        WHERE u.role = 'Instructor'
    `);
    return result.rows;
};


// ==========================================
// COURSE QUERIES
// ==========================================


const getCourseById = async (courseId) => {
    const result = await pool.query(`
        SELECT c.*
        FROM course c
        WHERE c.course_id = $1
    `, [courseId]);
    return result.rows[0];
};


const getAllCourses = async () => {
    const result = await pool.query(`
        SELECT c.*
        FROM course c
    `);
    return result.rows;
};


const createCourse = async ({ name, description, duration, university_id, textbook_isbn }) => {
    const result = await pool.query(
            'INSERT INTO course (name, description, duration, university_id, textbook_isbn) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, duration, university_id, textbook_isbn]
    );
    return result.rows[0];
};


const updateCourse = async (courseId, { name, description, duration, university_id, textbook_isbn }) => {
    const result = await pool.query(
            'UPDATE course SET name = $2, description = $3, duration = $4, university_id = $5, textbook_isbn = $6 WHERE course_id = $1 RETURNING *',
        [courseId, name, description, duration, university_id, textbook_isbn]
    );
    return result.rows[0];
};


const searchCourses = async (query) => {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
        SELECT c.*
        FROM course c
        WHERE c.name ILIKE $1
           OR c.description ILIKE $1
    `, [searchQuery]);
    return result.rows;
};


// ==========================================
// ENROLLMENT QUERIES
// ==========================================


const getEnrollmentsByStudent = async (studentId) => {
    const result = await pool.query(`
        SELECT e.*, c.name AS course_name
        FROM enrollment e
        JOIN course c ON e.course_id = c.course_id
        WHERE e.student_id = $1
        ORDER BY e.enrollment_date DESC
    `, [studentId]);
    return result.rows;
};


const getEnrollmentsByCourse = async (courseId) => {
    // Corrected table names
    const result = await pool.query(`
        SELECT e.*, u.name AS student_name, u.email
        FROM enrollment e
        JOIN student s ON e.student_id = s.student_id
        JOIN user_ u ON s.student_id = u.user_id
        WHERE e.course_id = $1
        ORDER BY e.enrollment_date DESC
    `, [courseId]);
    return result.rows;
};


const enrollStudent = async ({ student_id, course_id }) => {
    const result = await pool.query(
            'INSERT INTO enrollment (student_id, course_id, enrollment_date) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
        [student_id, course_id]
    );
    return result.rows[0];
};


const updateEnrollmentScore = async (enrollmentId, evaluation_score) => {
    const result = await pool.query(
            'UPDATE enrollment SET evaluation_score = $2 WHERE enrollment_id = $1 RETURNING *',
        [enrollmentId, evaluation_score]
    );
    return result.rows[0];
};


const checkEnrollment = async (studentId, courseId) => {
    const result = await pool.query(
            'SELECT * FROM enrollment WHERE student_id = $1 AND course_id = $2',
        [studentId, courseId]
    );
    return result.rows[0];
};


// ==========================================
// COURSE INSTRUCTOR QUERIES
// ==========================================


const assignInstructorToCourse = async ({ course_id, instructor_id }) => {
    const result = await pool.query(
            'INSERT INTO course_instructor (course_id, instructor_id) VALUES ($1, $2) RETURNING *',
        [course_id, instructor_id]
    );
    return result.rows[0];
};


const getInstructorsByCourse = async (courseId) => {
    // Corrected table names
    const result = await pool.query(`
        SELECT u.*, i.expertise
        FROM course_instructor ci
        JOIN instructor i ON ci.instructor_id = i.instructor_id
        JOIN user_ u ON i.instructor_id = u.user_id
        WHERE ci.course_id = $1
    `, [courseId]);
    return result.rows;
};


const getCoursesByInstructor = async (instructorId) => {
    const result = await pool.query(`
        SELECT c.*
        FROM course_instructor ci
        JOIN course c ON ci.course_id = c.course_id
        WHERE ci.instructor_id = $1
    `, [instructorId]);
    return result.rows;
};


// ==========================================
// UNIVERSITY QUERIES
// ==========================================


const getAllUniversities = async () => {
    const result = await pool.query('SELECT * FROM university ORDER BY name ASC');
    return result.rows;
};


const getUniversityById = async (universityId) => {
    const result = await pool.query('SELECT * FROM university WHERE university_id = $1', [universityId]);
    return result.rows[0];
};


const createUniversity = async ({ name, country }) => {
    const result = await pool.query(
            'INSERT INTO university (name, country) VALUES ($1, $2) RETURNING *',
        [name, country]
    );
    return result.rows[0];
};


// ==========================================
// TEXTBOOK QUERIES
// ==========================================


const getTextbookByIsbn = async (isbn) => {
    const result = await pool.query('SELECT * FROM textbook WHERE isbn = $1', [isbn]);
    return result.rows[0];
};


const createTextbook = async ({ isbn, name, author }) => {
    const result = await pool.query(
            'INSERT INTO textbook (isbn, name, author) VALUES ($1, $2, $3) RETURNING *',
        [isbn, name, author]
    );
    return result.rows[0];
};


// ==========================================
// MODULE & CONTENT QUERIES
// ==========================================


const getModulesByCourse = async (courseId) => {
    const result = await pool.query(
            'SELECT * FROM module WHERE course_id = $1 ORDER BY module_number ASC',
        [courseId]
    );
    return result.rows;
};


const createModule = async ({ course_id, module_number, name, duration_weeks }) => {
    const result = await pool.query(
            'INSERT INTO module (course_id, module_number, name, duration_weeks) VALUES ($1, $2, $3, $4) RETURNING *',
        [course_id, module_number, name, duration_weeks]
    );
    return result.rows[0];
};


const getModuleContent = async (courseId, moduleNumber) => {
    const result = await pool.query(
        'SELECT * FROM module_content WHERE course_id = $1 AND module_number = $2 ORDER BY content_id ASC',
        [courseId, moduleNumber]
    );
    return result.rows;
};


const createModuleContent = async ({ course_id, module_number, content_id, title, content_type, url }) => {
    const result = await pool.query(
        'INSERT INTO module_content (course_id, module_number, content_id, title, content_type, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [course_id, module_number, content_id, title, content_type, url]
    );
    return result.rows[0];
};


module.exports = {
    // User queries
    getUserById,
    getUserByEmail,
    createUser,
    createUserAndStudentInTransaction,
    updateUser,
   
    // Student queries
    getStudentById,
    createStudent,
    getAllStudents,
   
    // Instructor queries
    getInstructorById,
    createInstructor,
    getAllInstructors,
   
    // Course queries
    getCourseById,
    getAllCourses,
    createCourse,
    updateCourse,
    searchCourses,
   
    // Enrollment queries
    getEnrollmentsByStudent,
    getEnrollmentsByCourse,
    enrollStudent,
    updateEnrollmentScore,
    checkEnrollment,
   
    // Course Instructor queries
    assignInstructorToCourse,
    getInstructorsByCourse,
    getCoursesByInstructor,
   
    // University queries
    getAllUniversities,
    getUniversityById,
    createUniversity,
   
    // Textbook queries
    getTextbookByIsbn,
    createTextbook,
   
    // Module & Content queries
    getModulesByCourse,
    createModule,
    getModuleContent,
    createModuleContent,
};


