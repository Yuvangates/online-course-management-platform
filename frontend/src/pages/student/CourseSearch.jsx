import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import courses from './courseData';
import '../../styles/student.css';

const CourseSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(courses);
  const [enrolled, setEnrolled] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolled(data);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setResults(courses);
    setResults(
      courses.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setSuggestions([]);
    const s = courses.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0,5);
    setSuggestions(s);
  }, [query]);

  const isRegistered = (id) => enrolled.some(e => e.id === id);

  const register = (course) => {
    if (isRegistered(course.id)) return;
    const newEnrolled = [...enrolled, { id: course.id, title: course.title, enrolledAt: new Date().toISOString(), evaluation_score: null }];
    setEnrolled(newEnrolled);
    localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolled));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!query.trim()) {
      setError('Please enter a search term');
      inputRef.current?.focus();
      return;
    }
    navigate('/student/search');
  };

  const onSelectSuggestion = (course) => {
    setQuery(course.title);
    setSuggestions([]);
    navigate(`/student/course/${course.id}`);
  };

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <form className="search-header" onSubmit={onSubmit} role="search">
          <div>
            <h1>Find Courses</h1>
            <p className="muted">Search courses by title, description or university</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Search by title or description..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-autocomplete="list"
                aria-haspopup="true"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list" role="listbox">
                  {suggestions.map(s => (
                    <li key={s.id} role="option" tabIndex={0} onClick={() => onSelectSuggestion(s)} onKeyDown={(e)=>{ if(e.key=== 'Enter') onSelectSuggestion(s)}}>
                      <strong>{s.title}</strong>
                      <div className="muted">{s.university} • {s.duration_months} mo</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {error && <div className="input-error">{error}</div>}
          </div>
        </form>

        <div className="courses-grid">
          {results.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p className="muted">{course.university} • {course.duration_months} months</p>
              <p>{course.description}</p>
              <div className="course-actions">
                <Link to={`/student/course/${course.id}`} className="btn outline">View</Link>
                <button className="btn primary" onClick={() => register(course)} disabled={isRegistered(course.id)}>
                  {isRegistered(course.id) ? 'Registered' : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CourseSearch;
