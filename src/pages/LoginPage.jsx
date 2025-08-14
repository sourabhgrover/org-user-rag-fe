import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import apiClient from '../utils/apiConfig';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

    // Redirect if user is already logged in
    useEffect(() => {
        if (isAuthenticated) {
            if (user?.is_admin) {
                navigate('/dashboard');
            } else {
                navigate('/user-dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (formData) => {
        try {
            dispatch(loginStart());
            const response = await apiClient.post('/token', formData);
            const { status, data, message } = response.data;
            if (status === 'success') {
                // Ensure we have the token in the response data
                if (!data.token) {
                    throw new Error('No token received from server');
                }

                // Prepare user data with role
                const userData = {
                    ...data.user,
                    role: data.user.is_admin ? 'admin' : 'user'
                };

                // Dispatch success with both token and user data
                dispatch(loginSuccess({
                    token: data.token,
                    user: userData
                }));

                toast.success('Login successful!');
                // Redirect based on role
                if (data.user.is_admin) {
                    navigate('/dashboard');
                } else {
                    navigate('/user-dashboard');
                }
            } else {
                dispatch(loginFailure(message));
                toast.error(message || 'Invalid credentials');
                setError('username', { message: message || 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            dispatch(loginFailure(errorMessage));
            toast.error(errorMessage);
            setError('username', { message: errorMessage });
        }
    };

    // Don't render the login form if user is authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto space-y-6 sm:space-y-8"
        >
            {/* Header with Icon */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center space-y-4"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto"
                >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <circle cx="16" cy="8" r="3" fill="currentColor" stroke="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                    </svg>
                </motion.div>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">
                        Sign in to access your AI assistant
                    </p>
                </div>
            </motion.div>

            {/* Login Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                    {/* Username Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                id="username"
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                className="w-full px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter your username"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        </div>
                        <AnimatePresence>
                            {errors.username && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-400 font-medium"
                                >
                                    {errors.username.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="w-full px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter your password"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        </div>
                        <AnimatePresence>
                            {errors.password && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-400 font-medium"
                                >
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="flex items-center justify-center space-x-2">
                            {isSubmitting ? (
                                <>
                                    <motion.svg 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </motion.svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <motion.svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </motion.svg>
                                </>
                            )}
                        </div>
                    </motion.button>
                </form>
            </motion.div>

            {/* Register Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-center"
            >
                <p className="text-gray-300 text-sm sm:text-base">
                    Don't have an organization?{' '}
                    <Link 
                        to="/register" 
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors duration-200"
                    >
                        Create one now
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default LoginPage;