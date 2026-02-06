import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import courseService from '../../api/courseService';
import '../../styles/student/course-view.css';

const CourseView = () => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleContents, setModuleContents] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState({});
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, modulesRes, enrolledRes] = await Promise.all([
          courseService.getCourseById(courseId),
          courseService.getCourseModules(courseId),
          courseService.getEnrolledCourses()
        ]);
        setCourse(courseRes.course);
        setModules(modulesRes.modules || []);
        setEnrolledIds((enrolledRes.enrollments || []).map(e => e.course_id));
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const isEnrolled = course && enrolledIds.includes(course.id);

  const handleEnroll = async () => {
    if (!course) return;
    try {
      setEnrolling(true);
      await courseService.enrollCourse(course.id);
      setEnrolledIds([...enrolledIds, course.id]);
    } catch (err) {
      console.error('Enrollment error:', err);
      setError('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = async (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));

    // Load content if not already loaded
    if (!moduleContents[moduleId] && !loadingContent[moduleId]) {
      try {
        setLoadingContent(prev => ({
          ...prev,
          [moduleId]: true
        }));
        const contentRes = await courseService.getModuleContent(moduleId);
        setModuleContents(prev => ({
          ...prev,
          [moduleId]: contentRes.content || []
        }));
      } catch (err) {
        console.error('Error loading module content:', err);
        setModuleContents(prev => ({
          ...prev,
          [moduleId]: []
        }));
      } finally {
        setLoadingContent(prev => ({
          ...prev,
          [moduleId]: false
        }));
      }
    }
  };

  if (loading) return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    </>
  );

  if (!course) return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="course-not-found">
          <h2>Course Not Found</h2>
          <p>This course is no longer available.</p>
          <Link to="/student/search" className="btn primary">Back to Search</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        {/* COURSE HEADER SECTION */}
        <div className="course-header">
          <div className="course-header-content">
            <h1>{course.title}</h1>
            <p className="course-code">{course.code}</p>
            {course.instructor_name && (
              <p className="course-instructor">👨‍🏫 Instructor: {course.instructor_name}</p>
            )}
          </div>
          <div className="course-header-badge">
            <span className="level-badge">{course.level} Level</span>
          </div>
        </div>

        {/* COURSE INFO GRID */}
        <div className="course-info-grid">
          <div className="info-card">
            <span className="info-label">Duration</span>
            <span className="info-value">{course.duration_weeks} weeks</span>
          </div>
          <div className="info-card">
            <span className="info-label">Credits</span>
            <span className="info-value">{course.credits || 'N/A'}</span>
          </div>
          {course.start_date && (
            <div className="info-card">
              <span className="info-label">Start Date</span>
              <span className="info-value">{new Date(course.start_date).toLocaleDateString()}</span>
            </div>
          )}
          {course.end_date && (
            <div className="info-card">
              <span className="info-label">End Date</span>
              <span className="info-value">{new Date(course.end_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* COURSE DESCRIPTION */}
        <div className="course-description">
          <h3>About This Course</h3>
          <p>{course.description}</p>
          {course.prerequisites && (
            <div className="prerequisites">
              <h4>Prerequisites</h4>
              <p>{course.prerequisites}</p>
            </div>
          )}
          {course.learning_objectives && (
            <div className="learning-objectives">
              <h4>Learning Objectives</h4>
              <p>{course.learning_objectives}</p>
            </div>
          )}
        </div>

        {/* COURSE ACTIONS */}
        {!isEnrolled && (
          <div className="course-actions">
            <Link to="/student/search" className="btn outline">Back to Courses</Link>
            <button 
              className="btn primary" 
              onClick={handleEnroll} 
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll in This Course'}
            </button>
          </div>
        )}

        {/* MODULES SECTION - ONLY VISIBLE IF ENROLLED */}
        {isEnrolled ? (
          <>
            <div className="modules-divider">
              <h2>Course Modules & Content</h2>
              <p className="section-subtitle">You are enrolled in this course. Explore the modules below.</p>
            </div>

            {modules.length > 0 ? (
              <div className="modules-list">
                {modules.map((module) => (
                  <div key={module.id} className="module-card">
                    <div 
                      className="module-header"
                      onClick={() => toggleModule(module.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && toggleModule(module.id)}
                    >
                      <div className="module-title-section">
                        <span className="module-toggle">
                          {expandedModules[module.id] ? '▼' : '▶'}
                        </span>
                        <h4>Module {module.module_number}: {module.title}</h4>
                      </div>
                      <div className="module-info-mini">
                        <span className="module-duration">⏱️ {module.duration_hours}h</span>
                      </div>
                    </div>

                    <p className="module-description">{module.description}</p>

                    {/* MODULE CONTENT - EXPANDABLE */}
                    {expandedModules[module.id] && (
                      <div className="module-content">
                        {loadingContent[module.id] ? (
                          <div className="content-loading">
                            <div className="spinner-small"></div>
                            <p>Loading content...</p>
                          </div>
                        ) : moduleContents[module.id] && moduleContents[module.id].length > 0 ? (
                          <div className="content-list">
                            {moduleContents[module.id].map((content, idx) => (
                              <div key={idx} className="content-item">
                                <span className="content-icon">
                                  {content.type === 'video' && '🎥'}
                                  {content.type === 'pdf' && '📄'}
                                  {content.type === 'quiz' && '📝'}
                                  {content.type === 'assignment' && '✏️'}
                                  {content.type === 'resource' && '📚'}
                                  {!['video', 'pdf', 'quiz', 'assignment', 'resource'].includes(content.type) && '📌'}
                                </span>
                                <div className="content-details">
                                  <p className="content-title">{content.title}</p>
                                  {content.description && (
                                    <p className="content-desc">{content.description}</p>
                                  )}
                                  {content.duration && (
                                    <span className="content-duration">{content.duration}</span>
                                  )}
                                </div>
                                {content.type === 'quiz' && (
                                  <span className="content-status">Quiz</span>
                                )}
                                {content.type === 'assignment' && (
                                  <span className="content-status">Assignment</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-content">
                            <p>No content available for this module yet.</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="module-footer">
                      <button 
                        className="btn outline btn-small"
                        onClick={() => toggleModule(module.id)}
                      >
                        {expandedModules[module.id] ? 'Hide Content' : 'View Content'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-modules">
                <p>📚 No modules available for this course yet.</p>
                <p className="text-secondary">The instructor will add course content soon.</p>
              </div>
            )}

            {/* ENROLL BUTTON WHEN ENROLLED */}
            <div className="course-actions enrolled">
              <Link to="/student/enrolled" className="btn outline">Back to My Courses</Link>
              <span className="enrolled-badge">✓ Enrolled</span>
            </div>
          </>
        ) : (
          // WHEN NOT ENROLLED - SHOW PREVIEW MESSAGE
          <div className="preview-message">
            <p>👁️ You are viewing a preview of this course. Enroll to access modules and content.</p>
          </div>
        )}

        {error && (
          <div className="alert error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseView;
