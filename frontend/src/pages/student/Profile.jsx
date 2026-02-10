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
                    skill_level: user.skill_level || '',
                    password: ''
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
                email: formData.email,
                country: formData.country,
                date_of_birth: formData.date_of_birth || null,
                skill_level: formData.skill_level || null,
                password: formData.password ? formData.password : undefined
            };
            const updated = await authService.updateProfile(payload);
            setProfile(updated);
            // Update auth context user
            if (updated) {
                updateUser(updated);
            }
            setFormData((prev) => ({ ...prev, password: '' }));
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
            <div className="student-container">
                <div className="profile-header">
                    <div>
                        <h1>My Profile</h1>
                        <p className="muted">Manage your personal information and learning preferences.</p>
                    </div>
                    {!isEditing && (
                        <button
                            className="btn outline"
                            onClick={() => setIsEditing(true)}
                            type="button"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {error && <div className="alert error">{error}</div>}

                <div className="profile-card">
                    <div className="profile-hero">
                        <div className="profile-avatar">
                            {profile?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="profile-hero-info">
                            <h2>{profile?.name}</h2>
                            <span className="role-badge">Student</span>
                        </div>
                    </div>

                    {isEditing ? (
                        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">U</span>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">@</span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="country">Country</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">G</span>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="date_of_birth">Date of Birth</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">D</span>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="skill_level">Skill Level</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">S</span>
                                    <select
                                        id="skill_level"
                                        name="skill_level"
                                        value={formData.skill_level}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="">Select a level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">New Password</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">P</span>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    className="btn outline"
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: profile?.name || '',
                                            email: profile?.email || '',
                                            country: profile?.country || '',
                                            date_of_birth: profile?.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
                                            skill_level: profile?.skill_level || '',
                                            password: ''
                                        });
                                    }}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn primary"
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-details">
                            <div className="detail-card">
                                <span className="detail-icon">@</span>
                                <div>
                                    <p className="detail-label">Email Address</p>
                                    <p className="detail-value">{profile?.email}</p>
                                </div>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">G</span>
                                <div>
                                    <p className="detail-label">Country</p>
                                    <p className="detail-value">{profile?.country || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">D</span>
                                <div>
                                    <p className="detail-label">Date of Birth</p>
                                    <p className="detail-value">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}</p>
                                </div>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">S</span>
                                <div>
                                    <p className="detail-label">Skill Level</p>
                                    <p className="detail-value">{profile?.skill_level || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;