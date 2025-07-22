import React from 'react';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Layout from './Layout';
import apiClient from '../../utils/apiConfig';
import useToast from '../hooks/useToast.jsx';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../store/slices/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            dispatch(loginStart());
            
            const response = await apiClient.post('/organization', data);

            if (!response.status === 200) {
                throw new Error('Login failed');
            }

           const result = await response.data.data;
           
            // Dispatch success action
            dispatch(loginSuccess({
                user: result.user,
                token: result.token,
                role: result.user.is_admin ? 'admin' : 'user'
            }));
            showSuccess('Organization created successfully');
            debugger
            // Redirect based on role
            if (result.user.is_admin) {
                navigate('/dashboard');
            } else {
                navigate('/dashboard/chatbots');
            }
        } catch (error) {
            console.error('Login error:', error);
            dispatch(loginFailure(error.message));
            showError('Organization creation failed');
            setError('root', {
                type: 'manual',
                message: 'Invalid email or password'
            });
        }
    };

    return (
      
            <div className="w-full max-w-lg mx-auto p-6 flex">
                <div className="bg-white/10 px-14 py-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-white mb-6">Create Organization</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Organization Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                                Organization Name
                            </label>
                            <input
                                {...register('name', {
                                    required: 'Organization name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                                type="text"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter organization name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                                Username
                            </label>
                            <input
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                                })}
                                type="text"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Choose a username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                Email
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                Password
                            </label>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                })}
                                type="password"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                                Confirm Password
                            </label>
                            <input
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === watch('password') || 'Passwords do not match'
                                })}
                                type="password"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Organization...' : 'Create Organization'}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-4 text-center text-sm text-white">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>                
            </div>
     
    );
};

export default RegisterPage; 