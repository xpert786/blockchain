import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import { HomeIcon, InvitesIcon, PortfolioIcon, TaxesIcon, MessagesIcon, SettingsIcon, AlertsIcon } from "./icon.jsx";
const Invest = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const investDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const syndicates = [
    {
      name: "NextGen AI Syndicate",
      date: "02/01/2024",
      description: "Focused On Artificial Intelligence And Machine Learning Startups With Proven Traction And Enterprise Customers.",
      tags: ["Technology", "Series B", "Raising"],
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$25,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      date: "02/01/2024",
      description: "Focused On Artificial Intelligence And Machine Learning Startups With Proven Traction And Enterprise Customers.",
      tags: ["Technology", "Series B", "Raising"],
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$25,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      date: "02/01/2024",
      description: "Focused On Artificial Intelligence And Machine Learning Startups With Proven Traction And Enterprise Customers.",
      tags: ["Technology", "Series B", "Raising"],
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$25,000",
      trackRecord: "+23.4% IRR",
      status: 65
    }
  ];

  const filterOptions = ["All", "Technology", "AI/ML", "Robotics", "Healthcare", "Energy", "Finance"];

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
      {/* Top Header */}
      <header className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between w-full md:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
                aria-label="Open primary navigation"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/investor-panel/notifications")}
                className="relative bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
                aria-label="View notifications"
              >
                <AlertsIcon />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                  <span className="text-[#01373D] text-xs font-bold">2</span>
                </div>
              </button>
              <div className="flex items-center gap-1">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#01373D] text-[#01373D]" aria-label="Open profile menu">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center w-full gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  placeholder="Search SPVs, investors, documents..."
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative">
                  <button 
                    onClick={() => navigate("/investor-panel/notifications")}
                    className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
                    aria-label="View notifications"
                  >
                    <AlertsIcon />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                      <span className="text-[#01373D] text-xs font-bold">2</span>
                    </div>
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <button className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]" aria-label="Open profile menu">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search SPVs, investors, documents..."
                className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Dark Teal) */}
      <nav className="hidden lg:block bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full overflow-x-auto py-2">
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-3 py-3 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <HomeIcon />
            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button 
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors bg-[#FFFFFF1A] text-white"
            >
              <InvitesIcon />
              Invest
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showInvestDropdown && (
              <div className="absolute top-full left-0 mt-2 bg.white rounded-lg shadow-lg z-10 min-w-[180px]" style={{border: "1px solid #000"}}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg"
                  style={{backgroundColor: "#00F0C3"}}
                >
                  Discover
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invites");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Invites
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/top-syndicates");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Top Syndicates
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/wishlist");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                >
                  Wishlist
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate("/investor-panel/tax-documents")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <PortfolioIcon />
            Your Portfolio
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <TaxesIcon />
            Taxes & Document
          </button>
          <button 
            onClick={() => navigate("/investor-panel/messages")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <MessagesIcon />
            Messages
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <SettingsIcon />
            Investor Settings
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white transition-transform duration-300 ease-in-out shadow-lg lg:hidden ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-[#01373D]">Navigation</h4>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
            aria-label="Close navigation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <button
            onClick={() => navigate("/investor-panel/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Overview
          </button>
          <div className="space-y-2 rounded-lg border border-[#E2E2FB] p-4">
            <p className="text-sm font-semibold text-[#01373D] font-poppins-custom">Invest</p>
            <button
              onClick={() => navigate("/investor-panel/invest")}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[#001D21] hover:bg-[#F4F6F5] transition-colors font-poppins-custom"
            >
              Discover
            </button>
            <button
              onClick={() => navigate("/investor-panel/invites")}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[#001D21] hover:bg-[#F4F6F5] transition-colors font-poppins-custom"
            >
              Invites
            </button>
            <button
              onClick={() => navigate("/investor-panel/top-syndicates")}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[#001D21] hover:bg-[#F4F6F5] transition-colors font-poppins-custom"
            >
              Top Syndicates
            </button>
            <button
              onClick={() => navigate("/investor-panel/wishlist")}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[#001D21] hover:bg-[#F4F6F5] transition-colors font-poppins-custom"
            >
              Wishlist
            </button>
          </div>
          <button
            onClick={() => navigate("/investor-panel/tax-documents")}
            className="w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Taxes & Document
          </button>
          <button
            onClick={() => navigate("/investor-panel/messages")}
            className="w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Messages
          </button>
          <button
            onClick={() => navigate("/investor-panel/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Investor Settings
          </button>
        </div>
      </div>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 py-8">
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
          {syndicates.map((syndicate, index) => (
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
                  <button className="px-4 py-2 bg-[#00F0C3] text-black rounded-xl hover:bg-[#16a34a] transition-colors font-medium font-poppins-custom flex items-center gap-2 text-sm">
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Invest;

