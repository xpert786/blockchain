import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {HomeIcon,InvitesIcon,PortfolioIcon,TaxesIcon,MessagesIcon,SettingsIcon, AlertsIcon } from "./icon.jsx";

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const InvestorDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("overview");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const investDropdownRef = useRef(null);
  const investButtonRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

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
    } else if (path === "/investor-panel/tax-documents" || path.startsWith("/investor-panel/tax-documents/")) {
      // Only set taxes as active for the list page, not the detail page
      if (path === "/investor-panel/tax-documents") {
        setActiveNav("taxes");
      } else {
        // For detail pages, show overview or none
        setActiveNav("overview");
      }
    } else if (path.includes("/investor-panel/messages")) {
      setActiveNav("messages");
    } else if (path.includes("/investor-panel/settings")) {
      setActiveNav("settings");
    } else {
      setActiveNav("overview");
    }
  }, [location.pathname]);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showInvestDropdown && investButtonRef.current) {
      const buttonRect = investButtonRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: `${buttonRect.bottom + window.scrollY + 2}px`,
        left: `${buttonRect.left + window.scrollX}px`,
      });
    }
  }, [showInvestDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        investDropdownRef.current && 
        !investDropdownRef.current.contains(event.target) && 
        investButtonRef.current && 
        !investButtonRef.current.contains(event.target)
      ) {
        setShowInvestDropdown(false);
      }
    };

    if (showInvestDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInvestDropdown]);

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
      <header className="bg-white px-4 sm:px-6 py-2 border-b border-gray-200">
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
                className="h-20 w-20 object-contain"
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
                className="h-20 w-20 object-contain"
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
      <nav className="hidden lg:block bg-[#001D21] px-6 relative z-40">
        <div className="flex items-center gap-2 w-full overflow-x-auto py-2">
          <button 
            onClick={() => handleNavigate("/investor-panel/dashboard", "overview")}
            className={navButtonClasses(activeNav === "overview")}
          >
            <HomeIcon />
            Overview
          </button>
          <div className="relative">
            <button 
              ref={investButtonRef}
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className={navButtonClasses(activeNav === "invest")}
            >
              <InvitesIcon />
              Invest
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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

      {/* Dropdown Menu - Rendered outside nav to avoid overflow clipping */}
      {showInvestDropdown && (
        <div 
          className="fixed bg-white rounded-lg shadow-xl z-[9999] w-fit shadow-md" 
          style={{...dropdownStyle, border: "1px solid #000"}}
          ref={investDropdownRef}
        >
          {investLinks.map((link, index) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path, "invest")}
              className={`w-fit flex flex-col text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors ${index === 0 ? "rounded-t-lg" : ""} ${index === investLinks.length - 1 ? "rounded-b-lg" : ""}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

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
        <Outlet />
      </main>
    </div>
  );
};

export default InvestorDashboardLayout;

