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

    // Generate suggestions from search query
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) return setSuggestions([]);
        const s = allCourses.filter(c => 
            c.title.toLowerCase().includes(q) || 
            c.description.toLowerCase().includes(q)
        ).slice(0, 5);
        setSuggestions(s);
    }, [query, allCourses]);

    const coursesEnrolled = enrolledCourses.length;
    const completed = enrolledCourses.filter(e => e.completion_status === 'Completed').length;
    const inProgress = enrolledCourses.filter(e => e.completion_status === 'In Progress').length;

    const onSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        navigate('/student/search' + (q ? `?q=${encodeURIComponent(q)}` : ''));
    };

    return (
        <>
            <Navbar role="Student" />

            <div className="student-container">
                <div className="dashboard-hero">
                    <div className="hero-text">
                        <h1>Welcome back, {user?.name || 'Student'}!</h1>
                        <p className="muted">Search for courses, register, and continue learning.</p>
                    </div>

                    <form className="hero-search" onSubmit={onSearch}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: 760 }}>
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
                                    key={s.id} 
                                    role="option" 
                                    tabIndex={0} 
                                    onClick={() => { setQuery(s.title); navigate(`/student/course/${s.id}`); }} 
                                    onKeyDown={(e)=>{ if(e.key=== 'Enter'){ navigate(`/student/course/${s.id}`) } }}
                                >
                                  <strong>{s.title}</strong>
                                  <div className="muted">{s.code} • {s.duration_weeks} weeks</div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <button className="btn primary" style={{ marginLeft: 12 }} onClick={onSearch}>Search</button>
                    </form>
                </div>

                {error && <div style={{ color: '#c62828', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>{coursesEnrolled}</h3>
                        <p>Courses Enrolled</p>
                    </div>
                    <div className="stat-card">
                        <h3>{inProgress}</h3>
                        <p>In Progress</p>
                    </div>
                    <div className="stat-card">
                        <h3>{completed}</h3>
                        <p>Completed</p>
                    </div>
                </div>

                <h2>Current Courses</h2>
                <div className="courses-grid" style={{ marginTop: '1rem' }}>
                    {loading ? (
                        <div className="empty">Loading courses...</div>
                    ) : enrolledCourses.length === 0 ? (
                        <div className="empty">You are not enrolled in any courses. <a href="/student/search">Browse courses</a> to get started.</div>
                    ) : (
                        enrolledCourses.map(enrollment => (
                            <div key={enrollment.id} className="course-card">
                                <h4>{enrollment.course_title || enrollment.title}</h4>
                                <p className="muted">Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {enrollment.completion_status}</p>
                                <p><strong>Progress:</strong> {enrollment.percentage_completed || 0}%</p>
                                <p>Grade: {enrollment.grade ? `${enrollment.grade}` : 'Not graded yet'}</p>
                                <button 
                                    className="btn outline" 
                                    onClick={() => navigate(`/student/course/${enrollment.course_id}`)}
                                    style={{ marginTop: '1rem' }}
                                >
                                    View Course
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;