import React from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/dashboard.css';

const StatsDashboard = () => {
    return (
        <>
            <Navbar role="Analyst" />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Platform Analytics</h1>
                    <button className="action-btn">Export Report</button>
                </div>

                <div className="stat-grid">
                    <div className="card">
                        <h3>Enrollment Rate</h3>
                        <p>+15%</p>
                    </div>
                    <div className="card">
                        <h3>Top Region</h3>
                        <p>India</p>
                    </div>
                </div>

                <h2>Enrollment Trends</h2>
                <div className="card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    [Chart Component Placeholder]
                </div>
            </div>
        </>
    );
};

export default StatsDashboard;