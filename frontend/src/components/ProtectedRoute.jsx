import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component wraps pages that need login
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>403 - Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;