import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';
import '../../styles/admin/admin.css';

const CourseManagement = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 30,
        university_id: '',
        textbook_isbn: '',
        image_url: '',
        fee: '',
    });

    useEffect(() => {
        fetchCourses();
        fetchUniversities();
        fetchTextbooks();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getAllCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchUniversities = async () => {
        try {
            const data = await adminService.getAllUniversities();
            setUniversities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const getUniversityName = (universityId) => {
        const uni = universities.find((u) => u.university_id === universityId);
        return uni ? uni.name : 'Unknown';
    };

    const fetchTextbooks = async () => {
        try {
            const data = await adminService.getAllTextbooks();
            setTextbooks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'university_id' || name === 'duration' ? parseInt(value) : value,
        }));
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (!formData.name.trim() || !formData.university_id) {
                setError('Name and university are required');
                return;
            }

            await adminService.createCourse({
                name: formData.name,
                description: formData.description,
                duration: formData.duration,
                university_id: formData.university_id,
                textbook_isbn: formData.textbook_isbn || null,
                image_url: formData.image_url || 'default_course.jpg',
                fee: formData.fee || 0,
            });

            setFormData({
                name: '',
                description: '',
                duration: 30,
                university_id: '',
                textbook_isbn: '',
                image_url: '',
                fee: '',
            });
            setShowForm(false);
            await fetchCourses();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create course');
        }
    };

    const viewCourseDetails = (course) => {
        setSelectedCourse(course);
        setActiveTab('course-detail');
    };

    const handleDeleteCourse = async (courseId, courseName) => {
        if (!window.confirm(`Are you sure you want to delete the course "${courseName}"? This will also delete all enrollments and course-instructor associations.`)) {
            return;
        }

        try {
            setError('');
            await adminService.deleteCourse(courseId);
            await fetchCourses();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to delete course');
        }
    };

    const handleBackToCourses = () => {
        setSelectedCourse(null);
        setActiveTab('courses');
    };

    return (
        <div className="admin-section">
            {activeTab === 'courses' && (
                <>
                    <div className="section-header">
                        <h2>Course Management</h2>
                        <button
                            className="btn-primary"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancel' : 'Create Course'}
                        </button>
                    </div>

                    {error && <div className="alert error">{error}</div>}

                    {showForm && (
                        <form className="form-container" onSubmit={handleCreateCourse}>
                            <h3>Create New Course</h3>
                            <div className="form-group">
                                <label>Course Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Advanced JavaScript"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Course description..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>University *</label>
                                    <select
                                        name="university_id"
                                        value={formData.university_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select University</option>
                                        {universities.map((uni) => (
                                            <option key={uni.university_id} value={uni.university_id}>
                                                {uni.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Duration (weeks)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        min={1}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Textbook</label>
                                    <select
                                        name="textbook_isbn"
                                        value={formData.textbook_isbn}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Textbook (Optional)</option>
                                        {textbooks.map((textbook) => (
                                            <option key={textbook.isbn} value={textbook.isbn}>
                                                {textbook.name} - {textbook.author}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Fee</label>
                                    <input
                                        type="number"
                                        name="fee"
                                        value={formData.fee}
                                        onChange={handleInputChange}
                                        placeholder="Course fee amount"
                                        min={0}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleInputChange}
                                        placeholder="e.g., https://example.com/course.jpg"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">
                                Create Course
                            </button>
                        </form>
                    )}

                    {loading ? (
                        <div className="loading">Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="empty-state">No courses found</div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>University</th>
                                        <th>Duration</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.course_id}>
                                            <td>{course.name}</td>
                                            <td>{getUniversityName(course.university_id)}</td>
                                            <td>{course.duration} weeks</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <button
                                                        className="btn-link"
                                                        onClick={() => viewCourseDetails(course)}
                                                    >
                                                        Manage
                                                    </button>
                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => handleDeleteCourse(course.course_id, course.name)}
                                                        style={{ marginLeft: 'auto', marginRight: '10px' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'course-detail' && selectedCourse && (
                <CourseDetailView 
                    course={selectedCourse} 
                    onBack={handleBackToCourses} 
                    getUniversityName={getUniversityName}
                    universities={universities}
                    textbooks={textbooks}
                    onCourseUpdate={fetchCourses}
                />
            )}
        </div>
    );
};

// Course Detail View Component
const CourseDetailView = ({ course, onBack, getUniversityName, universities, textbooks, onCourseUpdate }) => {
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);
    const [allInstructors, setAllInstructors] = useState([]);
    const [error, setError] = useState('');
    const [searchInstructorQuery, setSearchInstructorQuery] = useState('');
    const [showAddInstructor, setShowAddInstructor] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: course.name,
        description: course.description || '',
        duration: course.duration,
        university_id: course.university_id,
        textbook_isbn: course.textbook_isbn || '',
        image_url: course.image_url || '',
        fee: course.fee || '',
    });

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'university_id' || name === 'duration' ? parseInt(value) : value,
        }));
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (!editFormData.name.trim() || !editFormData.university_id) {
                setError('Name and university are required');
                return;
            }

            await adminService.updateCourse(course.course_id, {
                name: editFormData.name,
                description: editFormData.description,
                duration: editFormData.duration,
                university_id: editFormData.university_id,
                textbook_isbn: editFormData.textbook_isbn || null,
                image_url: editFormData.image_url || 'default_course.jpg',
                fee: editFormData.fee || 0,
            });

            setShowEditForm(false);
            onCourseUpdate();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to update course');
        }
    };

    const fetchAllInstructors = async () => {
        try {
            const data = await adminService.getAllInstructors();
            setAllInstructors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearchInstructor = async (e) => {
        const query = e.target.value;
        setSearchInstructorQuery(query);

        if (!query.trim()) {
            const allInsts = await adminService.getAllInstructors();
            setAllInstructors(allInsts);
            return;
        }

        try {
            const results = await adminService.searchInstructors(query);
            setAllInstructors(results);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveInstructor = async (instructorId) => {
        if (!window.confirm('Remove this instructor from the course?')) return;

        try {
            setError('');
            await adminService.removeInstructorFromCourse(course.course_id, instructorId);
            // Reload course details
            const data = await adminService.getCourseDetails(course.course_id);
            setInstructors(data.instructors || []);
            setStudents(data.students || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to remove instructor');
        }
    };

    const handleRemoveStudent = async (enrollmentId) => {
        if (!window.confirm('Remove this student from the course?')) return;

        try {
            setError('');
            await adminService.removeStudentFromCourse(enrollmentId);
            // Reload course details
            const data = await adminService.getCourseDetails(course.course_id);
            setInstructors(data.instructors || []);
            setStudents(data.students || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to remove student');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setError('');
                const data = await adminService.getCourseDetails(course.course_id);
                setInstructors(data.instructors || []);
                setStudents(data.students || []);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || 'Failed to load course details');
            }
            await fetchAllInstructors();
        };
        loadData();
    }, [course.course_id]);

    const handleAssignInstructor = async (instructorId) => {
        try {
            setError('');
            await adminService.assignInstructorToCourse(course.course_id, instructorId);
            // Reload course details
            const data = await adminService.getCourseDetails(course.course_id);
            setInstructors(data.instructors || []);
            setStudents(data.students || []);
            setSearchInstructorQuery('');
            setShowAddInstructor(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to assign instructor');
        }
    };

    return (
        <div className="course-detail">
            <div className="course-header-actions">
                <button className="btn-back" onClick={onBack}>
                    ← Back to Courses
                </button>
                <button 
                    className="btn-primary-large"
                    onClick={() => setShowEditForm(!showEditForm)}
                >
                    {showEditForm ? 'Cancel' : 'Edit Course'}
                </button>
            </div>

            <h2>{course.name}</h2>
            <p className="course-meta">
                <strong>Duration:</strong> {course.duration} weeks | <strong>University:</strong> {getUniversityName(course.university_id)}
            </p>

            {error && <div className="alert error">{error}</div>}

            {/* Edit Form */}
            {showEditForm && (
                <div className="form-container">
                    <h3>Edit Course</h3>
                    <form onSubmit={handleUpdateCourse}>
                        <div className="form-group">
                            <label>Course Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditInputChange}
                                placeholder="e.g., Advanced JavaScript"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditInputChange}
                                placeholder="Course description..."
                                rows={3}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>University *</label>
                                <select
                                    name="university_id"
                                    value={editFormData.university_id}
                                    onChange={handleEditInputChange}
                                    required
                                >
                                    <option value="">Select University</option>
                                    {universities.map((uni) => (
                                        <option key={uni.university_id} value={uni.university_id}>
                                            {uni.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Duration (weeks)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={editFormData.duration}
                                    onChange={handleEditInputChange}
                                    min={1}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Textbook</label>
                                <select
                                    name="textbook_isbn"
                                    value={editFormData.textbook_isbn}
                                    onChange={handleEditInputChange}
                                >
                                    <option value="">Select Textbook (Optional)</option>
                                    {textbooks.map((textbook) => (
                                        <option key={textbook.isbn} value={textbook.isbn}>
                                            {textbook.name} - {textbook.author}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Fee</label>
                                <input
                                    type="number"
                                    name="fee"
                                    value={editFormData.fee}
                                    onChange={handleEditInputChange}
                                    placeholder="Course fee amount"
                                    min={0}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={editFormData.image_url}
                                    onChange={handleEditInputChange}
                                    placeholder="e.g., https://example.com/course.jpg"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary-large">
                            Save Changes
                        </button>
                    </form>
                </div>
            )}

            {/* Instructors Section */}
            <div className="detail-section">
                <div className="section-header">
                    <h3>Assigned Instructors ({instructors.length})</h3>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowAddInstructor(!showAddInstructor)}
                    >
                        {showAddInstructor ? 'Cancel' : 'Add Instructor'}
                    </button>
                </div>

                {showAddInstructor && (
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search instructors..."
                            value={searchInstructorQuery}
                            onChange={handleSearchInstructor}
                            className="search-input"
                        />
                        <div className="search-results">
                            {allInstructors.length === 0 ? (
                                <p className="no-results">No instructors found</p>
                            ) : (
                                allInstructors.map((instructor) => {
                                    const isAssigned = instructors.some(
                                        (i) => i.user_id === instructor.user_id
                                    );
                                    return (
                                        <div key={instructor.user_id} className="search-result-item">
                                            <div>
                                                <strong>{instructor.name}</strong>
                                                <p className="muted">{instructor.email}</p>
                                            </div>
                                            <button
                                                className={isAssigned ? 'btn-disabled' : 'btn-primary'}
                                                onClick={() => handleAssignInstructor(instructor.user_id)}
                                                disabled={isAssigned}
                                            >
                                                {isAssigned ? 'Assigned' : 'Assign'}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {instructors.length === 0 ? (
                    <p className="empty-state">No instructors assigned</p>
                ) : (
                    <div className="list-container">
                        {instructors.map((instructor) => (
                            <div key={instructor.user_id} className="list-item">
                                <div>
                                    <strong>{instructor.name}</strong>
                                    <p className="muted">{instructor.email}</p>
                                    {instructor.expertise && (
                                        <p className="expertise">Expertise: {instructor.expertise}</p>
                                    )}
                                </div>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleRemoveInstructor(instructor.user_id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Students Section */}
            <div className="detail-section">
                <h3>Enrolled Students ({students.length})</h3>

                {students.length === 0 ? (
                    <p className="empty-state">No students enrolled</p>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Enrolled Date</th>
                                    <th>Score</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.enrollment_id}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            {new Date(student.enrollment_date).toLocaleDateString()}
                                        </td>
                                        <td>{student.evaluation_score || '-'}</td>
                                        <td>
                                            <button
                                                className="btn-danger"
                                                onClick={() => handleRemoveStudent(student.enrollment_id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseManagement;
