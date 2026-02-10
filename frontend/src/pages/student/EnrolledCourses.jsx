import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Sidebar';
import courseService from '../../api/courseService';
import '../../styles/student/enrolled-courses.css';

const EnrolledCourses = () => {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseLookup, setCourseLookup] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progressByCourse, setProgressByCourse] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [enrolledRes, coursesRes] = await Promise.all([
                    courseService.getEnrolledCourses(),
                    courseService.getAllCourses()
                ]);
                const lookup = (coursesRes.courses || []).reduce((acc, course) => {
                    acc[Number(course.course_id)] = course;
                    return acc;
                }, {});
                setCourseLookup(lookup);
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

    return (
        <>
            <Navbar role="Student" />
            <div className="student-container">
                <div className="student-hero">
                    <h1>My courses</h1>
                    <p className="muted">All courses you are currently enrolled in.</p>
                </div>

                {error && <div className="alert error">{error}</div>}

                {loading ? (
                    <div className="empty-state">Loading courses...</div>
                ) : enrolledCourses.length === 0 ? (
                    <div className="empty-state">You are not enrolled in any courses yet.</div>
                ) : (
                    <div className="student-courses-grid">
                        {enrolledCourses.map(enrollment => {
                            const enrolledDate = enrollment.enrollment_date
                                ? new Date(enrollment.enrollment_date).toLocaleDateString()
                                : 'Not available';
                            const lastAccess = enrollment.Last_access
                                ? new Date(enrollment.Last_access).toLocaleDateString()
                                : null;
                            const score = enrollment.evaluation_score;
                            const progress = progressByCourse[Number(enrollment.course_id)] ?? 0;
                            const courseInfo = courseLookup[Number(enrollment.course_id)] || {};

                            return (
                                <div key={enrollment.enrollment_id} className="student-course-card">
                                    <h3>{enrollment.course_name}</h3>
                                    <div className="meta">
                                        <span>📅 Enrolled {enrolledDate}</span>
                                        {courseInfo.average_rating && courseInfo.total_ratings && (
                                            <span>⭐ {parseFloat(courseInfo.average_rating).toFixed(1)} ({parseInt(courseInfo.total_ratings, 10)})</span>
                                        )}
                                        {score !== null && score !== undefined ? (
                                            <span>✅ Grade {score}</span>
                                        ) : (
                                            <span>📈 Progress {progress}%</span>
                                        )}
                                        {lastAccess && <span>👁️ Last access {lastAccess}</span>}
                                    </div>
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
            </div>
        </>
    );
};

export default EnrolledCourses;