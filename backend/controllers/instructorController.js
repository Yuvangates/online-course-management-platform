const queries = require('../db/queries');
const pool = require('../config/db'); // Corrected path to the database connection pool
const bcrypt = require('bcryptjs');

/**
 * @desc    Get instructor dashboard statistics
 * @route   GET /api/instructor/dashboard
 * @access  Private (Instructor)
 */
exports.getDashboard = async (req, res) => {
    try {
        const instructorId = req.user.user_id;
        const courses = await queries.getCoursesByInstructorWithCounts(instructorId);
        const totalStudents = courses.reduce((sum, c) => sum + parseInt(c.student_count || 0, 10), 0);
        res.status(200).json({ courses, totalStudents });
    } catch (error) {
        console.error('Get instructor dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Update instructor's own profile (name, country, email)
 * @route   PUT /api/instructor/profile
 * @access  Private (Instructor)
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, country, email } = req.body;
        const userId = req.user.user_id;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required.' });
        }

        const existingUser = await queries.getUserByEmail(email);
        if (existingUser && existingUser.user_id !== userId) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        const updatedUser = await queries.updateUserProfile(userId, {
            name: name.trim(),
            country: country ? country.trim() : req.user.country,
            email: email.trim(),
        });

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Update instructor's own password
 * @route   PUT /api/instructor/profile/password
 * @access  Private (Instructor)
 */
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.user_id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
        }

        const user = await queries.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await queries.updateUserPassword(userId, newPasswordHash);

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Get all courses assigned to the logged-in instructor
 * @route   GET /api/instructor/courses
 * @access  Private (Instructor)
 */
