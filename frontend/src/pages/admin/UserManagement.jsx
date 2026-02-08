import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../api/adminService';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAllUsers();
      setUsers(response);
      setFilteredUsers(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await adminService.searchUsers(searchQuery);
      setFilteredUsers(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      Student: 'S',
      Instructor: 'I',
      Admin: 'A',
      Analyst: 'An',
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      Student: 'student',
      Instructor: 'instructor',
      Admin: 'admin',
      Analyst: 'analyst',
    };
    return colorMap[role] || 'student';
  };

  return (
    <div className="users-container">
      <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
        ← Back to Dashboard
      </button>
      <div className="users-header">
        <h2>User Management</h2>
        <div className="users-search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="users-stats">
        <span>Total Users: {users.length}</span>
        <span>Showing: {filteredUsers.length}</span>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="users-empty">
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user.user_id} className="user-card">
              <div className="user-header">
                <div className={`user-badge ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>

              <div className={`user-role-badge ${getRoleColor(user.role)}`}>
                {user.role}
              </div>

              <div className="user-details">
                <div className="detail-row">
                  <span className="detail-label">Country:</span>
                  <span className="detail-value">{user.country || 'N/A'}</span>
                </div>
                {user.role === 'Student' && user.skill_level && (
                  <div className="detail-row">
                    <span className="detail-label">Skill Level:</span>
                    <span className="detail-value">{user.skill_level}</span>
                  </div>
                )}
                {user.role === 'Instructor' && user.expertise && (
                  <div className="detail-row">
                    <span className="detail-label">Expertise:</span>
                    <span className="detail-value">{user.expertise}</span>
                  </div>
                )}
              </div>

              <div className="user-actions">
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteUser(user.user_id, user.name)}
                >
                  Remove Account
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
