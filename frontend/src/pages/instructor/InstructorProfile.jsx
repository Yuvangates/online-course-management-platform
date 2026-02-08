import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import '../../styles/instructor/instructor-profile.css';

const InstructorProfile = () => {
  const { user, login } = useAuth(); // Assuming login can be used to update user context or we need a refresh
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', country: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        country: user.country || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setError('');
      setMessage('');
      // Assuming instructorService has an updateUser method mapping to the backend
      const updatedUser = await instructorService.updateUser(user.user_id, {
        name: formData.name,
        country: formData.country
      });
      
      // Update local state and exit edit mode
      setIsEditing(false);
      setMessage('Profile updated successfully.');
      
      // Ideally update the global auth context here if possible, 
      // or trigger a reload/refetch. For now we rely on the local state update 
      // and the fact that the backend is updated.
      if (login) {
          // If login function accepts user data to update context without token
          // This depends on AuthContext implementation. 
          // If not available, a page reload might be needed to reflect changes in Navbar.
      }
      
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      country: user.country || '',
    });
    setIsEditing(false);
    setError('');
  };

  if (loading) return <div className="instructor-container"><p>Loading...</p></div>;

  return (
    <>
      <Navbar role="Instructor" />
      <div className="instructor-container">
        <div className="profile-header-section">
          <h1>My Profile</h1>
          <p className="muted">Manage your personal information and account settings.</p>
        </div>

        {error && <div className="alert error" style={{ maxWidth: '800px', margin: '0 auto 1rem auto' }}>{error}</div>}
        {message && <div className="alert success" style={{ maxWidth: '800px', margin: '0 auto 1rem auto' }}>{message}</div>}

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {formData.name.charAt(0) || 'I'}
            </div>
            <div className="profile-title" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2 style={{ margin: 0 }}>{isEditing ? 'Edit Profile' : formData.name}</h2>
              <span className="role-badge">Instructor</span>
            </div>
            <div>
              {!isEditing ? (
                <button className="btn-instructor outline" onClick={() => setIsEditing(true)}>Edit Profile</button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-instructor primary" onClick={handleSave}>Save</button>
                  <button className="btn-instructor secondary" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-grid">
            <div className="detail-group">
              <label>Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="value">{formData.name}</div>
              )}
            </div>
            <div className="detail-group">
              <label>Email Address</label>
              <div className="value" style={{ background: '#f0f0f0', color: '#888' }}>{user?.email}</div>
            </div>
            <div className="detail-group">
              <label>Country</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="country" 
                  className="form-input" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                />
              ) : (
                <div className="value">{formData.country || 'Not set'}</div>
              )}
            </div>
            <div className="detail-group">
              <label>Account Type</label>
              <div className="value">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorProfile;