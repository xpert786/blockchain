import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Files2Icon, FilesaddIcon, RightLeftErrorIcon, RighIcon, GreenIcon, RedIcon, BlackfileIcon, CrossesIcon, View1Icon, View2Icon, View3Icon, WatchsIcon, SecondFilesIcon, RightssIcon } from "../../../components/Icons";

const RequestSystem = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requests = [
    {
      id: 1,
      title: "Update SPV Investment Terms",
      requester: "A John Investor",
      date: "3/5/2024, 4:00:00 PM",
      spvId: "SPV-001",
      description: "Request to increase maximum cap from $5M to $8M for Tech Startup Fund Q4",
      status: "Pending Approval",
      statusColor: "bg-[#E9BB30] text-[#FFFFFF]",
      priority: "High",
      priorityColor: "bg-red-100 text-red-800",
      actions: ["approve", "reject", "review"]
    },
    {
      id: 2,
      title: "Update Contact Information",
      requester: "A Alice Investor",
      date: "3/14/2024, 9:15:00 PM",
      spvId: "SPV-002",
      description: "Request to update phone number and mailing address",
      status: "Pending Approval",
      statusColor: "bg-[#E9BB30] text-[#FFFFFF]",
      priority: "Medium",
      priorityColor: "bg-orange-100 text-orange-800",
      actions: ["approve", "reject", "review"]
    }
  ];

  const tabs = [
    { id: "all", label: "All Requests", count: 5 },
    { id: "approved", label: "Approved", count: 1 },
    { id: "pending", label: "Pending", count: 2 },
    { id: "rejected", label: "Rejected", count: 1 }
  ];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleApprove = (request) => {
    console.log("Approve request:", request);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleReview = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 mb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <span className="text-[#9889FF]">Request</span> & Approval System
        </h1>
        <p className="text-lg text-gray-600">Manage approval workflows and requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#CAE6FF] rounded-2xl p-8 h-32">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Pending Requests</p>
                <WatchsIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-green-600">+1 this week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#D7F8F0] rounded-2xl p-8 h-32">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Approved Today</p>
                <GreenIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#E2E2FB] rounded-2xl p-8 h-32">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Rejected</p>
                <RedIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-green-600">+1 this week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFEFE8] rounded-2xl p-8 h-32">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">High Priority</p>
                <RightssIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-xs text-green-600">+1 this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-2 mb-6 max-w-fit">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

    {/* Search Bar and Icons */}
    <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search SPVs by name, ID, or focus area..."
            className="w-full pl-10 pr-4 py-2 !border border-gray-300 rounded-lg focus:outline-none  bg-[#FFFFFF]"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center space-x-2">
          {/* View1Icon - Inactive */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <View1Icon />
          </button>
          
          {/* View2Icon - Inactive */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors ">
            <View2Icon />
          </button>
          
          {/* View3Icon - Active */}
          <button className="p-2 text-white hover:text-gray-200 transition-colors ">
            <View3Icon />
          </button>
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span>{request.requester}</span>
                  <span>{request.date}</span>
                  <span>{request.spvId}</span>
                </div>
                <p className="text-gray-700 mb-4">{request.description}</p>

                {/* Action Buttons and Status Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {request.actions.includes("approve") && (
                      <button
                        onClick={() => handleApprove(request)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <RighIcon />
                        <span>Approve Request</span>
                      </button>
                    )}
                    {request.actions.includes("reject") && (
                      <button
                        onClick={() => handleReject(request)}
                        className="flex items-center space-x-2 bg-white border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <div className="w-5 h-5 border border-[#01373D] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-[#01373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span>Reject</span>
                      </button>
                    )}
                    {request.actions.includes("review") && (
                      <button
                        onClick={() => handleReview(request)}
                        className="flex items-center space-x-2 bg-white border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <div className="w-5 h-5 bg-[#F4F6F5] border border-[#01373D] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-[#01373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <span>Review Details</span>
                      </button>
                    )}
                  </div>

                  {/* Status Tags */}
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.statusColor}`}>
                      {request.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.priorityColor}`}>
                      {request.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
                <p className="text-sm text-gray-600">Request ID: {selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setShowRequestDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CrossesIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedRequest.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>{selectedRequest.requester}</span>
                    <span>{selectedRequest.date}</span>
                    <span>{selectedRequest.spvId}</span>
                  </div>
                  <p className="text-gray-700">{selectedRequest.description}</p>
                </div>
              </div>

              {/* Request Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requester</label>
                  <p className="text-sm text-gray-900">{selectedRequest.requester}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SPV ID</label>
                  <p className="text-sm text-gray-900">{selectedRequest.spvId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                  <p className="text-sm text-gray-900">{selectedRequest.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <p className="text-sm text-gray-900">{selectedRequest.priority}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowRequestDetails(false);
                  handleReject(selectedRequest);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#01373D] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 border border-[#01373D] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#01373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span>Reject</span>
              </button>
              <button
                onClick={() => {
                  setShowRequestDetails(false);
                  handleApprove(selectedRequest);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <RighIcon />
                <span>Approve Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">Reject Request</h2>
                
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CrossesIcon />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                You are about to reject request {selectedRequest.id}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                  <select className="w-full px-3 py-2 !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white">
                    <option>Select A Reason</option>
                    <option>Insufficient Information</option>
                    <option>Compliance Issues</option>
                    <option>Not Approved by Management</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the rejection reason..."
                    className="w-full px-3 py-2 !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  console.log("Request rejected:", selectedRequest);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestSystem;