import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
//import ParticlesBackground from "../components/ParticleBg.jsx";

const Layout = ({children}) => {
    return (
        <div className="relative w-full">
            {/* === Hero Section === */}
            <div className="relative h-screen bg-cover bg-center flex items-center justify-start px-8 md:px-20" style={{ backgroundImage: `url('/tech-bg.jpg')` }}>
                {/*<div className="absolute inset-0">
                    <ParticlesBackground />
                </div>*/}
                <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-xl text-white space-y-6"
                >
                    {children}
                </motion.div>
                <div className="relative px-14 py-8 rounded-lg ">
                    <div className="space-y-6 text-white">
                        <h2 className="text-2xl font-semibold">AI-Powered Document Assistant</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm">Upload your documents and let our AI create an intelligent chatbot that can answer questions based on your content.</p>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm">Get instant, accurate responses to queries about your organization's documents and procedures.</p>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm">Manage user access and permissions to ensure secure handling of sensitive information.</p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-white/5 rounded-md">
                            <p className="text-sm italic text-gray-300">
                                "Transform your organization's knowledge management with our AI-powered chatbot solution. Quick setup, immediate results."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* The rest of your sections... (Features, CTA, Footer) */}
            
        </div>
    );
};

export default Layout;
