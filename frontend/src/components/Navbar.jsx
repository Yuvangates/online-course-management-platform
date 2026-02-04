import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
                {role === 'Student' && (
                    <>
                        <li><NavLink to="/student/dashboard" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Dashboard</NavLink></li>
                        <li><NavLink to="/student/enrolled" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>My Courses</NavLink></li>
                        <li><NavLink to="/student/profile" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Profile</NavLink></li>
                        <li><NavLink to="/student/search" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Search</NavLink></li>
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
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;