exports.getAssignedCourses = async (req, res) => {
    try {
        const instructorId = req.user.user_id;
        const courses = await queries.getCoursesByInstructorWithCounts(instructorId);
        res.status(200).json({ courses });
    } catch (error) {
        console.error('Get assigned courses error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Get course enrollments (only for instructor's course)
 * @route   GET /api/instructor/courses/:id/enrollments
 * @access  Private (Instructor)
 */
exports.getCourseEnrollments = async (req, res) => {
    try {
        const instructorId = req.user.user_id;
        const courseId = parseInt(req.params.id, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const assigned = await queries.getCoursesByInstructor(instructorId);
        const teaches = assigned.some(c => c.course_id === courseId);
        if (!teaches) {
            return res.status(403).json({ error: 'You do not teach this course' });
        }
        const enrollments = await queries.getEnrollmentsByCourse(courseId);
        res.status(200).json({ enrollments });
    } catch (error) {
        console.error('Get course enrollments error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    List modules for a course
 * @route   GET /api/instructor/courses/:id/modules
 * @access  Private (Instructor)
 */
exports.getCourseModules = async (req, res) => {
    try {
        const modules = await queries.getModulesByCourse(req.courseId);
        res.status(200).json({ modules });
    } catch (error) {
        console.error('Get course modules error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Create a module for a course
 * @route   POST /api/instructor/courses/:id/modules
 * @access  Private (Instructor)
 */
exports.createModule = async (req, res) => {
    try {
        const { module_number, name, duration_weeks } = req.body;
        if (module_number === undefined || module_number === null || !name) {
            return res.status(400).json({ error: 'module_number and name are required' });
        }
        const num = parseInt(module_number, 10);
        if (isNaN(num) || num < 1) return res.status(400).json({ error: 'module_number must be a positive integer' });
        const module = await queries.createModule({
            course_id: req.courseId,
            module_number: num,
            name: String(name).trim(),
            duration_weeks: duration_weeks != null ? parseInt(duration_weeks, 10) : null,
        });
        res.status(201).json({ module });
    } catch (error) {
        console.error('Create module error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Update a module
 * @route   PUT /api/instructor/courses/:id/modules/:num
 * @access  Private (Instructor)
 */
exports.updateModule = async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) return res.status(400).json({ error: 'Invalid module number' });
        const { name, duration_weeks } = req.body;
        const updated = await queries.updateModule(req.courseId, moduleNumber, {
            name: name != null ? String(name).trim() : undefined,
            duration_weeks: duration_weeks != null ? parseInt(duration_weeks, 10) : undefined,
        });
        if (!updated) return res.status(404).json({ error: 'Module not found' });
        res.status(200).json({ module: updated });
    } catch (error) {
        console.error('Update module error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Delete a module
 * @route   DELETE /api/instructor/courses/:id/modules/:num
 * @access  Private (Instructor)
 */
exports.deleteModule = async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) {
            return res.status(400).json({ error: 'Invalid module number' });
        }

        // Assuming ON DELETE CASCADE is set on foreign keys in the DB.
        const deleted = await queries.deleteModule(req.courseId, moduleNumber);

        if (!deleted) {
            return res.status(404).json({ error: 'Module not found' });
        }

        const modules = await queries.getModulesByCourse(req.courseId);
        res.status(200).json({ message: 'Module deleted successfully', modules });
    } catch (error) {
        console.error('Delete module error:', error);
        // Handle foreign key violation if cascade is not set up properly
        if (error.code === '23503') {
             return res.status(400).json({ error: 'Cannot delete module. It contains content that students have progress on.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Swap the order of two modules
 * @route   POST /api/instructor/courses/:id/modules/swap
 * @access  Private (Instructor)
 */
exports.swapModules = async (req, res) => {
    try {
        const { num1, num2 } = req.body;
        const n1 = parseInt(num1, 10);
        const n2 = parseInt(num2, 10);
        if (isNaN(n1) || isNaN(n2) || n1 < 1 || n2 < 1) {
            return res.status(400).json({ error: 'num1 and num2 must be positive integers' });
        }
        await queries.swapModuleOrder(req.courseId, n1, n2);
        const modules = await queries.getModulesByCourse(req.courseId);
        res.status(200).json({ modules });
    } catch (error) {
        console.error('Swap modules error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    List content for a module
 * @route   GET /api/instructor/courses/:id/modules/:num/content
 * @access  Private (Instructor)
 */
exports.getModuleContent = async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) return res.status(400).json({ error: 'Invalid module number' });
        const content = await queries.getModuleContent(req.courseId, moduleNumber);
        res.status(200).json({ content });
    } catch (error) {
        console.error('Get module content error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Create content for a module
 * @route   POST /api/instructor/courses/:id/modules/:num/content
 * @access  Private (Instructor)
 */
exports.createModuleContent = async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        if (isNaN(moduleNumber)) return res.status(400).json({ error: 'Invalid module number' });
        const { content_id, title, content_type, url } = req.body;
        if (content_id === undefined || content_id === null || !title) {
            return res.status(400).json({ error: 'content_id and title are required' });
        }
        const cid = parseInt(content_id, 10);
        if (isNaN(cid) || cid < 1) return res.status(400).json({ error: 'content_id must be a positive integer' });
        const validTypes = ['Video', 'Note', 'assignment'];
        const type = content_type && validTypes.includes(content_type) ? content_type : 'Note';
        const item = await queries.createModuleContent({
            course_id: req.courseId,
            module_number: moduleNumber,
            content_id: cid,
            title: String(title).trim(),
            content_type: type,
            url: url != null ? String(url).trim() : null,
        });
        res.status(201).json({ content: item });
    } catch (error) {
        console.error('Create module content error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Update content in a module
 * @route   PUT /api/instructor/courses/:id/modules/:num/content/:contentId
 * @access  Private (Instructor)
 */
exports.updateModuleContent = async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        const contentId = parseInt(req.params.contentId, 10);
        if (isNaN(moduleNumber) || isNaN(contentId)) return res.status(400).json({ error: 'Invalid parameters' });
        const { title, content_type, url } = req.body;
        const updated = await queries.updateModuleContent(req.courseId, moduleNumber, contentId, {
            title: title != null ? String(title).trim() : undefined,
            content_type: content_type != null ? content_type : undefined,
            url: url !== undefined ? (url == null ? null : String(url).trim()) : undefined,
        });
        if (!updated) return res.status(404).json({ error: 'Content not found' });
        res.status(200).json({ content: updated });
    } catch (error) {
        console.error('Update module content error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Delete content from a module
 * @route   DELETE /api/instructor/courses/:id/modules/:num/content/:contentId
 * @access  Private (Instructor)
 */
exports.deleteModuleContent = async (req, res) => {
    try {
        const moduleNumber = parseInt(req.params.num, 10);
        const contentId = parseInt(req.params.contentId, 10);
        if (isNaN(moduleNumber) || isNaN(contentId)) {
            return res.status(400).json({ error: 'Invalid module or content ID' });
        }

        // Assuming ON DELETE CASCADE is set on the student_progress foreign key
        const deleted = await queries.deleteModuleContent(req.courseId, moduleNumber, contentId);

        if (!deleted) {
            return res.status(404).json({ error: 'Content not found' });
        }

        const content = await queries.getModuleContent(req.courseId, moduleNumber);
        res.status(200).json({ message: 'Content deleted successfully', content });
    } catch (error) {
        console.error('Delete module content error:', error);
        if (error.code === '23503') { // foreign_key_violation
            return res.status(400).json({ error: 'Cannot delete content. A student has progress recorded for this item.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Swap the order of two content items in a module
 * @route   POST /api/instructor/courses/:id/modules/:num/content/swap
 * @access  Private (Instructor)
 */
exports.swapModuleContent = async (req, res) => {
    const moduleNumber = parseInt(req.params.num, 10);
    if (isNaN(moduleNumber)) {
        return res.status(400).json({ error: 'Invalid module number' });
    }

    const { contentId1, contentId2 } = req.body;
    const c1 = parseInt(contentId1, 10);
    const c2 = parseInt(contentId2, 10);

    if (isNaN(c1) || isNaN(c2) || c1 < 1 || c2 < 1 || c1 === c2) {
        return res.status(400).json({ error: 'Both content IDs must be distinct positive integers.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch the two content items to be swapped. We swap the data, not the primary key (content_id),
        // to avoid violating foreign key constraints from the student_progress table.
        const contentRes = await client.query(
            `SELECT content_id, title, content_type, url FROM module_content 
             WHERE course_id = $1 AND module_number = $2 AND content_id IN ($3, $4)`,
            [req.courseId, moduleNumber, c1, c2]
        );

        if (contentRes.rows.length !== 2) {
            throw new Error('One or both content items not found for swapping.');
        }

        const contentItem1 = contentRes.rows.find(r => r.content_id === c1);
        const contentItem2 = contentRes.rows.find(r => r.content_id === c2);

        // Update the first item with the second item's data
        await client.query(
            `UPDATE module_content SET title = $1, content_type = $2, url = $3 
             WHERE course_id = $4 AND module_number = $5 AND content_id = $6`,
            [contentItem2.title, contentItem2.content_type, contentItem2.url, req.courseId, moduleNumber, c1]
        );

        // Update the second item with the first item's data
        await client.query(
            `UPDATE module_content SET title = $1, content_type = $2, url = $3 
             WHERE course_id = $4 AND module_number = $5 AND content_id = $6`,
            [contentItem1.title, contentItem1.content_type, contentItem1.url, req.courseId, moduleNumber, c2]
        );

        await client.query('COMMIT');
        const content = await queries.getModuleContent(req.courseId, moduleNumber);
        res.status(200).json({ content });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message || 'Failed to reorder content.' });
    } finally {
        client.release();
    }
};

/**
 * @desc    Update evaluation score for an enrollment
 * @route   PUT /api/instructor/enrollments/:id/grade
 * @access  Private (Instructor)
 */
exports.updateEnrollmentGrade = async (req, res) => {
    try {
        const enrollmentId = parseInt(req.params.id, 10);
        let { evaluation_score } = req.body;
        if (isNaN(enrollmentId)) {
            return res.status(400).json({ error: 'Invalid enrollment ID' });
        }
        if (evaluation_score === undefined || evaluation_score === null || evaluation_score === '') {
            return res.status(400).json({ error: 'evaluation_score (0-100) is required' });
        }
        const score = parseInt(evaluation_score, 10);
        if (isNaN(score) || score < 0 || score > 100) {
            return res.status(400).json({ error: 'evaluation_score must be between 0 and 100' });
        }

        // Security check: Ensure instructor teaches the course for this enrollment
        const enrollment = await queries.getEnrollmentById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }
        const assignedCourses = await queries.getCoursesByInstructor(req.user.user_id);
        if (!assignedCourses.some(c => c.course_id === enrollment.course_id)) {
            return res.status(403).json({ error: 'You are not authorized to grade this enrollment' });
        }

        await queries.updateEnrollmentScore(enrollmentId, score);
        res.status(200).json({ message: 'Grade updated', evaluation_score: score });
    } catch (error) {
        console.error('Update enrollment grade error:', error);
        res.status(500).json({ error: error.message });
    }
};