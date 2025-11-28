import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InviteLPsModal from "./InviteLPsModal";
import SPVDocuments from "./SPVDocuments";
import SPVActivity from "./SPVActivity";

const SPVDetails = () => {
  const [activeTab, setActiveTab] = useState("investors");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const navigate = useNavigate();

  console.log('=== SPV DETAILS PAGE LOADED ===');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);

  const spvData = {
    name: "Tech Startup Fund Q4 2024",
    id: "SPV-001",
    raised: "$2.4M",
    target: "$5.0M",
    investors: "24",
    minInvestment: "$25,000",
    daysLeft: "45 Days Left",
    status: "Raising",
    statusColor: "bg-[#22C55E] text-white",
    progress: 50,
    totalValue: "$2.4M",
    unrealizedGain: "$300,000",
    irr: "15.2%",
    multiple: "1.17x",
    jurisdiction: "Delaware, USA",
    created: "1/14/2024",
    focus: "Technology",
    vintage: "2024",
    fundTerm: "7 Years",
    closingDate: "45 Until December 31, 2024",
    description: "A Q4 2024 SPV Targeting Early-Stage Technology Companies With High Growth Potential.",
    managementFee: "2.0%",
    investmentPeriod: "24 Months",
    maxCap: "$50,000",
    carriedInterest: "20%"
  };

  const investors = [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      amount: "$50,000",
      ownership: "2.5%",
      date: "01/28/2025",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white"
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      amount: "$50,000",
      ownership: "2.5%",
      date: "01/28/2025",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white"
    },
    {
      name: "Michael Brown",
      email: "michael.brown@email.com",
      amount: "$50,000",
      ownership: "2.5%",
      date: "01/28/2025",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white"
    }
  ];

  const tabs = [
    { id: "investors", label: "Investors" },
    { id: "documents", label: "Documents" },
    { id: "activity", label: "Activity" }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F5] p-6 pt-10">
      {/* Success Message */}
      
      
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
          <span className="text-gray-900">{spvData.name}</span>
        </nav>
      </div>

      {/* Main SPV Card */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{spvData.name}</h1>
            <p className="text-lg text-gray-600">{spvData.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Raised</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.raised}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Investors</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.investors}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Min Investment</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.minInvestment}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Days to Close</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.daysLeft}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${spvData.statusColor}`}>
                {spvData.status}
              </span>
              <span className="text-sm text-gray-600">Fundraising period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fundraising Progress Card */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fundraising Progress</h2>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Target: {spvData.target}</span>
            <span className="text-sm font-medium text-gray-900">{spvData.raised} of {spvData.target}</span>
          </div>
          <div className="w-full bg-[#CEC6FF] rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-[#00F0C3]"
              style={{ width: `${spvData.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-end mt-2">
            <span className="text-sm font-medium text-gray-900">{spvData.progress}% Complete</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics Card */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.totalValue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Unrealized Gain</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.unrealizedGain}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">IRR</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.irr}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Multiple</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.multiple}</p>
          </div>
        </div>
      </div>

      {/* SPV Details and Investment Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* SPV Details Card */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SPV Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">SPV ID:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Jurisdiction:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.jurisdiction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Created:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.created}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Investment Focus:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.focus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Vintage:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.vintage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fund Term:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.fundTerm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Closing Date:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.closingDate}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-sm text-gray-900">{spvData.description}</p>
          </div>
        </div>

        {/* Investment Terms Card */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Terms</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Minimum Investment:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.minInvestment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Management Fee:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.managementFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Investment Period:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.investmentPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Maximum Cap.:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.maxCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Carried Interest:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.carriedInterest}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-3 w-fit mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "investors" && (
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Investor List</h2>
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Invite LPs
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search SPVs by name, ID, or focus area..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* Investor Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investors.map((investor, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{investor.name}</div>
                        <div className="text-sm text-gray-500">{investor.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investor.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investor.ownership}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investor.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${investor.statusColor}`}>
                        {investor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate('/manager-panel/investor-details', { state: { investor } })}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#01373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4 text-[#01373D]" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="2"/>
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="12" cy="19" r="2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end mt-6">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">←</button>
              <button className="px-3 py-1 text-sm bg-[#00F0C3] text-black rounded">1</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">→</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && <SPVDocuments />}
      {activeTab === "activity" && <SPVActivity />}

      {/* Invite LPs Modal */}
      <InviteLPsModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />
    </div>
  );
};

export default SPVDetails;

