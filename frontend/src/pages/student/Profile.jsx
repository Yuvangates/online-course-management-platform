import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import authService from '../../api/authService';
import '../../styles/student/student-profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        setProfile(response.user);
      } catch (err) {
        setError('Failed to load profile');
        // Fallback to user from context
        if (user) {
          setProfile(user);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return (
    <>
      <Navbar role="Student" />
      <div className="student-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading profile...</p>
      </div>
    </>
  );

  if (!profile) return (
    <>
      <Navbar role="Student" />
      <div className="student-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Unable to load profile</p>
      </div>
    </>
  );

  const age = (() => {
    if (!profile.date_of_birth) return '--';
    const dob = new Date(profile.date_of_birth);
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  })();

  return (
    <>
      <Navbar role="Student" />
      <div className="student-container">
        <div className="dashboard-hero">
          <div className="hero-text">
            <h1>My Profile</h1>
            <p className="muted">View and manage your profile information</p>
          </div>
        </div>

        {error && <div style={{ color: '#c62828', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

        <div className="profile-card course-card">
          <h3>{profile.name}</h3>
          <p className="muted">{profile.role} • ID: {profile.user_id}</p>

          <div style={{ marginTop: 12 }}>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Country:</strong> {profile.country || 'Not specified'}</p>
            {profile.date_of_birth && <p><strong>Date of Birth:</strong> {profile.date_of_birth} ({age} years)</p>}
            {profile.skill_level && <p><strong>Skill Level:</strong> {profile.skill_level}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
