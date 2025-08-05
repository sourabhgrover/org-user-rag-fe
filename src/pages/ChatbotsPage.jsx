import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import apiClient from '../../utils/apiConfig';

const ChatbotsPage = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await apiClient.get(`doc/${organization_id}`);
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
                // Add bot response to chat
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.data.data.answer,
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, botMessage]);
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
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">AI Chatbot</h1>
                    <p className="text-sm text-gray-600">Chat with your organization's AI assistant</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="document-select" className="text-sm font-medium text-gray-700">
                            Search in:
                        </label>
                        <select
                            id="document-select"
                            value={selectedDocument}
                            onChange={handleDocumentChange}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Documents</option>
                            {documents.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={clearChat}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Clear Chat
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                                    message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : message.sender === 'system'
                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                            >
                                <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' 
                                        ? 'text-blue-100' 
                                        : message.sender === 'system'
                                        ? 'text-yellow-600'
                                        : 'text-gray-500'
                                }`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-500">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                {...register('message', { required: 'Please enter a message' })}
                                placeholder="Type your message here..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            {errors.message && (
                                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatbotsPage;
