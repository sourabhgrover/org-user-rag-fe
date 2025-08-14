import React from "react";
import { motion } from "framer-motion";

const Layout = ({children}) => {
    return (
        <div className="relative w-full">
            {/* === Professional Background === */}
            <div className="relative min-h-screen">
                {/* Professional Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
                
                {/* Animated Geometric Patterns */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Large Circle - Top Right */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute -top-1/4 -right-1/4 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"
                    />
                    
                    {/* Medium Circle - Bottom Left */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.15 }}
                        transition={{ duration: 2, delay: 1 }}
                        className="absolute -bottom-1/4 -left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"
                    />
                    
                    {/* Small Accent Circle - Center */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 2, delay: 1.5 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-full blur-xl"
                    />
                    
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="h-full w-full" style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }} />
                    </div>
                    
                    {/* Floating Particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ 
                                opacity: [0.2, 0.5, 0.2], 
                                y: [-20, -100, -20],
                                x: [0, 20, 0]
                            }}
                            transition={{ 
                                duration: 6 + i * 2,
                                repeat: Infinity,
                                delay: i * 0.8
                            }}
                            className={`absolute w-2 h-2 bg-blue-400/30 rounded-full blur-sm`}
                            style={{
                                left: `${20 + i * 15}%`,
                                bottom: '10%'
                            }}
                        />
                    ))}
                </div>

                {/* Content Overlay */}
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
                            {/* Enhanced Feature Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl"
                            >
                                <div className="space-y-4 sm:space-y-6 text-white">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                <circle cx="16" cy="8" r="3" fill="currentColor" stroke="none" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                                            </svg>
                                        </div>
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                                            AI-Powered RAG Assistant
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                icon: "📄",
                                                title: "Smart Document Processing",
                                                desc: "Upload your documents and let our AI create an intelligent chatbot that can answer questions based on your content."
                                            },
                                            {
                                                icon: "⚡",
                                                title: "Instant Responses",
                                                desc: "Get instant, accurate responses to queries about your organization's documents and procedures."
                                            },
                                            {
                                                icon: "🔒",
                                                title: "Secure Access Control",
                                                desc: "Manage user access and permissions to ensure secure handling of sensitive information."
                                            }
                                        ].map((feature, index) => (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                                className="flex items-start space-x-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                                            >
                                                <div className="flex-shrink-0 mt-1 text-2xl">
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-blue-200 mb-1">{feature.title}</h4>
                                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                                        {feature.desc}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Quote Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2, duration: 0.6 }}
                                        className="relative mt-6 sm:mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20"
                                    >
                                        <div className="absolute top-2 left-2 text-blue-300/40 text-4xl font-serif">"</div>
                                        <p className="text-xs sm:text-sm italic text-blue-100 pl-8 pr-2 leading-relaxed">
                                            Transform your organization's knowledge management with our AI-powered chatbot solution. Quick setup, immediate results.
                                        </p>
                                        <div className="flex items-center justify-end mt-3">
                                            <div className="flex space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.svg
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
                                                        className="w-3 h-3 text-yellow-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </motion.svg>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
