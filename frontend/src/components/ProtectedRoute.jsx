import React from 'react';
import { Navigate } from 'react-router-dom';

// This component wraps pages that need login
// For now, we simulate "isLoggedIn" with a simple check
const ProtectedRoute = ({ children, allowedRoles, userRole }) => {

    // 1. Check if user is logged in (Mock logic for now)
    const isLoggedIn = true;

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // 2. Check if user has permission
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>403 - Access Denied</h2>
            <p>You do not have permission to view this page.</p>
        </div>;
    }

    return children;
};

export default ProtectedRoute;