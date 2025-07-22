import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div>
            <h1 className="text-4xl md:text-5xl font-bold">Empower Your Organization</h1>
            <p className='text-gray-300 my-4'>Create AI-powered chatbots with your own documents. Manage users, permissions, and get instant answers.</p>
            <div className="space-y-3">
                <Link to="/register" className="block w-full text-center py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md font-semibold">
                    Create Organization
                </Link>
                <Link to="/login" className="block text-center text-sm underline text-gray-300 hover:text-white transition duration-300">
                    Already have an account? Sign In
                </Link>
            </div>
        </div>
    )
}

export default LandingPage