import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const InvestorDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get investor data from location state or use default
  const investor = location.state?.investor || {
    name: "Michael Investor",
    email: "m.investor@example.com",
    amount: "$50,000",
    ownership: "3%",
    date: "01/28/2025",
    status: "Raising",
    statusColor: "bg-[#22C55E] text-white"
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] p-6">
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{investor.name}</h1>
            <p className="text-gray-600">{investor.email}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-[#2563EB] text-[#FFFFFF] rounded-full text-sm font-medium">
              KYC Approved
            </span>
            <button className="p-2 bg-[#F4F6F5] text-gray-400 hover:text-gray-600 transition-colors rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Investment Metrics */}
        <div className="bg-[#F9F8FF] rounded-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Investment Amount</p>
            <p className="text-2xl font-bold text-gray-900">{investor.amount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Current Value</p>
            <p className="text-2xl font-bold text-gray-900">$57,500</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Ownership</p>
            <p className="text-2xl font-bold text-gray-900">{investor.ownership}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Return</p>
            <p className="text-2xl font-bold text-[#22C55E]">+15%</p>
          </div>
        </div>
      </div>

      {/* Investor Profile Card */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Investor Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{investor.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Phone Number</p>
              <p className="text-sm font-medium text-gray-900">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Nationality</p>
              <p className="text-sm font-medium text-gray-900">United States</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Risk Profile</p>
              <p className="text-sm font-medium text-gray-900">Moderate</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Email Address</p>
              <p className="text-sm font-medium text-gray-900">{investor.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">Address</p>
              <p className="text-sm font-medium text-gray-900">123 Investment Ave, New York, NY 10001</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-poppins-custom">KYC Status</p>
              <span className="px-3 py-1 bg-[#2563EB] text-[#FFFFFF] rounded-full text-sm font-medium">
                KYC Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDetails;
