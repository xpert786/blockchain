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
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSpv, setSelectedSpv] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [spvToArchive, setSpvToArchive] = useState(null);
  const [archiving, setArchiving] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleArchiveClick = (spv) => {
    setSpvToArchive(spv);
    setShowArchiveModal(true);
    setOpenDropdown(null);
  };

  const handleArchiveConfirm = async () => {
    if (!spvToArchive) return;

    try {
      setArchiving(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      // Get the SPV ID from rawData or the spv object
      const spvId = spvToArchive.rawData?.id || spvToArchive.id;

      // Archive the SPV - try different possible endpoints
      try {
        await axios.patch(
          `${API_URL.replace(/\/$/, "")}/spv/${spvId}/archive/`,
          { archived: true },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      } catch (patchError) {
        // If PATCH doesn't work, try PUT or DELETE
        if (patchError.response?.status === 404 || patchError.response?.status === 405) {
          // Try alternative endpoint
          await axios.post(
            `${API_URL.replace(/\/$/, "")}/spv/${spvId}/archive/`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );
        } else {
          throw patchError;
        }
      }

      // Remove the archived SPV from the local state
      setSpvs(prevSpvs => prevSpvs.filter(spv => {
        const currentId = spv.rawData?.id || spv.id;
        return currentId !== spvId;
      }));

      // Update summary if needed
      if (summary) {
        setSummary(prev => ({
          ...prev,
          total_spvs: Math.max((prev.total_spvs || 0) - 1, 0)
        }));
      }

      setShowArchiveModal(false);
      setSpvToArchive(null);
    } catch (err) {
      console.error("Error archiving SPV:", err);
      alert(err.response?.data?.detail || err.message || "Failed to archive SPV. Please try again.");
    } finally {
      setArchiving(false);
    }
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

  // Filter SPVs based on active tab and search query
  const filteredSPVs = spvs.filter(spv => {
    // Filter by tab
    let matchesTab = true;
    if (activeTab === "all") {
      matchesTab = true;
    } else if (activeTab === "ready") {
      matchesTab = spv.status === "Ready to Launch";
    } else if (activeTab === "fundraising") {
      matchesTab = spv.status === "Raising";
    } else if (activeTab === "closed") {
      matchesTab = spv.status === "Closing";
    }

    // Filter by search query
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = 
        spv.name?.toLowerCase().includes(query) ||
        spv.id?.toLowerCase().includes(query) ||
        spv.location?.toLowerCase().includes(query) ||
        spv.category?.toLowerCase().includes(query) ||
        spv.status?.toLowerCase().includes(query);
    }

    return matchesTab && matchesSearch;
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
              placeholder="Search SPVs by name, ID, location, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "grid" ? "bg-[#01373D] border-transparent text-[#01373D]" : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            {viewMode === "grid" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7 4H4V7H7V4ZM4 3C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H7C7.26522 8 7.51957 7.89464 7.70711 7.70711C7.89464 7.51957 8 7.26522 8 7V4C8 3.73478 7.89464 3.48043 7.70711 3.29289C7.51957 3.10536 7.26522 3 7 3H4ZM7 10.5H4V13.5H7V10.5ZM4 9.5C3.73478 9.5 3.48043 9.60536 3.29289 9.79289C3.10536 9.98043 3 10.2348 3 10.5V13.5C3 13.7652 3.10536 14.0196 3.29289 14.2071C3.48043 14.3946 3.73478 14.5 4 14.5H7C7.26522 14.5 7.51957 14.3946 7.70711 14.2071C7.89464 14.0196 8 13.7652 8 13.5V10.5C8 10.2348 7.89464 9.98043 7.70711 9.79289C7.51957 9.60536 7.26522 9.5 7 9.5H4ZM7 17H4V20H7V17ZM4 16C3.73478 16 3.48043 16.1054 3.29289 16.2929C3.10536 16.4804 3 16.7348 3 17V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.4804 20.8946 3.7348 21 4 21H7C7.2652 21 7.5196 20.8946 7.7071 20.7071C7.8946 20.5196 8 20.2652 8 20V17C8 16.7348 7.8946 16.4804 7.7071 16.2929C7.5196 16.1054 7.2652 16 7 16H4ZM13.5 4H10.5V7H13.5V4ZM10.5 3C10.2348 3 9.98043 3.10536 9.79289 3.29289C9.60536 3.48043 9.5 3.73478 9.5 4V7C9.5 7.26522 9.60536 7.51957 9.79289 7.70711C9.98043 7.89464 10.2348 8 10.5 8H13.5C13.7652 8 14.0196 7.89464 14.2071 7.70711C14.3946 7.51957 14.5 7.26522 14.5 7V4C14.5 3.73478 14.3946 3.48043 14.2071 3.29289C14.0196 3.10536 13.7652 3 13.5 3H10.5ZM13.5 10.5H10.5V13.5H13.5V10.5ZM10.5 9.5C10.2348 9.5 9.98043 9.60536 9.79289 9.79289C9.60536 9.98043 9.5 10.2348 9.5 10.5V13.5C9.5 13.7652 9.60536 14.0196 9.79289 14.2071C9.98043 14.3946 10.2348 14.5 10.5 14.5H13.5C13.7652 14.5 14.0196 14.3946 14.2071 14.2071C14.3946 14.0196 14.5 13.7652 14.5 13.5V10.5C14.5 10.2348 14.3946 9.98043 14.2071 9.79289C14.0196 9.60536 13.7652 9.5 13.5 9.5H10.5ZM13.5 17H10.5V20H13.5V17ZM10.5 16C10.2348 16 9.98043 16.1054 9.79289 16.2929C9.60536 16.4804 9.5 16.7348 9.5 17V20C9.5 20.2652 9.60536 20.5196 9.79289 20.7071C9.98043 20.8946 10.2348 21 10.5 21H13.5C13.7652 21 14.0196 20.8946 14.2071 20.7071C14.3946 20.5196 14.5 20.2652 14.5 20V17C14.5 16.7348 14.3946 16.4804 14.2071 16.2929C14.0196 16.1054 13.7652 16 13.5 16H10.5ZM20 4H17V7H20V4ZM17 3C16.7348 3 16.4804 3.10536 16.2929 3.29289C16.1054 3.48043 16 3.73478 16 4V7C16 7.26522 16.1054 7.51957 16.2929 7.70711C16.4804 7.89464 16.7348 8 17 8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3H17ZM20 10.5H17V13.5H20V10.5ZM17 9.5C16.7348 9.5 16.4804 9.60536 16.2929 9.79289C16.1054 9.98043 16 10.2348 16 10.5V13.5C16 13.7652 16.1054 14.0196 16.2929 14.2071C16.4804 14.3946 16.7348 14.5 17 14.5H20C20.2652 14.5 20.5196 14.3946 20.7071 14.2071C20.8946 14.0196 21 13.7652 21 13.5V10.5C21 10.2348 20.8946 9.98043 20.7071 9.79289C20.5196 9.60536 20.2652 9.5 20 9.5H17ZM20 17H17V20H20V17ZM17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17V20C16 20.2652 16.1054 20.5196 16.2929 20.7071C16.4804 20.8946 16.7348 21 17 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V17C21 16.7348 20.8946 16.4804 20.7071 16.2929C20.5196 16.1054 20.2652 16 20 16H17Z" fill="#FFFFFF"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7 4H4V7H7V4ZM4 3C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H7C7.26522 8 7.51957 7.89464 7.70711 7.70711C7.89464 7.51957 8 7.26522 8 7V4C8 3.73478 7.89464 3.48043 7.70711 3.29289C7.51957 3.10536 7.26522 3 7 3H4ZM7 10.5H4V13.5H7V10.5ZM4 9.5C3.73478 9.5 3.48043 9.60536 3.29289 9.79289C3.10536 9.98043 3 10.2348 3 10.5V13.5C3 13.7652 3.10536 14.0196 3.29289 14.2071C3.48043 14.3946 3.73478 14.5 4 14.5H7C7.26522 14.5 7.51957 14.3946 7.70711 14.2071C7.89464 14.0196 8 13.7652 8 13.5V10.5C8 10.2348 7.89464 9.98043 7.70711 9.79289C7.51957 9.60536 7.26522 9.5 7 9.5H4ZM7 17H4V20H7V17ZM4 16C3.73478 16 3.48043 16.1054 3.29289 16.2929C3.10536 16.4804 3 16.7348 3 17V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.4804 20.8946 3.7348 21 4 21H7C7.2652 21 7.5196 20.8946 7.7071 20.7071C7.8946 20.5196 8 20.2652 8 20V17C8 16.7348 7.8946 16.4804 7.7071 16.2929C7.5196 16.1054 7.2652 16 7 16H4ZM13.5 4H10.5V7H13.5V4ZM10.5 3C10.2348 3 9.98043 3.10536 9.79289 3.29289C9.60536 3.48043 9.5 3.73478 9.5 4V7C9.5 7.26522 9.60536 7.51957 9.79289 7.70711C9.98043 7.89464 10.2348 8 10.5 8H13.5C13.7652 8 14.0196 7.89464 14.2071 7.70711C14.3946 7.51957 14.5 7.26522 14.5 7V4C14.5 3.73478 14.3946 3.48043 14.2071 3.29289C14.0196 3.10536 13.7652 3 13.5 3H10.5ZM13.5 10.5H10.5V13.5H13.5V10.5ZM10.5 9.5C10.2348 9.5 9.98043 9.60536 9.79289 9.79289C9.60536 9.98043 9.5 10.2348 9.5 10.5V13.5C9.5 13.7652 9.60536 14.0196 9.79289 14.2071C9.98043 14.3946 10.2348 14.5 10.5 14.5H13.5C13.7652 14.5 14.0196 14.3946 14.2071 14.2071C14.3946 14.0196 14.5 13.7652 14.5 13.5V10.5C14.5 10.2348 14.3946 9.98043 14.2071 9.79289C14.0196 9.60536 13.7652 9.5 13.5 9.5H10.5ZM13.5 17H10.5V20H13.5V17ZM10.5 16C10.2348 16 9.98043 16.1054 9.79289 16.2929C9.60536 16.4804 9.5 16.7348 9.5 17V20C9.5 20.2652 9.60536 20.5196 9.79289 20.7071C9.98043 20.8946 10.2348 21 10.5 21H13.5C13.7652 21 14.0196 20.8946 14.2071 20.7071C14.3946 20.5196 14.5 20.2652 14.5 20V17C14.5 16.7348 14.3946 16.4804 14.2071 16.2929C14.0196 16.1054 13.7652 16 13.5 16H10.5ZM20 4H17V7H20V4ZM17 3C16.7348 3 16.4804 3.10536 16.2929 3.29289C16.1054 3.48043 16 3.73478 16 4V7C16 7.26522 16.1054 7.51957 16.2929 7.70711C16.4804 7.89464 16.7348 8 17 8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3H17ZM20 10.5H17V13.5H20V10.5ZM17 9.5C16.7348 9.5 16.4804 9.60536 16.2929 9.79289C16.1054 9.98043 16 10.2348 16 10.5V13.5C16 13.7652 16.1054 14.0196 16.2929 14.2071C16.4804 14.3946 16.7348 14.5 17 14.5H20C20.2652 14.5 20.5196 14.3946 20.7071 14.2071C20.8946 14.0196 21 13.7652 21 13.5V10.5C21 10.2348 20.8946 9.98043 20.7071 9.79289C20.5196 9.60536 20.2652 9.5 20 9.5H17ZM20 17H17V20H20V17ZM17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17V20C16 20.2652 16.1054 20.5196 16.2929 20.7071C16.4804 20.8946 16.7348 21 17 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V17C21 16.7348 20.8946 16.4804 20.7071 16.2929C20.5196 16.1054 20.2652 16 20 16H17Z" fill="#748A91"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "list" ? "bg-[#01373D] border-transparent text-[#01373D]" : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            {viewMode === "list" ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M17 1H1V4H17V1ZM1 0C0.734784 0 0.480429 0.105357 0.292892 0.292893C0.105356 0.48043 0 0.734784 0 1V4C0 4.26522 0.105356 4.51957 0.292892 4.70711C0.480429 4.89464 0.734784 5 1 5H17C17.2653 5 17.5196 4.89464 17.7072 4.70711C17.8947 4.51957 18 4.26522 18 4V1C18 0.734784 17.8947 0.48043 17.7072 0.292893C17.5196 0.105357 17.2653 0 17 0H1Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M17 7.5H1V10.5H17V7.5ZM1 6.5C0.734784 6.5 0.480429 6.60536 0.292892 6.79289C0.105356 6.98043 0 7.23478 0 7.5V10.5C0 10.7652 0.105356 11.0196 0.292892 11.2071C0.480429 11.3946 0.734784 11.5 1 11.5H17C17.2653 11.5 17.5196 11.3946 17.7072 11.2071C17.8947 11.0196 18 10.7652 18 10.5V7.5C18 7.23478 17.8947 6.98043 17.7072 6.79289C17.5196 6.60536 17.2653 6.5 17 6.5H1Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M17 14H1V17H17V14ZM1 13C0.734784 13 0.480429 13.1054 0.292892 13.2929C0.105356 13.4804 0 13.7348 0 14V17C0 17.2652 0.105356 17.5196 0.292892 17.7071C0.480429 17.8946 0.734784 18 1 18H17C17.2653 18 17.5196 17.8946 17.7072 17.7071C17.8947 17.5196 18 17.2652 18 17V14C18 13.7348 17.8947 13.4804 17.7072 13.2929C17.5196 13.1054 17.2653 13 17 13H1Z" fill="white"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M17 1H1V4H17V1ZM1 0C0.734784 0 0.480429 0.105357 0.292892 0.292893C0.105356 0.48043 0 0.734784 0 1V4C0 4.26522 0.105356 4.51957 0.292892 4.70711C0.480429 4.89464 0.734784 5 1 5H17C17.2653 5 17.5196 4.89464 17.7072 4.70711C17.8947 4.51957 18 4.26522 18 4V1C18 0.734784 17.8947 0.48043 17.7072 0.292893C17.5196 0.105357 17.2653 0 17 0H1Z" fill="#748A91"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M17 7.5H1V10.5H17V7.5ZM1 6.5C0.734784 6.5 0.480429 6.60536 0.292892 6.79289C0.105356 6.98043 0 7.23478 0 7.5V10.5C0 10.7652 0.105356 11.0196 0.292892 11.2071C0.480429 11.3946 0.734784 11.5 1 11.5H17C17.2653 11.5 17.5196 11.3946 17.7072 11.2071C17.8947 11.0196 18 10.7652 18 10.5V7.5C18 7.23478 17.8947 6.98043 17.7072 6.79289C17.5196 6.60536 17.2653 6.5 17 6.5H1Z" fill="#748A91"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M17 14H1V17H17V14ZM1 13C0.734784 13 0.480429 13.1054 0.292892 13.2929C0.105356 13.4804 0 13.7348 0 14V17C0 17.2652 0.105356 17.5196 0.292892 17.7071C0.480429 17.8946 0.734784 18 1 18H17C17.2653 18 17.5196 17.8946 17.7072 17.7071C17.8947 17.5196 18 17.2652 18 17V14C18 13.7348 17.8947 13.4804 17.7072 13.2929C17.5196 13.1054 17.2653 13 17 13H1Z" fill="#748A91"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          Found {filteredSPVs.length} {filteredSPVs.length === 1 ? "SPV" : "SPVs"} matching "{searchQuery}"
        </div>
      )}

      {/* SPV Cards */}
      <div className="space-y-4">
        {filteredSPVs.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SPVs found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || activeTab !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You don't have any SPVs yet."}
            </p>
            {(searchQuery || activeTab !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
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
                  <button
                    onClick={() => {
                      setSelectedSpv(spv);
                      setShowViewModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
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
                          <button
                            onClick={() => handleArchiveClick(spv)}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                          >
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
                <button
                  onClick={() => {
                    setSelectedSpv(spv);
                    setShowDocumentsModal(true);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Documents</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedSpv(spv);
                    setShowAnalyticsModal(true);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
          ))
        ) : (
          /* List/Table View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investors</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSPVs.map((spv, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{spv.name}</div>
                        <div className="text-xs text-gray-500">{spv.id}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${spv.statusColor}`}>
                          {spv.status}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-sm text-gray-900">{spv.location}</td>
                      <td className="hidden xl:table-cell px-6 py-4 text-sm text-gray-900">{spv.created}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{spv.raised}</td>
                      <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">{spv.target}</td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-900">{spv.investors}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 lg:w-16 bg-[#CEC6FF] rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(spv.status)}`}
                              style={{ width: `${spv.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs lg:text-sm text-gray-600">{spv.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSpv(spv);
                              setShowViewModal(true);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            title="View Details"
                          >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleViewDetails(spv)}
                            className="text-[#00F0C3] hover:text-[#00D4A3] transition-colors font-medium text-xs lg:text-sm"
                            title="View Full Details"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredSPVs.map((spv, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{spv.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{spv.id}</p>
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${spv.statusColor} flex-shrink-0`}>
                      {spv.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Raised</p>
                      <p className="text-sm font-semibold text-gray-900">{spv.raised}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="text-sm font-semibold text-gray-900">{spv.target}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Investors</p>
                      <p className="text-sm font-semibold text-gray-900">{spv.investors}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="text-sm font-semibold text-gray-900">{spv.progress}%</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Funding Progress</span>
                      <span className="text-xs text-gray-600">{spv.progress}%</span>
                    </div>
                    <div className="w-full bg-[#CEC6FF] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(spv.status)}`}
                        style={{ width: `${spv.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedSpv(spv);
                        setShowViewModal(true);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="View Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleViewDetails(spv)}
                      className="px-3 py-1.5 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors text-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View SPV Details Modal */}
      {showViewModal && selectedSpv && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowViewModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">SPV Details</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedSpv.name}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">SPV ID</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedSpv.statusColor}`}>
                          {selectedSpv.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Created Date</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.created}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Category</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Progress</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.progress}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Raised</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.raised}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Target Amount</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.target}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Number of Investors</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.investors}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Minimum Investment</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.minInvestment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Progress</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{selectedSpv.progress}%</span>
                      </div>
                      <div className="w-full bg-[#CEC6FF] rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${selectedSpv.progressColor || getProgressColor(selectedSpv.status)}`}
                          style={{ width: `${selectedSpv.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleViewDetails(selectedSpv);
                  }}
                  className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && spvToArchive && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => !archiving && setShowArchiveModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Archive SPV</h2>
                </div>
                {!archiving && (
                  <button
                    onClick={() => setShowArchiveModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to archive <span className="font-semibold text-gray-900">{spvToArchive.name}</span>?
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  This action will archive the SPV. You can restore it later if needed. Archived SPVs will not appear in your active SPV list.
                </p>
                {spvToArchive.id && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">SPV ID</p>
                    <p className="text-sm font-medium text-gray-900">{spvToArchive.id}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowArchiveModal(false);
                    setSpvToArchive(null);
                  }}
                  disabled={archiving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleArchiveConfirm}
                  disabled={archiving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {archiving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Archiving...</span>
                    </>
                  ) : (
                    <span>Archive SPV</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDocumentsModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
                  {selectedSpv && (
                    <p className="text-sm text-gray-600 mt-1">{selectedSpv.name}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowDocumentsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md">
                    There are no documents uploaded for this SPV yet. Documents will appear here once they are added.
                  </p>
                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedSpv && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAnalyticsModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedSpv.name}</p>
                </div>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Funding Progress Chart */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Progress</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-8 gap-6">
                      {/* Circular Progress Chart */}
                      <div className="relative flex-shrink-0 mx-auto sm:mx-0 w-48 h-48 sm:w-64 sm:h-64">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="none"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#00F0C3"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - selectedSpv.progress / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              {selectedSpv.raised}
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              of {selectedSpv.target} target
                            </p>
                            <p className="text-sm font-semibold text-[#00F0C3]">
                              {selectedSpv.progress}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="flex-1 space-y-3 max-w-md">
                        <div className="bg-[#F9F8FF] rounded-lg p-3 border border-[#E2E2FB]">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedSpv.statusColor}`}>
                            {selectedSpv.status}
                          </span>
                        </div>
                        <div className="bg-[#F9F8FF] rounded-lg p-3 border border-[#E2E2FB]">
                          <p className="text-xs text-gray-500 mb-1">Total Investors</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedSpv.investors}</p>
                        </div>
                        <div className="bg-[#F9F8FF] rounded-lg p-3 border border-[#E2E2FB]">
                          <p className="text-xs text-gray-500 mb-1">Minimum Investment</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedSpv.minInvestment}</p>
                        </div>
                        <div className="bg-[#F9F8FF] rounded-lg p-3 border border-[#E2E2FB]">
                          <p className="text-xs text-gray-500 mb-1">Progress</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedSpv.progress}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Amount Raised</p>
                        <p className="text-xl font-semibold text-gray-900">{selectedSpv.raised}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Target Amount</p>
                        <p className="text-xl font-semibold text-gray-900">{selectedSpv.target}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Remaining</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {(() => {
                            // Extract numeric values for calculation
                            const raisedNum = parseFloat(selectedSpv.raised.replace(/[$,KM]/g, '')) || 0;
                            const targetNum = parseFloat(selectedSpv.target.replace(/[$,KM]/g, '')) || 0;
                            const remaining = targetNum - raisedNum;
                            if (remaining >= 1000) return `$${(remaining / 1000).toFixed(1)}K`;
                            return `$${remaining.toFixed(0)}`;
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Average per Investor</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {(() => {
                            const raisedNum = parseFloat(selectedSpv.raised.replace(/[$,KM]/g, '')) || 0;
                            const investors = parseInt(selectedSpv.investors) || 1;
                            const avg = raisedNum / investors;
                            if (avg >= 1000) return `$${(avg / 1000).toFixed(1)}K`;
                            return `$${avg.toFixed(0)}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Progress</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Funding Progress</span>
                        <span className="text-sm font-medium text-gray-900">{selectedSpv.progress}%</span>
                      </div>
                      <div className="w-full bg-[#CEC6FF] rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${selectedSpv.progressColor || getProgressColor(selectedSpv.status)}`}
                          style={{ width: `${selectedSpv.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SPVManagement;
