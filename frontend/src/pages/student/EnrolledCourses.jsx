import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import courseService from '../../api/courseService';
import '../../styles/student/enrolled-courses.css';

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
                <div className="enrolled-header">
                    <div>
                        <h1>My Courses</h1>
                        <p className="subtitle">All courses you are currently enrolled in.</p>
                    </div>
                </div>

                {error && <div className="alert error">{error}</div>}

                <div className="enrolled-courses-grid" style={{ marginTop: '2rem' }}>
                    {loading ? (
                        <div className="empty-state">
                            <p>Loading courses...</p>
                        </div>
                    ) : enrolledCourses.length === 0 ? (
                        <div className="empty-state">
                            <p>📚 You are not enrolled in any courses yet.</p>
                            <a href="/student/search" className="btn primary">Browse Courses</a>
                        </div>
                    ) : (
                        enrolledCourses.map(enrollment => (
                            <div key={enrollment.enrollment_id} className="enrolled-course-card">
                                <div className="card-header">
                                    <h3>{enrollment.course_name}</h3>
                                    {enrollment.evaluation_score && (
                                        <span className="score-badge">{enrollment.evaluation_score}%</span>
                                    )}
                                </div>
                                <div className="card-details">
                                    <p className="enrollment-date">
                                        📅 Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                    </p>
                                    {enrollment.evaluation_score && (
                                        <p className="grade">
                                            ✓ Completed: {enrollment.evaluation_score}%
                                        </p>
                                    )}
                                    {!enrollment.evaluation_score && (
                                        <p className="in-progress">
                                            ⏳ In Progress
                                        </p>
                                    )}
                                    {enrollment.Last_access && (
                                        <p className="last-access">
                                            👁️ Last accessed: {new Date(enrollment.Last_access).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <button
                                    className="btn outline"
                                    onClick={() => navigate(`/student/course/${enrollment.course_id}`)}
                                    style={{ marginTop: 'auto' }}
                                >
                                    Continue Learning →
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