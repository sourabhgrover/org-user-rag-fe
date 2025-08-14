import React from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
        >
            {/* Logo/Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                className="flex justify-center"
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <circle cx="16" cy="8" r="3" fill="currentColor" stroke="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                    </svg>
                </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-3 sm:space-y-4 text-center lg:text-left"
            >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                    Empower Your Organization
                </h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mx-auto lg:mx-0 max-w-40"
                />
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gray-200 text-base sm:text-lg lg:text-xl leading-relaxed text-center lg:text-left max-w-2xl"
            >
                Create AI-powered chatbots with your own documents. Manage users, permissions, and get instant answers with our intelligent RAG system.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start"
            >
                {['Document Search', 'AI Chat', 'User Management', 'Secure Access'].map((feature, index) => (
                    <motion.span
                        key={feature}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm text-blue-100 border border-white/20"
                    >
                        {feature}
                    </motion.span>
                ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="space-y-3 sm:space-y-4 pt-2 sm:pt-4"
            >
                <Link to="/register">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base lg:text-lg"
                    >
                        <div className="flex items-center justify-center space-x-2">
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
                        </div>
                    </motion.button>
                </Link>

                <Link to="/login">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 sm:py-3 px-6 text-center text-sm sm:text-base text-blue-200 hover:text-white font-medium border border-blue-300/30 hover:border-blue-300/60 rounded-xl backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
                    >
                        Already have an account? Sign In
                    </motion.button>
                </Link>
            </motion.div>

            {/* Stats/Trust Indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="pt-6 sm:pt-8 border-t border-white/10"
            >
                <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center lg:text-left">
                    {[
                        { number: '10K+', label: 'Documents Processed' },
                        { number: '99.9%', label: 'Uptime' },
                        { number: '500+', label: 'Organizations' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                            className="space-y-1"
                        >
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-300">
                                {stat.number}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default LandingPage