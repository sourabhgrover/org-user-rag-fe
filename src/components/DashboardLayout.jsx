import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.auth)
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { title: 'Dashboard', icon: '📊', path: '/dashboard' },
        { title: 'Chatbots', icon: '🤖', path: '/dashboard/chatbots' },
        { title: 'Documents', icon: '📄', path: '/dashboard/documents' },
        { title: 'Users', icon: '👥', path: '/dashboard/users' },
        { title: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isSidebarOpen ? 0 : -300 }}
                className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50"
            >
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800">AI Chatbot</h2>
                </div>
                <nav className="mt-4">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </motion.div>

            {/* Main Content */}
            <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-md hover:bg-gray-100 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-slate-200 rounded-md shadow-lg py-1"
                                    >
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            {`@${user?.username}`}
                                        </div>
                                        <Link
                                            to="/dashboard/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit Profile
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 