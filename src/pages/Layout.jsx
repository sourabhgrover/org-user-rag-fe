import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
//import ParticlesBackground from "../components/ParticleBg.jsx";

const Layout = ({children}) => {
    return (
        <div className="relative w-full">
            {/* === Hero Section === */}
            <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/tech-bg.jpg')` }}>
                <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

                {/* Mobile Layout - Split into two sections */}
                <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
                    {/* Left Section - Form/Children Content */}
                    <div className="flex items-center justify-center lg:justify-start w-full lg:w-1/2 px-4 sm:px-6 md:px-8 lg:px-20 py-8 lg:py-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-md lg:max-w-xl text-white space-y-6 w-full"
                        >
                            {children}
                        </motion.div>
                    </div>

                    {/* Right Section - Information/Features */}
                    <div className="flex items-center justify-center w-full lg:w-1/2 px-4 sm:px-6 md:px-8 lg:px-14 py-8 lg:py-0">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-md lg:max-w-lg w-full"
                        >
                            <div className="space-y-4 sm:space-y-6 text-white">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center lg:text-left">
                                    AI-Powered Document Assistant
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs sm:text-sm leading-relaxed">
                                            Upload your documents and let our AI create an intelligent chatbot that can answer questions based on your content.
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs sm:text-sm leading-relaxed">
                                            Get instant, accurate responses to queries about your organization's documents and procedures.
                                        </p>
                                    </div>

                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs sm:text-sm leading-relaxed">
                                            Manage user access and permissions to ensure secure handling of sensitive information.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/5 rounded-md">
                                    <p className="text-xs sm:text-sm italic text-gray-300 text-center lg:text-left">
                                        "Transform your organization's knowledge management with our AI-powered chatbot solution. Quick setup, immediate results."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* The rest of your sections... (Features, CTA, Footer) */}
            
        </div>
    );
};

export default Layout;
