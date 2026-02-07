import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import courseService from '../../api/courseService';
import '../../styles/student/student-common.css';

const CourseGrade = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = parseInt(id, 10);
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (isNaN(courseId)) return;
      try {
        setLoading(true);
        const [courseRes, enrollmentsRes] = await Promise.all([
          courseService.getCourseById(courseId),
          instructorService.getCourseEnrollments(courseId),
        ]);
        setCourse(courseRes.course || courseRes);
        const list = enrollmentsRes.enrollments || enrollmentsRes;
        setStudents(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [courseId]);

  const handleGradeChange = (enrollmentId, value) => {
    const num = value === '' ? null : Math.min(100, Math.max(0, parseInt(value, 10)));
    setGrades((g) => ({ ...g, [enrollmentId]: num }));
  };

  const handleSave = async (enrollmentId) => {
    const score = grades[enrollmentId];
    if (score == null) return;
    try {
      await instructorService.updateGrade(enrollmentId, score);
      setStudents((prev) => prev.map((e) => (e.enrollment_id === enrollmentId ? { ...e, evaluation_score: score } : e)));
      setMessage('Grade saved.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save grade');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <>
      <Navbar role="Instructor" />
      <div className="student-container">
        <div className="section-header">
          <div>
            <button type="button" className="btn outline" onClick={() => navigate('/instructor/dashboard')} style={{ marginBottom: '1rem' }}>
              ← Back to dashboard
            </button>
            <h1>Grade students</h1>
            <p className="muted">{course?.name || 'Course'} – Enter marks (0–100) for each student.</p>
          </div>
        </div>

        {error && <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {message && <div className="alert success" style={{ marginBottom: '1rem' }}>{message}</div>}

        {loading ? (
          <div className="empty">Loading...</div>
        ) : students.length === 0 ? (
          <div className="empty">No students enrolled in this course.</div>
        ) : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--space-md)' }}>Student</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-md)' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-md)' }}>Current grade</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-md)' }}>Marks (0–100)</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-md)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.enrollment_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 'var(--space-md)' }}>{s.student_name}</td>
                    <td style={{ padding: 'var(--space-md)' }}>{s.email}</td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <span className={grades[s.enrollment_id] ?? s.evaluation_score != null ? 'font-semibold' : 'muted'}>
                        {(grades[s.enrollment_id] ?? s.evaluation_score) != null ? (grades[s.enrollment_id] ?? s.evaluation_score) : '—'}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0–100"
                        className="form-input"
                        style={{ width: '100px' }}
                        value={grades[s.enrollment_id] ?? ''}
                        onChange={(e) => handleGradeChange(s.enrollment_id, e.target.value)}
                      />
                    </td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      <button type="button" className="btn primary" onClick={() => handleSave(s.enrollment_id)}>
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseGrade;
