import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';
import '../../styles/admin/admin.css';

const InstructorManagement = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        country: '',
        expertise: '',
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getAllInstructors();
            setInstructors(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load instructors');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateInstructor = async (e) => {
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

            await adminService.createInstructor({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                country: formData.country || '',
                expertise: formData.expertise || '',
            });

            setFormData({
                email: '',
                password: '',
                name: '',
                country: '',
                expertise: '',
            });
            setShowForm(false);
            await fetchInstructors();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create instructor');
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Instructor Management</h2>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add Instructor'}
                </button>
            </div>

            {error && <div className="alert error">{error}</div>}

            {showForm && (
                <form className="form-container" onSubmit={handleCreateInstructor}>
                    <h3>Create New Instructor</h3>

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="instructor@example.com"
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
                            placeholder="e.g., Dr. John Doe"
                            required
                        />
                    </div>

                    <div className="form-row">
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

                        <div className="form-group">
                            <label>Expertise</label>
                            <input
                                type="text"
                                name="expertise"
                                value={formData.expertise}
                                onChange={handleInputChange}
                                placeholder="e.g., Web Development"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        Create Instructor
                    </button>
                </form>
            )}

            {loading ? (
                <div className="loading">Loading instructors...</div>
            ) : instructors.length === 0 ? (
                <div className="empty-state">No instructors found</div>
            ) : (
                <div className="list-container">
                    {instructors.map((instructor) => (
                        <div key={instructor.user_id} className="list-item">
                            <div>
                                <strong>{instructor.name}</strong>
                                <p className="muted">{instructor.email}</p>
                                {instructor.expertise && (
                                    <p className="expertise">Expertise: {instructor.expertise}</p>
                                )}
                                {instructor.country && (
                                    <p className="country">Country: {instructor.country}</p>
                                )}
                                {instructor.start_date && (
                                    <p className="muted" style={{ fontSize: '0.85rem' }}>
                                        Start Date: {new Date(instructor.start_date).toLocaleDateString()}
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
