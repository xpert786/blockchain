import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  WatchsIcon, DollerssIcon,RightssIcon,View1Icon,View2Icon,View3Icon, FilesaddIcon,RightLeftErrorIcon, RighIcon, GreenIcon, RedIcon, BlackfileIcon, CrossesIcon,EyessIcon,RightLeftIcon  } from "../../../components/Icons";

const TransferTemp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showTransferDetails, setShowTransferDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const transfers = [
    {
      id: 1,
      txnId: "TXN-001",
      spv: "Tech Startup Fund Q4",
      spvId: "SPV-001",
      requestedDate: "3/15/2024",
      amount: "$50,000",
      status: "Pending Approval",
      statusColor: "bg-yellow-100 text-yellow-800",
      sender: {
        name: "Alice Investor",
        email: "alice@email.com",
        initials: "AI"
      },
      receiver: {
        name: "Bob Smith",
        email: "bob@email.com",
        initials: "BS"
      },
      shares: 125,
      transferFee: "$250",
      netAmount: "$49,750",
      actions: ["approve", "reject", "review"]
    },
    {
      id: 2,
      txnId: "TXN-002",
      spv: "Real Estate Opportunity",
      spvId: "SPV-002",
      requestedDate: "3/15/2024",
      amount: "$75,000",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800",
      sender: {
        name: "Carol Johnson",
        email: "carol@email.com",
        initials: "CJ"
      },
      receiver: {
        name: "David Wilson",
        email: "david@email.com",
        initials: "DW"
      },
      shares: 150,
      transferFee: "$375",
      netAmount: "$74,625",
      actions: []
    },
    {
      id: 3,
      txnId: "TXN-003",
      spv: "Tech Innovation Fund",
      spvId: "SPV-003",
      requestedDate: "3/15/2024",
      amount: "$25,000",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-800",
      sender: {
        name: "Mike Johnson",
        email: "mike@email.com",
        initials: "MJ"
      },
      receiver: {
        name: "Sarah Connor",
        email: "sarah@email.com",
        initials: "SC"
      },
      shares: 50,
      transferFee: "$125",
      netAmount: "$24,875",
      rejectionReason: "Recipient not KYC verified",
      actions: []
    },
    {
      id: 4,
      txnId: "TXN-004",
      spv: "Tech Startup Fund Q4",
      spvId: "SPV-001",
      requestedDate: "3/15/2024",
      amount: "$100,000",
      status: "Pending KYC",
      statusColor: "bg-yellow-100 text-yellow-800",
      sender: {
        name: "Lisa Wang",
        email: "lisa@email.com",
        initials: "LW"
      },
      receiver: {
        name: "Emma Rodriguez",
        email: "emma@email.com",
        initials: "ER"
      },
      shares: 250,
      transferFee: "$500",
      netAmount: "$99,500",
      actions: []
    }
  ];

  const tabs = [
    { id: "all", label: "All Transfers", count: 5 },
    { id: "approved", label: "Approved", count: 1 },
    { id: "pending", label: "Pending", count: 2 },
    { id: "completed", label: "Completed", count: 1 },
    { id: "rejected", label: "Rejected", count: 1 }
  ];

  const handleViewDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setShowTransferDetails(true);
  };

  const handleApprove = (transfer) => {
    console.log("Approve transfer:", transfer);
  };

  const handleReject = (transfer) => {
    setSelectedTransfer(transfer);
    setShowRejectModal(true);
  };

  const handleReview = (transfer) => {
    setSelectedTransfer(transfer);
    setShowTransferDetails(true);
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
         <span className="text-[#9889FF]">Transfer</span> Management
      </h1>
        <p className="text-lg text-gray-600">Manage and monitor investment transfers</p>
      </div>

      {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-[#CAE6FF] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Transfers</p>
            <RightLeftIcon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">4</p>
            <p className="text-xs text-green-600">+4 this month</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#D7F8F0] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Approval</p>
            <WatchsIcon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-green-600">2 urgent</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#E2E2FB] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completed</p>
            <RightssIcon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-green-600">+1 this week</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#FFEFE8] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Transfer Volumes</p>
            <DollerssIcon/>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">$250k</p>
            <p className="text-xs text-green-600">+15 this week</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-2 mb-6 max-w-fit mt-6">
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

      {/* Transfer Cards */}
      <div className="space-y-4">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="bg-white rounded-lg p-6 border border-gray-200">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Transfer {transfer.txnId}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span>{transfer.spv}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Requested {transfer.requestedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>{transfer.amount}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${transfer.statusColor}`}>
                  {transfer.status}
                </span>
                <button
                  onClick={() => handleViewDetails(transfer)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Participants and Transfer Details */}
            <div className="bg-[#F9F8FF] rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Sender */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">{transfer.sender.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{transfer.sender.name}</h4>
                    <p className="text-xs text-gray-600">{transfer.sender.email}</p>
                  </div>
                </div>

                {/* Transfer Amount */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <RightLeftErrorIcon />
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{transfer.shares} Shares</div>
                      <div className="text-sm text-gray-600">{transfer.amount}</div>
                    </div>
                  </div>
                </div>

                {/* Receiver */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">{transfer.receiver.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{transfer.receiver.name}</h4>
                    <p className="text-xs text-gray-600">{transfer.receiver.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">SPV</p>
                  <p className="font-medium text-gray-900">{transfer.spvId}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Shares</p>
                  <p className="font-medium text-gray-900">{transfer.shares}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Transfer Fee</p>
                  <p className="font-medium text-gray-900">{transfer.transferFee}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Net Amount</p>
                  <p className="font-medium text-gray-900">{transfer.netAmount}</p>
                </div>
              </div>
              <div className="border-t border-[#01373D] mt-4"></div>
            </div>

            {/* Action Buttons or Status Banner */}
            {transfer.actions.length > 0 ? (
              <div className="flex items-center space-x-3">
                {transfer.actions.includes("approve") && (
                  <button
                    onClick={() => handleApprove(transfer)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    <RighIcon />
                    <span>Approve Transfer</span>
                  </button>
                )}
                {transfer.actions.includes("reject") && (
                  <button
                    onClick={() => handleReject(transfer)}
                    className="flex items-center space-x-2 bg-white border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    <div className="w-5 h-5 bg-[#F4F6F5] border border-[#01373D] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#01373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span>Reject</span>
                  </button>
                )}
                {transfer.actions.includes("review") && (
                  <button
                    onClick={() => handleReview(transfer)}
                    className="flex items-center space-x-2 bg-white border border-[#01373D] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    <EyessIcon />
                    <span>Review Details</span>
                  </button>
                )}
              </div>
            ) : (
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                transfer.status === "Completed" 
                  ? "bg-green-50 text-green-800" 
                  : transfer.status === "Rejected"
                  ? "bg-red-50 text-red-800"
                  : "bg-gray-50 text-gray-800"
              }`}>
                {transfer.status === "Completed" && (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <GreenIcon />
                      <span className="font-medium">Transfer Completed</span>
                    </div>
                    <span className="text-sm ml-7">Requested {transfer.requestedDate}</span>
                  </div>
                )}
                {transfer.status === "Rejected" && transfer.rejectionReason && (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <RedIcon />
                      <span className="font-medium">Rejection Reason:</span>
                    </div>
                    <span className="text-sm ml-7">{transfer.rejectionReason}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Transfer Details Modal */}
      {showTransferDetails && selectedTransfer && (
        <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Transfer Request Details</h2>
                <p className="text-sm text-gray-600">Transfer ID: {selectedTransfer.txnId}</p>
              </div>
              <button
                onClick={() => setShowTransferDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CrossesIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Participants */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-6">
                  {/* Sender */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">{selectedTransfer.sender.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{selectedTransfer.sender.name}</h4>
                      <p className="text-xs text-gray-600">{selectedTransfer.sender.email}</p>
                    </div>
                  </div>

                  {/* Transfer Amount */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <RightLeftErrorIcon />
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{selectedTransfer.shares} Shares</div>
                        <div className="text-sm text-gray-600">{selectedTransfer.amount}</div>
                      </div>
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">{selectedTransfer.receiver.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{selectedTransfer.receiver.name}</h4>
                      <p className="text-xs text-gray-600">{selectedTransfer.receiver.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investor</label>
                  <p className="text-sm text-gray-900">{selectedTransfer.sender.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SPV</label>
                  <p className="text-sm text-gray-900">{selectedTransfer.spv}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                  <p className="text-sm text-gray-900">{selectedTransfer.requestedDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-sm text-gray-900">{selectedTransfer.amount}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">Request To Transfer Tokens To External Wallet For Liquidity Purposes.</p>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <BlackfileIcon />
                      <span className="text-sm font-medium text-gray-900">Transfer Request Form.Pdf</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-[#F8F8F8] border border-[#01373D] rounded-lg hover:bg-gray-100 transition-colors">
                      Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <BlackfileIcon />
                      <span className="text-sm font-medium text-gray-900">Transfer Request Form.Pdf</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-[#F8F8F8] border border-[#01373D] rounded-lg hover:bg-gray-100 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowTransferDetails(false);
                  handleReject(selectedTransfer);
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
                  setShowTransferDetails(false);
                  handleApprove(selectedTransfer);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <RighIcon />
                <span>Approve Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Transfer Modal */}
      {showRejectModal && selectedTransfer && (
        <div className="fixed inset-0 bg-[#01373DB2]  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 !border-b border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">Reject Transfer Request</h2>
                
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CrossesIcon />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                You are about to reject transfer request {selectedTransfer.txnId}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                  <select className="w-full px-3 py-2 !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white">
                    <option>Select A Reason</option>
                    <option>KYC Not Verified</option>
                    <option>Insufficient Documentation</option>
                    <option>Compliance Issues</option>
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
                  console.log("Transfer rejected:", selectedTransfer);
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

export default TransferTemp;
