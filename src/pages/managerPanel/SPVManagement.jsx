import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SPVManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // API data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [spvs, setSpvs] = useState([]);

  // Fetch SPV data from API
  useEffect(() => {
    const fetchSPVData = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("No access token found. Please login again.");
        }

        const response = await axios.get(`${API_URL.replace(/\/$/, "")}/spv/management/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const data = response.data;

        // Set summary data
        setSummary(data.summary);

        // Map tabs from API response
        const mappedTabs = data.filters.available_statuses.map(status => ({
          id: status.key === "ready_to_launch" ? "ready" : status.key === "fundraising" ? "fundraising" : status.key,
          label: status.label,
          count: status.count
        }));
        setTabs(mappedTabs);

        // Map SPVs from API response
        const mappedSPVs = data.spvs.map(spv => {
          // Format date
          const createdDate = new Date(spv.created_at);
          const formattedDate = createdDate.toLocaleDateString('en-US', { 
            month: 'numeric', 
            day: 'numeric', 
            year: 'numeric' 
          });

          // Format currency
          const formatCurrency = (value) => {
            if (value >= 1000000) {
              return `$${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `$${(value / 1000).toFixed(1)}K`;
            }
            return `$${value.toFixed(0)}`;
          };

          // Map status
          const getStatusInfo = (status, statusLabel) => {
            switch (status?.toLowerCase()) {
              case "active":
              case "fundraising":
                return { label: "Raising", color: "bg-[#22C55E] text-white" };
              case "ready_to_launch":
                return { label: "Ready to Launch", color: "bg-[#FFD97A] text-white" };
              case "closed":
              case "closing":
                return { label: "Closing", color: "bg-[#ED1C24] text-white" };
              default:
                return { label: statusLabel || "Active", color: "bg-[#22C55E] text-white" };
            }
          };

          const statusInfo = getStatusInfo(spv.status, spv.status_label);
          const raised = spv.my_commitment || 0;
          const target = spv.target_amount || 0;
          const progress = target > 0 ? Math.round((raised / target) * 100) : 0;

          return {
            id: spv.code || `SPV-${spv.id}`,
            name: spv.name,
            location: spv.jurisdiction || "N/A",
            created: formattedDate,
            category: spv.sector || spv.industry_tags?.[0] || "N/A",
            status: statusInfo.label,
            statusColor: statusInfo.color,
            raised: formatCurrency(raised),
            target: formatCurrency(target),
            investors: spv.investor_count?.toString() || "0",
            minInvestment: formatCurrency(spv.minimum_investment || 0),
            progress: progress,
            progressColor: getProgressColor(statusInfo.label),
            rawData: spv // Keep raw data for navigation
          };
        });

        setSpvs(mappedSPVs);
      } catch (err) {
        console.error("Error fetching SPV data:", err);
        setError(err.response?.data?.detail || err.message || "Failed to fetch SPV data");
      } finally {
        setLoading(false);
      }
    };

    fetchSPVData();
  }, [activeTab]);

  // Format currency helper
  const formatCurrency = (value) => {
    if (!value) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Metrics derived from summary
  const metrics = summary ? [
    {
      title: "Total SPVs",
      value: summary.total_spvs?.toString() || "0",
      change: "+2 this month",
      bgColor: "bg-[#D6EEF9]",
      iconColor: "text-[#01373D]",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22M6 22H18M6 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V14C2 13.4696 2.21071 12.9609 2.58579 12.5858C2.96086 12.2107 3.46957 12 4 12H6M18 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H18M10 6H14M10 10H14M10 14H14M10 18H14" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Total AUM",
      value: formatCurrency(summary.total_aum || 0),
      change: "+15.2%",
      bgColor: "bg-[#D7F8F0]",
      iconColor: "text-[#01373D]",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Active Investors",
      value: summary.active_investors?.toString() || "0",
      change: "+23 new",
      bgColor: "bg-[#E2E2FB]",
      iconColor: "text-[#01373D]",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7ZM23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Success Rate",
      value: `${summary.success_rate_percent?.toFixed(0) || 0}%`,
      change: "+5% this quarter",
      bgColor: "bg-[#FFEFE8]",
      iconColor: "text-[#01373D]",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3V21H21M7 16L10 13L14 17L21 10" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ] : [];

  const getProgressColor = (status) => {
    switch (status) {
      case "Raising":
        return "bg-[#22C55E]";
      case "Ready to Launch":
        return "bg-[#FFD97A]";
      case "Closing":
        return "bg-[#ED1C24]";
      default:
        return "bg-green-500";
    }
  };

  const handleViewDetails = (spv) => {
    console.log('=== VIEW DETAILS FUNCTION CALLED ===');
    console.log('SPV Data:', spv);
    
    // Close dropdown menu
    setOpenDropdown(null);
    
    // Navigate to SPV details page with SPV data
    console.log('Navigating to SPV Details...');
    navigate('/manager-panel/spv-details', { state: { spv: spv.rawData || spv } });
    console.log('Navigation completed!');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter SPVs based on active tab
  const filteredSPVs = spvs.filter(spv => {
    if (activeTab === "all") return true;
    if (activeTab === "ready") return spv.status === "Ready to Launch";
    if (activeTab === "fundraising") return spv.status === "Raising";
    if (activeTab === "closed") return spv.status === "Closing";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F0C3] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SPV data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-medium text-gray-600 mb-2"><span className="text-[#9889FF]">SPV</span> Management</h3>
        <p className="text-sm sm:text-base text-gray-600">Create and manage your Special Purpose Vehicles</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`${metric.bgColor} rounded-lg p-4 sm:p-6 h-full flex flex-col justify-between`}>
            {/* Top Row - Title and Icon */}
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-600 font-medium">{metric.title}</p>
              <div className={`${metric.iconColor}`}>
                {metric.icon()}
              </div>
            </div>
            
            {/* Bottom Row - Large Number and Change */}
            <div className="flex justify-between items-end">
              <p className="text-xl font-bold text-[#01373D]">{metric.value}</p>
              <p className="text-sm text-[#34D399] font-medium">{metric.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="bg-white rounded-lg p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search SPVs by name, ID, or focus area..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "grid" ? "bg-[#00F0C3] border-transparent text-[#01373D]" : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            <span className="text-sm font-medium">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "list" ? "bg-[#00F0C3] border-transparent text-[#01373D]" : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            <span className="text-sm font-medium">List</span>
          </button>
        </div>
      </div>

      {/* SPV Cards */}
      <div className="space-y-4">
        {filteredSPVs.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">No SPVs found for the selected filter.</p>
          </div>
        ) : (
          filteredSPVs.map((spv, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            {/* Header Section */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{spv.name}</h3>
                <p className="text-sm text-gray-500">{spv.id} • {spv.location} • Created {spv.created} • {spv.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${spv.statusColor}`}>
                  {spv.status}
                </span>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === index && (
                      <div 
                        className="absolute right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-2 mb-2">
                          <div 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('=== VIEW DETAILS DIV CLICKED ===');
                              console.log('SPV:', spv);
                              console.log('Event:', e);
                              
                              // Close dropdown first
                              setOpenDropdown(null);
                              
                              // Navigate directly
                              console.log('Navigating to SPV Details...');
                              navigate('/manager-panel/spv-details');
                              console.log('Navigation completed!');
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('VIEW DETAILS MOUSEDOWN');
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-black bg-[#00F0C3] hover:bg-[#00D4A3] transition-colors rounded-lg mb-2 cursor-pointer">
                            View Details
                          </div>
                          <button className="w-full px-4 py-3 text-left text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg mb-2">
                            Edit SPV
                          </button>
                          <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mb-2   ">
                            Manage Investors
                          </button>
                          <button className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg">
                            Archive SPV
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Raised</p>
                <p className="text-lg font-semibold text-gray-900">{spv.raised}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target</p>
                <p className="text-lg font-semibold text-gray-900">{spv.target}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Investors</p>
                <p className="text-lg font-semibold text-gray-900">{spv.investors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Min Investment</p>
                <p className="text-lg font-semibold text-gray-900">{spv.minInvestment}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Funding Progress</span>
                <span className="text-sm font-medium text-gray-900">{spv.progress}%</span>
              </div>
              <div className="w-full bg-[#CEC6FF] rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(spv.status)}`}
                  style={{ width: `${spv.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2">
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>Manage Investors</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Documents</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SPVManagement;
