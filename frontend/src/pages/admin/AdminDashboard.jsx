import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import adminService from '../../api/adminService';
import CourseManagement from './CourseManagement';
import InstructorManagement from './InstructorManagement';
import StudentManagement from './StudentManagement';
import AnalystManagement from './AnalystManagement';
import UniversityManagement from './UniversityManagement';
import TextBookManagement from './TextBookManagement';
import '../../styles/admin/admin.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        hasAnalyst: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getDashboard();
            setStats(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar role="Admin" />
            <div className="admin-container">
                <div className="admin-sidebar">
                    <nav className="admin-nav">
                        <h3>Admin Panel</h3>
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            Courses
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'instructors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('instructors')}
                        >
                            Instructors
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            Students
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'analyst' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analyst')}
                        >
                            Analyst
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'universities' ? 'active' : ''}`}
                            onClick={() => setActiveTab('universities')}
                        >
                            Universities
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'textbooks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('textbooks')}
                        >
                            TextBooks
                        </button>
                    </nav>
                </div>

                <div className="admin-content">
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-view">
                            <div className="dashboard-header">
                                <h1>System Administration</h1>
                            </div>

                            {error && <div className="alert error">{error}</div>}

                            {loading ? (
                                <div className="loading">Loading dashboard...</div>
                            ) : (
                                <>
                                    <div className="stat-grid">
                                        <div className="card">
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                                            <h3>Total Courses</h3>
                                            <p className="stat-value">{stats.totalCourses}</p>
                                        </div>
                                        <div className="card">
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
                                            <h3>Total Instructors</h3>
                                            <p className="stat-value">{stats.totalInstructors}</p>
                                        </div>
                                        <div className="card">
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🎓</div>
                                            <h3>Total Students</h3>
                                            <p className="stat-value">{stats.totalStudents}</p>
                                        </div>
                                        <div className="card">
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                                            <h3>Analyst Status</h3>
                                            <p className="stat-value">{stats.hasAnalyst ? '✓ Active' : '✗ Not Set'}</p>
                                        </div>
                                        <div className="card">
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏫</div>
                                            <h3>Total Universities</h3>
                                            <p className="stat-value">{stats.totalUniversities}</p>
                                        </div>
                                        <div className="card">
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
                                            <h3>Total TextBooks</h3>
                                            <p className="stat-value">{stats.totalTextbooks}</p>
                                        </div>
                                    </div>

                                    <div className="quick-actions">
                                        <h2>Quick Actions</h2>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn"
                                                onClick={() => setActiveTab('courses')}
                                            >
                                                📚 Create Course
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() => setActiveTab('instructors')}
                                            >
                                                👨‍🏫 Add Instructor
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() => setActiveTab('universities')}
                                            >
                                                🏫 Add University
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() => setActiveTab('textbooks')}
                                            >
                                                📖 Add TextBook
                                            </button>
                                            {!stats.hasAnalyst && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => setActiveTab('analyst')}
                                                >
                                                    📊 Create Analyst
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'courses' && <CourseManagement />}
                    {activeTab === 'instructors' && <InstructorManagement />}
                    {activeTab === 'students' && <StudentManagement />}
                    {activeTab === 'analyst' && <AnalystManagement />}
                    {activeTab === 'universities' && <UniversityManagement />}
                    {activeTab === 'textbooks' && <TextBookManagement />}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;