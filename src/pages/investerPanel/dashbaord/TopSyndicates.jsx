import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import { HomeIcon, InvitesIcon, PortfolioIcon, TaxesIcon, MessagesIcon, SettingsIcon, AlertsIcon } from "./icon.jsx";

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const TopSyndicates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const investDropdownRef = useRef(null);
  const actionsDropdownRefs = useRef({});
  const actionButtonRefs = useRef({});
  const [activeNav, setActiveNav] = useState("invest");

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
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
      // Check if click is outside any actions dropdown
      if (showActionsDropdown !== null) {
        const clickedDropdown = actionsDropdownRefs.current[showActionsDropdown];
        const clickedButton = actionButtonRefs.current[showActionsDropdown];
        if (clickedDropdown && !clickedDropdown.contains(event.target) && 
            clickedButton && !clickedButton.contains(event.target)) {
          setShowActionsDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsDropdown]);

  // Update dropdown position to prevent cutoff
  useEffect(() => {
    if (showActionsDropdown !== null) {
      const updatePosition = () => {
        const button = actionButtonRefs.current[showActionsDropdown];
        if (button) {
          const buttonRect = button.getBoundingClientRect();
          const dropdownHeight = 180; // Approximate height of dropdown with 4 items
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          // Position dropdown above if not enough space below, but enough space above
          if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Position above button
            setDropdownPosition({
              bottom: `${window.innerHeight - buttonRect.top + 8}px`,
              right: `${window.innerWidth - buttonRect.right}px`,
              top: 'auto',
              left: 'auto'
            });
          } else {
            // Position below button (default) - use viewport coordinates for fixed positioning
            // Align dropdown right edge with button right edge
            const dropdownWidth = 180;
            let leftPos = buttonRect.right - dropdownWidth;
            // Ensure dropdown doesn't go off-screen to the left
            if (leftPos < 8) {
              leftPos = 8;
            }
            setDropdownPosition({
              top: `${buttonRect.bottom + 8}px`,
              left: `${leftPos}px`,
              bottom: 'auto',
              right: 'auto'
            });
          }
        }
      };
      
      // Small delay to ensure button ref is set
      setTimeout(updatePosition, 0);
      
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showActionsDropdown]);

  const syndicates = [
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

  const filterOptions = ["All", "Technology", "AI/ML", "Robotics", "Healthcare", "Energy", "Finance"];

  const toggleActionsDropdown = (index, event) => {
    if (event) {
      event.stopPropagation();
    }
    if (showActionsDropdown === index) {
      setShowActionsDropdown(null);
      setDropdownPosition({});
    } else {
      setShowActionsDropdown(index);
      // Calculate position immediately
      setTimeout(() => {
        const button = actionButtonRefs.current[index];
        if (button) {
          const buttonRect = button.getBoundingClientRect();
          const dropdownHeight = 180;
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Position above button
            setDropdownPosition({
              bottom: `${window.innerHeight - buttonRect.top + 8}px`,
              right: `${window.innerWidth - buttonRect.right}px`,
              top: 'auto',
              left: 'auto'
            });
          } else {
            // Position below button (default) - use viewport coordinates for fixed positioning
            // Align dropdown right edge with button right edge
            const dropdownWidth = 180;
            let leftPos = buttonRect.right - dropdownWidth;
            // Ensure dropdown doesn't go off-screen to the left
            if (leftPos < 8) {
              leftPos = 8;
            }
            setDropdownPosition({
              top: `${buttonRect.bottom + 8}px`,
              left: `${leftPos}px`,
              bottom: 'auto',
              right: 'auto'
            });
          }
        }
      }, 0);
    }
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
                    setActiveNav("invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors"
                >
                  Discover
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invites");
                    setActiveNav("invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                    
                  Invites
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/top-syndicates");
                    setActiveNav("invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                  style={{backgroundColor: "#00F0C3"}}
                >
                  Top Syndicates
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/wishlist");
                    setActiveNav("invest");
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
              style={{ backgroundColor: "#00F0C3" }}
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
        {/* Header Section */}
        <div className="mb-6 bg-white rounded-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
              Top <span className="text-[#9889FF]">Syndicates</span>
            </h1>
            <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
              Discover and invest in top-tier opportunities
            </p>
          </div>

          {/* Search, Filter, and View Toggle */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            {/* Search Bar and Filter */}
            <div className="flex-1 w-full sm:max-w-md">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <div className="relative flex-1">
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
                {/* Filter Dropdown */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center sm:justify-start gap-2 text-sm font-medium font-poppins-custom text-[#0A2A2E]"
                  >
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.5087 1.6875H13.492C13.9644 1.6875 14.3682 1.6875 14.6912 1.73025C15.0333 1.776 15.3641 1.87875 15.6361 2.14875C15.9123 2.424 16.0221 2.76675 16.0703 3.123C16.1149 3.45075 16.1149 3.858 16.1149 4.323V4.905C16.1149 5.27175 16.1149 5.5875 16.0894 5.85225C16.0611 6.13725 16.0009 6.4035 15.8549 6.65925C15.7097 6.9135 15.5149 7.098 15.2897 7.263C15.0779 7.419 14.808 7.58025 14.4893 7.77L12.4054 9.012C11.9308 9.29475 11.7657 9.39675 11.6552 9.498C11.4024 9.7305 11.2572 9.98925 11.1892 10.3125C11.1601 10.4513 11.1566 10.6252 11.1566 11.1547V13.2037C11.1566 13.8795 11.1566 14.4533 11.0907 14.895C11.0213 15.3638 10.8591 15.8137 10.4341 16.095C10.0183 16.3702 9.56141 16.3447 9.11657 16.233C8.68803 16.1257 8.16033 15.9068 7.52708 15.645L7.46616 15.6195C7.16866 15.4965 6.90941 15.3892 6.70399 15.2767C6.48299 15.156 6.27757 15.006 6.12103 14.772C5.96166 14.535 5.89862 14.2815 5.86958 14.022C5.84408 13.7857 5.84408 13.5022 5.84408 13.1857V11.1547C5.84408 10.6252 5.84124 10.4513 5.81149 10.3125C5.74734 9.99311 5.58309 9.70607 5.34541 9.498C5.23491 9.39675 5.06916 9.29475 4.59528 9.012L2.51137 7.77C2.19262 7.58025 1.92274 7.419 1.71095 7.263C1.4857 7.098 1.29091 6.9135 1.1457 6.65925C0.999784 6.4035 0.939575 6.1365 0.91195 5.85225C0.885742 5.58825 0.885742 5.27175 0.885742 4.905V4.323C0.885742 3.858 0.885742 3.45075 0.930367 3.123C0.978534 2.76675 1.08833 2.424 1.36458 2.14875C1.63658 1.87875 1.96666 1.776 2.30949 1.73025C2.63249 1.6875 3.03624 1.6875 3.5087 1.6875ZM2.44266 2.847C2.20608 2.8785 2.13099 2.9295 2.09203 2.96925C2.05662 3.00375 2.01128 3.0645 1.98153 3.28275C1.94966 3.52125 1.94824 3.84675 1.94824 4.36125V4.87875C1.94824 5.27925 1.94824 5.53725 1.96808 5.73675C1.98649 5.922 2.01766 6.01125 2.05591 6.078C2.09487 6.14625 2.16003 6.2235 2.31658 6.339C2.48233 6.4605 2.70828 6.59625 3.05324 6.80175L5.11662 8.03175L5.17328 8.0655C5.56995 8.30175 5.83912 8.46225 6.0417 8.64825C6.45141 9.01422 6.73532 9.51339 6.8492 10.068C6.90657 10.3433 6.90657 10.653 6.90657 11.088V13.1572C6.90657 13.5112 6.90728 13.7288 6.9257 13.8923C6.94128 14.0408 6.96749 14.091 6.98662 14.1202C7.00787 14.1517 7.05037 14.2005 7.19133 14.2778C7.34149 14.3595 7.54903 14.4457 7.87628 14.5815C8.55699 14.8635 9.01528 15.0517 9.36166 15.1388C9.70095 15.2242 9.81287 15.18 9.87024 15.1417C9.91841 15.1095 9.99278 15.0442 10.0417 14.7195C10.0927 14.3767 10.0941 13.8923 10.0941 13.1565V11.088C10.0941 10.653 10.0941 10.3433 10.1522 10.068C10.2658 9.51349 10.5495 9.01434 10.9589 8.64825C11.1615 8.46225 11.4314 8.301 11.8267 8.0655L11.884 8.03175L13.9474 6.80175C14.2924 6.59625 14.5183 6.4605 14.6841 6.339C14.8406 6.2235 14.9058 6.14625 14.9447 6.078C14.983 6.01125 15.0142 5.922 15.0319 5.73675C15.0517 5.53725 15.0524 5.27925 15.0524 4.878V4.3605C15.0524 3.84675 15.051 3.5205 15.0191 3.28275C14.9894 3.0645 14.9433 3.00375 14.9093 2.96925C14.8697 2.93025 14.7946 2.8785 14.558 2.847C14.3101 2.81325 13.9736 2.8125 13.4587 2.8125H3.54199C3.02703 2.8125 2.69128 2.81325 2.44266 2.847Z" fill="#0A2A2E"/>
                    </svg>
                    Filter
                  </button>

                  {/* Dropdown Menu */}
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 sm:right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px] w-full sm:w-auto">
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
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1 self-start sm:self-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="w-5 h-5">
                  {/* List icon placeholder */}
                </div>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="w-5 h-5">
                  {/* Grid icon placeholder */}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden" style={{border: "0.5px solid #E2E2FB"}}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-[#E2E2FB]">
                <tr>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Syndicate Name
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Allocated
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Raised
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Min. Investment
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Track Record
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-center text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {syndicates.map((syndicate, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b border-[#E2E2FB]">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">
                        {syndicate.name}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#748A91] font-poppins-custom">
                        {syndicate.sector}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.allocated}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.raised}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.target}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.minInvestment}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black font-poppins-custom">
                        {syndicate.trackRecord}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden min-w-[60px] sm:min-w-[100px]">
                          <div className="h-full flex">
                            <div className="bg-[#22C55E] h-full" style={{width: `${syndicate.status}%`}}></div>
                            <div className="bg-[#CEC6FF] h-full" style={{width: `${100 - syndicate.status}%`}}></div>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-[#0A2A2E] font-poppins-custom whitespace-nowrap">{syndicate.status}%</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center relative">
                      <div className="relative inline-block">
                        <button
                          ref={el => {
                            actionButtonRefs.current[index] = el;
                          }}
                          onClick={(e) => toggleActionsDropdown(index, e)}
                          className="p-1.5 sm:p-2 text-[#0A2A2E] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6">
                            <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" fill="#F4F6F5"/>
                            <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" stroke="#E8EAED" strokeWidth="0.5"/>
                            <path d="M12.4163 13.0013C12.4163 13.3235 12.6775 13.5846 12.9997 13.5846C13.3218 13.5846 13.583 13.3235 13.583 13.0013C13.583 12.6791 13.3218 12.418 12.9997 12.418C12.6775 12.418 12.4163 12.6791 12.4163 13.0013Z" fill="#01373D" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.4163 17.0833C12.4163 17.4055 12.6775 17.6667 12.9997 17.6667C13.3218 17.6667 13.583 17.4055 13.583 17.0833C13.583 16.7612 13.3218 16.5 12.9997 16.5C12.6775 16.5 12.4163 16.7612 12.4163 17.0833Z" fill="#01373D" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.4163 8.91536C12.4163 9.23753 12.6775 9.4987 12.9997 9.4987C13.3218 9.4987 13.583 9.23753 13.583 8.91536C13.583 8.5932 13.3218 8.33203 12.9997 8.33203C12.6775 8.33203 12.4163 8.5932 12.4163 8.91536Z" fill="#01373D" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        {/* Actions Dropdown Menu - Fixed positioning */}
                        {showActionsDropdown === index && (
                          <div 
                            ref={el => {
                              actionsDropdownRefs.current[index] = el;
                            }}
                            className="flex flex-col fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-[180px]"
                            style={{
                              top: dropdownPosition.top || 'auto',
                              bottom: dropdownPosition.bottom || 'auto',
                              right: dropdownPosition.right || 'auto',
                              left: dropdownPosition.left || 'auto'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-[#00F0C3] transition-colors"
                            >
                              Invest Now
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                            >
                              Request Invite
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                            >
                              Add To Wishlist
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-center">
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="px-2 sm:px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                &lt;
              </button>
              <button className="px-2 sm:px-3 py-2 text-sm font-medium text-white bg-[#00F0C3] rounded-lg font-poppins-custom">
                1
              </button>
              <button className="px-2 sm:px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                2
              </button>
              <button className="px-2 sm:px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                3
              </button>
              <button className="px-2 sm:px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopSyndicates;

