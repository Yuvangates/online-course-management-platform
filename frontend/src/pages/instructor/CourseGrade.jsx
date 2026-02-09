import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import courseService from '../../api/courseService';
import '../../styles/student/student-common.css';
import '../../styles/instructor/instructor-grade.css';

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
  const [searchQuery, setSearchQuery] = useState('');

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
        console.error('Error loading students:', err);
        setError('Unable to load student list. Please try again later.');
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
      console.error('Error saving grade:', err);
      setError('Could not save the grade. Please try again.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredStudents = students.filter((s) =>
    (s.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar role="Instructor" />
      <div className="instructor-container">
        <div
          className="course-header"
          style={course?.image_url ? { backgroundImage: `url(${course.image_url})` } : {}}
        >
          <div className="course-header-content">
            <h1>{course?.name || 'Course'}</h1>
            <p className="course-instructor" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
               Grade Students
            </p>
          </div>
        </div>

        {error && (
          <div className="alert error alert-popup">
            <span>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: '1.5rem', lineHeight: 1, cursor: 'pointer', marginLeft: '1rem', padding: 0 }}>&times;</button>
          </div>
        )}
        {message && (
          <div className="alert success alert-popup">
            <span>{message}</span>
            <button onClick={() => setMessage('')} style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: '1.5rem', lineHeight: 1, cursor: 'pointer', marginLeft: '1rem', padding: 0 }}>&times;</button>
          </div>
        )}

        {loading ? (
          <div className="empty">Loading...</div>
        ) : students.length === 0 ? (
          <div className="empty">No students enrolled in this course.</div>
        ) : (
          <div className="card grade-card">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Student Grades</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                  placeholder="Search students..."
                className="form-input"
                  style={{ width: '250px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
                <button type="button" className="btn primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
              </div>
            </div>
            <table className="grade-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Progress</th>
                  <th>Current grade</th>
                  <th>Marks (0–100)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }} className="muted">No students found matching "{searchQuery}"</td></tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.enrollment_id}>
                      <td>{s.student_name}</td>
                      <td>{s.email}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${s.progress_percentage || 0}%`, height: '100%', background: '#28a745' }}></div>
                          </div>
                          <span style={{ fontSize: '0.85em', color: '#666' }}>{Math.round(s.progress_percentage || 0)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={grades[s.enrollment_id] ?? s.evaluation_score != null ? 'font-semibold' : 'muted'}>
                          {(grades[s.enrollment_id] ?? s.evaluation_score) != null ? (grades[s.enrollment_id] ?? s.evaluation_score) : '—'}
                        </span>
                      </td>
                      <td>
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
                      <td>
                        <button type="button" className="btn primary small" onClick={() => handleSave(s.enrollment_id)}>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseGrade;
