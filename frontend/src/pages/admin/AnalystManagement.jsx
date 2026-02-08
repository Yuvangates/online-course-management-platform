import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';
import '../../styles/admin/admin.css';

const AnalystManagement = () => {
    const [analyst, setAnalyst] = useState(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        country: '',
    });

    const fetchAnalyst = async () => {
        try {
            const data = await adminService.getAnalyst();
            setAnalyst(data);
        } catch (err) {
            console.error(err);
            // It's okay if there's no analyst (404)
            if (err.response?.status !== 404) {
                setError(err.response?.data?.error || 'Failed to load analyst');
            } else {
                setAnalyst(null);
            }
        }
    };

    useEffect(() => {
        fetchAnalyst();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDeleteAnalyst = async () => {
        if (!analyst || !analyst.analyst_id) {
            setError('Cannot find analyst to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to remove ${analyst.name}?`)) {
            return;
        }

        try {
            await adminService.deleteUser(analyst.analyst_id);
            setAnalyst(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to remove analyst');
        }
    };

    const handleCreateAnalyst = async (e) => {
        e.preventDefault();
        try {
            setError('');

            if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim()) {
                setError('Email, password, and name are required');
                return;
            }

            // Basic email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            await adminService.createAnalyst({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                country: formData.country || '',
            });

            setFormData({
                email: '',
                password: '',
                name: '',
                country: '',
            });
            setShowForm(false);
            await fetchAnalyst();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create analyst');
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Analyst Management</h2>
                {!analyst && (
                    <button
                        className="btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Create Analyst'}
                    </button>
                )}
            </div>

            {error && <div className="alert error">{error}</div>}

            {analyst ? (
                <div className="analyst-display">
                    <div className="analyst-info">
                        <h3>System Analyst</h3>
                        <div className="info-item">
                            <strong>Name:</strong> {analyst.name}
                        </div>
                        <div className="info-item">
                            <strong>Email:</strong> {analyst.email}
                        </div>
                        {analyst.country && (
                            <div className="info-item">
                                <strong>Country:</strong> {analyst.country}
                            </div>
                        )}
                        <p className="note">
                            The analyst role has been assigned. Only one analyst can exist in the system.
                        </p>
                        <button
                            className="btn-danger"
                            onClick={handleDeleteAnalyst}
                        >
                            Remove Account
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {showForm ? (
                        <form className="form-container" onSubmit={handleCreateAnalyst}>
                            <h3>Create Data Analyst</h3>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="analyst@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Jane Smith"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Country"
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                Create Analyst
                            </button>
                        </form>
                    ) : (
                        <div className="empty-state">
                            No analyst assigned yet
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AnalystManagement;
