import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../utils/apiConfig';
import useToast from '../hooks/useToast.jsx';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart } from '../store/slices/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            dispatch(loginStart());
            
            const response = await apiClient.post('/organization', data);

            if (response.status !== 201) {
                throw new Error('Organization creation failed');
            }

            const result = response.data;
            
            // Check if the response indicates success
            if (result.status === 'success') {
                showSuccess(result.message || 'Organization created successfully');
                
                // Since this is just organization creation, redirect to login
                // The user will need to login after organization creation
                navigate('/login');
            } else {
                throw new Error(result.message || 'Organization creation failed');
            }
            
        } catch (error) {
            console.error('Organization creation error:', error);
            dispatch(loginFailure(error.message));
            showError(error.response?.data?.message || 'Organization creation failed');
            setError('root', {
                type: 'manual',
                message: error.response?.data?.message || 'Organization creation failed'
            });
        }
    };

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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </motion.div>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Create Organization
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">
                        Get started with your AI-powered document assistant
                    </p>
                </div>
            </motion.div>

            {/* Registration Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                    {/* Organization Name Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                            Organization Name
                        </label>
                        <div className="relative">
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                {...register('name', {
                                    required: 'Organization name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                    maxLength: { value: 100, message: 'Name must be less than 100 characters' }
                                })}
                                type="text"
                                className="w-full px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
                                placeholder="Enter your organization name"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        </div>
                        <AnimatePresence>
                            {errors.name && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-400 font-medium"
                                >
                                    {errors.name.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Features Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                        <h4 className="text-sm font-medium text-blue-300 mb-3">What you'll get:</h4>
                        <div className="space-y-2">
                            {[
                                'AI-powered document search',
                                'Intelligent chatbot assistant',
                                'User management system',
                                'Secure document storage'
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                                    className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300"
                                >
                                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
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
                                    <span>Creating Organization...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Organization</span>
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

                    {/* Root Error Display */}
                    <AnimatePresence>
                        {errors.root && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                            >
                                <p className="text-sm text-red-400 font-medium text-center">
                                    {errors.root.message}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>

            {/* Login Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center"
            >
                <p className="text-gray-300 text-sm sm:text-base">
                    Already have an organization?{' '}
                    <Link 
                        to="/login" 
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors duration-200"
                    >
                        Sign in here
                    </Link>
                </p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center justify-center space-x-6 pt-4 border-t border-white/10"
            >
                {[
                    { icon: '🔒', text: 'Secure' },
                    { icon: '⚡', text: 'Fast Setup' },
                    { icon: '📊', text: 'Analytics' }
                ].map((item, index) => (
                    <motion.div
                        key={item.text}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                        className="flex flex-col items-center space-y-1"
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs text-gray-400">{item.text}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default RegisterPage; 