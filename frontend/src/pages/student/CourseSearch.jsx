import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
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
        setEnrolledIds((enrolledRes.enrollments || []).map(e => e.course_id));
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

  const isEnrolled = (id) => enrolledIds.includes(id);

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
        <form className="search-header" onSubmit={(e) => e.preventDefault()} role="search">
          <div>
            <h1>Find Courses</h1>
            <p className="muted">Search courses by title, code or description</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Search by title or code..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-autocomplete="list"
                aria-haspopup="true"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list" role="listbox">
                  {suggestions.map(s => (
                    <li key={s.course_id} role="option" tabIndex={0} onClick={() => onSelectSuggestion(s)} onKeyDown={(e) => { if (e.key === 'Enter') onSelectSuggestion(s) }}>
                      <strong>{s.name}</strong>
                      <div className="muted">{s.duration} weeks</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {error && <div className="input-error">{error}</div>}
          </div>
        </form>

        {loading ? (
          <div className="empty">Loading courses...</div>
        ) : (
          <div className="courses-grid">
            {results.length === 0 ? (
              <div className="empty">No courses found matching "{query}". Try searching with different keywords.</div>
            ) : (
              results.map(course => (
                <div key={course.course_id} className="course-card">
                  <h3>{course.name}</h3>
                  <p>{course.description?.substring(0, 100)}...</p>
                  <p className="muted">Duration: {course.duration} weeks</p>
                  {course.university_name && <p className="muted">🏫 {course.university_name}</p>}
                  {course.average_rating && (
                    <p className="muted">⭐ {parseFloat(course.average_rating).toFixed(1)}/5 ({parseInt(course.total_ratings) || 0} ratings)</p>
                  )}
                  <div className="course-actions">
                    <Link to={`/student/course/${course.course_id}`} className="btn outline">View</Link>
                    <button
                      className="btn primary"
                      onClick={() => enrollCourse(course.course_id)}
                      disabled={isEnrolled(course.course_id)}
                    >
                      {isEnrolled(course.course_id) ? 'Enrolled' : 'Enroll'}
                    </button>
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
