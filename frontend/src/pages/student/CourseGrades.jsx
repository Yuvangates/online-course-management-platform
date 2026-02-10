import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import courseService from '../../api/courseService';
import '../../styles/student/student-grades.css';

const CourseGrades = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressByCourse, setProgressByCourse] = useState({});

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const res = await courseService.getEnrolledCourses();
        const enrollmentList = res.enrollments || [];
        setEnrollments(enrollmentList);

        if (enrollmentList.length === 0) {
          setProgressByCourse({});
          return;
        }

        const progressEntries = await Promise.all(
          enrollmentList.map(async (enrollment) => {
            const courseId = Number(enrollment.course_id);
            if (!Number.isFinite(courseId)) {
              return [enrollment.course_id, 0];
            }

            try {
              const progressRes = await courseService.getStudentProgress(courseId);
              return [courseId, Math.round(progressRes.progress || 0)];
            } catch (progressError) {
              console.error('Failed to load progress for course', courseId, progressError);
              return [courseId, 0];
            }
          })
        );

        setProgressByCourse(Object.fromEntries(progressEntries));
      } catch (err) {
        console.error('Failed to load grades', err);
        setError('Failed to load grades. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getStatus = (enrollment) => {
    if (enrollment.evaluation_score !== null && enrollment.evaluation_score !== undefined) {
      return { label: 'Graded', className: 'status-tag status-graded' };
    }

    const courseId = Number(enrollment.course_id);
    const progress = Number.isFinite(courseId) ? progressByCourse[courseId] || 0 : 0;
    if (progress >= 100) {
      return { label: 'Not graded', className: 'status-tag status-not-graded' };
    }

    return { label: 'Complete the course to get grade', className: 'status-tag status-incomplete' };
  };

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="grades-page">
          <div className="grades-header">
            <h1>Course Grades</h1>
            <p className="muted">View your evaluation scores for completed courses.</p>
          </div>

          {error && <div className="alert error">{error}</div>}

          {loading ? (
            <div className="grades-card">
              <p>Loading grades...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="grades-card">
              <p>No enrollments yet.</p>
            </div>
          ) : (
            <div className="grades-card">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => {
                    const score = enrollment.evaluation_score;
                    const status = getStatus(enrollment);
                    return (
                      <tr key={enrollment.enrollment_id || enrollment.course_id}>
                        <td>{enrollment.course_name || enrollment.name}</td>
                        <td>{score !== null && score !== undefined ? Math.round(score) : '-'}</td>
                        <td>
                          <span className={status.className}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseGrades;
