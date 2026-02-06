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
  const [instructors, setInstructors] = useState([]);
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
        // Refactored to use a single, more efficient endpoint for all course details
        const [detailsRes, enrolledRes] = await Promise.all([
          courseService.getCourseDetails(courseId), // Assumes a service method for the /:id/details route
          courseService.getEnrolledCourses()
        ]);
        setCourse(detailsRes.course);
        setModules(detailsRes.modules || []);
        setInstructors(detailsRes.instructors || []);
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

  const isEnrolled = course && enrolledIds.includes(course.course_id);

  const handleEnroll = async () => {
    if (!course) return;
    try {
      setEnrolling(true);
      await courseService.enrollCourse(course.course_id);
      setEnrolledIds([...enrolledIds, course.course_id]);
    } catch (err) {
      console.error('Enrollment error:', err);
      setError('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = async (moduleNumber) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber]
    }));

    // Load content if not already loaded
    if (!moduleContents[moduleNumber] && !loadingContent[moduleNumber]) {
      try {
        setLoadingContent(prev => ({
          ...prev,
          [moduleNumber]: true
        }));
        // The backend query expects both courseId and moduleNumber
        const contentRes = await courseService.getModuleContent(courseId, moduleNumber);
        // Robustly handle response: check if it's { content: [...] } or just the array [...]
        const content = contentRes.content || (Array.isArray(contentRes) ? contentRes : []);
        setModuleContents(prev => ({
          ...prev,
          [moduleNumber]: content
        }));
      } catch (err) {
        console.error('Error loading module content:', err);
        setModuleContents(prev => ({
          ...prev,
          [moduleNumber]: []
        }));
      } finally {
        setLoadingContent(prev => ({
          ...prev,
          [moduleNumber]: false
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
            <h1>{course.name}</h1>
            {instructors.length > 0 && (
              <p className="course-instructor" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Instructor(s): {instructors.map(i => i.name).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* COURSE INFO GRID */}
        <div className="course-info-grid">
          <div className="info-card">
            <span className="info-label">Duration</span>
            <span className="info-value">{course.duration} weeks</span>
          </div>
        </div>

        {/* COURSE DESCRIPTION */}
        <div className="course-description">
          <h3>About This Course</h3>
          <p>{course.description}</p>
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
                  <div key={module.module_number} className="module-card">
                    <div 
                      className="module-header"
                      onClick={() => toggleModule(module.module_number)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && toggleModule(module.module_number)}
                    >
                      <div className="module-title-section">
                        <span className="module-toggle">
                          {expandedModules[module.module_number] ? '▼' : '▶'}
                        </span>
                        <h4>Module {module.module_number}: {module.name}</h4>
                      </div>
                      <p className="module-description" style={{ marginTop: 0 }}>{module.description}</p>
                    </div>
 
                    {/* MODULE CONTENT - EXPANDABLE */}
                    {expandedModules[module.module_number] && (
                      <div className="module-content">
                        {loadingContent[module.module_number] ? (
                          <div className="content-loading">
                            <div className="spinner-small"></div>
                            <p>Loading content...</p>
                          </div>
                        ) : moduleContents[module.module_number] && moduleContents[module.module_number].length > 0 ? (
                          <div className="content-list">
                            {moduleContents[module.module_number].map((content, idx) => (
                              <div key={idx} className="content-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <span style={{ fontWeight: '600' }}>{content.title}</span>
                                  <span style={{ fontSize: '0.85em', color: '#666', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                                    {content.content_type || content.type}
                                  </span>
                                </div>
                                {content.url && (
                                  <a href={content.url} target="_blank" rel="noopener noreferrer" className="btn outline btn-small" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
                                    Open Link
                                  </a>
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
