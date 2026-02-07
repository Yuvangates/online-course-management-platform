import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';

const InstructorManagement = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        expertise: '',
        start_date: '',
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getAllInstructors();
            setInstructors(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch instructors');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateExperience = (startDate) => {
        if (!startDate) return 'N/A';
        const start = new Date(startDate);
        const now = new Date();
        const diffMs = now - start;
        const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        if (diffYears < 1) return '< 1 year';
        const years = Math.floor(diffYears);
        return `${years} ${years === 1 ? 'year' : 'years'}`;
    };

    const handleCreateInstructor = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }
        if (!formData.password.trim()) {
            setError('Password is required');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!formData.expertise.trim()) {
            setError('Expertise is required');
            return;
        }
        if (!formData.start_date) {
            setError('Start date is required');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const instructorData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                expertise: formData.expertise.trim(),
                start_date: formData.start_date,
            };
            
            await adminService.createInstructor(instructorData);
            setFormData({
                name: '',
                email: '',
                password: '',
                expertise: '',
                start_date: '',
            });
            setShowForm(false);
            await fetchInstructors();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create instructor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="management-container">
            {/* Header */}
            <div className="section-header">
                <h2>Instructor Management</h2>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Add Instructor'}
                </button>
            </div>

            {/* Error Display */}
            {error && <div className="alert error">{error}</div>}

            {/* Create Form */}
            {showForm && (
                <div className="form-container">
                    <h3>Create New Instructor</h3>
                    <form onSubmit={handleCreateInstructor}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Instructor name"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Instructor email"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Minimum 6 characters"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expertise *</label>
                                <input
                                    type="text"
                                    name="expertise"
                                    value={formData.expertise}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Computer Science"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Instructor'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Loading State */}
            {loading && !showForm && <div className="loading">Loading instructors...</div>}

            {/* Instructors List */}
            {!loading && instructors.length === 0 ? (
                <div className="empty-state">
                    <p>No instructors found. Create your first instructor!</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {instructors.map(instructor => (
                        <div key={instructor.instructor_id} className="card">
                            <div className="card-header">
                                <h3>{instructor.name}</h3>
                            </div>
                            <div className="card-content">
                                <p><strong>Email:</strong> {instructor.email}</p>
                                <p><strong>Expertise:</strong> {instructor.expertise}</p>
                                {instructor.start_date && (
                                    <p>
                                        Experience: {calculateExperience(instructor.start_date)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorManagement;
