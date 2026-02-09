import { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAllUsers();
      const studentsOnly = response.filter(user => user.role === 'Student');
      setStudents(studentsOnly);
      setFilteredStudents(studentsOnly);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName}?`)) {
      return;
    }

    try {
      await adminService.deleteUser(studentId);
      await fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove student');
    }
  };

  return (
    <div className="management-container">
      <div className="section-header">
        <h2>Student Management</h2>
      </div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <p>No students found</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredStudents.map((student) => (
            <div key={student.user_id} className="card">
              <div className="card-header">
                <h3>{student.name}</h3>
              </div>
              <div className="card-content">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Country:</strong> {student.country || 'N/A'}</p>
                {student.skill_level && (
                  <p><strong>Skill Level:</strong> {student.skill_level}</p>
                )}
              </div>
              <div className="card-actions">
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteStudent(student.user_id, student.name)}
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

export default StudentManagement;
