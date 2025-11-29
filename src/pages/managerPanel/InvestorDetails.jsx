import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const InvestorDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get investor data from location state
  const investor = location.state?.investor;
  
  // If no investor data, show error or redirect
  if (!investor) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] p-6 pt-12 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investor Data</h3>
          <p className="text-gray-600 mb-4">No investor information available.</p>
          <button
            onClick={() => navigate('/manager-panel/spv-management')}
            className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] p-6 pt-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm">
          <button 
            onClick={() => navigate('/manager-panel/spv-management')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            SPV Management
          </button>
          <span className="mx-2 text-gray-400">&gt;</span>
          <button 
            onClick={() => navigate('/manager-panel/spv-details')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            My SPV
          </button>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-900">Investor</span>
        </nav>
      </div>

      {/* Investor Summary Card */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{investor.name || investor.email || "Investor"}</h1>
            {investor.email && <p className="text-gray-600">{investor.email}</p>}
          </div>
          <div className="flex items-center space-x-3">
            {investor.kycStatus && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                investor.kycStatus === "Approved" || investor.kycStatus === "approved" 
                  ? "bg-[#2563EB] text-[#FFFFFF]" 
                  : "bg-gray-200 text-gray-700"
              }`}>
                {investor.kycStatus}
              </span>
            )}
            <button className="p-2 bg-[#F4F6F5] text-gray-400 hover:text-gray-600 transition-colors rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Investment Metrics */}
        <div className="bg-[#F9F8FF] rounded-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {investor.amount && (
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Investment Amount</p>
              <p className="text-2xl font-bold text-gray-900">{investor.amount}</p>
            </div>
          )}
          {investor.currentValue && (
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">{investor.currentValue}</p>
            </div>
          )}
          {investor.ownership && (
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Ownership</p>
              <p className="text-2xl font-bold text-gray-900">{investor.ownership}</p>
            </div>
          )}
          {investor.return && (
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Return</p>
              <p className={`text-2xl font-bold ${investor.return?.startsWith('-') ? 'text-red-500' : 'text-[#22C55E]'}`}>
                {investor.return}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Investor Profile Card */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Investor Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-4">
            {investor.name && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{investor.name}</p>
              </div>
            )}
            {investor.phone && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">{investor.phone}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {investor.nationality && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Nationality</p>
                <p className="text-sm font-medium text-gray-900">{investor.nationality}</p>
              </div>
            )}
            {investor.riskProfile && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Risk Profile</p>
                <p className="text-sm font-medium text-gray-900">{investor.riskProfile}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {investor.email && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Email Address</p>
                <p className="text-sm font-medium text-gray-900">{investor.email}</p>
              </div>
            )}
            {investor.address && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Address</p>
                <p className="text-sm font-medium text-gray-900">{investor.address}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {investor.kycStatus && (
              <div>
                <p className="text-sm text-gray-500 mb-1 font-poppins-custom">KYC Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  investor.kycStatus === "Approved" || investor.kycStatus === "approved" 
                    ? "bg-[#2563EB] text-[#FFFFFF]" 
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {investor.kycStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDetails;
