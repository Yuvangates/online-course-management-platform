import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseSearch from './pages/student/CourseSearch';
import { CourseView } from './pages/student/CourseView';
import EnrolledCourses from './pages/student/EnrolledCourses';
import Profile from './pages/student/Profile';
import CourseGrades from './pages/student/CourseGrades';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorProfile from './pages/instructor/InstructorProfile';
import AssignedCourses from './pages/instructor/AssignedCourses';
import ManageCourse from './pages/instructor/ManageCourse';
import CourseGrade from './pages/instructor/CourseGrade';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from "./pages/admin/StudentManagement";
import StatsDashboard from './pages/analyst/StatsDashboard';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

// Import Styles
import './styles/main.css';

const AppContent = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/search"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <CourseSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:id"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <CourseView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/enrolled"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <EnrolledCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/grades"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <CourseGrades />
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <AssignedCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/course/:id/modules"
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <ManageCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/course/:id/grade"
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <CourseGrade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/profile"
          element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <InstructorProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        {/* Analyst Routes */}
        <Route
          path="/analyst/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Analyst']}>
              <StatsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;