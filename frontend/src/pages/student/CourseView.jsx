import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import courses from './courseData';
import '../../styles/student.css';

const CourseView = () => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);
  const course = courses.find(c => c.id === courseId);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolled(data);
  }, []);

  const isRegistered = course && enrolled.some(e => e.id === course.id);

  const register = () => {
    if (!course) return;
    if (isRegistered) return;
    const newEnrolled = [...enrolled, { id: course.id, title: course.title, enrolledAt: new Date().toISOString(), evaluation_score: null }];
    setEnrolled(newEnrolled);
    localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolled));
  };

  if (!course) return (
    <>
      <Navbar role="Student" />
      <div className="student-container"><h2>Course not found</h2></div>
    </>
  );

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="course-detail">
          <div>
            <h1>{course.title}</h1>
            <p className="muted">{course.university} • {course.duration_months} months</p>
            <p>{course.description}</p>
            <p className="muted">Textbook: {course.textbook}</p>
          </div>
          <div className="course-cta">
            <Link to="/student/search" className="btn outline">Back</Link>
            <button className="btn primary" onClick={register} disabled={isRegistered}>{isRegistered ? 'Registered' : 'Register'}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseView;
