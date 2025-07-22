import { Suspense } from 'react';
import { useRoutes, Outlet, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import RegistrationPage from '../pages/RegisterPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import Layout from '../pages/Layout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import UsersPage from '../pages/UsersPage.jsx';
import PrivateRoute from '../components/PrivateRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';
import DocumentsPage from '../pages/DocumentsPage';
import UserDashboardLayout from '../components/UserDashboardLayout.jsx';
import UserChatbot from '../pages/UserChatbot.jsx';
import UserDashboard from '../pages/UserDashboard.jsx';

export default function AppRoutes() {
    const routes = useRoutes([
        // Public Layout
        {
            element: (
                <Suspense>
                   
                        <Layout>
                            <Outlet />
                        </Layout>
                  
                </Suspense>
            ),
            children: [
                { index: true, element: <LandingPage /> },
                { path: '/register', element: <RegistrationPage /> },
                { path: '/login', element: <LoginPage /> },
            ]
        },
        {
            path: '/user-dashboard',
            element: (
                <Suspense>
                    <PrivateRoute allowedRoles={['user']}>
                        <UserDashboardLayout>
                            <Outlet />
                        </UserDashboardLayout>
                    </PrivateRoute>
                </Suspense>
            ),
            children: [
                { index: true, element: <UserDashboard /> },
                { path: 'chatbot', element: <UserChatbot /> },

            ]
        },
        // Dashboard (Admin Only)
        {
            path: '/dashboard',
            element: (
                <Suspense>
                    <PrivateRoute allowedRoles={['admin']}>
                        <DashboardLayout>
                            <Outlet />
                        </DashboardLayout>
                    </PrivateRoute>
                </Suspense>
            ),
            children: [
                { index: true, element: <Dashboard /> },
                { path: 'chatbots', element: <div>Chatbots Page</div> },
                { path: 'documents', element: <DocumentsPage /> },
                { path: 'users', element: <UsersPage /> },
                { path: 'settings', element: <div>Settings Page</div> },
                { path: 'profile', element: <div>Profile Page</div> }
            ]
        }
    ]);

    return routes;
}
