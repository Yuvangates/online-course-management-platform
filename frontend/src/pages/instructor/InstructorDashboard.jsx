import React from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/dashboard.css';

const InstructorDashboard = () => {
    return (
        <>
            <Navbar role="Instructor" />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Instructor Portal</h1>
                    <button className="action-btn">+ Create New Course</button>
                </div>

                <div className="stat-grid">
                    <div className="card">
                        <h3>Active Courses</h3>
                        <p>2</p>
                    </div>
                    <div className="card">
                        <h3>Total Students</h3>
                        <p>145</p>
                    </div>
                </div>

                <h2>Manage Courses</h2>
                <div className="card" style={{ marginTop: '1rem' }}>
                    <h4>Advanced React Patterns</h4>
                    <p style={{ fontSize: '1rem', fontWeight: 'normal' }}>Status: Published</p>
                    <button style={{ marginTop: '10px', padding: '5px 10px' }}>Add Content</button>
                </div>
            </div>
        </>
    );
};

export default InstructorDashboard;