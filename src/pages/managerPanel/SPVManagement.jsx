import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SPVManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const metrics = [
    {
      title: "Total SPVs",
      value: "12",
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
      value: "$8.7M",
      change: "+15.2%",
      bgColor: "bg-[#D7F8F0]",
      iconColor: "text-[#01373D]",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 11.6312 16.9749 10.9749C17.6312 10.3185 18 9.42826 18 8.5C18 7.57174 17.6312 6.6815 16.9749 6.02513C16.3185 5.36875 15.4283 5 14.5 5H17Z" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Active Investors",
      value: "74",
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
      value: "87%",
      change: "+5% this quarter",
      bgColor: "bg-[#FFEFE8]",
      iconColor: "text-[#01373D]",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3V21H21M7 16L10 13L14 17L21 10" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const tabs = [
    { id: "all", label: "All", count: 4 },
    { id: "ready", label: "Ready to launch", count: 1 },
    { id: "fundraising", label: "Fundraising", count: 1 },
    { id: "closed", label: "Closed", count: 1 }
  ];

  const spvs = [
    {
      id: "SPV-001",
      name: "Tech Startup Fund Q4 2024",
      location: "Delaware",
      created: "1/15/2024",
      category: "Technology",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white",
      raised: "$2.4M",
      target: "$5.0M",
      investors: "24",
      minInvestment: "$25,000",
      progress: 48,
      progressColor: "bg-[#22C55E]"
    },
    {
      id: "SPV-002",
      name: "Real Estate Opportunity Fund",
      location: "Cayman Islands",
      created: "1/15/2024",
      category: "Technology",
      status: "Ready to Launch",
      statusColor: "bg-[#FFD97A] text-white",
      raised: "$1.8M",
      target: "$3.0M",
      investors: "18",
      minInvestment: "$50,000",
      progress: 60,
      progressColor: "bg-[#FFD97A]"
    },
    {
      id: "SPV-003",
      name: "Healthcare Innovation Series A",
      location: "Singapore",
      created: "1/15/2024",
      category: "Technology",
      status: "Closing",
      statusColor: "bg-[#ED1C24] text-white",
      raised: "$4.5M",
      target: "$4.5M",
      investors: "32",
      minInvestment: "$75,000",
      progress: 100,
      progressColor: "bg-[#ED1C24]"
    },
    {
      id: "SPV-004",
      name: "Green Energy Infrastructure",
      location: "Luxembourg",
      created: "1/15/2024",
      category: "Technology",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white",
      raised: "$0.0M",
      target: "$8.0M",
      investors: "0",
      minInvestment: "$100,000",
      progress: 0,
      progressColor: "bg-[#22C55E]"
    }
  ];

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
    
    // Navigate to SPV details page
    console.log('Navigating to SPV Details...');
    navigate('/manager-panel/spv-details');
    console.log('Navigation completed!');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-medium text-gray-600 mb-2">SPV Management</h3>
        <p className="text-gray-600">Create and manage your Special Purpose Vehicles</p>
        
        {/* Test Buttons */}
        <div className="mt-4">
        
          
        
          
          
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`${metric.bgColor} rounded-lg p-6 h-32 flex flex-col justify-between`}>
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search SPVs by name, ID, or focus area..."
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-[] text-black" : "bg-gray-200 text-gray-600"
            }`}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.25" y="0.25" width="31.5" height="31.5" rx="5.75" stroke={viewMode === "grid" ? "#000000" : "#748A91"} strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11 8H8V11H11V8ZM8 7C7.73478 7 7.48043 7.10536 7.29289 7.29289C7.10536 7.48043 7 7.73478 7 8V11C7 11.2652 7.10536 11.5196 7.29289 11.7071C7.48043 11.8946 7.73478 12 8 12H11C11.2652 12 11.5196 11.8946 11.7071 11.7071C11.8946 11.5196 12 11.2652 12 11V8C12 7.73478 11.8946 7.48043 11.7071 7.29289C11.5196 7.10536 11.2652 7 11 7H8ZM11 14.5H8V17.5H11V14.5ZM8 13.5C7.73478 13.5 7.48043 13.6054 7.29289 13.7929C7.10536 13.9804 7 14.2348 7 14.5V17.5C7 17.7652 7.10536 18.0196 7.29289 18.2071C7.48043 18.3946 7.73478 18.5 8 18.5H11C11.2652 18.5 11.5196 18.3946 11.7071 18.2071C11.8946 18.0196 12 17.7652 12 17.5V14.5C12 14.2348 11.8946 13.9804 11.7071 13.7929C11.5196 13.6054 11.2652 13.5 11 13.5H8ZM11 21H8V24H11V21ZM8 20C7.73478 20 7.48043 20.1054 7.29289 20.2929C7.10536 20.4804 7 20.7348 7 21V24C7 24.2652 7.10536 24.5196 7.29289 24.7071C7.48043 24.8946 7.73478 25 8 25H11C11.2652 25 11.5196 24.8946 11.7071 24.7071C11.8946 24.5196 12 24.2652 12 24V21C12 20.7348 11.8946 20.4804 11.7071 20.2929C11.5196 20.1054 11.2652 20 11 20H8ZM17.5 8H14.5V11H17.5V8ZM14.5 7C14.2348 7 13.9804 7.10536 13.7929 7.29289C13.6054 7.48043 13.5 7.73478 13.5 8V11C13.5 11.2652 13.6054 11.5196 13.7929 11.7071C13.9804 11.8946 14.2348 12 14.5 12H17.5C17.7652 12 18.0196 11.8946 18.2071 11.7071C18.3946 11.5196 18.5 11.2652 18.5 11V8C18.5 7.73478 18.3946 7.48043 18.2071 7.29289C18.0196 7.10536 17.7652 7 17.5 7H14.5ZM17.5 14.5H14.5V17.5H17.5V14.5ZM14.5 13.5C14.2348 13.5 13.9804 13.6054 13.7929 13.7929C13.6054 13.9804 13.5 14.2348 13.5 14.5V17.5C13.5 17.7652 13.6054 18.0196 13.7929 18.2071C13.9804 18.3946 14.2348 18.5 14.5 18.5H17.5C17.7652 18.5 18.0196 18.3946 18.2071 18.2071C18.3946 18.0196 18.5 17.7652 18.5 17.5V14.5C18.5 14.2348 18.3946 13.9804 18.2071 13.7929C18.0196 13.6054 17.7652 13.5 17.5 13.5H14.5ZM17.5 21H14.5V24H17.5V21ZM14.5 20C14.2348 20 13.9804 20.1054 13.7929 20.2929C13.6054 20.4804 13.5 20.7348 13.5 21V24C13.5 24.2652 13.6054 24.5196 13.7929 24.7071C13.9804 24.8946 14.2348 25 14.5 25H17.5C17.7652 25 18.0196 24.8946 18.2071 24.7071C18.3946 24.5196 18.5 24.2652 18.5 24V21C18.5 20.7348 18.3946 20.4804 18.2071 20.2929C18.0196 20.1054 17.7652 20 17.5 20H14.5ZM24 8H21V11H24V8ZM21 7C20.7348 7 20.4804 7.10536 20.2929 7.29289C20.1054 7.48043 20 7.73478 20 8V11C20 11.2652 20.1054 11.5196 20.2929 11.7071C20.4804 11.8946 20.7348 12 21 12H24C24.2652 12 24.5196 11.8946 24.7071 11.7071C24.8946 11.5196 25 11.2652 25 11V8C25 7.73478 24.8946 7.48043 24.7071 7.29289C24.5196 7.10536 24.2652 7 24 7H21ZM24 14.5H21V17.5H24V14.5ZM21 13.5C20.7348 13.5 20.4804 13.6054 20.2929 13.7929C20.1054 13.9804 20 14.2348 20 14.5V17.5C20 17.7652 20.1054 18.0196 20.2929 18.2071C20.4804 18.3946 20.7348 18.5 21 18.5H24C24.2652 18.5 24.5196 18.3946 24.7071 18.2071C24.8946 18.0196 25 17.7652 25 17.5V14.5C25 14.2348 24.8946 13.9804 24.7071 13.7929C24.5196 13.6054 24.2652 13.5 24 13.5H21ZM24 21H21V24H24V21ZM21 20C20.7348 20 20.4804 20.1054 20.2929 20.2929C20.1054 20.4804 20 20.7348 20 21V24C20 24.2652 20.1054 24.5196 20.2929 24.7071C20.4804 24.8946 20.7348 25 21 25H24C24.2652 25 24.5196 24.8946 24.7071 24.7071C24.8946 24.5196 25 24.2652 25 24V21C25 20.7348 24.8946 20.4804 24.7071 20.2929C24.5196 20.1054 24.2652 20 24 20H21Z" fill={viewMode === "grid" ? "#000000" : "#01373D"}/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-[#00F0C3] text-black" : "bg-gray-200 text-gray-600"
            }`}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.25" y="0.25" width="31.5" height="31.5" rx="5.75" fill={viewMode === "list" ? "#000000" : "#01373D"}/>
              <rect x="0.25" y="0.25" width="31.5" height="31.5" rx="5.75" stroke={viewMode === "list" ? "#000000" : "#01373D"} strokeWidth="0.5"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24 8H8V11H24V8ZM8 7C7.73478 7 7.48043 7.10536 7.29289 7.29289C7.10536 7.48043 7 7.73478 7 8V11C7 11.2652 7.10536 11.5196 7.29289 11.7071C7.48043 11.8946 7.73478 12 8 12H24C24.2653 12 24.5196 11.8946 24.7072 11.7071C24.8947 11.5196 25 11.2652 25 11V8C25 7.73478 24.8947 7.48043 24.7072 7.29289C24.5196 7.10536 24.2653 7 24 7H8Z" fill={viewMode === "list" ? "#000000" : "white"}/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24 14.5H8V17.5H24V14.5ZM8 13.5C7.73478 13.5 7.48043 13.6054 7.29289 13.7929C7.10536 13.9804 7 14.2348 7 14.5V17.5C7 17.7652 7.10536 18.0196 7.29289 18.2071C7.48043 18.3946 7.73478 18.5 8 18.5H24C24.2653 18.5 24.5196 18.3946 24.7072 18.2071C24.8947 18.0196 25 17.7652 25 17.5V14.5C25 14.2348 24.8947 13.9804 24.7072 13.7929C24.5196 13.6054 24.2653 13.5 24 13.5H8Z" fill={viewMode === "list" ? "#000000" : "white"}/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24 21H8V24H24V21ZM8 20C7.73478 20 7.48043 20.1054 7.29289 20.2929C7.10536 20.4804 7 20.7348 7 21V24C7 24.2652 7.10536 24.5196 7.29289 24.7071C7.48043 24.8946 7.73478 25 8 25H24C24.2653 25 24.5196 24.8946 24.7072 24.7071C24.8947 24.5196 25 24.2652 25 24V21C25 20.7348 24.8947 20.4804 24.7072 20.2929C24.5196 20.1054 24.2653 20 24 20H8Z" fill={viewMode === "list" ? "#000000" : "white"}/>
            </svg>
          </button>
        </div>
      </div>

      {/* SPV Cards */}
      <div className="space-y-4">
        {spvs.map((spv, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{spv.name}</h3>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>Manage Investors</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Documents</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SPVManagement;
