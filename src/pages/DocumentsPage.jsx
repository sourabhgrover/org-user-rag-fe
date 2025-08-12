import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiConfig';

const DocumentsPage = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { organization_id } = useSelector((state) => state.auth?.user);
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch documents for the organization
    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get(`doc`);
            if (response.data.status === 'success') {
                setDocuments(response.data.data);
            } else {
                toast.error('Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to fetch documents');
        }
    };

    useEffect(() => {
        if (organization_id) {
            fetchDocuments();
        }
    }, [organization_id]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const onSubmit = async (formData) => {
        try {
            setUploading(true);
            const formDataToSend = new FormData();
            
            // Append each file to FormData with the name 'file'
            selectedFiles.forEach((file) => {
                formDataToSend.append('file', file);
            });

            const response = await apiClient.post(`doc`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            const { status, message } = response.data;
            
            if (status === 'success') {
                toast.success(message || 'Documents uploaded successfully!');
                setIsUploadModalOpen(false);
                reset();
                setSelectedFiles([]);
                // Refresh the documents list
                await fetchDocuments();
            } else {
                toast.error(message || 'Failed to upload documents');
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
            toast.error(error.response?.data?.message || 'Failed to upload documents');
        } finally {
            setUploading(false);
        }
    };

    /*const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };*/

    const handleChatWithDocument = (documentId, documentName) => {
        // Store the selected document in sessionStorage to be picked up by ChatbotsPage
        sessionStorage.setItem('selectedDocumentId', documentId);
        sessionStorage.setItem('selectedDocumentName', documentName);
        
        // Navigate to chatbots page
        navigate('/dashboard/chatbots');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Upload Documents
                </button>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Filename</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Path</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map((doc) => (
                            <tr key={doc.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{doc.unique_filename}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        <a className="text-blue-600 hover:text-blue-900" href={doc.path} target="_blank" rel="noopener noreferrer">
                                            {doc.path}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => handleChatWithDocument(doc.id, doc.name)}
                                        className="text-green-600 hover:text-green-900 mr-3"
                                    >
                                        Chat
                                    </button>
                                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Upload Documents Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Upload Documents</h2>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select PDF Files</label>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                {selectedFiles.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Selected files:</p>
                                        <ul className="mt-1 text-sm text-gray-500">
                                            {selectedFiles.map((file, index) => (
                                                <li key={index}>{file.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || selectedFiles.length === 0}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Documents'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsPage; 