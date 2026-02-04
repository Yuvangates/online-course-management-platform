import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import courses from './courseData';
import '../../styles/student.css';

const EnrolledCourses = () => {
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolled(data);
  }, []);

  const getCourse = (id) => courses.find(c => c.id === id) || { title: 'Unknown' };

  const assignRandomGrades = () => {
    const updated = enrolled.map(e => ({ ...e, evaluation_score: e.evaluation_score ?? Math.floor(Math.random() * 41) + 60 }));
    setEnrolled(updated);
    localStorage.setItem('enrolledCourses', JSON.stringify(updated));
  };

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="enrolled-header">
          <h1>My Courses</h1>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn primary" onClick={assignRandomGrades}>Grades</button>
          </div>
        </div>

        {enrolled.length === 0 ? (
          <div className="empty">You are not enrolled in any courses yet.</div>
        ) : (
          <div className="enrolled-grid">
            {enrolled.map(e => (
              <div key={e.id} className="enrolled-card">
                <h3>{getCourse(e.id).title}</h3>
                <p className="muted">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</p>
                <p>Grade: {e.evaluation_score !== null ? `${e.evaluation_score}%` : 'Not graded yet'}</p>
                <div className="course-actions">
                  <Link to={`/student/course/${e.id}`} className="btn outline">View</Link>
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
