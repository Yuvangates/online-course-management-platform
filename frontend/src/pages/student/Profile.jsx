import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import Navbar from '../../components/Navbar';
import '../../styles/student/student-profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const setupProfile = () => {
            if (!user) {
                setError('Could not load user profile.');
                setLoading(false);
                return;
            }
            try {
                setProfile(user);
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    country: user.country || '',
                    date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
                    skill_level: user.skill_level || ''
                });
            } catch (err) {
                setError('Failed to load profile.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        setupProfile();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const payload = {
                name: formData.name,
                country: formData.country,
                date_of_birth: formData.date_of_birth || null,
                skill_level: formData.skill_level || null
            };
            const updated = await authService.updateProfile(payload);
            setProfile(updated);
            // Update auth context user
            if (updated) {
                updateUser(updated);
            }
            setIsEditing(false);
        } catch (err) {
            console.log(err);
            setError('Failed to save profile.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <>
            <Navbar role="Student" />
            <div className="student-container">
                <p>Loading profile...</p>
            </div>
        </>
    );

    return (
        <>
            <Navbar role="Student" />
            <div className="student-container profile-page">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    {!isEditing && (
                        <button
                            className="btn primary"
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Edit Profile
                        </button>
                    )}
                </div>

                {error && <div className="alert error">{error}</div>}

                {!isEditing ? (
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <div className="avatar-circle">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="label">Name</span>
                                <span className="value">{profile?.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Email</span>
                                <span className="value">{profile?.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Country</span>
                                <span className="value">{profile?.country || 'Not set'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Date of Birth</span>
                                <span className="value">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Skill Level</span>
                                <span className="value skill-badge">{profile?.skill_level || 'Not set'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="profile-card edit-mode">
                        <h2>Edit Profile</h2>
                        <div className="edit-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            {/* Email cannot be changed once created */}
                            <div className="form-group">
                                <label>Email</label>
                                <div className="value static-value">{profile?.email}</div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="date_of_birth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="skill_level">Skill Level</label>
                                <select
                                    id="skill_level"
                                    name="skill_level"
                                    value={formData.skill_level}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Select a level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="btn outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: profile?.name || '',
                                            email: profile?.email || '',
                                            country: profile?.country || '',
                                            date_of_birth: profile?.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
                                            skill_level: profile?.skill_level || ''
                                        });
                                    }}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn primary"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;