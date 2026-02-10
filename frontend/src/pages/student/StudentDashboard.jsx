import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import courseService from '../../api/courseService';
import '../../styles/student/student-dashboard.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progressByCourse, setProgressByCourse] = useState({});

    // Fetch enrolled courses and all courses on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [enrolledRes, allCoursesRes] = await Promise.all([
                    courseService.getEnrolledCourses(),
                    courseService.getAllCourses()
                ]);
                setEnrolledCourses(enrolledRes.enrollments || []);
                setAllCourses(allCoursesRes.courses || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const loadProgress = async () => {
            if (!enrolledCourses.length) {
                setProgressByCourse({});
                return;
            }

            try {
                const progressEntries = await Promise.all(
                    enrolledCourses.map(async (enrollment) => {
                        const courseId = Number(enrollment.course_id);
                        try {
                            const res = await courseService.getStudentProgress(courseId);
                            return [courseId, Math.round(res.progress || 0)];
                        } catch (err) {
                            console.error('Error loading progress for course', courseId, err);
                            return [courseId, 0];
                        }
                    })
                );
                setProgressByCourse(Object.fromEntries(progressEntries));
            } catch (err) {
                console.error('Error loading progress:', err);
            }
        };

        loadProgress();
    }, [enrolledCourses]);

    // Generate suggestions from search query
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) return setSuggestions([]);
        const s = allCourses.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        ).slice(0, 5);
        setSuggestions(s);
    }, [query, allCourses]);

    const coursesEnrolled = enrolledCourses.length;
    const courseLookup = new Map(allCourses.map(course => [Number(course.course_id), course]));
    const popularCourses = [...allCourses]
        .filter(course => course.average_rating)
        .sort((a, b) => Number(b.average_rating) - Number(a.average_rating))
        .slice(0, 6);

    const onSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        navigate('/student/search' + (q ? `?q=${encodeURIComponent(q)}` : ''));
    };

    return (
        <>
            <Navbar role="Student" />

            <div className="student-container">
                <div className="student-hero">
                    <h1>Welcome, {user?.name || 'Student'}!</h1>
                    <p className="muted">Search for courses, register, and continue learning.</p>

                    <form className="student-hero-search" onSubmit={onSearch}>
                        <div className="search-input-wrapper">
                          <input
                              className="search-input"
                              value={query}
                              onChange={e => setQuery(e.target.value)}
                              placeholder="Search courses, topics or subjects..."
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
                                    onClick={() => { setQuery(s.name); navigate(`/student/course/${s.course_id}`); }}
                                    onKeyDown={(e)=>{ if(e.key=== 'Enter'){ navigate(`/student/course/${s.course_id}`) } }}
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
                </div>

                {error && (
                    <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>
                )}

                <div className="student-stats">
                    <div className="student-stat-card">
                        <p className="value">{coursesEnrolled}</p>
                        <p className="label">Courses enrolled</p>
                    </div>
                </div>

                <div className="student-section-title">
                    <h2>Your courses</h2>
                </div>
                <p className="student-section-subtitle">Continue learning or review your progress.</p>

                {loading ? (
                    <div className="empty-state">Loading courses...</div>
                ) : enrolledCourses.length === 0 ? (
                    <div className="empty-state">You are not enrolled in any courses.</div>
                ) : (
                    <div className="student-courses-grid">
                        {enrolledCourses.map((enrollment) => {
                            const courseInfo = courseLookup.get(Number(enrollment.course_id)) || {};
                            const enrolledDate = enrollment.enrollment_date
                                ? new Date(enrollment.enrollment_date).toLocaleDateString()
                                : 'Not available';
                            const score = enrollment.evaluation_score;
                            const progress = progressByCourse[Number(enrollment.course_id)] ?? 0;
                            const duration = courseInfo.duration ? `${courseInfo.duration} weeks` : null;
                            const universityName = courseInfo.university_name;
                            const description = courseInfo.description;

                            return (
                                <div key={enrollment.enrollment_id} className="student-course-card">
                                    <h3>{enrollment.course_name}</h3>
                                    {universityName && (
                                        <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>🏛️</span> {universityName}
                                        </div>
                                    )}
                                    <div className="meta">
                                        {duration && <span>⏱ {duration}</span>}
                                        <span>📅 Enrolled {enrolledDate}</span>
                                        {score !== null && score !== undefined ? (
                                            <span>✅ Grade {score}</span>
                                        ) : (
                                            <span>📈 Progress {progress}%</span>
                                        )}
                                    </div>
                                    {description && (
                                        <p className="muted" style={{ flexGrow: 1, marginBottom: '1rem' }}>
                                            {description}
                                        </p>
                                    )}
                                    <div className="card-actions">
                                        <button
                                            type="button"
                                            className="btn primary"
                                            onClick={() => navigate(`/student/course/${enrollment.course_id}`)}
                                        >
                                            Continue learning
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="student-section-title" style={{ marginTop: '2.5rem' }}>
                    <h2>Explore popular courses</h2>
                </div>
                <p className="student-section-subtitle">Top-rated picks to start learning today.</p>

                {loading ? (
                    <div className="empty-state">Loading popular courses...</div>
                ) : popularCourses.length === 0 ? (
                    <div className="empty-state">No popular courses available right now.</div>
                ) : (
                    <div className="student-courses-grid">
                        {popularCourses.map((course) => (
                            <div key={course.course_id} className="student-course-card">
                                <h3>{course.name}</h3>
                                {course.university_name && (
                                    <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>🏛️</span> {course.university_name}
                                    </div>
                                )}
                                <div className="meta">
                                    <span>⏱ {course.duration} weeks</span>
                                    {course.average_rating && course.total_ratings && (
                                        <span>⭐ {parseFloat(course.average_rating).toFixed(1)} ({parseInt(course.total_ratings, 10)})</span>
                                    )}
                                </div>
                                {course.description && (
                                    <p className="muted" style={{ flexGrow: 1, marginBottom: '1rem' }}>
                                        {course.description}
                                    </p>
                                )}
                                <div className="card-actions">
                                    <button
                                        type="button"
                                        className="btn outline"
                                        onClick={() => navigate(`/student/course/${course.course_id}`)}
                                    >
                                        View course
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentDashboard;