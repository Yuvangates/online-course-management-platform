import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import '../../styles/instructor/instructor-dashboard.css';

const AssignedCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await instructorService.getAssignedCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load courses');
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
          <h1>Assigned courses</h1>
          <p className="muted">View your courses. Edit modules and content, or grade students.</p>
        </div>

        {error && (
          <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>
        )}

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
                  <div className="meta">
                    <span>{course.duration} weeks</span>
                    <span>{studentCount} students</span>
                    <span>{moduleCount} modules</span>
                  </div>
                  {course.description && (
                    <p className="muted" style={{ flexGrow: 1, marginBottom: '1rem' }}>{course.description}</p>
                  )}
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-instructor outline"
                      onClick={() => navigate(`/instructor/course/${course.course_id}/modules`)}
                    >
                      Edit modules
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

export default AssignedCourses;
