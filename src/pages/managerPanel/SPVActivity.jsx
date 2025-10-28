import React, { useState } from "react";

const SPVActivity = () => {
  const [filter, setFilter] = useState("all");

  const activities = [
    {
      id: 1,
      type: "investment",
      title: "New Investment Received",
      description: "John Smith invested $50,000 in the SPV",
      timestamp: "2 hours ago",
      user: "John Smith",
      amount: "$50,000",
      icon: "💰",
      color: "text-green-600"
    },
    {
      id: 2,
      type: "document",
      title: "Document Uploaded",
      description: "Investment Agreement v1.2 uploaded by John Manager",
      timestamp: "4 hours ago",
      user: "John Manager",
      document: "Investment Agreement v1.2",
      icon: "📄",
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "status",
      title: "Status Updated",
      description: "SPV status changed from 'Draft' to 'Raising'",
      timestamp: "1 day ago",
      user: "System",
      status: "Draft → Raising",
      icon: "🔄",
      color: "text-yellow-600"
    },
    {
      id: 4,
      type: "investor",
      title: "Investor Invited",
      description: "Sarah Johnson was invited to join the SPV",
      timestamp: "2 days ago",
      user: "John Manager",
      investor: "Sarah Johnson",
      icon: "👤",
      color: "text-purple-600"
    },
    {
      id: 5,
      type: "document",
      title: "Document Signed",
      description: "Term Sheet signed by Michael Brown",
      timestamp: "3 days ago",
      user: "Michael Brown",
      document: "Term Sheet",
      icon: "✍️",
      color: "text-green-600"
    },
    {
      id: 6,
      type: "system",
      title: "SPV Created",
      description: "Tech Startup Fund Q4 2024 SPV was created",
      timestamp: "1 week ago",
      user: "John Manager",
      spv: "Tech Startup Fund Q4 2024",
      icon: "🏗️",
      color: "text-indigo-600"
    }
  ];

  const filters = [
    { id: "all", label: "All Activity", count: activities.length },
    { id: "investment", label: "Investments", count: activities.filter(a => a.type === "investment").length },
    { id: "document", label: "Documents", count: activities.filter(a => a.type === "document").length },
    { id: "status", label: "Status Changes", count: activities.filter(a => a.type === "status").length },
    { id: "investor", label: "Investors", count: activities.filter(a => a.type === "investor").length }
  ];

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Activity Feed</h2>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Settings
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6">
        {filters.map((filterItem) => (
          <button
            key={filterItem.id}
            onClick={() => setFilter(filterItem.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterItem.id
                ? "bg-[#00F0C3] text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filterItem.label} ({filterItem.count})
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            {/* Timeline Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg ${activity.color}`}>
              {activity.icon}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  
                  {/* Activity Details */}
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>By: {activity.user}</span>
                    {activity.amount && <span>Amount: {activity.amount}</span>}
                    {activity.document && <span>Document: {activity.document}</span>}
                    {activity.status && <span>Status: {activity.status}</span>}
                    {activity.investor && <span>Investor: {activity.investor}</span>}
                    {activity.spv && <span>SPV: {activity.spv}</span>}
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-xs text-gray-500">
                  {activity.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <button className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Load More Activity
        </button>
      </div>
    </div>
  );
};

export default SPVActivity;
