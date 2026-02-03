import React from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
    return (
        <>
            <Navbar role="Admin" />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>System Administration</h1>
                </div>

                <div className="stat-grid">
                    <div className="card">
                        <h3>Total Users</h3>
                        <p>1,240</p>
                    </div>
                    <div className="card">
                        <h3>Instructors</h3>
                        <p>45</p>
                    </div>
                    <div className="card">
                        <h3>Courses</h3>
                        <p>89</p>
                    </div>
                </div>

                <h2>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="action-btn">Add Instructor</button>
                    <button className="action-btn" style={{ backgroundColor: '#6c757d' }}>System Logs</button>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;