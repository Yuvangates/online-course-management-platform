import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import courses from './courseData';
import '../../styles/student.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [enrolled, setEnrolled] = useState([]);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        setEnrolled(data);
    }, []);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) return setSuggestions([]);
        const s = courses.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0,5);
        setSuggestions(s);
    }, [query]);

    const coursesEnrolled = enrolled.length;
    const completed = enrolled.filter(e => e.evaluation_score !== null && e.evaluation_score !== undefined).length;
    const avgScore = (() => {
        const scores = enrolled.map(e => e.evaluation_score).filter(s => typeof s === 'number');
        if (!scores.length) return '--';
        return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) + '%';
    })();

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
                        <h1>Welcome back name </h1>
                        <p className="muted">Search for courses, register, and continue learning.</p>
                    </div>

                    <form className="hero-search" onSubmit={onSearch}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: 760 }}>
                          <input
                              className="search-input"
                              value={query}
                              onChange={e => setQuery(e.target.value)}
                              placeholder="Search courses, topics or universities..."
                              aria-autocomplete="list"
                              aria-haspopup="true"
                          />
                          {suggestions.length > 0 && (
                            <ul className="suggestions-list" role="listbox">
                              {suggestions.map(s => (
                                <li key={s.id} role="option" tabIndex={0} onClick={() => { setQuery(s.title); navigate(`/student/course/${s.id}`); }} onKeyDown={(e)=>{ if(e.key=== 'Enter'){ setQuery(s.title); navigate(`/student/course/${s.id}`) } }}>
                                  <strong>{s.title}</strong>
                                  <div className="muted">{s.university} • {s.duration_months} mo</div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <button className="btn primary" style={{ marginLeft: 12 }} onClick={onSearch}>Search</button>
                    </form>
                </div>

                <h2>Current Courses</h2>
                <div className="courses-grid" style={{ marginTop: '1rem' }}>
                    {enrolled.length === 0 ? (
                        <div className="empty">You are not enrolled in any courses. Browse courses to get started.</div>
                    ) : (
                        enrolled.map(e => (
                            <div key={e.id} className="course-card">
                                <h4>{e.title}</h4>
                                <p className="muted">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</p>
                                <p>Grade: {e.evaluation_score !== null && e.evaluation_score !== undefined ? `${e.evaluation_score}%` : 'Not graded yet'}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;