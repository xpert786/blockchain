import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RighIcon, GreenIcon,  CrossesIcon, View1Icon, View2Icon, View3Icon, WatchsIcon, SecondFilesIcon, RightssIcon, UpdateSpvIcon, UpdateContactIcon,Users2Icon,Spv2Icon,EyessIcon,RejecIcon,AlertsIcon } from "../../../components/Icons";

const RequestSystem = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [openDropdown, setOpenDropdown] = useState(null);
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
    navigate('/manager-panel/request-details', { state: { request } });
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
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 text-center sm:text-left">
          <span className="text-[#9889FF]">Request</span> & Approval System
        </h3>
        <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">Manage approval workflows and requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#CAE6FF] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Pending Requests</p>
                <WatchsIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">2</p>
               
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#D7F8F0] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Approved Today</p>
                <GreenIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">3</p>
                
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#E2E2FB] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Rejected</p>
                <RejecIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">2</p>
                
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFEFE8] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">High Priority</p>
                <AlertsIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">1</p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full md:max-w-md">
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
        <div className="flex items-center justify-between md:justify-start gap-2">
          {/* View1Icon - Inactive */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <View1Icon />
          </button>
          
          {/* View2Icon - Inactive */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors ">
            <View2Icon />
          </button>
          
          {/* View3Icon - Active */}
          <button className="p-2 bg-[#01373D] text-white rounded-lg">
            <View3Icon />
          </button>
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {request.title === "Update SPV Investment Terms" && <UpdateSpvIcon />}
                  {request.title === "Update Contact Information" && <UpdateContactIcon />}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{request.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Users2Icon />
                    <span>{request.requester}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{request.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Spv2Icon />
                    <span>{request.spvId}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{request.description}</p>

                {/* Action Buttons and Status Tags */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    {request.actions.includes("approve") && (
                      <button
                        onClick={() => handleApprove(request)}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <RighIcon />
                        <span>Approve Request</span>
                      </button>
                    )}
                    {request.actions.includes("reject") && (
                      <button
                        onClick={() => handleReject(request)}
                        className="flex items-center justify-center gap-2 bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <div className="w-5 h-5 !border border-[#01373D] rounded-full flex items-center justify-center">
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
                        className="flex items-center justify-center gap-2 bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <EyessIcon />
                        <span>Review Details</span>
                      </button>
                    )}
                  </div>

                  {/* Status Tags */}
                  <div className="flex items-center justify-end gap-2">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 p-6 border-t border-gray-200">
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
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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