import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = useSelector((state) => state.auth?.role);
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // 🔥 Role Check
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Non-admins will be redirected to /chatbot automatically
        return <Navigate to="user-dashboard/chatbot" replace />;
    }

    return children;
};

export default PrivateRoute;
