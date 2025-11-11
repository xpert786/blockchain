import React from "react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: "KYC Approval Required",
      description: "KYC approval is required to proceed with your account verification.",
      timestamp: "2 minutes ago",
      statusIcon: "info",
      statusColor: "text-blue-500",
      typeIcon: "document",
      typeColor: "text-gray-700"
    },
    {
      id: 2,
      title: "New SPV Created",
      description: "A new SPV has been created and is now available for review.",
      relatedTo: "Sarah John",
      timestamp: "1 Hours ago",
      statusIcon: "check",
      statusColor: "text-green-500",
      typeIcon: "users",
      typeColor: "text-gray-700"
    },
    {
      id: 3,
      title: "Transfer Request Pending",
      description: "Transfer request is pending and requires your attention.",
      relatedTo: "Fund / SPV Mike",
      timestamp: "2 Hours ago",
      statusIcon: "check",
      statusColor: "text-blue-500",
      typeIcon: "chart",
      typeColor: "text-gray-700"
    }
  ];

  const getStatusIcon = (iconType, color) => {
    if (iconType === "info") {
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (iconType === "check") {
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return null;
  };

  const getTypeIcon = (iconType, color) => {
    if (iconType === "document") {
      return (
        <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (iconType === "users") {
      return (
        <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      );
    }
    if (iconType === "chart") {
      return (
        <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8A63D2]">
          Syndicate Manager Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your SPVs and investor relationships
        </p>
      </div>

      {/* Notifications Section */}
      <div className="bg-[#F9F8FF] rounded-xl p-4 sm:p-6 lg:px-8 lg:py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm sm:text-base text-gray-600">
            A new update has been added to your notifications
          </p>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#D1D5DB80] rounded-lg p-4 bg-white"
            >
              {/* Left Side - Icons */}
              <div className="flex items-center space-x-3">
                {getStatusIcon(notification.statusIcon, notification.statusColor)}
                {getTypeIcon(notification.typeIcon, notification.typeColor)}
              </div>

              {/* Middle - Content */}
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1">
                  {notification.description}
                </p>
                {notification.relatedTo && (
                  <p className="text-sm sm:text-base text-gray-600">
                    Related to: <span className="underline">{notification.relatedTo}</span>
                  </p>
                )}
              </div>

              {/* Right Side - Timestamp */}
              <div className="text-xs sm:text-sm text-gray-500 sm:text-right">
                {notification.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
