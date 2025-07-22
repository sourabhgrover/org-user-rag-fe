import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import apiClient from '../../utils/apiConfig';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

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
        <div className="w-full max-w-lg mx-auto p-6 flex">
            <div className="bg-white/10 px-14 py-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-white mb-6">
                    Sign in to your account
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-px">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">Username</label>
                            <input
                                id="username"
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;