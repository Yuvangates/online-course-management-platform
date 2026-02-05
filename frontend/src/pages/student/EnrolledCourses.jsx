import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import courseService from '../../api/courseService';
import '../../styles/student/enrolled-courses.css';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getEnrolledCourses();
        setEnrolledCourses(response.enrollments || []);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#4caf50';
    if (percentage >= 50) return '#ff9800';
    if (percentage >= 25) return '#2196f3';
    return '#f44336';
  };

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="enrolled-header">
          <h1>My Courses</h1>
          <p className="muted">Track your progress and continue learning</p>
        </div>

        {error && <div style={{ color: '#c62828', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <div className="empty">Loading enrolled courses...</div>
        ) : enrolledCourses.length === 0 ? (
          <div className="empty">You are not enrolled in any courses yet. <Link to="/student/search">Browse courses</Link> to enroll.</div>
        ) : (
          <div className="enrolled-grid">
            {enrolledCourses.map(enrollment => (
              <div key={enrollment.id} className="enrolled-card">
                <h3>{enrollment.course_title || enrollment.title}</h3>
                <p className="muted">{enrollment.course_code || 'Course'}</p>
                <p className="muted">Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</p>
                
                <div style={{ marginTop: '1rem' }}>
                  <p><strong>Status:</strong> {enrollment.completion_status}</p>
                  <p><strong>Progress:</strong> {enrollment.percentage_completed || 0}%</p>
                  
                  {/* Progress bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    marginTop: '0.5rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${enrollment.percentage_completed || 0}%`,
                      height: '100%',
                      backgroundColor: getProgressColor(enrollment.percentage_completed || 0),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <p style={{ marginTop: '1rem' }}>
                  <strong>Grade:</strong> {enrollment.grade ? `${enrollment.grade}` : 'Not graded yet'}
                </p>
                
                <div className="course-actions" style={{ marginTop: '1rem' }}>
                  <Link to={`/student/course/${enrollment.course_id}`} className="btn outline">View Course</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EnrolledCourses;
