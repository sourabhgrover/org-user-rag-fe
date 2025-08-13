import React from 'react';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Layout from './Layout';
import apiClient from '../utils/apiConfig';
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
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                    maxLength: { value: 100, message: 'Name must be less than 100 characters' }
                                })}
                                type="text"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter organization name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
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
                        Already have an organization?{' '}
                        <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>                
            </div>
     
    );
};

export default RegisterPage; 