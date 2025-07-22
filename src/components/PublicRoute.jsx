import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = useSelector((state) => state.auth.role);
    const location = useLocation();

    if (isAuthenticated) {
        // If user is authenticated, redirect based on role
        if (userRole === 'admin') {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/user-dashboard" replace />;
        }
    }

    return children;
};

export default PublicRoute; 