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

// Get all users with role information
const getAllUsers = async () => {
    const result = await pool.query(`
        SELECT u.user_id, u.email, u.name, u.role, u.country,
               s.skill_level, i.expertise, i.start_date
        FROM user_ u
        LEFT JOIN student s ON u.user_id = s.student_id
        LEFT JOIN instructor i ON u.user_id = i.instructor_id
        ORDER BY u.name ASC
    `);
    return result.rows;
};

// Search users by name or email
const searchUsersByName = async (query) => {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
        SELECT u.user_id, u.email, u.name, u.role, u.country,
               s.skill_level, i.expertise, i.start_date
        FROM user_ u
        LEFT JOIN student s ON u.user_id = s.student_id
        LEFT JOIN instructor i ON u.user_id = i.instructor_id
        WHERE (u.name ILIKE $1 OR u.email ILIKE $1)
        ORDER BY u.name ASC
    `, [searchQuery]);
    return result.rows;
};

// Delete user (cascade will handle related records)
const deleteUser = async (userId) => {
    const result = await pool.query(
        'DELETE FROM user_ WHERE user_id = $1 RETURNING *',
        [userId]
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
            'INSERT INTO course (name, description, duration, university_id, textbook_isbn, Fees) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, description, duration, university_id, textbook_isbn, 100]
    );
    return result.rows[0];
};


const updateCourse = async (courseId, { name, description, duration, university_id, textbook_isbn }) => {
    const result = await pool.query(
            'UPDATE course SET name = $2, description = $3, duration = $4, university_id = $5, textbook_isbn = $6, Fees = $7 WHERE course_id = $1 RETURNING *',
        [courseId, name, description, duration, university_id, textbook_isbn, 100]
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
        SELECT e.*, u.name AS student_name, u.email,
        COALESCE(
            (SELECT COUNT(sp.content_id)::FLOAT 
             FROM student_progress sp 
             WHERE sp.student_id = e.student_id AND sp.course_id = e.course_id
            ) / NULLIF((SELECT COUNT(*) FROM module_content mc WHERE mc.course_id = e.course_id), 0) * 100, 
        0) AS progress_percentage
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


const updateEnrollmentReview = async (enrollmentId, { review, rating }) => {
    const result = await pool.query(
        'UPDATE enrollment SET Review = $2, rating = $3, Last_access = CURRENT_TIMESTAMP WHERE enrollment_id = $1 RETURNING *',
        [enrollmentId, review, rating]
    );
    return result.rows[0];
};

const getCourseReviews = async (courseId) => {
    const result = await pool.query(
        'SELECT e.Review, e.rating, u.name as student_name FROM enrollment e JOIN user_ u ON e.student_id = u.user_id WHERE e.course_id = $1 AND e.Review IS NOT NULL',
        [courseId]
    );
    return result.rows;
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


const getCoursesByInstructorWithCounts = async (instructorId) => {
    const result = await pool.query(`
        SELECT c.*,
            u.name AS university_name,
            (SELECT COUNT(*) FROM module m WHERE m.course_id = c.course_id) AS module_count,
            (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id) AS student_count,
            (
                SELECT STRING_AGG(usr.name, ', ')
                FROM course_instructor ci2
                JOIN user_ usr ON ci2.instructor_id = usr.user_id
                WHERE ci2.course_id = c.course_id AND ci2.instructor_id != $1
            ) AS other_instructors
        FROM course_instructor ci
        JOIN course c ON ci.course_id = c.course_id
        LEFT JOIN university u ON c.university_id = u.university_id
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


const updateModule = async (courseId, moduleNumber, { name, duration_weeks }) => {
    const result = await pool.query(
        'UPDATE module SET name = COALESCE($3, name), duration_weeks = COALESCE($4, duration_weeks) WHERE course_id = $1 AND module_number = $2 RETURNING *',
        [courseId, moduleNumber, name, duration_weeks]
    );
    return result.rows[0];
};


const updateModuleContent = async (courseId, moduleNumber, contentId, { title, content_type, url }) => {
    const result = await pool.query(
        `UPDATE module_content SET title = COALESCE($4, title), content_type = COALESCE($5, content_type), url = COALESCE($6, url)
         WHERE course_id = $1 AND module_number = $2 AND content_id = $3 RETURNING *`,
        [courseId, moduleNumber, contentId, title, content_type, url]
    );
    return result.rows[0];
};


// Swap two modules by module_number (and their content) for reordering
const swapModuleOrder = async (courseId, num1, num2) => {
    if (num1 === num2) return;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Helper to move content from one module to another
        // Necessary because foreign keys (student_progress) restrict direct updates to module_number
        const moveContent = async (fromMod, toMod) => {
            const res = await client.query(
                'SELECT * FROM module_content WHERE course_id = $1 AND module_number = $2',
                [courseId, fromMod]
            );
            for (const row of res.rows) {
                // 1. Insert copy into new module
                await client.query(
                    'INSERT INTO module_content (course_id, module_number, content_id, title, content_type, url) VALUES ($1, $2, $3, $4, $5, $6)',
                    [courseId, toMod, row.content_id, row.title, row.content_type, row.url]
                );
                // 2. Update dependent student_progress to point to the new parent
                await client.query(
                    'UPDATE student_progress SET module_number = $2 WHERE course_id = $1 AND module_number = $3 AND content_id = $4',
                    [courseId, toMod, fromMod, row.content_id]
                );
                // 3. Delete original content row
                await client.query(
                    'DELETE FROM module_content WHERE course_id = $1 AND module_number = $2 AND content_id = $3',
                    [courseId, fromMod, row.content_id]
                );
            }
        };

        // Fetch attributes of both modules
        const res1 = await client.query('SELECT name, duration_weeks FROM module WHERE course_id = $1 AND module_number = $2', [courseId, num1]);
        const res2 = await client.query('SELECT name, duration_weeks FROM module WHERE course_id = $1 AND module_number = $2', [courseId, num2]);
        
        if (res1.rows.length === 0 || res2.rows.length === 0) throw new Error('Module not found');
        
        const m1 = res1.rows[0];
        const m2 = res2.rows[0];
        const tempId = -1; // Temporary ID for swapping content

        // 1. Create temp module
        await client.query('DELETE FROM module WHERE course_id = $1 AND module_number = $2', [courseId, tempId]); // Cleanup
        await client.query('INSERT INTO module (course_id, module_number, name, duration_weeks) VALUES ($1, $2, $3, $4)', [courseId, tempId, 'TEMP', 0]);

        // 2. Rotate content: 1 -> Temp, 2 -> 1, Temp -> 2
        await moveContent(num1, tempId);
        await moveContent(num2, num1);
        await moveContent(tempId, num2);

        // 3. Swap attributes on the modules
        await client.query('UPDATE module SET name = $3, duration_weeks = $4 WHERE course_id = $1 AND module_number = $2', [courseId, num1, m2.name, m2.duration_weeks]);
        await client.query('UPDATE module SET name = $3, duration_weeks = $4 WHERE course_id = $1 AND module_number = $2', [courseId, num2, m1.name, m1.duration_weeks]);

        // 4. Delete temp module
        await client.query('DELETE FROM module WHERE course_id = $1 AND module_number = $2', [courseId, tempId]);
        
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};


// ==========================================
// STUDENT PROGRESS QUERIES
// ==========================================

const markContentAsComplete = async ({ student_id, course_id, module_number, content_id }) => {
    const result = await pool.query(
        'INSERT INTO student_progress (student_id, course_id, module_number, content_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *',
        [student_id, course_id, module_number, content_id]
    );
    return result.rows[0];
};

const getStudentProgress = async (studentId, courseId) => {
    const result = await pool.query(
        'SELECT (COUNT(sp.content_id)::FLOAT / (SELECT COUNT(*) FROM module_content WHERE course_id = $2)) * 100 AS progress_percentage FROM student_progress sp WHERE sp.student_id = $1 AND sp.course_id = $2',
        [studentId, courseId]
    );
    return result.rows[0];
};

// ==========================================
// ADMIN QUERIES
// ==========================================

// Create user and instructor in transaction
const createUserAndInstructorInTransaction = async ({ userData, instructorData }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Create user
        const userRes = await client.query(
            'INSERT INTO user_ (email, password_hash, name, role, country) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userData.email, userData.password_hash, userData.name, userData.role, userData.country]
        );
        const newUser = userRes.rows[0];

        // 2. Create instructor using the new user's ID
        await client.query(
            'INSERT INTO instructor (instructor_id, expertise, start_date) VALUES ($1, $2, $3)',
            [newUser.user_id, instructorData.expertise, instructorData.start_date || new Date()]
        );

        await client.query('COMMIT');
        return newUser;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

// Create user and analyst in transaction
const createUserAndAnalystInTransaction = async ({ userData }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Create user
        const userRes = await client.query(
            'INSERT INTO user_ (email, password_hash, name, role, country) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userData.email, userData.password_hash, userData.name, userData.role, userData.country]
        );
        const newUser = userRes.rows[0];

        // 2. Create analyst using the new user's ID
        await client.query(
            'INSERT INTO analyst (analyst_id) VALUES ($1)',
            [newUser.user_id]
        );

        await client.query('COMMIT');
        return newUser;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

// Search instructors by name or email
const searchInstructors = async (query) => {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
        SELECT u.*, i.expertise, i.start_date
        FROM user_ u
        JOIN instructor i ON u.user_id = i.instructor_id
        WHERE (u.name ILIKE $1 OR u.email ILIKE $1) AND u.role = 'Instructor'
    `, [searchQuery]);
    return result.rows;
};

// Search students by name or email
const searchStudents = async (query) => {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
        SELECT u.*, s.date_of_birth, s.skill_level
        FROM user_ u
        JOIN student s ON u.user_id = s.student_id
        WHERE (u.name ILIKE $1 OR u.email ILIKE $1) AND u.role = 'Student'
    `, [searchQuery]);
    return result.rows;
};

// Get students enrolled in a course
const getStudentsByCourse = async (courseId) => {
    const result = await pool.query(`
        SELECT u.user_id, u.email, u.name, e.enrollment_id, e.enrollment_date, e.evaluation_score, e.rating
        FROM enrollment e
        JOIN student s ON e.student_id = s.student_id
        JOIN user_ u ON s.student_id = u.user_id
        WHERE e.course_id = $1
        ORDER BY e.enrollment_date DESC
    `, [courseId]);
    return result.rows;
};

// Remove instructor from course
const removeInstructorFromCourse = async ({ course_id, instructor_id }) => {
    const result = await pool.query(
        'DELETE FROM course_instructor WHERE course_id = $1 AND instructor_id = $2 RETURNING *',
        [course_id, instructor_id]
    );
    return result.rows[0];
};

// Remove student from enrollment
const removeStudentFromEnrollment = async (enrollmentId) => {
    const result = await pool.query(
        'DELETE FROM enrollment WHERE enrollment_id = $1 RETURNING *',
        [enrollmentId]
    );
    return result.rows[0];
};

// Check if instructor is already assigned to course
const checkInstructorAssignment = async (courseId, instructorId) => {
    const result = await pool.query(
        'SELECT * FROM course_instructor WHERE course_id = $1 AND instructor_id = $2',
        [courseId, instructorId]
    );
    return result.rows[0];
};

// Get analyst
const getAnalyst = async () => {
    const result = await pool.query(`
        SELECT u.*
        FROM user_ u
        JOIN analyst a ON u.user_id = a.analyst_id
        WHERE u.role = 'Analyst'
        LIMIT 1
    `);
    return result.rows[0];
};

module.exports = {
    // User queries
    getUserById,
    getUserByEmail,
    createUser,
    createUserAndStudentInTransaction,
    createUserAndInstructorInTransaction,
    createUserAndAnalystInTransaction,
    updateUser,
    getAllUsers,
    searchUsersByName,
    deleteUser,
   
    // Student queries
    getStudentById,
    createStudent,
    getAllStudents,
    searchStudents,
   
    // Instructor queries
    getInstructorById,
    createInstructor,
    getAllInstructors,
    searchInstructors,
   
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
    updateEnrollmentReview,
    getCourseReviews,
    removeStudentFromEnrollment,
    getStudentsByCourse,
   
    // Course Instructor queries
    assignInstructorToCourse,
    getInstructorsByCourse,
    getCoursesByInstructor,
    getCoursesByInstructorWithCounts,
    removeInstructorFromCourse,
    checkInstructorAssignment,

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
    updateModule,
    updateModuleContent,
    swapModuleOrder,

    // Student Progress queries
    markContentAsComplete,
    getStudentProgress,

    // Analyst queries
    getAnalyst,
};
