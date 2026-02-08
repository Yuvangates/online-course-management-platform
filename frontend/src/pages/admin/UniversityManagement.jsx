import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';

const UniversityManagement = () => {
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        country: '',
    });

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, universities]);

    const fetchUniversities = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminService.getAllUniversities();
            setUniversities(response);
            setFilteredUniversities(response);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch universities');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredUniversities(universities);
            return;
        }

        const filtered = universities.filter(
            (university) =>
                university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                university.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUniversities(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateUniversity = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (!formData.name.trim() || !formData.country.trim()) {
                setError('Name and country are required');
                return;
            }

            if (editingId) {
                await adminService.updateUniversity(editingId, formData);
            } else {
                await adminService.createUniversity(formData);
            }

            setFormData({ name: '', country: '' });
            setShowForm(false);
            setEditingId(null);
            await fetchUniversities();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save university');
        }
    };

    const handleEditUniversity = (university) => {
        setFormData({
            name: university.name,
            country: university.country,
        });
        setEditingId(university.university_id);
        setShowForm(true);
    };

    const handleDeleteUniversity = async (universityId, universityName) => {
        if (!window.confirm(`Are you sure you want to delete ${universityName}?`)) {
            return;
        }

        try {
            await adminService.deleteUniversity(universityId);
            await fetchUniversities();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete university');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', country: '' });
    };

    return (
        <div className="management-container">
            <div className="section-header-with-button">
                <h2>University Management</h2>
                <button
                    className="btn-primary-large"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Add University'}
                </button>
            </div>

            {!showForm && (
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search universities by name or country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            )}

            {error && <div className="alert error">{error}</div>}

            {showForm && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit University' : 'Create New University'}</h3>
                    <form onSubmit={handleCreateUniversity}>
                        <div className="form-group">
                            <label>University Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="University name"
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

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary-large"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : editingId ? 'Update University' : 'Create University'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && !showForm && <div className="loading">Loading universities...</div>}

            {!loading && filteredUniversities.length === 0 ? (
                <div className="empty-state">
                    <p>{searchQuery ? 'No universities found' : 'Create your first university!'}</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {filteredUniversities.map(university => (
                        <div key={university.university_id} className="card">
                            <div className="card-header">
                                <h3>{university.name}</h3>
                            </div>
                            <div className="card-content">
                                <p><strong>Country:</strong> {university.country}</p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => handleEditUniversity(university)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleDeleteUniversity(university.university_id, university.name)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UniversityManagement;
