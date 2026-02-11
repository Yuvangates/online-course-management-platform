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


const updateStudentProfile = async (userId, { date_of_birth, skill_level }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Upsert student details
        await client.query(
            `INSERT INTO student (student_id, date_of_birth, skill_level)
             VALUES ($1, $2, $3)
             ON CONFLICT (student_id) DO UPDATE SET date_of_birth = EXCLUDED.date_of_birth, skill_level = EXCLUDED.skill_level`,
            [userId, date_of_birth || null, skill_level || null]
        );

        await client.query('COMMIT');
        // Return the full student/user profile
        const updated = await getStudentById(userId);
        return updated;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
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
        SELECT c.*,
               t.name as textbook_name,
               t.author as textbook_author
        FROM course c
        LEFT JOIN textbook t ON c.textbook_isbn = t.isbn
        WHERE c.course_id = $1
    `, [courseId]);
    return result.rows[0];
};


const getAllCourses = async () => {
    const result = await pool.query(`
        SELECT c.*, u.university_id, u.name as university_name,
               (SELECT AVG(rating) FROM enrollment e WHERE e.course_id = c.course_id AND e.rating IS NOT NULL) as average_rating,
               (SELECT COUNT(rating) FROM enrollment e WHERE e.course_id = c.course_id AND e.rating IS NOT NULL) as total_ratings
        FROM course c
        LEFT JOIN university u ON c.university_id = u.university_id
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


const updateCourse = async (courseId, { name, description, duration, university_id, textbook_isbn, image_url, fee }) => {
    const result = await pool.query(
        'UPDATE course SET name = $2, description = $3, duration = $4, university_id = $5, textbook_isbn = $6, image_url = $7, Fees = $8 WHERE course_id = $1 RETURNING *',
        [courseId, name, description, duration, university_id, textbook_isbn, image_url, fee]
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

const getEnrollmentById = async (enrollmentId) => {
    const result = await pool.query(
        'SELECT * FROM enrollment WHERE enrollment_id = $1',
        [enrollmentId]
    );
    return result.rows[0];
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
            t.name AS textbook_name,
            t.author AS textbook_author,
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
        LEFT JOIN textbook t ON c.textbook_isbn = t.isbn
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

const updateUniversity = async (universityId, { name, country }) => {
    const result = await pool.query(
        'UPDATE university SET name = $2, country = $3 WHERE university_id = $1 RETURNING *',
        [universityId, name, country]
      );
  return result.rows[0];
};

const updateUserProfile = async (userId, { name, country, email }) => {
    const result = await pool.query(
        'UPDATE user_ SET name = $2, country = $3, email = $4 WHERE user_id = $1 RETURNING user_id, name, email, role, country',
        [userId, name, country, email]
    );
    return result.rows[0];
};

const deleteUniversity = async (universityId) => {
    const result = await pool.query(
        'DELETE FROM university WHERE university_id = $1 RETURNING *',
        [universityId]
    );
    return result.rows[0];
};

const updateUserPassword = async (userId, password_hash) => {
    await pool.query(
        'UPDATE user_ SET password_hash = $1 WHERE user_id = $2',
        [password_hash, userId]
    );
};

// ==========================================
// TEXTBOOK QUERIES
// ==========================================

const getAllTextbooks = async () => {
    const result = await pool.query('SELECT * FROM textbook ORDER BY name ASC');
    return result.rows;
};

const getTextbookByIsbn = async (isbn) => {
    const result = await pool.query('SELECT * FROM textbook WHERE isbn = $1', [isbn]);
    return result.rows[0];
};

const getTextbookById = async (isbn) => {
    return getTextbookByIsbn(isbn);
};

const createTextbook = async ({ isbn, name, author }) => {
    const result = await pool.query(
        'INSERT INTO textbook (isbn, name, author) VALUES ($1, $2, $3) RETURNING *',
        [isbn, name, author]
    );
    return result.rows[0];
};

const updateTextbook = async (isbn, { name, author }) => {
    const result = await pool.query(
        'UPDATE textbook SET name = $2, author = $3 WHERE isbn = $1 RETURNING *',
        [isbn, name, author]
    );
    return result.rows[0];
};

const deleteTextbook = async (isbn) => {
    const result = await pool.query(
        'DELETE FROM textbook WHERE isbn = $1 RETURNING *',
        [isbn]
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


const deleteModule = async (courseId, moduleNumber) => {
    const result = await pool.query(
        'DELETE FROM module WHERE course_id = $1 AND module_number = $2',
        [courseId, moduleNumber]
    );
    return result.rowCount > 0;
};

const deleteModuleContent = async (courseId, moduleNumber, contentId) => {
    const result = await pool.query(
        'DELETE FROM module_content WHERE course_id = $1 AND module_number = $2 AND content_id = $3',
        [courseId, moduleNumber, contentId]
    );
    return result.rowCount > 0;
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

const getStudentCompletedContent = async (studentId, courseId) => {
    const result = await pool.query(
        'SELECT * FROM student_progress WHERE student_id = $1 AND course_id = $2',
        [studentId, courseId]
    );
    return result.rows;
};

const getCourseUniversities = async (courseId) => {
    const result = await pool.query(
        'SELECT u.* FROM university u JOIN course c ON u.university_id = c.university_id WHERE c.course_id = $1',
        [courseId]
    );
    return result.rows;
};

const getCourseRating = async (courseId) => {
    const result = await pool.query(
        'SELECT AVG(rating) as average_rating, COUNT(rating) as total_ratings FROM enrollment WHERE course_id = $1 AND rating IS NOT NULL',
        [courseId]
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

// ==========================================
// ANALYST ANALYTICS QUERIES
// ==========================================

// Get dashboard KPIs (total revenue, active students, avg rating, completion rate)
const getAnalystDashboardKPIs = async () => {
    const result = await pool.query(`
        SELECT
            -- Total Revenue
            COALESCE(SUM(c.Fees), 0) AS total_revenue,
            
            -- Active Students (accessed within last 7 days)
            COUNT(DISTINCT CASE 
                WHEN e.Last_access >= CURRENT_DATE - INTERVAL '7 days' 
                THEN e.student_id 
            END) AS active_students,
            
            -- Average Course Rating
            ROUND(AVG(e.rating)::NUMERIC, 2) AS avg_rating,
            
            -- Completion Rate (students with >80% progress)
            ROUND(
                (COUNT(DISTINCT CASE 
                    WHEN (
                        SELECT COUNT(sp.content_id)::FLOAT / NULLIF(
                            (SELECT COUNT(*) FROM module_content mc WHERE mc.course_id = e.course_id), 
                        0) * 100
                        FROM student_progress sp 
                        WHERE sp.student_id = e.student_id AND sp.course_id = e.course_id
                    ) > 80 
                    THEN e.student_id 
                END)::NUMERIC / NULLIF(COUNT(DISTINCT e.student_id), 0) * 100)::NUMERIC, 
            2) AS completion_rate
        FROM enrollment e
        JOIN course c ON e.course_id = c.course_id
    `);
    return result.rows[0];
};

// Get total revenue
const getTotalRevenue = async () => {
    const result = await pool.query(`
        SELECT COALESCE(SUM(c.Fees), 0) AS total_revenue
        FROM enrollment e
        JOIN course c ON e.course_id = c.course_id
    `);
    return result.rows[0];
};

// Get revenue breakdown by university
const getRevenueByUniversity = async () => {
    const result = await pool.query(`
        SELECT 
            u.name AS university_name,
            u.country,
            COUNT(DISTINCT c.course_id) AS course_count,
            COUNT(e.enrollment_id) AS enrollment_count,
            COALESCE(SUM(c.Fees), 0) AS total_revenue
        FROM university u
        LEFT JOIN course c ON u.university_id = c.university_id
        LEFT JOIN enrollment e ON c.course_id = e.course_id
        GROUP BY u.university_id, u.name, u.country
        ORDER BY total_revenue DESC
    `);
    return result.rows;
};

// Get free vs paid course performance comparison
const getFreeVsPaidCourseStats = async () => {
    const result = await pool.query(`
        SELECT 
            CASE WHEN c.Fees = 0 THEN 'Free' ELSE 'Paid' END AS course_type,
            COUNT(DISTINCT c.course_id) AS course_count,
            COUNT(e.enrollment_id) AS total_enrollments,
            ROUND(AVG(e.evaluation_score)::NUMERIC, 2) AS avg_evaluation_score,
            ROUND(AVG(e.rating)::NUMERIC, 2) AS avg_rating,
            ROUND(
                (AVG(
                    (SELECT COUNT(sp.content_id)::FLOAT / NULLIF(
                        (SELECT COUNT(*) FROM module_content mc WHERE mc.course_id = c.course_id), 
                    0) * 100
                    FROM student_progress sp 
                    WHERE sp.student_id = e.student_id AND sp.course_id = e.course_id)
                ))::NUMERIC, 
            2) AS avg_completion_percentage
        FROM course c
        LEFT JOIN enrollment e ON c.course_id = e.course_id
        WHERE e.enrollment_id IS NOT NULL
        GROUP BY course_type
        ORDER BY course_type
    `);
    return result.rows;
};

// Get dormant vs active users
const getDormantVsActiveUsers = async () => {
    const result = await pool.query(`
        SELECT 
            status AS user_status,
            COUNT(*) AS student_count
        FROM (
            SELECT 
                e.student_id,
                MAX(e.Last_access) AS last_access_date,
                CASE 
                    WHEN MAX(e.Last_access) IS NULL THEN 'Never Accessed'
                    WHEN MAX(e.Last_access) >= CURRENT_DATE - INTERVAL '7 days' THEN 'Active'
                    WHEN MAX(e.Last_access) >= CURRENT_DATE - INTERVAL '30 days' THEN 'At Risk'
                    ELSE 'Dormant'
                END AS status
            FROM enrollment e
            GROUP BY e.student_id
        ) AS user_activity
        GROUP BY status
        ORDER BY 
            CASE status
                WHEN 'Active' THEN 1
                WHEN 'At Risk' THEN 2
                WHEN 'Dormant' THEN 3
                WHEN 'Never Accessed' THEN 4
            END
    `);
    return result.rows;
};

// Get content drop-off rate (identify problematic content)
const getContentDropoffRate = async () => {
    const result = await pool.query(`
        SELECT 
            c.course_id,
            c.name AS course_name,
            m.module_number,
            m.name AS module_name,
            mc.content_id,
            mc.title AS content_title,
            mc.content_type,
            COUNT(DISTINCT e.student_id) AS enrolled_students,
            COUNT(DISTINCT sp.student_id) AS completed_students,
            ROUND(
                (COUNT(DISTINCT sp.student_id)::NUMERIC / NULLIF(COUNT(DISTINCT e.student_id), 0) * 100)::NUMERIC, 
            2) AS completion_rate
        FROM course c
        JOIN module m ON c.course_id = m.course_id
        JOIN module_content mc ON m.course_id = mc.course_id AND m.module_number = mc.module_number
        LEFT JOIN enrollment e ON c.course_id = e.course_id
        LEFT JOIN student_progress sp ON mc.course_id = sp.course_id 
            AND mc.module_number = sp.module_number 
            AND mc.content_id = sp.content_id
        GROUP BY c.course_id, c.name, m.module_number, m.name, mc.content_id, mc.title, mc.content_type
        HAVING COUNT(DISTINCT e.student_id) > 0
        ORDER BY completion_rate ASC, c.course_id, m.module_number, mc.content_id
        LIMIT 50
    `);
    return result.rows;
};

// Get preferred learning mode (content type completion rates)
const getPreferredLearningMode = async () => {
    const result = await pool.query(`
        SELECT 
            mc.content_type,
            COUNT(DISTINCT mc.course_id || '-' || mc.module_number || '-' || mc.content_id) AS total_content,
            COUNT(DISTINCT sp.student_id || '-' || sp.course_id || '-' || sp.module_number || '-' || sp.content_id) AS total_completions,
            COUNT(DISTINCT sp.student_id) AS unique_students,
            ROUND(
                COUNT(DISTINCT sp.student_id || '-' || sp.course_id || '-' || sp.module_number || '-' || sp.content_id)::NUMERIC / 
                NULLIF(COUNT(DISTINCT mc.course_id || '-' || mc.module_number || '-' || mc.content_id), 0), 
            2) AS avg_completion_per_content
        FROM module_content mc
        LEFT JOIN student_progress sp ON mc.course_id = sp.course_id 
            AND mc.module_number = sp.module_number 
            AND mc.content_id = sp.content_id
        GROUP BY mc.content_type
        ORDER BY avg_completion_per_content DESC
    `);
    return result.rows;
};

// Get score distribution for histogram
const getScoreDistribution = async () => {
    const result = await pool.query(`
        SELECT 
            CASE 
                WHEN evaluation_score >= 0 AND evaluation_score < 20 THEN '0-19'
                WHEN evaluation_score >= 20 AND evaluation_score < 40 THEN '20-39'
                WHEN evaluation_score >= 40 AND evaluation_score < 60 THEN '40-59'
                WHEN evaluation_score >= 60 AND evaluation_score < 80 THEN '60-79'
                WHEN evaluation_score >= 80 AND evaluation_score <= 100 THEN '80-100'
            END AS score_range,
            COUNT(*) AS student_count
        FROM enrollment
        WHERE evaluation_score IS NOT NULL
        GROUP BY score_range
        ORDER BY score_range
    `);
    return result.rows;
};

// Get skill level vs success correlation
const getSkillLevelVsSuccess = async () => {
    const result = await pool.query(`
        SELECT 
            s.skill_level,
            COUNT(e.enrollment_id) AS total_enrollments,
            ROUND(AVG(e.evaluation_score)::NUMERIC, 2) AS avg_score,
            ROUND(AVG(e.rating)::NUMERIC, 2) AS avg_rating,
            COUNT(CASE WHEN e.evaluation_score >= 60 THEN 1 END) AS passed_count,
            ROUND(
                (COUNT(CASE WHEN e.evaluation_score >= 60 THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC,
            2) AS pass_rate
        FROM student s
        JOIN enrollment e ON s.student_id = e.student_id
        WHERE e.evaluation_score IS NOT NULL
        GROUP BY s.skill_level
        ORDER BY s.skill_level
    `);
    return result.rows;
};

// Get instructor leaderboard (top-rated instructors)
const getInstructorLeaderboard = async () => {
    const result = await pool.query(`
        SELECT 
            u.user_id,
            u.name AS instructor_name,
            u.email,
            i.expertise,
            COUNT(DISTINCT ci.course_id) AS courses_taught,
            COUNT(DISTINCT e.student_id) AS total_students,
            ROUND(AVG(e.rating)::NUMERIC, 2) AS avg_rating,
            ROUND(AVG(e.evaluation_score)::NUMERIC, 2) AS avg_student_score
        FROM instructor i
        JOIN user_ u ON i.instructor_id = u.user_id
        LEFT JOIN course_instructor ci ON i.instructor_id = ci.instructor_id
        LEFT JOIN enrollment e ON ci.course_id = e.course_id
        GROUP BY u.user_id, u.name, u.email, i.expertise
        HAVING COUNT(DISTINCT ci.course_id) > 0
        ORDER BY avg_rating DESC NULLS LAST, total_students DESC
    `);
    return result.rows;
};

// Get course duration vs completion analysis
const getCourseDurationVsCompletion = async () => {
    const result = await pool.query(`
        SELECT 
            c.course_id,
            c.name AS course_name,
            c.duration AS duration_weeks,
            COUNT(DISTINCT e.enrollment_id) AS enrollment_count,
            ROUND(AVG(e.rating)::NUMERIC, 2) AS avg_rating,
            ROUND(AVG(e.evaluation_score)::NUMERIC, 2) AS avg_score,
            ROUND(
                (AVG(
                    (SELECT COUNT(sp.content_id)::FLOAT / NULLIF(
                        (SELECT COUNT(*) FROM module_content mc WHERE mc.course_id = c.course_id), 
                    0) * 100
                    FROM student_progress sp 
                    WHERE sp.student_id = e.student_id AND sp.course_id = e.course_id)
                ))::NUMERIC,
            2) AS avg_completion_percentage
        FROM course c
        LEFT JOIN enrollment e ON c.course_id = e.course_id
        WHERE e.enrollment_id IS NOT NULL
        GROUP BY c.course_id, c.name, c.duration
        HAVING COUNT(DISTINCT e.enrollment_id) > 0
        ORDER BY c.duration, avg_rating DESC
    `);
    return result.rows;
};

// Get enrollment trends (monthly breakdown)
const getEnrollmentTrends = async () => {
    const result = await pool.query(`
        SELECT 
            TO_CHAR(enrollment_date, 'YYYY-MM') AS month,
            COUNT(*) AS enrollment_count,
            COUNT(DISTINCT student_id) AS unique_students,
            COUNT(DISTINCT course_id) AS courses_enrolled
        FROM enrollment
        GROUP BY TO_CHAR(enrollment_date, 'YYYY-MM')
        ORDER BY month DESC
        LIMIT 12
    `);
    return result.rows;
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

const getAvailableAnalysts = async () => {
    const result = await pool.query(`
        SELECT u.user_id, u.name, u.email, u.country
        FROM user_ u
        WHERE u.role = 'Analyst'
          AND NOT EXISTS (
              SELECT 1 FROM analyst a WHERE a.analyst_id = u.user_id
          )
        ORDER BY u.name ASC
    `);
    return result.rows;
};

const assignAnalystToSystem = async (analystId) => {
    const result = await pool.query(
        'INSERT INTO analyst (analyst_id) VALUES ($1) RETURNING *',
        [analystId]
    );
    return result.rows[0];
};
const getCourseReviewsDetailed = async (courseId) => {
    const result = await pool.query(
        `SELECT e.Review, e.rating, u.name as student_name, e.enrollment_date 
         FROM enrollment e 
         JOIN user_ u ON e.student_id = u.user_id 
         WHERE e.course_id = $1 AND e.Review IS NOT NULL 
         ORDER BY e.enrollment_date DESC`,
        [courseId]
    );
    return result.rows;
};

// ==========================================
// LANDING PAGE QUERIES (PUBLIC)
// ==========================================

// Get top rated courses
const getTopCoursesByRating = async (limit = 3) => {
    const result = await pool.query(`
        SELECT 
            c.course_id,
            c.name as course_name,
            c.description,
            c.image_url,
            u.name as university_name,
            ROUND(AVG(e.rating)::NUMERIC, 1) as rating,
            COUNT(e.enrollment_id) as total_enrollments
        FROM course c
        LEFT JOIN university u ON c.university_id = u.university_id
        LEFT JOIN enrollment e ON c.course_id = e.course_id AND e.rating IS NOT NULL
        GROUP BY c.course_id, c.name, c.description, c.image_url, u.name
        ORDER BY rating DESC NULLS LAST, total_enrollments DESC
        LIMIT $1
    `, [limit]);
    return result.rows;
};

// Get top universities by course count
const getTopUniversitiesByCoursesCount = async (limit = 3) => {
    const result = await pool.query(`
        SELECT 
            u.university_id,
            u.name as university_name,
            u.country,
            COUNT(c.course_id) as course_count,
            COUNT(DISTINCT e.student_id) as total_students,
            ROUND(AVG(e.rating)::NUMERIC, 1) as avg_rating
        FROM university u
        LEFT JOIN course c ON u.university_id = c.university_id
        LEFT JOIN enrollment e ON c.course_id = e.course_id AND e.rating IS NOT NULL
        GROUP BY u.university_id, u.name, u.country
        HAVING COUNT(c.course_id) > 0
        ORDER BY course_count DESC, avg_rating DESC NULLS LAST
        LIMIT $1
    `, [limit]);
    return result.rows;
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
    getEnrollmentById,
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
    updateUniversity,
    deleteUniversity,

    // Textbook queries
    getAllTextbooks,
    getTextbookByIsbn,
    getTextbookById,
    createTextbook,
    updateTextbook,
    deleteTextbook,

    // Module & Content queries
    getModulesByCourse,
    createModule,
    getModuleContent,
    createModuleContent,
    updateModule,
    updateModuleContent,
    deleteModule,
    deleteModuleContent,
    swapModuleOrder,

    // Student Progress queries
    markContentAsComplete,
    getStudentProgress,

    // Analyst queries
    getAnalyst,
    getAvailableAnalysts,
    assignAnalystToSystem,
    getAnalystDashboardKPIs,
    getTotalRevenue,
    getRevenueByUniversity,
    getFreeVsPaidCourseStats,
    getDormantVsActiveUsers,
    getContentDropoffRate,
    getPreferredLearningMode,
    getScoreDistribution,
    getSkillLevelVsSuccess,
    getInstructorLeaderboard,
    getCourseDurationVsCompletion,
    getEnrollmentTrends,
    getStudentCompletedContent,

    // Course universities and ratings
    getCourseUniversities,
    getCourseRating,
    getCourseReviewsDetailed,
    updateStudentProfile, // This is for students, we'll add a new one for general profile
    updateUserProfile,
    updateUserPassword,

    // Landing page queries (public)
    getTopCoursesByRating,
    getTopUniversitiesByCoursesCount,
};
