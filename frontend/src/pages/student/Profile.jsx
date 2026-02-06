import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import '../../styles/student/student-profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const setupProfile = () => {
            if (!user) {
                setError('Could not load user profile.');
                setLoading(false);
                return;
            }
            try {
                // The user object from AuthContext is now the source of truth.
                // For edit functionality to work, a backend endpoint and API service are needed.
                setProfile(user);
            } catch (err) {
                setError('Failed to load profile.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        setupProfile();
    }, [user]);

    if (loading) return <div className="student-container"><p>Loading profile...</p></div>;    

    return (
        <>
            <Navbar role="Student" />
            <div className="student-container profile-page">
                <h1>My Profile</h1>
                {error && <div className="alert error">{error}</div>}
                
                <div className="profile-card">
                    <div className="profile-header">
                        <h2>{profile?.name}</h2>
                        {/* Edit button removed as the backend service for updates is not available. */}
                    </div>

                    <div className="profile-details">
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
                            <span className="value">{profile?.skill_level || 'Not set'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;