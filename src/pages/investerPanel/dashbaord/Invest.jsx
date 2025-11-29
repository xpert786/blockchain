import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Invest = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const filterDropdownRef = useRef(null);
  const [syndicates, setSyndicates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format currency helper
  const formatCurrency = (value) => {
    if (!value || value === 0) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Format allocated as percentage or number
  const formatAllocated = (value) => {
    if (!value || value === 0) return "0";
    return value.toString();
  };

  // Calculate progress percentage
  const calculateProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.round((raised / target) * 100);
  };

  // Fetch discover deals from API
  useEffect(() => {
    fetchDiscoverDeals();
  }, []);

  const fetchDiscoverDeals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/dashboard/discover_deals/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Discover deals API response:", data);
        
        // Map API response to component data structure
        const mappedSyndicates = data.results?.map(deal => {
          const progress = calculateProgress(deal.raised || 0, deal.target || 0);
          
          return {
            id: deal.id,
            spvId: deal.spv_id,
            name: deal.syndicate_name || deal.company_name || "Unnamed Deal",
            date: deal.created_at || "-",
            description: `${deal.company_name || deal.syndicate_name} - ${deal.sector || "General"} sector opportunity in ${deal.stage || "Seed"} stage.`,
            tags: [
              ...(deal.tags || []),
              deal.sector,
              deal.stage,
              deal.status === "Pending" ? "Pending" : "Raising"
            ].filter(Boolean),
            allocated: formatAllocated(deal.allocated),
            raised: formatCurrency(deal.raised),
            target: formatCurrency(deal.target),
            minInvestment: formatCurrency(deal.min_investment),
            trackRecord: "+23.4% IRR", // This might come from API in future
            status: progress,
            daysLeft: deal.days_left?.toString() || "0",
            rawData: deal // Keep raw data for navigation
          };
        }) || [];

        setSyndicates(mappedSyndicates);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch discover deals:", response.status, errorText);
        setError("Failed to load deals. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching discover deals:", err);
      setError(err.message || "Network error loading deals.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const filterOptions = ["All", "Technology", "AI/ML", "Robotics", "Healthcare", "Energy", "Finance"];

  return (
    <>
        {/* Header Section */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <h1 className="text-3xl  text-[#0A2A2E] font-poppins-custom mb-2">
            Discover/ Find New <span className="text-[#9889FF]">Syndicates</span>
          </h1>
          <p className="text-base text-[#748A91] font-poppins-custom mb-6">
            Discover and invest in top-tier opportunities
          </p>

          {/* Search, Filter, and View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-6 mb-6">
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search Companies, funds, leads."
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center sm:justify-start gap-2 text-sm font-medium font-poppins-custom text-[#0A2A2E]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Filter
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showFilterDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                      {filterOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveFilter(option);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-poppins-custom hover:bg-gray-50 transition-colors ${
                            activeFilter === option ? "bg-[#00F0C3] text-[#001D21]" : "text-[#0A2A2E]"
                          } ${index === 0 ? "rounded-t-lg" : ""} ${index === filterOptions.length - 1 ? "rounded-b-lg" : ""}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1 self-start">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H9V9H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 3H17V9H11V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 11H9V17H3V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 11H17V17H11V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Syndicate Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchDiscoverDeals}
                className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : syndicates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No deals available at the moment.</p>
            </div>
          ) : (
            syndicates.map((syndicate, index) => (
            <div key={index} className="bg-white rounded-lg p-6" style={{border: "0.5px solid #E2E2FB"}}>
              {/* Header: Name, Date, Tags */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                    {syndicate.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 6H13M6 2V4M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{syndicate.date}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {syndicate.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom ${
                        tag === "Raising"
                          ? "bg-[#22C55E] text-white"
                          : "bg-[#F9F8FF]  text-[#0A2A2E] " 
                      }`}
                      style={{border: "1px solid #E2E2FB"}}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#748A91] font-poppins-custom mb-5">
                {syndicate.description}
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Allocated</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.allocated}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Raised</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.raised}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1 ">Target</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.target}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Min. Investment</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.minInvestment}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Track Record</p>
                  <p className="text-base font-medium text-[#22C55E] font-poppins-custom">{syndicate.trackRecord}</p>
                </div>
              </div>

              {/* Progress Bar and Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 flex-1 w-full">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div className="bg-[#22C55E] h-full" style={{width: `${syndicate.status}%`}}></div>
                      <div className="bg-[#CEC6FF] h-full" style={{width: `${100 - syndicate.status}%`}}></div>
                    </div>
                  </div>
                  <span className="text-sm text-[#0A2A2E] font-poppins-custom whitespace-nowrap">{syndicate.status}%</span>
                </div>
              </div>

               {/* Action Buttons */}
               <div className="flex flex-wrap items-center justify-start gap-3 ">
                  <button 
                    onClick={() => navigate(`/investor-panel/tax-documents/${syndicate.id || syndicate.spvId || '1'}`, { 
                      state: { 
                        document: {
                          id: syndicate.id || syndicate.spvId || '1',
                          investmentName: syndicate.name,
                          company: syndicate.name,
                          taxYear: new Date().getFullYear().toString(),
                          issueDate: syndicate.date,
                          status: "Available",
                          stage: syndicate.tags?.find(tag => ['Seed', 'Series A', 'Series B', 'Series C'].includes(tag)) || "Seed",
                          valuation: syndicate.target,
                          expectedReturns: "3-5x",
                          timeline: `${syndicate.daysLeft} days`,
                          fundingProgress: syndicate.status,
                          fundingRaised: syndicate.raised,
                          fundingTarget: syndicate.target,
                          documentTitle: `${syndicate.name} Investment Document`,
                          size: "2.5 MB",
                          rawData: syndicate.rawData || syndicate
                        }
                      } 
                    })}
                    className="px-4 py-2 bg-[#00F0C3] text-black rounded-xl hover:bg-[#16a34a] transition-colors font-medium font-poppins-custom flex items-center gap-2 text-sm"
                  >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 5.25L10.125 11.625L6.375 7.875L1.5 12.75M16.5 5.25H12M16.5 5.25V9.75" stroke="#001D21" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>                                                   

                    Invest Now
                  </button>
                  <button className="px-4 py-2 bg-[#F4F6F5]  text-[#0A2A2E] rounded-xl hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                  style={{border: "0.5px solid #01373D"}}
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-[#F4F6F5]  text-[#0A2A2E] rounded-xl hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                  style={{border: "0.5px solid #01373D"}}
                  >
                    Request Invite
                  </button>
                  <button className="w-10 h-10 bg-[#F4F6F5]  text-[#0A2A2E] rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                  style={{border: "0.5px solid #01373D"}}
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1.5L12.5 7.5L19 8.5L14.5 13L15.5 19.5L10 16.5L4.5 19.5L5.5 13L1 8.5L7.5 7.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
            </div>
          ))
          )}
        </div>
    </>
  );
};

export default Invest;

