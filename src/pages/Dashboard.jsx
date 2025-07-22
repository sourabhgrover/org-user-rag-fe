import React from 'react';

const Dashboard = () => {
    return (
      
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Total Chatbots</h3>
                    <p className="text-3xl font-bold text-green-500 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
                    <p className="text-3xl font-bold text-blue-500 mt-2">245</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Documents Processed</h3>
                    <p className="text-3xl font-bold text-purple-500 mt-2">1,234</p>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-500">📝</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Document uploaded and processed</p>
                                    <p className="text-xs text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
       
    );
};

export default Dashboard; 