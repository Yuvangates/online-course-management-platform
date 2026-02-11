import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';

const InstructorManagement = () => {
    const [instructors, setInstructors] = useState([]);
    const [filteredInstructors, setFilteredInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        expertise: '',
        start_date: '',
        country: '',
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
            setFilteredInstructors(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch instructors');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredInstructors(instructors);
            return;
        }

        const filtered = instructors.filter(
            (instructor) =>
                instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredInstructors(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery, instructors]);

    const handleDeleteInstructor = async (instructorId, instructorName) => {
        if (!window.confirm(`Are you sure you want to remove ${instructorName}? This will remove them from all assigned courses.`)) {
            return;
        }

        try {
            setError('');
            await adminService.deleteInstructor(instructorId);
            await fetchInstructors();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to remove instructor');
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
                country: formData.country.trim(),
            };
            
            await adminService.createInstructor(instructorData);
            setFormData({
                name: '',
                email: '',
                password: '',
                expertise: '',
                start_date: '',
                country: '',
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
            <div className="section-header-with-button">
                <h2>Instructor Management</h2>
                <button
                    className="btn-primary-large"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Add Instructor'}
                </button>
            </div>

            {/* Search Bar */}
            {!showForm && (
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search instructors by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            )}

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
                            <div className="form-group">
                                <label>Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="e.g., USA, India"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary-large"
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
            {!loading && filteredInstructors.length === 0 ? (
                <div className="empty-state">
                    <p>No instructors found. Create your first instructor!</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {filteredInstructors.map(instructor => (
                        <div key={instructor.instructor_id} className="card">
                            <div className="card-header">
                                <h3>{instructor.name}</h3>
                            </div>
                            <div className="card-content">
                                <p><strong>Email:</strong> {instructor.email}</p>
                                <p><strong>Expertise:</strong> {instructor.expertise}</p>
                                {instructor.country && (
                                    <p><strong>Country:</strong> {instructor.country}</p>
                                )}
                                {instructor.start_date && (
                                    <p>
                                        <strong>Experience:</strong> {calculateExperience(instructor.start_date)}
                                    </p>
                                )}
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn-danger"
                                    onClick={() => handleDeleteInstructor(instructor.user_id, instructor.name)}
                                >
                                    Remove Account
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorManagement;
