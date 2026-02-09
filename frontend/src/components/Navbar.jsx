import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';
import '../styles/navbar.css';

const Navbar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

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

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/" className="nav-logo">LearnSphere</Link>
            </div>

            {!isAuthPage && user && (
                <>
                    <ul className="nav-links">
                        {user.role === 'Student' && (
                            <>
                                <li><NavLink to="/student/dashboard" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Dashboard</NavLink></li>
                                <li><NavLink to="/student/enrolled" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>My Courses</NavLink></li>
                                <li><NavLink to="/student/profile" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Profile</NavLink></li>
                                <li><NavLink to="/student/search" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Search</NavLink></li>
                            </>
                        )}

                        {user.role === 'Instructor' && (
                            <>
                                <li><NavLink to="/instructor/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink></li>
                                <li><NavLink to="/instructor/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Assigned Courses</NavLink></li>
                                <li><NavLink to="/instructor/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink></li>
                            </>
                        )}

                        {user.role === 'Admin' && (
                            <>
                                <li><Link to="/admin/dashboard" className="nav-link">System Overview</Link></li>
                            </>
                        )}

                        {user.role === 'Analyst' && (
                            <li><Link to="/analyst/dashboard" className="nav-link">Data Reports</Link></li>
                        )}
                    </ul>

                    <div className="nav-user">
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
