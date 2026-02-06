import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import courseService from '../../api/courseService';
import '../../styles/student/student-dashboard.css'; // Re-use styles

const EnrolledCourses = () => {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const enrolledRes = await courseService.getEnrolledCourses();
                setEnrolledCourses(enrolledRes.enrollments || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load enrolled courses');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar role="Student" />
            <div className="student-container">
                <h1>My Courses</h1>
                <p className="muted">All courses you are currently enrolled in.</p>
                
                {error && <div style={{ color: '#c62828', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

                <div className="courses-grid" style={{ marginTop: '2rem' }}>
                    {loading ? (
                        <div className="empty">Loading courses...</div>
                    ) : enrolledCourses.length === 0 ? (
                        <div className="empty">You are not enrolled in any courses. <a href="/student/search">Browse courses</a> to get started.</div>
                    ) : (
                        enrolledCourses.map(enrollment => (
                            <div key={enrollment.enrollment_id} className="course-card">
                                <h4>{enrollment.course_name}</h4>
                                <p className="muted">Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</p>
                                <p>Grade: {enrollment.evaluation_score ? `${enrollment.evaluation_score}` : 'Not graded yet'}</p>
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

export default EnrolledCourses;