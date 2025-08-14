import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import apiClient from '../utils/apiConfig';

const ChatbotsPage = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState('');
    const messagesEndRef = useRef(null);
    const { organization_id } = useSelector((state) => state.auth?.user);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Typing animation function
    const typeMessage = (text, messageId) => {
        setIsTyping(true);
        let currentIndex = 0;
        const typingSpeed = 30; // milliseconds per character
        
        const typeChar = () => {
            if (currentIndex < text.length) {
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, text: text.substring(0, currentIndex + 1) }
                        : msg
                ));
                currentIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                setIsTyping(false);
            }
        };
        
        // Start typing
        typeChar();
    };

    // Initialize with a welcome message
    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: "Hello! I'm your AI assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date().toISOString()
            }
        ]);
    }, []);

    // Fetch documents for the organization
    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get(`doc`);
            if (response.data.status === 'success') {
                setDocuments(response.data.data);
            } else {
                console.error('Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    useEffect(() => {
        if (organization_id) {
            fetchDocuments();
        }
        
        // Check if a document was selected from the Documents page
        const selectedDocId = sessionStorage.getItem('selectedDocumentId');
        const selectedDocName = sessionStorage.getItem('selectedDocumentName');
        
        if (selectedDocId && selectedDocName) {
            setSelectedDocument(selectedDocId);
            
            // Add a system message indicating which document is selected
            const systemMessage = {
                id: Date.now(),
                text: `Ready to chat about: ${selectedDocName}`,
                sender: 'system',
                timestamp: new Date().toISOString()
            };
            
            setMessages([
                {
                    id: 1,
                    text: "Hello! I'm your AI assistant. How can I help you today?",
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                },
                systemMessage
            ]);
            
            // Clear the session storage
            sessionStorage.removeItem('selectedDocumentId');
            sessionStorage.removeItem('selectedDocumentName');
        }
    }, [organization_id]);

    const onSubmit = async (formData) => {
        const userMessage = formData.message.trim();
        if (!userMessage) return;

        // Add user message to chat
        const newUserMessage = {
            id: Date.now(),
            text: userMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newUserMessage]);
        reset(); // Clear the input
        setIsLoading(true);

        try {
            const requestData = {
                question: userMessage,
                // organization_id
            };

            // Add document_id if a specific document is selected
            if (selectedDocument) {
                requestData.document_id = selectedDocument;
            }

            const response = await apiClient.post('/qa/ask', requestData);

            if (response.data.status === 'success') {
                // Add bot response to chat with empty text first
                const botMessage = {
                    id: Date.now() + 1,
                    text: '',
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, botMessage]);
                
                // Start typing animation
                setTimeout(() => {
                    typeMessage(response.data.data.answer, botMessage.id);
                }, 500); // Small delay before starting to type
            } else {
                // Add error message as bot response
                const errorMessage = {
                    id: Date.now() + 1,
                    text: "Sorry, I encountered an error processing your request. Please try again.",
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, errorMessage]);
                toast.error('Failed to get response from chatbot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message as bot response
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm currently unavailable. Please try again later.",
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
            toast.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: "Hello! I'm your AI assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date().toISOString()
            }
        ]);
    };

    const handleDocumentChange = (e) => {
        setSelectedDocument(e.target.value);
        // Add a system message when document selection changes
        if (e.target.value) {
            const selectedDoc = documents.find(doc => doc.id === e.target.value);
            const systemMessage = {
                id: Date.now(),
                text: `Now searching in: ${selectedDoc?.name || 'Selected Document'}`,
                sender: 'system',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, systemMessage]);
        } else {
            const systemMessage = {
                id: Date.now(),
                text: "Now searching in: All Documents",
                sender: 'system',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, systemMessage]);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-br from-slate-50 to-blue-50"
        >
            {/* Clean Header */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-white border-b border-gray-200 shadow-sm"
            >
                {/* Single Header Row */}
                <div className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Title with Bot Icon */}
                        <div className="flex items-center space-x-3">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21,8c0,0-1.5-0.5-3.5-0.5S14.5,8,12,8s-3-0.5-5.5-0.5S3,8,3,8v8c0,0,1.5,0.5,3.5,0.5S9.5,16,12,16s3,0.5,5.5,0.5 S21,16,21,16V8z M12,14c-1.5,0-3-0.5-3-2s1.5-2,3-2s3,0.5,3,2S13.5,14,12,14z M12,11c-0.5,0-1,0.2-1,1s0.5,1,1,1s1-0.2,1-1 S12.5,11,12,11z"/>
                                    <circle cx="8.5" cy="12" r="1"/>
                                    <circle cx="15.5" cy="12" r="1"/>
                                </svg>
                            </motion.div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    AI Assistant
                                </h1>
                            </div>
                        </div>
                        
                        {/* Right: Controls */}
                        <div className="flex items-center space-x-3">
                            {/* Document Selection */}
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="hidden sm:flex items-center"
                            >
                                <select
                                    value={selectedDocument}
                                    onChange={handleDocumentChange}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white min-w-40"
                                >
                                    <option value="">All Documents</option>
                                    {documents.map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.name}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                            
                            {/* Clear Chat Button */}
                            <motion.button
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={clearChat}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                    
                    {/* Mobile Document Selection */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="sm:hidden mt-3"
                    >
                        <select
                            value={selectedDocument}
                            onChange={handleDocumentChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                        >
                            <option value="">All Documents</option>
                            {documents.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>
                </div>
            </motion.div>

            {/* Enhanced Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatePresence mode="popLayout">
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ 
                                    delay: index * 0.1, 
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end space-x-3 max-w-[85%] sm:max-w-lg md:max-w-xl`}>
                                    {/* Bot Avatar */}
                                    {message.sender === 'bot' && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM21 9V7C21 5.9 20.1 5 19 5S17 5.9 17 7V9C17 10.1 17.9 11 19 11S21 10.1 21 9ZM7 9V7C7 5.9 6.1 5 5 5S3 5.9 3 7V9C3 10.1 3.9 11 5 11S7 10.1 7 9ZM17.7 14.3C17.3 13.9 16.7 13.9 16.3 14.3L12 18.6L7.7 14.3C7.3 13.9 6.7 13.9 6.3 14.3S5.9 15.3 6.3 15.7L11.3 20.7C11.7 21.1 12.3 21.1 12.7 20.7L17.7 15.7C18.1 15.3 18.1 14.7 17.7 14.3Z"/>
                                            </svg>
                                        </motion.div>
                                    )}
                                    
                                    {/* Message Bubble */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto'
                                                : message.sender === 'system'
                                                ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200'
                                                : 'bg-white text-gray-800 border border-gray-200 shadow-md'
                                        }`}
                                    >
                                        {/* Message tail */}
                                        <div className={`absolute w-0 h-0 ${
                                            message.sender === 'user' 
                                                ? 'right-0 top-4 border-l-8 border-l-blue-500 border-t-4 border-t-transparent border-b-4 border-b-transparent transform translate-x-2'
                                                : 'left-0 top-4 border-r-8 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-x-2'
                                        }`} />
                                        
                                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                            {message.text}
                                        </p>
                                        <p className={`text-xs mt-2 opacity-70 ${
                                            message.sender === 'user' 
                                                ? 'text-blue-100' 
                                                : message.sender === 'system'
                                                ? 'text-amber-600'
                                                : 'text-gray-500'
                                        }`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                    </motion.div>
                                    
                                    {/* User Avatar */}
                                    {message.sender === 'user' && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {/* Enhanced Loading indicator */}
                    <AnimatePresence>
                        {(isLoading || isTyping) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex justify-start"
                            >
                                <div className="flex items-end space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM21 9V7C21 5.9 20.1 5 19 5S17 5.9 17 7V9C17 10.1 17.9 11 19 11S21 10.1 21 9ZM7 9V7C7 5.9 6.1 5 5 5S3 5.9 3 7V9C3 10.1 3.9 11 5 11S7 10.1 7 9ZM17.7 14.3C17.3 13.9 16.7 13.9 16.3 14.3L12 18.6L7.7 14.3C7.3 13.9 6.7 13.9 6.3 14.3S5.9 15.3 6.3 15.7L11.3 20.7C11.7 21.1 12.3 21.1 12.7 20.7L17.7 15.7C18.1 15.3 18.1 14.7 17.7 14.3Z"/>
                                        </svg>
                                    </div>
                                    <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl shadow-md">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">
                                                {isLoading ? 'AI is thinking...' : 'AI is typing...'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Enhanced Message Input */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="relative bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4 sm:p-6"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                <form onSubmit={handleSubmit(onSubmit)} className="relative max-w-4xl mx-auto">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1 relative">
                            <motion.div
                                whileFocus={{ scale: 1.02 }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    {...register('message', { required: 'Please enter a message' })}
                                    placeholder="Ask me anything about your documents..."
                                    className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-800 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                                    disabled={isLoading || isTyping}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                            </motion.div>
                            <AnimatePresence>
                                {errors.message && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-2 text-sm text-red-500 font-medium"
                                    >
                                        {errors.message.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                        <motion.button
                            type="submit"
                            disabled={isLoading || isTyping}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            {(isLoading || isTyping) ? (
                                <motion.svg 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 sm:w-6 sm:h-6" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </motion.svg>
                            ) : (
                                <motion.svg 
                                    whileHover={{ x: 2 }}
                                    className="w-5 h-5 sm:w-6 sm:h-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </motion.svg>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ChatbotsPage;
