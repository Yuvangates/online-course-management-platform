import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Sidebar';
import instructorService from '../../api/instructorService';
import '../../styles/instructor/instructor-profile.css';

const InstructorProfile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({ name: '', country: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        country: user.country || '',
        email: user.email || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, form } = e.target;
    if (form.id === 'profileForm') {
      setProfileData(prev => ({ ...prev, [name]: value }));
    } else if (form.id === 'passwordForm') {
      setPasswordData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Helper to show temporary messages
  const showTempMessage = (setter, message, duration = 3000) => {
    setter(message);
    setTimeout(() => setter(''), duration);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');
    try {
      const res = await instructorService.updateProfile(profileData);
      showTempMessage(setProfileMessage, res.message || 'Profile updated successfully.');
      // Update user in AuthContext
      if (login && res.user) {
        const updatedUser = { ...user, ...res.user };
        login(localStorage.getItem('token'), updatedUser);
      }
    } catch (err) {
      console.error('Failed to update profile', err);
      const errorMsg = err.response?.data?.error || 'Failed to update profile. Please try again.';
      showTempMessage(setProfileError, errorMsg, 4000);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    if (!passwordData.currentPassword) {
      showTempMessage(setPasswordError, 'Current password is required.', 4000);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showTempMessage(setPasswordError, 'New passwords do not match.', 4000);
      return;
    }
    try {
      const res = await instructorService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showTempMessage(setPasswordMessage, res.message || 'Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to update password', err);
      const errorMsg = err.response?.data?.error || 'Failed to update password. Please try again.';
      showTempMessage(setPasswordError, errorMsg, 4000);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name || '',
      country: user.country || '',
      email: user.email || '',
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsEditing(false);
    setProfileError('');
    setPasswordError('');
  };

  if (loading) return <div className="instructor-container"><p>Loading...</p></div>;

  return (
    <>
      <Navbar role="Instructor" />
      <div className="instructor-container">
        <div className="profile-page">
          <div className="profile-topbar">
            <h1>My Profile</h1>
            {!isEditing && (
              <button className="btn-instructor outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-card">
            <div className="profile-hero">
              <div className="profile-avatar">
                {profileData.name.charAt(0) || 'I'}
              </div>
              <h2>{profileData.name}</h2>
              <p className="profile-role">Instructor</p>
            </div>

            {isEditing ? (
              <form id="profileForm" onSubmit={handleProfileSave} className="profile-form">
                {profileError && <div className="alert error">{profileError}</div>}
                {profileMessage && <div className="alert success">{profileMessage}</div>}
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" name="name" className="input-field" value={profileData.name} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" name="email" className="input-field" value={profileData.email} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Country</label>
                  <input type="text" name="country" className="input-field" value={profileData.country} onChange={handleInputChange} />
                </div>
                <div className="profile-actions">
                  <button type="submit" className="btn-instructor primary">Save Profile</button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-card">
                  <p className="detail-label">Email Address</p>
                  <p className="detail-value">{profileData.email}</p>
                </div>
                <div className="detail-card">
                  <p className="detail-label">Country</p>
                  <p className="detail-value">{profileData.country || 'Not set'}</p>
                </div>
                <div className="detail-card">
                  <p className="detail-label">Account Type</p>
                  <p className="detail-value">{user?.role}</p>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="profile-section">
                <h3>Change Password</h3>
                <form id="passwordForm" onSubmit={handlePasswordSave} className="profile-form">
                  {passwordError && <div className="alert error">{passwordError}</div>}
                  {passwordMessage && <div className="alert success">{passwordMessage}</div>}
                  <div className="input-group">
                    <label className="input-label">Current Password</label>
                    <input type="password" name="currentPassword" className="input-field" placeholder="Required to change password" value={passwordData.currentPassword} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">New Password</label>
                    <input type="password" name="newPassword" className="input-field" placeholder="Leave blank to keep current" alue={passwordData.newPassword} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Confirm New Password</label>
                    <input type="password" name="confirmPassword" className="input-field" value={passwordData.confirmPassword} onChange={handleInputChange} required />
                  </div>
                  <div className="profile-actions">
                    <button type="submit" className="btn-instructor primary">Update Password</button>
                    <button type="button" className="btn-instructor danger" onClick={handleCancel}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorProfile;