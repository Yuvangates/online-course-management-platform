import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/student.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Try to load from localStorage if available (placeholder until backend)
    const p = JSON.parse(localStorage.getItem('studentProfile') || 'null');
    if (p) setProfile(p);
    else {
      // Dummy profile based on schema
      setProfile({
        user_id: 1001,
        email: 'student@example.edu',
        full_name: 'Alex Student',
        role: 'Student',
        country: 'India',
        date_of_birth: '2000-05-12',
        skill_level: 'Intermediate'
      });
    }
  }, []);

  if (!profile) return null;

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
            <h1>Profile</h1>
            <p className="muted">Your profile will be editable once the backend is connected.</p>
          </div>
        </div>

        <div className="profile-card course-card">
          <h3>{profile.full_name}</h3>
          <p className="muted">{profile.role} • ID: {profile.user_id}</p>

          <div style={{ marginTop: 12 }}>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Country:</strong> {profile.country}</p>
            <p><strong>Date of Birth:</strong> {profile.date_of_birth} ({age} yrs)</p>
            <p><strong>Skill Level:</strong> {profile.skill_level}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
