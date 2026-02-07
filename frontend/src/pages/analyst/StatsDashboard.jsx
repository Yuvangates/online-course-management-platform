import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import analystService from '../../api/analystService';
import { LineChart, BarChart, PieChart, DoughnutChart, lineChartOptions, barChartOptions, pieChartOptions, doughnutChartOptions } from '../../components/Charts';
import { generateAnalyticsReport } from '../../utils/exportReport';
import '../../styles/analyst/analyst.css';

const AnalystDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dashboard KPIs State
    const [kpis, setKpis] = useState({
        total_revenue: 0,
        active_students: 0,
        avg_rating: 0,
        completion_rate: 0,
    });

    // Revenue State
    const [revenueByUniversity, setRevenueByUniversity] = useState([]);
    const [freeVsPaid, setFreeVsPaid] = useState([]);

    // Engagement State
    const [userStatus, setUserStatus] = useState([]);
    const [contentDropoff, setContentDropoff] = useState([]);
    const [learningMode, setLearningMode] = useState([]);

    // Performance State
    const [scoreDistribution, setScoreDistribution] = useState([]);
    const [skillAnalysis, setSkillAnalysis] = useState([]);

    // Instructor State
    const [instructorLeaderboard, setInstructorLeaderboard] = useState([]);
    const [durationAnalysis, setDurationAnalysis] = useState([]);

    // Trends State
    const [enrollmentTrends, setEnrollmentTrends] = useState([]);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardData();
        } else if (activeTab === 'revenue') {
            fetchRevenueData();
        } else if (activeTab === 'engagement') {
            fetchEngagementData();
        } else if (activeTab === 'performance') {
            fetchPerformanceData();
        } else if (activeTab === 'instructors') {
            fetchInstructorData();
        }
    }, [activeTab]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');
            const [kpisData, trendsData] = await Promise.all([
                analystService.getDashboard(),
                analystService.getEnrollmentTrends()
            ]);
            setKpis(kpisData);
            setEnrollmentTrends(trendsData);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            setError('');
            const [universityData, freeVsPaidData] = await Promise.all([
                analystService.getRevenueByUniversity(),
                analystService.getFreeVsPaidStats()
            ]);
            setRevenueByUniversity(universityData);
            setFreeVsPaid(freeVsPaidData);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load revenue data');
        } finally {
            setLoading(false);
        }
    };

    const fetchEngagementData = async () => {
        try {
            setLoading(true);
            setError('');
            const [statusData, dropoffData, modeData] = await Promise.all([
                analystService.getUserStatus(),
                analystService.getContentDropoff(),
                analystService.getLearningMode()
            ]);
            setUserStatus(statusData);
            setContentDropoff(dropoffData);
            setLearningMode(modeData);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load engagement data');
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            setError('');
            const [scoresData, skillData] = await Promise.all([
                analystService.getScoreDistribution(),
                analystService.getSkillAnalysis()
            ]);
            setScoreDistribution(scoresData);
            setSkillAnalysis(skillData);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load performance data');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstructorData = async () => {
        try {
            setLoading(true);
            setError('');
            const [leaderboardData, durationData] = await Promise.all([
                analystService.getInstructorLeaderboard(),
                analystService.getDurationAnalysis()
            ]);
            setInstructorLeaderboard(leaderboardData);
            setDurationAnalysis(durationData);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load instructor data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
    };

    const handleExportReport = async () => {
        try {
            // Fetch all data from all tabs to ensure complete export
            const [
                dashboardData,
                revenueData,
                paidData,
                statusData,
                dropoffData,
                modeData,
                scoresData,
                skillData,
                leaderboardData,
                durationData,
                trendsData
            ] = await Promise.all([
                analystService.getDashboard(),
                analystService.getRevenueByUniversity(),
                analystService.getFreeVsPaidStats(),
                analystService.getUserStatus(),
                analystService.getContentDropoff(),
                analystService.getLearningMode(),
                analystService.getScoreDistribution(),
                analystService.getSkillAnalysis(),
                analystService.getInstructorLeaderboard(),
                analystService.getDurationAnalysis(),
                analystService.getEnrollmentTrends()
            ]);

            const completeData = {
                kpis: dashboardData,
                revenueByUniversity: revenueData,
                freeVsPaid: paidData,
                userStatus: statusData,
                contentDropoff: dropoffData,
                learningMode: modeData,
                scoreDistribution: scoresData,
                skillAnalysis: skillData,
                instructorLeaderboard: leaderboardData,
                durationAnalysis: durationData,
                enrollmentTrends: trendsData,
            };
            
            // Always export all data
            await generateAnalyticsReport(completeData, 'all');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate report. Please try again.');
        }
    };

    // Chart data preparation functions
    const getEnrollmentTrendChartData = () => {
        if (!enrollmentTrends || enrollmentTrends.length === 0) return null;
        
        return {
            labels: enrollmentTrends.map(t => t.month),
            datasets: [
                {
                    label: 'Enrollments',
                    data: enrollmentTrends.map(t => t.enrollment_count),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    };

    const getRevenueByUniversityChartData = () => {
        if (!revenueByUniversity || revenueByUniversity.length === 0) return null;
        
        const top10 = revenueByUniversity.slice(0, 10);
        return {
            labels: top10.map(u => u.university_name),
            datasets: [
                {
                    label: 'Revenue ($)',
                    data: top10.map(u => parseFloat(u.total_revenue)),
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(124, 58, 237, 0.8)',
                        'rgba(109, 40, 217, 0.8)',
                        'rgba(91, 33, 182, 0.8)',
                        'rgba(76, 29, 149, 0.8)',
                        'rgba(67, 56, 202, 0.8)',
                        'rgba(79, 70, 229, 0.8)',
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(129, 140, 248, 0.8)',
                        'rgba(165, 180, 252, 0.8)',
                    ],
                },
            ],
        };
    };

    const getUserStatusPieData = () => {
        if (!userStatus || userStatus.length === 0) return null;
        
        const colors = {
            'Active': '#10b981',
            'At Risk': '#f59e0b',
            'Dormant': '#ef4444',
            'Never Accessed': '#6b7280',
        };
        
        return {
            labels: userStatus.map(s => s.user_status),
            datasets: [
                {
                    data: userStatus.map(s => s.student_count),
                    backgroundColor: userStatus.map(s => colors[s.user_status] || '#8b5cf6'),
                },
            ],
        };
    };

    const getLearningModeDoughnutData = () => {
        if (!learningMode || learningMode.length === 0) return null;
        
        return {
            labels: learningMode.map(m => m.content_type),
            datasets: [
                {
                    data: learningMode.map(m => m.total_completions),
                    backgroundColor: [
                        '#8b5cf6',
                        '#7c3aed',
                        '#6d28d9',
                        '#5b21b6',
                        '#4c1d95',
                    ],
                },
            ],
        };
    };

    const getScoreDistributionBarData = () => {
        if (!scoreDistribution || scoreDistribution.length === 0) return null;
        
        return {
            labels: scoreDistribution.map(s => s.score_range),
            datasets: [
                {
                    label: 'Students',
                    data: scoreDistribution.map(s => s.student_count),
                    backgroundColor: '#8b5cf6',
                },
            ],
        };
    };

    const getSkillLevelComparisonData = () => {
        if (!skillAnalysis || skillAnalysis.length === 0) return null;
        
        return {
            labels: skillAnalysis.map(s => s.skill_level || 'Unknown'),
            datasets: [
                {
                    label: 'Enrollments',
                    data: skillAnalysis.map(s => s.total_enrollments),
                    backgroundColor: 'rgba(139, 92, 246, 0.6)',
                },
                {
                    label: 'Pass Rate (%)',
                    data: skillAnalysis.map(s => parseFloat(s.pass_rate)),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                },
            ],
        };
    };

    return (
        <>
            <Navbar role="Analyst" />
            <div className="analyst-container">
                <div className="analyst-sidebar">
                    <nav className="analyst-nav">
                        <h3>Analytics</h3>
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'revenue' ? 'active' : ''}`}
                            onClick={() => setActiveTab('revenue')}
                        >
                            Revenue
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'engagement' ? 'active' : ''}`}
                            onClick={() => setActiveTab('engagement')}
                        >
                            Engagement
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('performance')}
                        >
                            Performance
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'instructors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('instructors')}
                        >
                            Instructors
                        </button>
                    </nav>
                </div>

                <div className="analyst-content">
                    {error && <div className="alert error">{error}</div>}

                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-view">
                            <div className="dashboard-header">
                                <div className="header-content">
                                    <div>
                                        <h1>Platform Analytics Dashboard</h1>
                                        <p className="subtitle">Key performance indicators and trends</p>
                                    </div>
                                    <button className="export-btn" onClick={handleExportReport}>
                                        📥 Download Report (PDF)
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Loading dashboard...</div>
                            ) : (
                                <>
                                    {/* KPI Cards */}
                                    <div className="stat-grid">
                                        <div className="card kpi-card">
                                            <h3>Total Revenue</h3>
                                            <p className="stat-value">{formatCurrency(kpis.total_revenue)}</p>
                                            <span className="stat-label">All Courses</span>
                                        </div>
                                        <div className="card kpi-card">
                                            <h3>Active Students</h3>
                                            <p className="stat-value">{kpis.active_students || 0}</p>
                                            <span className="stat-label">Last 7 Days</span>
                                        </div>
                                        <div className="card kpi-card">
                                            <h3>Avg Course Rating</h3>
                                            <p className="stat-value">{kpis.avg_rating || 'N/A'} ⭐</p>
                                            <span className="stat-label">Out of 5</span>
                                        </div>
                                        <div className="card kpi-card">
                                            <h3>Completion Rate</h3>
                                            <p className="stat-value">{kpis.completion_rate || 0}%</p>
                                            <span className="stat-label">&gt;80% Progress</span>
                                        </div>
                                    </div>

                                    {/* Enrollment Trends - Line Chart */}
                                    <div className="section-card">
                                        <h2>Enrollment Trends (Last 12 Months)</h2>
                                        {getEnrollmentTrendChartData() ? (
                                            <div className="chart-wrapper" style={{ height: '350px' }}>
                                                <LineChart data={getEnrollmentTrendChartData()} options={lineChartOptions} />
                                            </div>
                                        ) : (
                                            <div className="empty-state">No enrollment data available</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* REVENUE TAB */}
                    {activeTab === 'revenue' && (
                        <div className="revenue-view">
                            <div className="dashboard-header">
                                <div className="header-content">
                                    <div>
                                        <h1>Revenue Analytics</h1>
                                        <p className="subtitle">Financial performance by university and course type</p>
                                    </div>
                                    <button className="export-btn" onClick={handleExportReport}>
                                        📥 Download Report (PDF)
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Loading revenue data...</div>
                            ) : (
                                <>
                                    {/* Revenue by University - Bar Chart */}
                                    <div className="section-card">
                                        <h2>Top 10 Universities by Revenue</h2>
                                        {getRevenueByUniversityChartData() ? (
                                            <div className="chart-wrapper" style={{ height: '400px' }}>
                                                <BarChart data={getRevenueByUniversityChartData()} options={barChartOptions} />
                                            </div>
                                        ) : (
                                            <div className="empty-state">No revenue data available</div>
                                        )}
                                    </div>

                                    {/* Revenue Table */}
                                    <div className="section-card">
                                        <h2>All Universities - Detailed Breakdown</h2>
                                        {revenueByUniversity.length > 0 ? (
                                            <div className="table-container">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Rank</th>
                                                            <th>University</th>
                                                            <th>Country</th>
                                                            <th>Courses</th>
                                                            <th>Enrollments</th>
                                                            <th>Total Revenue</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {revenueByUniversity.map((uni, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>#{idx + 1}</strong></td>
                                                                <td><strong>{uni.university_name}</strong></td>
                                                                <td>{uni.country}</td>
                                                                <td>{uni.course_count}</td>
                                                                <td>{uni.enrollment_count}</td>
                                                                <td className="revenue-value">{formatCurrency(uni.total_revenue)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="empty-state">No university data available</div>
                                        )}
                                    </div>

                                    {/* Free vs Paid Courses */}
                                    <div className="section-card">
                                        <h2>Free vs Paid Course Performance</h2>
                                        {freeVsPaid.length > 0 ? (
                                            <div className="comparison-grid">
                                                {freeVsPaid.map((type, idx) => (
                                                    <div key={idx} className="comparison-card">
                                                        <h3>{type.course_type} Courses</h3>
                                                        <div className="comparison-stats">
                                                            <div className="stat-item">
                                                                <span className="label">Courses</span>
                                                                <span className="value">{type.course_count}</span>
                                                            </div>
                                                            <div className="stat-item">
                                                                <span className="label">Enrollments</span>
                                                                <span className="value">{type.total_enrollments}</span>
                                                            </div>
                                                            <div className="stat-item">
                                                                <span className="label">Avg Score</span>
                                                                <span className="value">{type.avg_evaluation_score || 'N/A'}</span>
                                                            </div>
                                                            <div className="stat-item">
                                                                <span className="label">Avg Rating</span>
                                                                <span className="value">{type.avg_rating || 'N/A'} ⭐</span>
                                                            </div>
                                                            <div className="stat-item">
                                                                <span className="label">Completion</span>
                                                                <span className="value">{type.avg_completion_percentage || 0}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state">No course comparison data available</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ENGAGEMENT TAB */}
                    {activeTab === 'engagement' && (
                        <div className="engagement-view">
                            <div className="dashboard-header">
                                <div className="header-content">
                                    <div>
                                        <h1>Student Engagement Analytics</h1>
                                        <p className="subtitle">User activity, content completion, and learning preferences</p>
                                    </div>
                                    <button className="export-btn" onClick={handleExportReport}>
                                        📥 Download Report (PDF)
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Loading engagement data...</div>
                            ) : (
                                <>
                                    {/* Charts Grid - Side by Side */}
                                    <div className="charts-grid">
                                        {/* User Status - Pie Chart */}
                                        <div className="section-card">
                                            <h2>User Activity Distribution</h2>
                                            {getUserStatusPieData() ? (
                                                <div className="chart-wrapper" style={{ height: '350px' }}>
                                                    <PieChart data={getUserStatusPieData()} options={pieChartOptions} />
                                                </div>
                                            ) : (
                                                <div className="empty-state">No user status data available</div>
                                            )}
                                        </div>

                                        {/* Learning Mode - Doughnut Chart */}
                                        <div className="section-card">
                                            <h2>Content Type Preferences</h2>
                                            {getLearningModeDoughnutData() ? (
                                                <div className="chart-wrapper" style={{ height: '350px' }}>
                                                    <DoughnutChart data={getLearningModeDoughnutData()} options={doughnutChartOptions} />
                                                </div>
                                            ) : (
                                                <div className="empty-state">No learning mode data available</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Dropoff Table */}
                                    <div className="section-card">
                                        <h2>Content Drop-off Analysis (Top 20 Lowest Completion)</h2>
                                        {contentDropoff.length > 0 ? (
                                            <div className="table-container">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Course</th>
                                                            <th>Module</th>
                                                            <th>Content</th>
                                                            <th>Type</th>
                                                            <th>Enrolled</th>
                                                            <th>Completed</th>
                                                            <th>Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {contentDropoff.slice(0, 20).map((content, idx) => (
                                                            <tr key={idx} className={parseFloat(content.completion_rate) < 30 ? 'low-completion' : ''}>
                                                                <td>{content.course_name}</td>
                                                                <td>M{content.module_number}: {content.module_name}</td>
                                                                <td>{content.content_title}</td>
                                                                <td>{content.content_type}</td>
                                                                <td>{content.enrolled_students}</td>
                                                                <td>{content.completed_students}</td>
                                                                <td><strong>{content.completion_rate}%</strong></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="empty-state">No content dropoff data available</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* PERFORMANCE TAB */}
                    {activeTab === 'performance' && (
                        <div className="performance-view">
                            <div className="dashboard-header">
                                <div className="header-content">
                                    <div>
                                        <h1>Academic Performance Analytics</h1>
                                        <p className="subtitle">Score distribution and skill level analysis</p>
                                    </div>
                                    <button className="export-btn" onClick={handleExportReport}>
                                        📥 Download Report (PDF)
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Loading performance data...</div>
                            ) : (
                                <>
                                    {/* Score Distribution - Bar Chart */}
                                    <div className="section-card">
                                        <h2>Score Distribution</h2>
                                        {getScoreDistributionBarData() ? (
                                            <div className="chart-wrapper" style={{ height: '350px' }}>
                                                <BarChart data={getScoreDistributionBarData()} options={barChartOptions} />
                                            </div>
                                        ) : (
                                            <div className="empty-state">No score distribution data available</div>
                                        )}
                                    </div>

                                    {/* Skill Level Comparison - Grouped Bar Chart */}
                                    <div className="section-card">
                                        <h2>Skill Level Performance Comparison</h2>
                                        {getSkillLevelComparisonData() ? (
                                            <div className="chart-wrapper" style={{ height: '350px' }}>
                                                <BarChart data={getSkillLevelComparisonData()} options={barChartOptions} />
                                            </div>
                                        ) : (
                                            <div className="empty-state">No skill level data available</div>
                                        )}
                                    </div>

                                    {/* Skill Level Analysis Table */}
                                    <div className="section-card">
                                        <h2>Detailed Skill Level Breakdown</h2>
                                        {skillAnalysis.length > 0 ? (
                                            <div className="table-container">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Skill Level</th>
                                                            <th>Total Enrollments</th>
                                                            <th>Avg Score</th>
                                                            <th>Avg Rating</th>
                                                            <th>Passed Count</th>
                                                            <th>Pass Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {skillAnalysis.map((skill, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>{skill.skill_level || 'Unknown'}</strong></td>
                                                                <td>{skill.total_enrollments}</td>
                                                                <td>{skill.avg_score || 'N/A'}</td>
                                                                <td>{skill.avg_rating || 'N/A'} ⭐</td>
                                                                <td>{skill.passed_count}</td>
                                                                <td><strong>{skill.pass_rate}%</strong></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="empty-state">No skill level data available</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* INSTRUCTORS TAB */}
                    {activeTab === 'instructors' && (
                        <div className="instructors-view">
                            <div className="dashboard-header">
                                <div className="header-content">
                                    <div>
                                        <h1>Instructor Analytics</h1>
                                        <p className="subtitle">Performance leaderboard and course insights</p>
                                    </div>
                                    <button className="export-btn" onClick={handleExportReport}>
                                        📥 Download Report (PDF)
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Loading instructor data...</div>
                            ) : (
                                <>
                                    {/* Instructor Leaderboard */}
                                    <div className="section-card">
                                        <h2>Instructor Leaderboard</h2>
                                        {instructorLeaderboard.length > 0 ? (
                                            <div className="table-container">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Rank</th>
                                                            <th>Instructor</th>
                                                            <th>Expertise</th>
                                                            <th>Courses</th>
                                                            <th>Students</th>
                                                            <th>Avg Rating</th>
                                                            <th>Avg Student Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {instructorLeaderboard.map((instructor, idx) => (
                                                            <tr key={idx} className={idx < 3 ? 'top-performer' : ''}>
                                                                <td><strong>#{idx + 1}</strong></td>
                                                                <td>{instructor.instructor_name}</td>
                                                                <td>{instructor.expertise || 'N/A'}</td>
                                                                <td>{instructor.courses_taught}</td>
                                                                <td>{instructor.total_students}</td>
                                                                <td><strong>{instructor.avg_rating || 'N/A'} ⭐</strong></td>
                                                                <td>{instructor.avg_student_score || 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="empty-state">No instructor data available</div>
                                        )}
                                    </div>

                                    {/* Duration Analysis */}
                                    <div className="section-card">
                                        <h2>Course Duration vs Performance</h2>
                                        {durationAnalysis.length > 0 ? (
                                            <div className="table-container">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Course</th>
                                                            <th>Duration (weeks)</th>
                                                            <th>Enrollments</th>
                                                            <th>Avg Rating</th>
                                                            <th>Avg Score</th>
                                                            <th>Completion %</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {durationAnalysis.map((course, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>{course.course_name}</strong></td>
                                                                <td>{course.duration_weeks}</td>
                                                                <td>{course.enrollment_count}</td>
                                                                <td>{course.avg_rating || 'N/A'} ⭐</td>
                                                                <td>{course.avg_score || 'N/A'}</td>
                                                                <td>{course.avg_completion_percentage || 0}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="empty-state">No duration analysis data available</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AnalystDashboard;
