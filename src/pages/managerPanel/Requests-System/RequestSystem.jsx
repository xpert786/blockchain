import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RighIcon, GreenIcon, CrossesIcon, View1Icon, View2Icon, View3Icon, WatchsIcon, SecondFilesIcon, RightssIcon, UpdateSpvIcon, UpdateContactIcon, Users2Icon, Spv2Icon, EyessIcon, RejecIcon, AlertsIcon } from "../../../components/Icons";

const RequestSystem = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pending_requests: 0,
    approved_today: 0,
    rejected: 0,
    high_priority: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch investment requests from API
  useEffect(() => {
    fetchInvestmentRequests();
  }, []);

  const fetchInvestmentRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investment-requests/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Investment requests API response:", data);

        // Update stats
        if (data.stats) {
          setStats({
            pending_requests: data.stats.pending_requests || 0,
            approved_today: data.stats.approved_today || 0,
            rejected: data.stats.rejected || 0,
            high_priority: data.stats.high_priority || 0
          });
        }

        // Map API requests to component format
        if (data.requests && Array.isArray(data.requests)) {
          const mappedRequests = data.requests.map((req) => ({
            id: req.id,
            title: `Investment Request - ${req.spv?.name || 'SPV'}`,
            requester: req.investor?.name || "Unknown Investor",
            email: req.investor?.email || "",
            date: new Date(req.created_at).toLocaleString('en-US', {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            spvId: req.spv?.code || `SPV-${String(req.spv?.id || req.id).padStart(3, '0')}`,
            spvName: req.spv?.name || "Unknown SPV",
            description: req.request_message || `Investment request of $${req.amount?.toLocaleString() || '0'} for ${req.spv?.name || 'SPV'}`,
            amount: req.amount || 0,
            status: req.status_display || req.status || "Pending Approval",
            statusColor: getStatusColor(req.status),
            priority: req.priority ? req.priority.charAt(0).toUpperCase() + req.priority.slice(1) : "Medium",
            priorityColor: getPriorityColor(req.priority),
            actions: req.status === "pending_approval" ? ["approve", "reject", "review"] : ["review"],
            rawData: req // Store raw data for details page
          }));
          setRequests(mappedRequests);
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch investment requests:", response.status, errorText);
        setError("Failed to load investment requests.");
      }
    } catch (err) {
      console.error("Error fetching investment requests:", err);
      setError(err.message || "Network error loading investment requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending_approval":
      case "pending":
        return "bg-[#E9BB30] text-[#FFFFFF]";
      case "approved":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-[#E9BB30] text-[#FFFFFF]";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return request.status.toLowerCase().includes("pending");
    if (activeTab === "approved") return request.status.toLowerCase().includes("approved");
    if (activeTab === "rejected") return request.status.toLowerCase().includes("rejected");
    return true;
  });

  const tabs = [
    { id: "all", label: "All Requests", count: requests.length },
    { id: "approved", label: "Approved", count: requests.filter(r => r.status.toLowerCase().includes("approved")).length },
    { id: "pending", label: "Pending", count: requests.filter(r => r.status.toLowerCase().includes("pending")).length },
    { id: "rejected", label: "Rejected", count: requests.filter(r => r.status.toLowerCase().includes("rejected")).length }
  ];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleApprove = async (request) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      // Get investment_id from rawData or use request id
      const investmentId = request.rawData?.id || request.id;

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investment-requests/${investmentId}/approve/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investment_id: investmentId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Request approved successfully:", data);
        setSuccessMessage("Request approved successfully!");
        // Refresh the requests list
        await fetchInvestmentRequests();
        // Close modals if open
        setShowReviewModal(false);
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        let errorMsg = `Failed to approve request. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {
          try {
            const errorText = await response.text();
            errorMsg = errorText || errorMsg;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Error approving request:", err);
      setErrorMessage(err.message || "Failed to approve request. Please try again.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectionNotes("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      // Get investment_id from rawData or use request id
      const investmentId = selectedRequest.rawData?.id || selectedRequest.id;

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investment-requests/${investmentId}/reject/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason || rejectionNotes || "Rejected by manager"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Request rejected successfully:", data);
        setSuccessMessage("Request rejected successfully!");
        // Refresh the requests list
        await fetchInvestmentRequests();
        // Close modals
        setShowRejectModal(false);
        setShowReviewModal(false);
        setRejectionReason("");
        setRejectionNotes("");
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        let errorMsg = `Failed to reject request. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {
          try {
            const errorText = await response.text();
            errorMsg = errorText || errorMsg;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      setErrorMessage(err.message || "Failed to reject request. Please try again.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReview = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
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
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.pending_requests}</p>

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
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.approved_today}</p>

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
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.rejected}</p>

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
                  <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.high_priority}</p>

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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchInvestmentRequests}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message for Actions */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Request Cards */}
      <div className="space-y-4">
        {!isLoading && !error && filteredRequests.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">No investment requests found.</p>
          </div>
        )}
        {!isLoading && !error && filteredRequests.map((request) => (
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
                    {request.email && <span className="text-gray-400">({request.email})</span>}
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
                  {request.amount > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>${request.amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{request.description}</p>

                {/* Action Buttons and Status Tags */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    {request.actions.includes("approve") && (
                      <button
                        onClick={() => handleApprove(request)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <RighIcon />
                            <span>Approve Request</span>
                          </>
                        )}
                      </button>
                    )}
                    {request.actions.includes("reject") && (
                      <button
                        onClick={() => handleReject(request)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white"
                  >
                    <option value="">Select A Reason</option>
                    <option value="Insufficient Information">Insufficient Information</option>
                    <option value="Compliance Issues">Compliance Issues</option>
                    <option value="Not Approved by Management">Not Approved by Management</option>
                    <option value="Investment Amount Too High">Investment Amount Too High</option>
                    <option value="Investment Amount Too Low">Investment Amount Too Low</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Provide details about the rejection reason..."
                    className="w-full px-3 py-2 !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setRejectionNotes("");
                }}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CrossesIcon />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Investment Request ID: {selectedRequest.id}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Investor Information */}
              <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#0A2A2E] mb-4 flex items-center gap-2">
                  <Users2Icon />
                  Investor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-1">Investor Name</p>
                    <p className="text-base text-[#0A2A2E] font-semibold">{selectedRequest.requester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-1">Email</p>
                    <p className="text-base text-[#0A2A2E]">{selectedRequest.email || "N/A"}</p>
                  </div>
                  {selectedRequest.rawData?.investor?.id && (
                    <div>
                      <p className="text-sm text-[#748A91] font-medium mb-1">Investor ID</p>
                      <p className="text-base text-[#0A2A2E]">{selectedRequest.rawData.investor.id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SPV Information */}
              <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#0A2A2E] mb-4 flex items-center gap-2">
                  <Spv2Icon />
                  SPV Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-1">SPV Name</p>
                    <p className="text-base text-[#0A2A2E] font-semibold">{selectedRequest.spvName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-1">SPV Code</p>
                    <p className="text-base text-[#0A2A2E]">{selectedRequest.spvId}</p>
                  </div>
                  {selectedRequest.rawData?.spv?.id && (
                    <div>
                      <p className="text-sm text-[#748A91] font-medium mb-1">SPV ID</p>
                      <p className="text-base text-[#0A2A2E]">{selectedRequest.rawData.spv.id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Investment Details */}
              <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#0A2A2E] mb-4">Investment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-1">Investment Amount</p>
                    <p className="text-2xl font-bold text-[#0A2A2E]">${selectedRequest.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-1">Request Date</p>
                    <p className="text-base text-[#0A2A2E]">{selectedRequest.date}</p>
                  </div>
                </div>
              </div>

              {/* Request Message */}
              {selectedRequest.rawData?.request_message && (
                <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E5E7EB]">
                  <h3 className="text-lg font-semibold text-[#0A2A2E] mb-2">Request Message</h3>
                  <p className="text-base text-[#748A91] whitespace-pre-wrap">{selectedRequest.rawData.request_message}</p>
                </div>
              )}

              {/* Status and Priority */}
              <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#0A2A2E] mb-4">Status & Priority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-2">Status</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${selectedRequest.statusColor}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#748A91] font-medium mb-2">Priority</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${selectedRequest.priorityColor}`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval Information (if approved/rejected) */}
              {selectedRequest.rawData?.approved_by && (
                <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E5E7EB]">
                  <h3 className="text-lg font-semibold text-[#0A2A2E] mb-4">Approval Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRequest.rawData.approved_at && (
                      <div>
                        <p className="text-sm text-[#748A91] font-medium mb-1">Approved At</p>
                        <p className="text-base text-[#0A2A2E]">
                          {new Date(selectedRequest.rawData.approved_at).toLocaleString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-[#748A91] font-medium mb-1">Approved By</p>
                      <p className="text-base text-[#0A2A2E]">User ID: {selectedRequest.rawData.approved_by}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Information (if rejected) */}
              {selectedRequest.rawData?.rejection_reason && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                  <p className="text-base text-red-700">{selectedRequest.rawData.rejection_reason}</p>
                </div>
              )}

              {/* Additional Raw Data (for debugging/development) */}
              {selectedRequest.rawData && (
                <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">View Raw Data (Debug)</summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                    {JSON.stringify(selectedRequest.rawData, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedRequest.actions.includes("approve") && (
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    handleApprove(selectedRequest);
                  }}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RighIcon />
                      <span>Approve Request</span>
                    </>
                  )}
                </button>
              )}
              {selectedRequest.actions.includes("reject") && (
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    handleReject(selectedRequest);
                  }}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span>Reject Request</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestSystem;