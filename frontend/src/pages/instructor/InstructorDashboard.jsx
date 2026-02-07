import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import '../../styles/instructor/instructor-dashboard.css';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await instructorService.getDashboard();
        setCourses(data.courses || []);
        setTotalStudents(data.totalStudents ?? 0);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load dashboard');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Navbar role="Instructor" />
      <div className="instructor-container">
        <div className="instructor-hero">
          <h1>Welcome, {user?.name || 'Instructor'}!</h1>
          <p className="muted">Manage your courses, add modules and content, and grade students.</p>
        </div>

        {error && (
          <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>
        )}

        <div className="instructor-stats">
          <div className="instructor-stat-card">
            <p className="value">{courses.length}</p>
            <p className="label">Courses you teach</p>
          </div>
          <div className="instructor-stat-card">
            <p className="value">{totalStudents}</p>
            <p className="label">Total students</p>
          </div>
        </div>

        <div className="instructor-section-title">
          <h2>Your courses</h2>
        </div>
        <p className="muted" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Edit modules and content, or grade students. You cannot create new courses or change enrollments.
        </p>

        {loading ? (
          <div className="empty-state">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="empty-state">You have no assigned courses.</div>
        ) : (
          <div className="instructor-courses-grid">
            {courses.map((course) => {
              const studentCount = parseInt(course.student_count ?? 0, 10);
              const moduleCount = parseInt(course.module_count ?? 0, 10);

              return (
                <div key={course.course_id} className="instructor-course-card">
                  <h3>{course.name}</h3>
                  {course.university_name && (
                    <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🏛️</span> {course.university_name}
                    </div>
                  )}
                  <div className="meta">
                    <span>⏱ {course.duration} weeks</span>
                    <span>👥 {studentCount} students</span>
                    <span>📚 {moduleCount} modules</span>
                  </div>
                  {course.other_instructors && (
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.8rem', fontStyle: 'italic' }}>
                      <span style={{ fontWeight: '600' }}>Co-instructors:</span> {course.other_instructors}
                    </div>
                  )}
                  {course.description && (
                    <p className="muted" style={{ flexGrow: 1, marginBottom: '1rem' }}>{course.description}</p>
                  )}
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-instructor outline"
                      onClick={() => navigate(`/instructor/course/${course.course_id}/modules`)}
                    >
                      Manage course
                    </button>
                    <button
                      type="button"
                      className="btn-instructor primary"
                      onClick={() => navigate(`/instructor/course/${course.course_id}/grade`)}
                    >
                      Grade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default InstructorDashboard;
