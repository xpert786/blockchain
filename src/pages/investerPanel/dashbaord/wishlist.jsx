import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import { HomeIcon, InvitesIcon, PortfolioIcon, TaxesIcon, MessagesIcon, SettingsIcon, AlertsIcon } from "./icon.jsx";

const Wishlist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const investDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
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

  const wishlistItems = [
    {
      name: "SpaceX Series F",
      estimatedMin: "$100,000",
      updates: "3 New",
      added: "2 Weeks Ago",
      tags: ["Healthcare", "Series B"],
      statusTag: "Watching",
      statusTagColor: "purple"
    },
    {
      name: "Stripe Series H",
      estimatedMin: "$500,000",
      updates: "5 New",
      added: "3 Weeks Ago",
      tags: ["FinTech", "Series H"],
      statusTag: "Available Soon",
      statusTagColor: "blue"
    },
    {
      name: "OpenAI Series C",
      estimatedMin: "$250,000",
      updates: "1 New",
      added: "1 Month Ago",
      tags: ["AI/ML", "Series C"],
      statusTag: "Invite Only",
      statusTagColor: "dark"
    }
  ];

  const pendingCount = 2;

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
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]" style={{border: "1px solid #000"}}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors"
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
                  style={{backgroundColor: "#00F0C3"}}
                >
                  Wishlist
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate("/investor-panel/portfolio")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <PortfolioIcon />
            Your Portfolio
          </button>
          <button 
            onClick={() => navigate("/investor-panel/tax-documents")}
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
            onClick={() => navigate("/investor-panel/settings")}
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
              style={{ backgroundColor: "#00F0C3" }}
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 bg-white rounded-lg p-4 sm:p-6">
          <div>
            <h1 className="text-3xl sm:text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
              Investment <span className="text-[#9889FF]">Wishlist</span>
            </h1>
            <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
              Track companies and deals you're interested in
            </p>
          </div>
          <div className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-[#0A2A2E] rounded-lg font-medium font-poppins-custom text-center"
          style={{border: "1px solid #D1D5DB"}}
          >
            {pendingCount} Pending
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlistItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              {/* Top Row: Company Name and Tags */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A2A2E] font-poppins-custom">
                  {item.name}
                </h3>
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 rounded-full text-xs font-medium font-poppins-custom bg-gray-100 text-[#0A2A2E] border border-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom text-white ${
                      item.statusTagColor === "purple"
                        ? "bg-[#9889FF]"
                        : item.statusTagColor === "blue"
                        ? "bg-blue-500"
                        : "bg-gray-800"
                    }`}
                  >
                    {item.statusTag}
                  </span>
                </div>
              </div>

              {/* Details Row: Estimated Min, Updates, Added */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom">Estimated Min</p>
                  <p className="text-sm sm:text-base font-semibold text-[#0A2A2E] font-poppins-custom">{item.estimatedMin}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom">Updates</p>
                  <p className="text-sm sm:text-base font-medium text-[#0A2A2E] font-poppins-custom">{item.updates}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom">Added</p>
                  <p className="text-sm sm:text-base font-medium text-[#0A2A2E] font-poppins-custom">{item.added}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2.5 bg-[#00F0C3] text-[#0A2A2E] rounded-lg hover:bg-[#00d4a8] transition-colors font-medium font-poppins-custom flex items-center gap-2 text-sm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.725 15.75C7.85054 15.9783 8.03509 16.1688 8.25937 16.3014C8.48365 16.434 8.73943 16.504 9 16.504C9.26057 16.504 9.51635 16.434 9.74063 16.3014C9.96491 16.1688 10.1495 15.9783 10.275 15.75M4.5 6C4.5 4.80653 4.97411 3.66193 5.81802 2.81802C6.66193 1.97411 7.80653 1.5 9 1.5C10.1935 1.5 11.3381 1.97411 12.182 2.81802C13.0259 3.66193 13.5 4.80653 13.5 6C13.5 11.25 15.75 12.75 15.75 12.75H2.25C2.25 12.75 4.5 11.25 4.5 6Z" stroke="#001D21" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                  Set Alert
                </button>
                <button className="px-4 py-2.5 bg-[#F4F6F5] text-[#0A2A2E]  rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                 style={{border: "0.5px solid #01373D"}}>
                  View Updates
                </button >
                <button className="w-10 h-10 bg-[#F4F6F5] text-[#0A2A2E]  rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                style={{border: "0.5px solid #01373D"}}>
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 3H11.75M10.5 3V11.75C10.5 12.375 9.875 13 9.25 13H3C2.375 13 1.75 12.375 1.75 11.75V3M3.625 3V1.75C3.625 1.125 4.25 0.5 4.875 0.5H7.375C8 0.5 8.625 1.125 8.625 1.75V3M4.875 6.125V9.875M7.375 6.125V9.875" stroke="#001D21" strokeLinecap="round" strokeLinejoin="round"/>
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

export default Wishlist;

