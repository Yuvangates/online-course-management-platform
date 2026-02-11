import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';
import '../styles/sidebar.css';

const Navbar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            logout();
            navigate('/');
        }
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const searchParams = new URLSearchParams(location.search);
    const adminTab = location.pathname.startsWith('/admin') ? (searchParams.get('tab') || 'dashboard') : null;
    const analystTab = location.pathname.startsWith('/analyst') ? (searchParams.get('tab') || 'dashboard') : null;

    if (isAuthPage || !user) {
        return null;
    }

    return (
        <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <Link to="/" className="sidebar-logo">LearnSphere</Link>
                    <button
                        type="button"
                        className="sidebar-toggle"
                        onClick={() => setCollapsed(prev => !prev)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-pressed={collapsed}
                    >
                        <svg
                            className={`sidebar-toggle-icon${collapsed ? ' is-collapsed' : ''}`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <span className="sidebar-role">{user.role}</span>
            </div>

            <ul className="nav-links">
                {user.role === 'Student' && (
                    <>
                        <li><NavLink to="/student/dashboard" data-short="D" className={({isActive})=> isActive? 'nav-link active':'nav-link'}><span className="nav-text">Dashboard</span></NavLink></li>
                        <li><NavLink to="/student/enrolled" data-short="M" className={({isActive})=> isActive? 'nav-link active':'nav-link'}><span className="nav-text">My Courses</span></NavLink></li>
                        <li><NavLink to="/student/grades" data-short="G" className={({isActive})=> isActive? 'nav-link active':'nav-link'}><span className="nav-text">Grades</span></NavLink></li>
                        <li><NavLink to="/student/profile" data-short="P" className={({isActive})=> isActive? 'nav-link active':'nav-link'}><span className="nav-text">Profile</span></NavLink></li>
                        <li><NavLink to="/student/search" data-short="S" className={({isActive})=> isActive? 'nav-link active':'nav-link'}><span className="nav-text">Search</span></NavLink></li>
                    </>
                )}

                {user.role === 'Instructor' && (
                    <>
                        <li><NavLink to="/instructor/dashboard" data-short="D" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Dashboard</span></NavLink></li>
                        <li><NavLink to="/instructor/courses" data-short="A" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Assigned Courses</span></NavLink></li>
                        <li><NavLink to="/instructor/profile" data-short="P" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Profile</span></NavLink></li>
                    </>
                )}

                {user.role === 'Admin' && (
                    <>
                        <li><Link to="/admin/dashboard?tab=dashboard" data-short="D" className={`nav-link${adminTab === 'dashboard' ? ' active' : ''}`}><span className="nav-text">Dashboard</span></Link></li>
                        <li><Link to="/admin/dashboard?tab=courses" data-short="C" className={`nav-link${adminTab === 'courses' ? ' active' : ''}`}><span className="nav-text">Courses</span></Link></li>
                        <li><Link to="/admin/dashboard?tab=instructors" data-short="I" className={`nav-link${adminTab === 'instructors' ? ' active' : ''}`}><span className="nav-text">Instructors</span></Link></li>
                        <li><Link to="/admin/dashboard?tab=students" data-short="S" className={`nav-link${adminTab === 'students' ? ' active' : ''}`}><span className="nav-text">Students</span></Link></li>
                        <li><Link to="/admin/dashboard?tab=analyst" data-short="A" className={`nav-link${adminTab === 'analyst' ? ' active' : ''}`}><span className="nav-text">Analyst</span></Link></li>
                        <li><Link to="/admin/dashboard?tab=universities" data-short="U" className={`nav-link${adminTab === 'universities' ? ' active' : ''}`}><span className="nav-text">Universities</span></Link></li>
                        <li><Link to="/admin/dashboard?tab=textbooks" data-short="T" className={`nav-link${adminTab === 'textbooks' ? ' active' : ''}`}><span className="nav-text">TextBooks</span></Link></li>
                    </>
                )}

                {user.role === 'Analyst' && (
                    <>
                        <li><Link to="/analyst/dashboard?tab=dashboard" data-short="D" className={`nav-link${analystTab === 'dashboard' ? ' active' : ''}`}><span className="nav-text">Dashboard</span></Link></li>
                        <li><Link to="/analyst/dashboard?tab=revenue" data-short="R" className={`nav-link${analystTab === 'revenue' ? ' active' : ''}`}><span className="nav-text">Revenue</span></Link></li>
                        <li><Link to="/analyst/dashboard?tab=engagement" data-short="E" className={`nav-link${analystTab === 'engagement' ? ' active' : ''}`}><span className="nav-text">Engagement</span></Link></li>
                        <li><Link to="/analyst/dashboard?tab=performance" data-short="P" className={`nav-link${analystTab === 'performance' ? ' active' : ''}`}><span className="nav-text">Performance</span></Link></li>
                        <li><Link to="/analyst/dashboard?tab=instructors" data-short="I" className={`nav-link${analystTab === 'instructors' ? ' active' : ''}`}><span className="nav-text">Instructors</span></Link></li>
                    </>
                )}
            </ul>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
