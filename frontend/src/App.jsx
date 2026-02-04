import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseSearch from './pages/student/CourseSearch';
import CourseView from './pages/student/CourseView';
import EnrolledCourses from './pages/student/EnrolledCourses';
import Profile from './pages/student/Profile';
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
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              // <ProtectedRoute userRole="Student" allowedRoles={['Student']}>
              <StudentDashboard />
              // </ProtectedRoute>
            }
          />
          <Route path="/student/search" element={<CourseSearch />} />
          <Route path="/student/course/:id" element={<CourseView />} />
          <Route path="/student/enrolled" element={<EnrolledCourses />} />
          <Route path="/student/profile" element={<Profile />} />

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