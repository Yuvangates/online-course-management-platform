const pool = require('../config/db');

// ==========================================
// USER QUERIES
// ==========================================

const getUserById = async (userId) => {
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

const updateUser = async (userId, { name, country }) => {
    const result = await pool.query(
        'UPDATE user_ SET name = $2, country = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *',
        [userId, name, country]
    );
    return result.rows[0];
};

// ==========================================
// STUDENT QUERIES
// ==========================================

const getStudentById = async (studentId) => {
    const result = await pool.query(`
        SELECT u.*, s.skill_level 
        FROM user_ u 
        LEFT JOIN student s ON u.user_id = s.user_id 
        WHERE u.user_id = $1 AND u.role = 'Student'
    `, [studentId]);
    return result.rows[0];
};

const createStudent = async ({ userId, university_id, skill_level }) => {
    const result = await pool.query(
        'INSERT INTO student (user_id, university_id, skill_level) VALUES ($1, $2, $3) RETURNING *',
        [userId, university_id, skill_level]
    );
    return result.rows[0];
};

const getAllStudents = async () => {
    const result = await pool.query(`
        SELECT u.*, s.skill_level 
        FROM user_ u 
        LEFT JOIN student s ON u.user_id = s.user_id 
        WHERE u.role = 'Student'
        ORDER BY u.created_at DESC
    `);
    return result.rows;
};

// ==========================================
// INSTRUCTOR QUERIES
// ==========================================

const getInstructorById = async (instructorId) => {
    const result = await pool.query(`
        SELECT u.*, i.department, i.qualification 
        FROM user_ u 
        LEFT JOIN instructor i ON u.user_id = i.user_id 
        WHERE u.user_id = $1 AND u.role = 'Instructor'
    `, [instructorId]);
    return result.rows[0];
};

const createInstructor = async ({ userId, university_id, department, qualification }) => {
    const result = await pool.query(
        'INSERT INTO instructor (user_id, university_id, department, qualification) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, university_id, department, qualification]
    );
    return result.rows[0];
};

const getAllInstructors = async () => {
    const result = await pool.query(`
        SELECT u.*, i.department, i.qualification 
        FROM user_ u 
        LEFT JOIN instructor i ON u.user_id = i.user_id 
        WHERE u.role = 'Instructor'
        ORDER BY u.created_at DESC
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
        ORDER BY c.created_at DESC
    `);
    return result.rows;
};

const createCourse = async ({ title, description, code, credits, level, duration_weeks, start_date, end_date }) => {
    const result = await pool.query(
        'INSERT INTO course (title, description, code, credits, level, duration_weeks, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [title, description, code, credits, level, duration_weeks, start_date, end_date]
    );
    return result.rows[0];
};

const updateCourse = async (courseId, { title, description, credits, level, end_date }) => {
    const result = await pool.query(
        'UPDATE course SET title = $2, description = $3, credits = $4, level = $5, end_date = $6, created_at = CURRENT_TIMESTAMP WHERE course_id = $1 RETURNING *',
        [courseId, title, description, credits, level, end_date]
    );
    return result.rows[0];
};

const searchCourses = async (query) => {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
        SELECT c.* 
        FROM course c 
        WHERE c.title ILIKE $1 
           OR c.description ILIKE $1 
           OR c.code ILIKE $1 
        ORDER BY c.created_at DESC
    `, [searchQuery]);
    return result.rows;
};

const getModulesByCourseId = async (courseId) => {
    const result = await pool.query(
        'SELECT * FROM module WHERE course_id = $1 ORDER BY module_number ASC',
        [courseId]
    );
    return result.rows;
};

// ==========================================
// ENROLLMENT QUERIES
// ==========================================

const getEnrollmentsByStudent = async (studentId) => {
    const result = await pool.query(`
        SELECT e.*, c.title as course_title
        FROM enrollment e 
        JOIN course c ON e.course_id = c.course_id 
        WHERE e.student_id = $1 
        ORDER BY e.enrollment_date DESC
    `, [studentId]);
    return result.rows;
};

const getEnrollmentsByCourse = async (courseId) => {
    const result = await pool.query(`
        SELECT e.*, u.name as student_name, u.email 
        FROM enrollment e 
        JOIN student s ON e.student_id = s.student_id 
        JOIN user_ u ON s.user_id = u.user_id 
        WHERE e.course_id = $1 
        ORDER BY e.enrollment_date DESC
    `, [courseId]);
    return result.rows;
};

const enrollStudent = async ({ student_id, course_id }) => {
    const result = await pool.query(
        'INSERT INTO enrollment (student_id, course_id, enrollment_date) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *',
        [student_id, course_id]
    );
    return result.rows[0];
};

const updateEnrollmentScore = async (enrollmentId, grade) => {
    const result = await pool.query(
        'UPDATE enrollment SET grade = $2 WHERE enrollment_id = $1 RETURNING *',
        [enrollmentId, grade]
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
        'INSERT INTO courseInstructor (course_id, instructor_id) VALUES ($1, $2) RETURNING *',
        [course_id, instructor_id]
    );
    return result.rows[0];
};

const getInstructorsByCourse = async (courseId) => {
    const result = await pool.query(`
        SELECT u.*, i.department, i.qualification 
        FROM courseInstructor ci 
        JOIN instructor i ON ci.instructor_id = i.instructor_id 
        JOIN user_ u ON i.user_id = u.user_id 
        WHERE ci.course_id = $1
    `, [courseId]);
    return result.rows;
};

const getCoursesByInstructor = async (instructorId) => {
    const result = await pool.query(`
        SELECT c.* 
        FROM courseInstructor ci 
        JOIN course c ON ci.course_id = c.course_id 
        WHERE ci.instructor_id = $1 
        ORDER BY c.created_at DESC
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

const createTextbook = async ({ title, author, isbn, publication_year }) => {
    const result = await pool.query(
        'INSERT INTO textbook (title, author, isbn, publication_year) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, author, isbn, publication_year]
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

const createModule = async ({ course_id, module_number, title, duration_hours }) => {
    const result = await pool.query(
        'INSERT INTO module (course_id, module_number, title, duration_hours) VALUES ($1, $2, $3, $4) RETURNING *',
        [course_id, module_number, title, duration_hours]
    );
    return result.rows[0];
};

const getModuleContent = async (moduleId) => {
    const result = await pool.query(
        'SELECT * FROM moduleContent WHERE module_id = $1 ORDER BY sequence_number ASC',
        [moduleId]
    );
    return result.rows;
};

const createModuleContent = async ({ module_id, title, content_type, content_url, duration_minutes, sequence_number }) => {
    const result = await pool.query(
        'INSERT INTO moduleContent (module_id, title, content_type, content_url, duration_minutes, sequence_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [module_id, title, content_type, content_url, duration_minutes, sequence_number]
    );
    return result.rows[0];
};

module.exports = {
    // User queries
    getUserById,
    getUserByEmail,
    createUser,
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
    getModulesByCourseId,
    
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
