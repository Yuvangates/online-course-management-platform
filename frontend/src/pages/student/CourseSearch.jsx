import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Sidebar';
import courseService from '../../api/courseService';
import '../../styles/student/course-search.css';

const CourseSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load all courses and enrolled courses on mount
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [coursesRes, enrolledRes] = await Promise.all([
          courseService.getAllCourses(),
          courseService.getEnrolledCourses()
        ]);
        setAllCourses(coursesRes.courses || []);
        setResults(coursesRes.courses || []);
        setEnrolledIds((enrolledRes.enrollments || []).map(e => Number(e.course_id)));
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    init();

    // Check if there's a query parameter
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  // Update results based on query
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(allCourses);
      return;
    }
    setResults(
      allCourses.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    );
  }, [query, allCourses]);

  // Generate suggestions
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setSuggestions([]);
    const s = allCourses.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    ).slice(0, 5);
    setSuggestions(s);
  }, [query, allCourses]);

  const isEnrolled = (id) => enrolledIds.includes(Number(id));

  const enrollCourse = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
      setEnrolledIds([...enrolledIds, courseId]);
    } catch (err) {
      console.error('Enrollment error:', err);
      setError('Failed to enroll in course');
    }
  };

  const onSelectSuggestion = (course) => {
    setQuery(course.name);
    setSuggestions([]);
    navigate(`/student/course/${course.course_id}`);
  };

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="student-hero">
          <h1>Find courses</h1>
          <p className="muted">Search courses by title, code, or description</p>
          <form className="student-hero-search" onSubmit={(e) => e.preventDefault()} role="search">
            <div className="search-input-wrapper">
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Search courses, topics or subjects..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-autocomplete="list"
                aria-haspopup="true"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list" role="listbox">
                  {suggestions.map(s => (
                    <li
                      key={s.course_id}
                      role="option"
                      tabIndex={0}
                      onClick={() => onSelectSuggestion(s)}
                      onKeyDown={(e) => { if (e.key === 'Enter') onSelectSuggestion(s); }}
                    >
                      <strong>{s.name}</strong>
                      <div className="muted">{s.duration} weeks</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="btn primary search-action-btn" type="submit">Search</button>
          </form>
          {error && <div className="input-error">{error}</div>}
        </div>

        {loading ? (
          <div className="empty-state">Loading courses...</div>
        ) : (
          <div className="student-courses-grid">
            {results.length === 0 ? (
              <div className="empty-state">No courses found matching "{query}".</div>
            ) : (
              results.map(course => (
                <div key={course.course_id} className="student-course-card">
                  <h3>{course.name}</h3>
                  {course.university_name && (
                    <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🏛️</span> {course.university_name}
                    </div>
                  )}
                  <div className="meta">
                    <span>⏱ {course.duration} weeks</span>
                    <span>
                      ⭐ {Number(course.average_rating || 0).toFixed(1)} ({parseInt(course.total_ratings || 0, 10)})
                    </span>
                  </div>
                  {course.description && (
                    <p className="muted" style={{ flexGrow: 1, marginBottom: '1rem' }}>
                      {course.description}
                    </p>
                  )}
                  <div className="card-actions">
                    {isEnrolled(course.course_id) ? (
                      <Link to={`/student/course/${course.course_id}`} className="btn primary">Resume learning</Link>
                    ) : (
                      <Link to={`/student/course/${course.course_id}`} className="btn outline">View</Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CourseSearch;
