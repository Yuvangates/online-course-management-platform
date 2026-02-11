import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import Navbar from '../../components/Sidebar';
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
                    password: '',
                    currentPassword: '',
                    confirmPassword: ''
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
            if (formData.password) {
                if (!formData.currentPassword) {
                    setError('Current password is required to set a new password.');
                    setIsSaving(false);
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('New passwords do not match.');
                    setIsSaving(false);
                    return;
                }
            }
            const payload = {
                name: formData.name,
                email: formData.email,
                country: formData.country,
                date_of_birth: formData.date_of_birth || null,
                skill_level: formData.skill_level || null,
                password: formData.password ? formData.password : undefined,
                currentPassword: formData.currentPassword ? formData.currentPassword : undefined
            };
            const updated = await authService.updateProfile(payload);
            setProfile(updated);
            // Update auth context user
            if (updated) {
                updateUser(updated);
            }
            setFormData((prev) => ({
                ...prev,
                password: '',
                currentPassword: '',
                confirmPassword: ''
            }));
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
                <div className="profile-page">
                    <div className="profile-topbar">
                        <h1>My Profile</h1>
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
                            <h2>{profile?.name}</h2>
                            <p className="profile-role">Student</p>
                        </div>

                        {isEditing ? (
                            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="name">Full Name</label>
                                    <input
                                        className="input-field"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="email">Email Address</label>
                                    <input
                                        className="input-field"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="country">Country</label>
                                    <input
                                        className="input-field"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="date_of_birth">Date of Birth</label>
                                    <input
                                        className="input-field"
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="skill_level">Skill Level</label>
                                    <select
                                        id="skill_level"
                                        name="skill_level"
                                        value={formData.skill_level}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    >
                                        <option value="">Select a level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="currentPassword">Current Password</label>
                                    <input
                                        className="input-field"
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        placeholder="Required to change password"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="password">New Password</label>
                                    <input
                                        className="input-field"
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label" htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        className="input-field"
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
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
                                                password: '',
                                                currentPassword: '',
                                                confirmPassword: ''
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
                                    <p className="detail-label">Email Address</p>
                                    <p className="detail-value">{profile?.email}</p>
                                </div>
                                <div className="detail-card">
                                    <p className="detail-label">Country</p>
                                    <p className="detail-value">{profile?.country || 'Not set'}</p>
                                </div>
                                <div className="detail-card">
                                    <p className="detail-label">Date of Birth</p>
                                    <p className="detail-value">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}</p>
                                </div>
                                <div className="detail-card">
                                    <p className="detail-label">Skill Level</p>
                                    <p className="detail-value">{profile?.skill_level || 'Not set'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;