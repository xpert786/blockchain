import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {HomeIcon,InvitesIcon,PortfolioIcon,TaxesIcon,MessagesIcon,SettingsIcon, GrowthIcon, AlertsIcon } from "./icon.jsx";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const Portfolio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const investDropdownRef = useRef(null);
  const [activeNav, setActiveNav] = useState("portfolio");
  const [chartFilter, setChartFilter] = useState("round"); // "round" or "sector"
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const chartDropdownRef = useRef(null);

  useEffect(() => {
    const path = location.pathname;
    if (
      [
        "/investor-panel/invest",
        "/investor-panel/invites",
        "/investor-panel/top-syndicates",
        "/investor-panel/wishlist"
      ].some((segment) => path.includes(segment))
    ) {
      setActiveNav("invest");
    } else if (path.includes("/investor-panel/portfolio")) {
      setActiveNav("portfolio");
    } else if (path.includes("/investor-panel/tax-documents")) {
      setActiveNav("taxes");
    } else if (path.includes("/investor-panel/messages")) {
      setActiveNav("messages");
    } else if (path.includes("/investor-panel/settings")) {
      setActiveNav("settings");
    } else {
      setActiveNav("overview");
    }
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
      if (chartDropdownRef.current && !chartDropdownRef.current.contains(event.target)) {
        setShowChartDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Portfolio Performance Data
  const portfolioData = [
    { month: "Oct '24", invested: 10, invested90: 0 },
    { month: "Dec '24", invested: 25, invested90: 2 },
    { month: "Feb '25", invested: 70, invested90: 15 },
    { month: "Apr '25", invested: 75, invested90: 18 },
    { month: "Jun '25", invested: 80, invested90: 20 },
    { month: "Aug '25", invested: 110, invested90: 35 }
  ];

  // Invested by Round Data
  const roundData = [
    { name: "Seed", value: 5000, color: "#00F0C3" },
    { name: "Series B", value: 50000, color: "#9889FF" },
    { name: "Seed", value: 20000, color: "#FFD700" }
  ];

  // Invested by Sector Data
  const sectorData = [
    { name: "Tech", value: 50000, color: "#00F0C3" },
    { name: "Fintech", value: 35000, color: "#9889FF" },
    { name: "Health", value: 15000, color: "#22C55E" },
    { name: "Consumer", value: 20000, color: "#FFD700" }
  ];

  // Get current chart data based on filter
  const chartData = chartFilter === "round" ? roundData : sectorData;
  const chartTitle = chartFilter === "round" ? "$ Invested by Round" : "$ Invested by Sector";

  const investments = [
    {
      name: "TechCorp Series C",
      updated: "2 days ago",
      tags: ["Technology", "Active"],
      invested: "$75,000",
      currentValue: "$95,000",
      gainLoss: "$20,000 (+26.7%)",
      gainLossPositive: true
    },
    {
      name: "GreenEnergy Fund III",
      updated: "1 week ago",
      tags: ["Energy", "Active"],
      invested: "$100,000",
      currentValue: "$118,000",
      gainLoss: "$18,000 (+18%)",
      gainLossPositive: true
    },
    {
      name: "HealthTech Syndicate",
      updated: "3 days ago",
      tags: ["Healthcare", "Active"],
      invested: "$50,000",
      currentValue: "$47,500",
      gainLoss: "-$2,500 (-5%)",
      gainLossPositive: false
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-[#0A2A2E] font-poppins-custom">
              {entry.name === "invested" ? "Invested" : "Invested Last 90 days"}: ${entry.value}K
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <img src={logoImage} alt="Unlocksley Logo" className="h-10 w-auto object-contain" />
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
                <img src={profileImage} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
                <button
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#01373D] text-[#01373D]"
                  aria-label="Open profile menu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center w-full gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src={logoImage} alt="Unlocksley Logo" className="h-12 w-auto object-contain" />
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
                <div className="flex items-center gap-2">
                  <img src={profileImage} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                  <button
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
                    aria-label="Open profile menu"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            onClick={() => {
              navigate("/investor-panel/dashboard");
              setActiveNav("overview");
            }}
            className={navButtonClasses(activeNav === "overview")}
          >
            <HomeIcon />
            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button 
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className={navButtonClasses(activeNav === "invest")}
            >
              <InvitesIcon />
              Invest
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showInvestDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]" style={{border: "1px solid #000"}}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors"
                >
                  Discover
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invites");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Invites
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/top-syndicates");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Top Syndicates
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/wishlist");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                >
                  Wishlist
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              navigate("/investor-panel/portfolio");
              setActiveNav("portfolio");
            }}
            className={navButtonClasses(activeNav === "portfolio")}
          >
            <PortfolioIcon />
            Your Portfolio
          </button>
          <button 
            onClick={() => {
              navigate("/investor-panel/tax-documents");
              setActiveNav("taxes");
            }}
            className={navButtonClasses(activeNav === "taxes")}
          >
            <TaxesIcon />
            Taxes & Document
          </button>
          <button 
            onClick={() => {
              navigate("/investor-panel/messages");
              setActiveNav("messages");
            }}
            className={navButtonClasses(activeNav === "messages")}
          >
            <MessagesIcon />
            Messages
          </button>
          <button 
            onClick={() => {
              navigate("/investor-panel/settings");
              setActiveNav("settings");
            }}
            className={navButtonClasses(activeNav === "settings")}
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
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <button
            onClick={() => {
              navigate("/investor-panel/dashboard");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Overview
          </button>
          <div className="space-y-2 rounded-lg border border-[#E2E2FB] p-4">
            <p className="text-sm font-semibold text-[#01373D] font-poppins-custom">Invest</p>
            <button
              onClick={() => {
                navigate("/investor-panel/invest");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Discover
            </button>
            <button
              onClick={() => {
                navigate("/investor-panel/invites");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Invites
            </button>
            <button
              onClick={() => {
                navigate("/investor-panel/top-syndicates");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Top Syndicates
            </button>
            <button
              onClick={() => {
                navigate("/investor-panel/wishlist");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Wishlist
            </button>
          </div>
          <button
            onClick={() => {
              navigate("/investor-panel/portfolio");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
            style={{ backgroundColor: "#00F0C3" }}
          >
            Your Portfolio
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/tax-documents");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Taxes & Document
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/messages");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Messages
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/settings");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
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
        {/* Header Section with New Investment Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
              Your <span className="text-[#9889FF]">Portfolio</span>
            </h1>
            <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
              Track and manage your investment portfolio
            </p>
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-[#00F0C3] text-[#0A2A2E] rounded-lg font-medium font-poppins-custom flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
            <span className="text-xl">+</span>
            New Investment
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Total Portfolio Value */}
          <div className="bg-[#CAE6FF] rounded-lg p-4 sm:p-6 relative overflow-hidden">
            <div className="flex flex-row justify-between mb-4 sm:mb-7">
                <p className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">Total Portfolio Value</p>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-xl sm:text-2xl text-[#0A2A2E] font-poppins-custom">$2,847,500</p>
                <p className="text-xs sm:text-sm text-green-600 font-poppins-custom">+26.6% overall</p>
            </div>
          </div>

          {/* Total Invested */}
          <div className="bg-green-100 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            <div className="flex flex-row justify-between mb-4 sm:mb-7">
                <div className="">
                    <p className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">Total Invested</p>   
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6">
                    <GrowthIcon />
                </div>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-xl sm:text-2xl text-[#0A2A2E] font-poppins-custom">$2,250,000</p>
                <p className="text-xs sm:text-sm text-green-600 font-poppins-custom">+26.6% overall</p>
            </div>
          </div>

          {/* Total Gains */}
          <div className="bg-[#CAE6FF] rounded-lg p-4 sm:p-6 relative overflow-hidden">
            <div className="flex flex-row justify-between mb-4 sm:mb-7"> 
                <p className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">Total Gains</p>
                <div className="w-5 h-5 sm:w-6 sm:h-6">
                    <GrowthIcon />
                </div>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-xl sm:text-2xl font-bold text-[#0A2A2E] font-poppins-custom">$597,500</p>
                <p className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">Unrealized gains</p>
            </div>
          </div>

          {/* Active Investments */}
          <div className="bg-orange-100 rounded-lg p-4 sm:p-6 relative overflow-hidden">
            <div className="flex flex-row justify-between mb-4 sm:mb-7">   
                <p className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">Active Investments</p>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                <path d="M21.2099 15.89C20.5737 17.3945 19.5787 18.7202 18.3118 19.7513C17.0449 20.7824 15.5447 21.4874 13.9424 21.8048C12.34 22.1221 10.6843 22.0421 9.12006 21.5718C7.55578 21.1014 6.13054 20.2551 4.96893 19.1067C3.80733 17.9582 2.94473 16.5428 2.45655 14.9839C1.96837 13.4251 1.86948 11.7705 2.16851 10.1646C2.46755 8.55878 3.15541 7.05063 4.17196 5.77203C5.18851 4.49343 6.5028 3.48332 7.99992 2.83M21.9999 12C21.9999 10.6868 21.7413 9.38642 21.2387 8.17317C20.7362 6.95991 19.9996 5.85752 19.071 4.92893C18.1424 4.00035 17.04 3.26375 15.8267 2.7612C14.6135 2.25866 13.3131 2 11.9999 2V12H21.9999Z" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-xl sm:text-2xl font-bold text-[#0A2A2E] font-poppins-custom">14</p>
                <p className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">3 pending</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Portfolio Performance Chart */}
          <div className="bg-white rounded-lg p-4 sm:p-6 pb-8 sm:pb-12 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Portfolio Performance</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00F0C3] rounded-full"></div>
                  <span className="text-xs text-[#0A2A2E] font-poppins-custom">Invested</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#9889FF] rounded-full"></div>
                  <span className="text-xs text-[#0A2A2E] font-poppins-custom">Invested Last 90 days</span>
                </div>
              </div>
            </div>
            <div className="h-64 sm:h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0C3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00F0C3" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested90" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9889FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9889FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#748A91"
                    style={{ fontSize: '10px', fontFamily: 'Poppins' }}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#748A91"
                    style={{ fontSize: '10px', fontFamily: 'Poppins' }}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value}K`}
                    domain={[0, 120]}
                    ticks={[0, 30, 60, 90, 120]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#00F0C3" 
                    strokeWidth={2}
                    fill="url(#colorInvested)" 
                    dot={{ fill: "#00F0C3", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested90" 
                    stroke="#9889FF" 
                    strokeWidth={2}
                    fill="url(#colorInvested90)" 
                    dot={{ fill: "#9889FF", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* $ Invested by Round/Sector Chart */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#0A2A2E] font-poppins-custom break-words">{chartTitle}</h3>
              <div className="relative self-start sm:self-auto" ref={chartDropdownRef}>
                <button 
                  onClick={() => setShowChartDropdown(!showChartDropdown)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-[#F4F6F5] text-[#0A2A2E] rounded-lg font-medium font-poppins-custom flex items-center justify-center sm:justify-start gap-2 text-sm"
                  style={{border: "0.5px solid #01373D"}}
                >
                  {chartFilter === "round" ? "Round" : "Sector"}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showChartDropdown && (
                  <div className="absolute top-full left-0 sm:right-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[120px] w-full sm:w-auto border border-gray-200">
                    <button
                      onClick={() => {
                        setChartFilter("round");
                        setShowChartDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors ${
                        chartFilter === "round" ? "bg-gray-50" : ""
                      }`}
                    >
                      Round
                    </button>
                    <button
                      onClick={() => {
                        setChartFilter("sector");
                        setShowChartDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors ${
                        chartFilter === "sector" ? "bg-gray-50" : ""
                      }`}
                    >
                      Sector
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="h-56 sm:h-64 w-full flex items-center justify-center px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontFamily: 'Poppins',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                {chartData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom">{entry.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#0A2A2E] font-poppins-custom">
                      ${entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Your Investments Section */}
        <div className="mb-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
              Your Investments
            </h2>
            <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
              Detailed view of your portfolio holdings
            </p>
          </div>

          {/* Investment Cards */}
          <div className="space-y-4">
            {investments.map((investment, index) => (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                      {investment.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#748A91] font-poppins-custom">
                      <div className="w-4 h-4">
                        {/* Calendar icon placeholder */}
                      </div>
                      Updated {investment.updated}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {investment.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom ${
                          tag === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-[#0A2A2E] border border-gray-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4">
                    <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                    style={{border: "0.5px solid #E2E2FB"}}
                    >
                        <p className="text-xs text-[#748A91] font-poppins-custom">Invested</p>
                        <p className="text-sm sm:text-base font-semibold text-[#0A2A2E] font-poppins-custom">{investment.invested}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                    <p className="text-xs text-[#748A91] font-poppins-custom">Current Value</p>
                    <p className="text-sm sm:text-base font-semibold text-[#0A2A2E] font-poppins-custom">{investment.currentValue}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                    <p className="text-xs text-[#748A91] font-poppins-custom">Gain/Loss</p>
                    <p className={`text-sm sm:text-base font-poppins-custom ${
                      investment.gainLossPositive ? "text-[#22C55E]" : "text-[#ED1C24]"
                    }`}>
                      {investment.gainLoss}
                    </p>
                  </div>
                </div>

                <button className="w-full sm:w-auto px-4 py-2 bg-[#F4F6F5] text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                style={{border: "0.5px solid #01373D"}}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;

