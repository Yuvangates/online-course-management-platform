import React from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/dashboard.css';

const StudentDashboard = () => {
    return (
        <>
            <Navbar role="Student" />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>My Learning Dashboard</h1>
                    <button className="action-btn">Browse New Courses</button>
                </div>

                <div className="stat-grid">
                    <div className="card">
                        <h3>Courses Enrolled</h3>
                        <p>4</p>
                    </div>
                    <div className="card">
                        <h3>Completed</h3>
                        <p>1</p>
                    </div>
                    <div className="card">
                        <h3>Avg. Score</h3>
                        <p>85%</p>
                    </div>
                </div>

                <h2>Current Courses</h2>
                <div className="card" style={{ marginTop: '1rem' }}>
                    <h4>Introduction to Database Systems</h4>
                    <p style={{ fontSize: '1rem', fontWeight: 'normal' }}>Progress: 60%</p>
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;