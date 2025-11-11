import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {HomeIcon,InvitesIcon,PortfolioIcon,TaxesIcon,MessagesIcon,SettingsIcon, GrowthIcon, AlertsIcon } from "./icon.jsx";

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("discover-deals");
  const [activeNav, setActiveNav] = useState("overview");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const investDropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const investmentOpportunities = [
    {
      name: "naman",
      date: "02/01/2024",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$85k",
      tags: ["Healthcare", "Series B", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Green Energy Initiative Q3",
      date: "02/01/2024",
      allocated: "30",
      raised: "$4M",
      target: "$45M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Real Estate Opportunity Fund",
      date: "15/01/2024",
      allocated: "18",
      raised: "$1.3M",
      target: "$8M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    }
  ];

  const topSyndicates = [
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    }
  ];

  const invites = [
    {
      name: "TechCorp Series c",
      date: "02/01/2024",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$85k",
      tags: ["Technology","series b"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Green Energy Initiative Q3",
      date: "02/01/2024",
      allocated: "30",
      raised: "$4M",
      target: "$45M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Real Estate Opportunity Fund",
      date: "15/01/2024",
      allocated: "18",
      raised: "$1.3M",
      target: "$8M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    }
  ];

  const investLinks = [
    { label: "Discover", path: "/investor-panel/invest" },
    { label: "Invites", path: "/investor-panel/invites" },
    { label: "Top Syndicates", path: "/investor-panel/top-syndicates" },
    { label: "Wishlist", path: "/investor-panel/wishlist" }
  ];

  const handleNavigate = (path, nav) => {
    navigate(path);
    if (nav) {
      setActiveNav(nav);
    }
    setShowInvestDropdown(false);
    setIsMobileNavOpen(false);
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
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#748A91]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6667 11.6667L14 14M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#748A91]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6667 11.6667L14 14M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Dark Teal) */}
      <nav className="hidden lg:block bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full overflow-x-auto py-2">
          <button 
            onClick={() => handleNavigate("/investor-panel/dashboard", "overview")}
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
                {investLinks.map((link, index) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigate(link.path, "invest")}
                    className={`w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors ${index === 0 ? "rounded-t-lg" : ""} ${index === investLinks.length - 1 ? "rounded-b-lg" : ""}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => handleNavigate("/investor-panel/portfolio", "portfolio")}
            className={navButtonClasses(activeNav === "portfolio")}
          >
            <PortfolioIcon />
            Your Portfolio
          </button>
          <button 
            onClick={() => handleNavigate("/investor-panel/tax-documents", "taxes")}
            className={navButtonClasses(activeNav === "taxes")}
          >
            <TaxesIcon />
            Taxes & Document
          </button>
          <button 
            onClick={() => handleNavigate("/investor-panel/messages", "messages")}
            className={navButtonClasses(activeNav === "messages")}
          >
            <MessagesIcon />
            Messages
          </button>
          <button 
            onClick={() => handleNavigate("/investor-panel/settings", "settings")}
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
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <button
            onClick={() => handleNavigate("/investor-panel/dashboard", "overview")}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom ${
              activeNav === "overview" ? "bg-[#00F0C3]/20 border-[#00F0C3] text-[#001D21]" : "border-transparent text-[#001D21] hover:bg-[#F4F6F5]"
            }`}
          >
            Overview
          </button>
          <div className="space-y-2 rounded-lg border border-[#E2E2FB] p-4">
            <p className="text-sm font-semibold text-[#01373D] font-poppins-custom">Invest</p>
            {investLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path, "invest")}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-[#001D21] hover:bg-[#F4F6F5] transition-colors font-poppins-custom"
              >
                {link.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleNavigate("/investor-panel/portfolio", "portfolio")}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom ${
              activeNav === "portfolio" ? "bg-[#00F0C3]/20 border-[#00F0C3] text-[#001D21]" : "border-transparent text-[#001D21] hover:bg-[#F4F6F5]"
            }`}
          >
            Your Portfolio
          </button>
          <button
            onClick={() => handleNavigate("/investor-panel/tax-documents", "taxes")}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom ${
              activeNav === "taxes" ? "bg-[#00F0C3]/20 border-[#00F0C3] text-[#001D21]" : "border-transparent text-[#001D21] hover:bg-[#F4F6F5]"
            }`}
          >
            Taxes & Document
          </button>
          <button
            onClick={() => handleNavigate("/investor-panel/messages", "messages")}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom ${
              activeNav === "messages" ? "bg-[#00F0C3]/20 border-[#00F0C3] text-[#001D21]" : "border-transparent text-[#001D21] hover:bg-[#F4F6F5]"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => handleNavigate("/investor-panel/settings", "settings")}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom ${
              activeNav === "settings" ? "bg-[#00F0C3]/20 border-[#00F0C3] text-[#001D21]" : "border-transparent text-[#001D21] hover:bg-[#F4F6F5]"
            }`}
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
        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl">
          {/* KYC Status Card */}
          <div className="bg-[#CAE6FF] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">KYC Status</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="#01373D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#01373D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="w-fit bg-[#001D21] text-white px-3 py-2 rounded-md text-xs font-medium font-poppins-custom">
                Verified
              </span>
            </div>
          </div>

          {/* Total Investments Card */}
          <div className="bg-[#D7F8F0] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">Total Investments</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7L13.5 15.5L8.5 10.5L2 17M22 7H16M22 7V13" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

            </div>
            <div className="flex flex-row justify-between gap-5">
              <p className="text-2xl font-bold text-[#0A2A2E] font-poppins-custom mb-1">3</p>
              <p className="text-sm text-[#748A91] font-poppins-custom">Active SPVs</p>
            </div>
          </div>

          {/* Portfolio Value Card */}
          <div className="bg-[#E2E2FB] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">Portfolio Value</p>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5009 4.749H14.0009C14.0009 3.003 13.9859 2.217 13.6349 1.866C13.2839 1.515 12.4979 1.5 10.7519 1.5C9.00593 1.5 8.21993 1.515 7.86893 1.866C7.51793 2.217 7.50293 3.003 7.50293 4.749H6.00293C6.00293 2.724 6.00293 1.611 6.80693 0.804C7.61093 0 8.72693 0 10.7519 0C12.7769 0 13.8899 0 14.6969 0.804C15.5009 1.611 15.5009 2.724 15.5009 4.749ZM10.7519 17.499C10.3379 17.499 10.0019 17.163 10.0019 16.749V16.743C9.57593 16.638 9.18593 16.443 8.85893 16.17C8.31593 15.717 8.00393 15.078 8.00393 14.415C8.00393 14.001 8.33993 13.665 8.75393 13.665C9.16793 13.665 9.50393 14.001 9.50393 14.415C9.50393 14.913 10.0769 15.333 10.7549 15.333C11.4329 15.333 12.0059 14.913 12.0059 14.415C12.0059 13.917 11.4329 13.497 10.7549 13.497C10.0469 13.497 9.37193 13.263 8.86193 12.834C8.31893 12.381 8.00693 11.742 8.00693 11.079C8.00693 10.416 8.31893 9.777 8.86193 9.324C9.18893 9.051 9.58193 8.856 10.0049 8.751V8.745C10.0049 8.331 10.3409 7.995 10.7549 7.995C11.1689 7.995 11.5049 8.331 11.5049 8.745V8.751C11.9309 8.856 12.3239 9.051 12.6479 9.324C13.1909 9.777 13.5029 10.416 13.5029 11.079C13.5029 11.493 13.1669 11.829 12.7529 11.829C12.3389 11.829 12.0029 11.493 12.0029 11.079C12.0029 10.581 11.4299 10.161 10.7519 10.161C10.0739 10.161 9.50093 10.581 9.50093 11.079C9.50093 11.577 10.0739 11.997 10.7519 11.997C11.4599 11.997 12.1349 12.231 12.6449 12.66C13.1879 13.113 13.4999 13.752 13.4999 14.415C13.4999 15.078 13.1879 15.717 12.6449 16.17C12.3179 16.443 11.9249 16.638 11.5019 16.743V16.749C11.5019 17.163 11.1659 17.499 10.7519 17.499Z" fill="#01373D"/>
            <path d="M12.753 21.4981H8.751C6.807 21.4981 5.4 21.4981 4.263 21.3451C2.958 21.1711 2.073 20.7871 1.392 20.1061C0.711 19.4251 0.33 18.5401 0.153 17.2351C7.15256e-08 16.0951 0 14.6911 0 12.7471C0 10.8031 7.15256e-08 9.39609 0.153 8.25909C0.327 6.95409 0.711 6.06909 1.392 5.38809C2.073 4.70709 2.958 4.32609 4.263 4.14909C5.403 3.99609 6.807 3.99609 8.751 3.99609H12.75C14.694 3.99609 16.101 3.99609 17.238 4.14909C18.543 4.32309 19.428 4.70709 20.109 5.38809C20.79 6.06909 21.171 6.95409 21.348 8.25909C21.501 9.39909 21.501 10.8031 21.501 12.7471C21.501 14.6911 21.501 16.0981 21.348 17.2351C21.174 18.5401 20.79 19.4251 20.109 20.1061C19.428 20.7871 18.543 21.1681 17.238 21.3451C16.101 21.4981 14.697 21.4981 12.753 21.4981ZM8.751 5.49909C5.19 5.49909 3.405 5.49909 2.454 6.45009C1.503 7.40409 1.503 9.18909 1.503 12.7501C1.503 16.3111 1.503 18.0961 2.454 19.0471C3.405 19.9981 5.193 19.9981 8.751 19.9981H12.75C16.311 19.9981 18.096 19.9981 19.047 19.0471C19.998 18.0961 19.998 16.3081 19.998 12.7501C19.998 9.18909 19.998 7.40409 19.047 6.45309C18.099 5.49909 16.311 5.49909 12.753 5.49909H8.751Z" fill="#01373D"/>
            </svg>

            </div>
            <div className="flex flex-row justify-between gap-5">
              <p className="text-2xl font-bold text-[#0A2A2E] font-poppins-custom mb-1">$287,500</p>
              <p className="text-sm text-[#22C55E] font-poppins-custom">+ 15% from invested capital</p>
            </div>
          </div>

          {/* Notification Card */}
          <div className="bg-[#FFEFE8] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">Notification</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.6316 16.5881C20.101 15.675 19.3126 13.0997 19.3126 9.75C19.3126 7.8106 18.5422 5.95064 17.1708 4.57928C15.7994 3.20792 13.9395 2.4375 12.0001 2.4375C10.0607 2.4375 8.20073 3.20792 6.82937 4.57928C5.45801 5.95064 4.68758 7.8106 4.68758 9.75C4.68758 13.1006 3.89821 15.675 3.36758 16.5881C3.25116 16.7875 3.18938 17.014 3.18849 17.2449C3.18759 17.4758 3.2476 17.7028 3.36247 17.903C3.47734 18.1033 3.643 18.2697 3.84274 18.3855C4.04247 18.5013 4.26922 18.5623 4.50008 18.5625H8.48258C8.61921 19.3964 9.04778 20.1545 9.69177 20.7016C10.3358 21.2486 11.1532 21.549 11.9982 21.549C12.8432 21.549 13.6607 21.2486 14.3047 20.7016C14.9486 20.1545 15.3772 19.3964 15.5138 18.5625H19.5001C19.7308 18.562 19.9573 18.5007 20.1568 18.3848C20.3562 18.2689 20.5216 18.1024 20.6363 17.9022C20.7509 17.702 20.8108 17.4751 20.8098 17.2444C20.8088 17.0137 20.7471 16.7874 20.6307 16.5881H20.6316ZM12.0001 20.4375C11.4516 20.4373 10.9191 20.2521 10.4889 19.9119C10.0586 19.5716 9.75573 19.0962 9.62915 18.5625H14.371C14.2444 19.0962 13.9415 19.5716 13.5113 19.9119C13.081 20.2521 12.5486 20.4373 12.0001 20.4375ZM19.6604 17.3438C19.645 17.3725 19.6219 17.3964 19.5938 17.4129C19.5657 17.4295 19.5336 17.438 19.501 17.4375H4.50008C4.46748 17.438 4.43538 17.4295 4.40728 17.4129C4.37918 17.3964 4.35615 17.3725 4.34071 17.3438C4.32425 17.3152 4.31559 17.2829 4.31559 17.25C4.31559 17.2171 4.32425 17.1848 4.34071 17.1562C5.0504 15.9375 5.81258 13.0959 5.81258 9.75C5.81258 8.10897 6.46448 6.53516 7.62486 5.37478C8.78524 4.2144 10.3591 3.5625 12.0001 3.5625C13.6411 3.5625 15.2149 4.2144 16.3753 5.37478C17.5357 6.53516 18.1876 8.10897 18.1876 9.75C18.1876 13.095 18.9507 15.9328 19.6604 17.1562C19.6769 17.1848 19.6855 17.2171 19.6855 17.25C19.6855 17.2829 19.6769 17.3152 19.6604 17.3438Z" fill="#01373D"/>
                </svg>

            </div>
            <div className="flex flex-row justify-between gap-5">
              <p className="text-2xl font-bold text-[#0A2A2E] font-poppins-custom mb-1">5</p>
              <p className="text-sm text-[#22C55E] font-poppins-custom">Unread Updates</p>
            </div>
          </div>
        </div>

        {/* New Investment Section */}
        <div className="mb-8">


          <div className="bg-white p-4 my-4 rounded-xl ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-3xl  text-[#0A2A2E] font-poppins-custom">
              New <span className="text-[#9889FF]">Investment</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            <button
              onClick={() => setActiveTab("discover-deals")}
              className={`px-3 py-2 text-sm rounded-lg font-medium font-poppins-custom transition-colors ${
                activeTab === "discover-deals"
                  ? "bg-[#00F0C3] text-[#001D21]"
                  : "bg-white text-[#748A91] hover:bg-gray-50"
              }`}
            >
              Discover Deals
            </button>
            <button
              onClick={() => setActiveTab("top-syndicates")}
              className={`px-3 py-2 text-sm rounded-lg font-medium font-poppins-custom transition-colors ${
                activeTab === "top-syndicates"
                  ? "bg-[#00F0C3] text-[#001D21]"
                  : "bg-white text-[#748A91] hover:bg-gray-50"
              }`}
            >
              Top Syndicates
            </button>
            <button
              onClick={() => setActiveTab("invites")}
              className={`px-3 py-2 text-sm rounded-lg font-medium font-poppins-custom transition-colors ${
                activeTab === "invites"
                  ? "bg-[#00F0C3] text-[#001D21]"
                  : "bg-white text-[#748A91] hover:bg-gray-50"
              }`}
            >
              Invites
            </button>
          </div>
            </div>  
          

          {/* Investment Opportunities / Top Syndicates / Invites */}
          {(() => {
            if (activeTab === "top-syndicates") {
              return (
                <div className="bg-white rounded-lg p-6 mb-6" style={{border: "0.5px solid #E2E2FB"}}>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1.2fr_1.2fr_1.5fr_0.8fr] gap-4 pb-4 border-b border-gray-200 mb-4">
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Syndicate Name</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Sector</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Allocated</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Raised</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Target</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Min. Investment</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Track Record</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Status</div>
                    <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Actions</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-3 mb-6">
                    {topSyndicates.map((syndicate, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 ">
                        <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1.2fr_1.2fr_1.5fr_0.8fr] gap-4 items-center">
                          <div className="text-sm font-semibold text-[#0A2A2E] font-poppins-custom">{syndicate.name}</div>
                          <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.sector}</div>
                          <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.allocated}</div>
                          <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.raised}</div>
                          <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.target}</div>
                          <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.minInvestment}</div>
                          <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.trackRecord}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full flex">
                                <div className="bg-[#22C55E] h-full" style={{width: `${syndicate.status}%`}}></div>
                                <div className="bg-[#CEC6FF] h-full" style={{width: `${100 - syndicate.status}%`}}></div>
                              </div>
                            </div>
                            <span className="text-sm text-[#0A2A2E] font-poppins-custom whitespace-nowrap">{syndicate.status}%</span>
                          </div>
                          <div className="flex justify-center">
                            <button className="w-8 h-8 bg-white   rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" fill="#F4F6F5"/>
                            <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" stroke="#E8EAED" stroke-width="0.5"/>
                            <path d="M12.4163 13.0013C12.4163 13.3235 12.6775 13.5846 12.9997 13.5846C13.3218 13.5846 13.583 13.3235 13.583 13.0013C13.583 12.6791 13.3218 12.418 12.9997 12.418C12.6775 12.418 12.4163 12.6791 12.4163 13.0013Z" fill="#01373D" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.4163 17.0833C12.4163 17.4055 12.6775 17.6667 12.9997 17.6667C13.3218 17.6667 13.583 17.4055 13.583 17.0833C13.583 16.7612 13.3218 16.5 12.9997 16.5C12.6775 16.5 12.4163 16.7612 12.4163 17.0833Z" fill="#01373D" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.4163 8.91536C12.4163 9.23753 12.6775 9.4987 12.9997 9.4987C13.3218 9.4987 13.583 9.23753 13.583 8.91536C13.583 8.5932 13.3218 8.33203 12.9997 8.33203C12.6775 8.33203 12.4163 8.5932 12.4163 8.91536Z" fill="#01373D" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View More Button */}
              <div className="text-center">
                <button className="px-6 py-3 bg-white text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2 mx-auto"
                style={{border: "0.5px solid #01373D"}}
                >
                  View More Syndicates
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
                </div>
              );
            } else if (activeTab === "invites") {
              return (
                <div key="invites-section" className="space-y-4 mb-6 bg-white rounded-lg p-6"
                style={{border: "0.5px solid #E2E2FB"}}
                >
              {invites.map((invite, index) => (
              <div key={index} className="bg-white rounded-lg p-6"
              style={{border: "0.5px solid #E2E2FB"}}
              >
                {/* Header Section: Title/Date on Left, Tags on Right */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                  {/* Left: Title and Date */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                      {invite.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H13M6 2V4M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{invite.date}</span>
                    </div>
                  </div>

                  {/* Right: Tags */}
                  <div className="flex items-center gap-2">
                    {invite.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium font-poppins-custom ${
                          tag === "Raising"
                            ? "bg-[#22C55E] text-white"
                            : "bg-[#F9F8FF] border border-gray-400 text-[#0A2A2E]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Section: Four boxes with light gray backgrounds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Allocated</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.allocated}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Raised</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.raised}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Target</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.target}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Min. Investment</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.minInvestment}</p>
                  </div>
                </div>

                {/* Footer Section: Buttons on Left, Timer on Right */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Left: Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-[#00F0C3] text-[#001D21] rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1401_2449)">
                        <path d="M14.6673 7.38527V7.99861C14.6665 9.43622 14.201 10.8351 13.3402 11.9865C12.4794 13.1379 11.2695 13.9803 9.89089 14.3879C8.51227 14.7955 7.03882 14.7465 5.6903 14.2483C4.34177 13.7501 3.19042 12.8293 2.40796 11.6233C1.6255 10.4173 1.25385 8.99065 1.34844 7.55615C1.44303 6.12165 1.99879 4.75616 2.93284 3.66332C3.86689 2.57049 5.12917 1.80886 6.53144 1.49204C7.93371 1.17521 9.40083 1.32017 10.714 1.90527M6.00065 7.33194L8.00065 9.33194L14.6673 2.66527" stroke="#001D21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_1401_2449">
                          <rect width="16" height="16" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>


                      Accept and Invite Now
                    </button>
                    <button className="flex flex-row items-center justify-center gap-2 px-6 py-2.5 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom">
                      Decline
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1401_2454)">
                          <path d="M10.0007 5.9987L6.00065 9.9987M6.00065 5.9987L10.0007 9.9987M14.6673 7.9987C14.6673 11.6806 11.6825 14.6654 8.00065 14.6654C4.31875 14.6654 1.33398 11.6806 1.33398 7.9987C1.33398 4.3168 4.31875 1.33203 8.00065 1.33203C11.6825 1.33203 14.6673 4.3168 14.6673 7.9987Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1401_2454">
                            <rect width="16" height="16" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <button className="w-10 h-10 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1.5L12.5 7.5L19 8.5L14.5 13L15.5 19.5L10 16.5L4.5 19.5L5.5 13L1 8.5L7.5 7.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Right: Timer */}
                  <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{invite.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
              {/* View All Invites Button */}
              <div className="text-center mt-6">
                <button className="px-6 py-3 bg-white border border-gray-300 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2 mx-auto">
                  View All Invites
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
              );
            } else {
              return (
                <div key="discover-deals-section" className="space-y-4 mb-6 bg-white rounded-lg p-6"
                style={{border: "0.5px solid #E2E2FB"}}
                >
            {investmentOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-lg p-6"
              style={{border: "0.5px solid #E2E2FB"}}
              >
                {/* Header Section: Title/Date on Left, Tags on Right */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                  {/* Left: Title and Date */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                        {opportunity.name}
                      </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 6H13M6 2V4M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{opportunity.date}</span>
                      </div>
                    </div>

                  {/* Right: Tags */}
                      <div className="flex items-center gap-2">
                        {opportunity.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium font-poppins-custom ${
                              tag === "Raising"
                            ? "bg-[#22C55E] text-white"
                            : "bg-[#F9F8FF] border border-gray-400 text-[#0A2A2E]"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                {/* Metrics Section: Four boxes with light gray backgrounds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Allocated</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.allocated}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Raised</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.raised}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Target</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.target}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Min. Investment</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.minInvestment}</p>
                  </div>
                </div>

                {/* Footer Section: Buttons on Left, Timer on Right */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Left: Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-[#00F0C3] text-[#001D21] rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 5.25L10.125 11.625L6.375 7.875L1.5 12.75M16.5 5.25H12M16.5 5.25V9.75" stroke="#001D21" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                      Invest Now
                    </button>
                    <button className="px-5 py-2.5 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom">
                      View Details
                    </button>
                    <button className="w-10 h-10 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1.5L12.5 7.5L19 8.5L14.5 13L15.5 19.5L10 16.5L4.5 19.5L5.5 13L1 8.5L7.5 7.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Right: Timer */}
                  <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{opportunity.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          {/* View All Deals Button */}
              <div className="text-center mt-6">
            <button className="px-6 py-3 bg-white border border-gray-300 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2 mx-auto">
              View All Deals →
            </button>
          </div>
                </div>
              );
            }
          })()}
        </div>

        {/* My Portfolio Snapshot Section */}
        <div className="bg-white rounded-lg p-6"
        style={{border: "0.5px solid #E2E2FB"}}
        >
          <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
              <h2 className="text-3xl  text-[#0A2A2E] font-poppins-custom mb-2">
              My Portfolio Snapshot
            </h2>
            <p className="text-sm text-[#748A91] font-poppins-custom">
              Your investment performance overview
            </p>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium font-poppins-custom">
              View Full
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Invested Card */}
            <div className="bg-[#F9F8FF] rounded-lg p-6 "
            style={{border: "0.5px solid #E2E2FB"}}
            >
              <p className="text-sm text-[#748A91] font-poppins-custom mb-3">Total Invested</p>
              <p className="text-3xl  text-[#0A2A2E] font-poppins-custom mb-6">$250,000</p>
              <p className="text-sm text-[#748A91] font-poppins-custom mb-2">Current Value</p>
              <p className="text-2xl text-[#0A2A2E] font-poppins-custom">$287,500</p>
            </div>

            {/* Unrealized Gain Card */}
            <div className="bg-[#F9F8FF] rounded-lg p-6"
            style={{border: "0.5px solid #E2E2FB"}}
            >
              <p className="text-sm text-[#748A91] font-poppins-custom mb-3">Unrealized Gain</p>
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl  text-[#22C55E] font-poppins-custom">+$37,500</p>
                <p className="text-sm text-[#22C55E] font-poppins-custom">15% Portfolio Growth</p>
              </div>
              {/* Line Graph Representation */}
              <div className="h-40 bg-[#F9F8FF] rounded-lg relative overflow-hidden mt-4">
                <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none" className="absolute inset-0">
                  <defs>
                    <linearGradient id="portfolioAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00F0C3" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#00F0C3" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <polyline
                    points="15,120 45,105 75,90 105,75 135,60 165,45 195,30 225,20 255,12 285,5"
                    fill="none"
                    stroke="#00F0C3"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="15,120 45,105 75,90 105,75 135,60 165,45 195,30 225,20 255,12 285,5 285,150 15,150"
                    fill="url(#portfolioAreaGradient)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

