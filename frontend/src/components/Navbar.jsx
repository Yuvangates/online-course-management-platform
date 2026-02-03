import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear tokens/state here
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">EduPlatform</div>

            <ul className="nav-links">
                {/* Common Link */}
                <li><Link to="/profile" className="nav-link">Profile</Link></li>

                {/* Role Based Links */}
                {role === 'Student' && (
                    <>
                        <li><Link to="/student/dashboard" className="nav-link">My Learning</Link></li>
                        <li><Link to="/student/search" className="nav-link">Browse Courses</Link></li>
                    </>
                )}

                {role === 'Instructor' && (
                    <>
                        <li><Link to="/instructor/dashboard" className="nav-link">Instructor Panel</Link></li>
                        <li><Link to="/instructor/create" className="nav-link">Create Course</Link></li>
                    </>
                )}

                {role === 'Admin' && (
                    <>
                        <li><Link to="/admin/dashboard" className="nav-link">System Overview</Link></li>
                        <li><Link to="/admin/users" className="nav-link">Manage Users</Link></li>
                    </>
                )}

                {role === 'Analyst' && (
                    <li><Link to="/analyst/dashboard" className="nav-link">Data Reports</Link></li>
                )}
            </ul>

            <div className="nav-user">
                <span>Welcome, {role}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;