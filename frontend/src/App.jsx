import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StatsDashboard from './pages/analyst/StatsDashboard';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

// Import Styles
import './styles/main.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              // <ProtectedRoute userRole="Student" allowedRoles={['Student']}>
              <StudentDashboard />
              // </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              // <ProtectedRoute userRole="Instructor" allowedRoles={['Instructor']}>
              <InstructorDashboard />
              // </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute userRole="Admin" allowedRoles={['Admin']}>
              <AdminDashboard />
              // </ProtectedRoute>
            }
          />

          {/* Analyst Routes */}
          <Route
            path="/analyst/dashboard"
            element={
              // <ProtectedRoute userRole="Analyst" allowedRoles={['Analyst']}>
              <StatsDashboard />
              // </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;