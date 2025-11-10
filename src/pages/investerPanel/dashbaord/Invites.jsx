import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import { HomeIcon, InvitesIcon, PortfolioIcon, TaxesIcon, MessagesIcon, SettingsIcon, AlertsIcon } from "./icon.jsx";

const Invites = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
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

  const invites = [
    {
      name: "TechCorp Series C",
      leader: "Michael Rodriguez",
      description: "AI-Powered Enterprise Software Platform With 500+ Enterprise Clients",
      tags: ["Technology", "Series C"],
      allocated: "18",
      raised: "$50M",
      target: "$85M",
      minInvestment: "$25,000",
      deadline: "7 Days",
      expired: false
    },
    {
      name: "GreenEnergy Infrastructure",
      leader: "Emma Thompson",
      description: "Renewable Energy Projects Across North America",
      tags: ["Energy", "Fund"],
      allocated: "40",
      raised: "$100M",
      target: "$120M",
      minInvestment: "$50,000",
      deadline: "14 Days",
      expired: false
    },
    {
      name: "HealthTech Innovation",
      leader: "Dr. James Wilson",
      description: "Digital Health Solutions And Medical Device Portfolio",
      tags: ["Healthcare", "Series B", "Expired"],
      allocated: "40",
      raised: "$25M",
      target: "$30M",
      minInvestment: "$10,000",
      deadline: "Expired",
      expired: true
    }
  ];

  const pendingCount = invites.filter(invite => !invite.expired).length;

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Top Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          {/* Logo on Left */}
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="Unlocksley Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Right Side: Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search SPVs, investors, documents..."
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => navigate("/investor-panel/notifications")}
                className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
              >
                <AlertsIcon />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                  <span className="text-[#01373D] text-xs font-bold">2</span>
                </div>
              </button>
            </div>

            {/* Profile with Dropdown */}
            <div className="flex items-center gap-2">
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              <button>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Dark Teal) */}
      <nav className="bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full">
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
                  style={{backgroundColor: "#00F0C3"}}
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
            onClick={() => navigate("/investor-panel/dashboard")}
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

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg p-6">
          <div>
            <h1 className="text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
              Your <span className="text-[#9889FF]">Invites</span>
            </h1>
            <p className="text-base text-[#748A91] font-poppins-custom">
              Exclusive investment opportunities you've been invited to
            </p>
          </div>
          <div className="px-4 py-2 bg-[#F9F8FF] text-[#001D21] rounded-lg font-medium font-poppins-custom"
          style={{border: "0.5px solid #748A91"}}
          >
            {pendingCount} Pending
          </div>
        </div>

        {/* Invite Cards */}
        <div className="space-y-6">
          {invites.map((invite, index) => (
            <div key={index} className={`bg-white rounded-lg p-6 border border-gray-200 ${invite.expired ? "opacity-50" : ""}`}>
              {/* Header: Name and Leader */}
              <div className="flex flex-row items-center justify-between">
              <div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-1">
                  {invite.name}
                </h3>
                <p className="text-sm text-[#748A91] font-poppins-custom">
                  Led by {invite.leader}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-[#001D21] font-poppins-custom mb-4">
                {invite.description}
              </p>
              </div>
             {/* Tags */}
              <div className="flex items-center gap-2 mb-6">
                {invite.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom ${
                      tag === "Expired"
                        ? "bg-red-100 text-red-600 border border-red-300"
                        : "bg-[#F9F8FF] text-[#0A2A2E] border border-gray-300"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              </div>
              

              {/* Metrics Grid */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#001D21] font-poppins-custom mb-1">Allocated</p>
                  <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.allocated}</p>
                </div>
                <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Raised</p>
                  <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.raised}</p>
                </div>
                <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Target</p>
                  <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.target}</p>
                </div>
                <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Min. Investment</p>
                  <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.minInvestment}</p>
                </div>
                <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Deadline</p>
                  <p className={`text-base font-semibold font-poppins-custom ${
                    invite.expired ? "text-red-600" : "text-[#0A2A2E]"
                  }`}>
                    {invite.deadline}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {invite.expired ? (
                  <button 
                    disabled
                    className="px-5 py-2.5  bg-[#00F0C3] text-black rounded-lg font-medium font-poppins-custom cursor-not-allowed"
                  > 


                    Invitation Expired
                  </button>
                ) : (
                  <>
                    <button className="px-5 py-2.5 bg-[#00F0C3] text-black rounded-lg hover:bg-[#16a34a] transition-colors font-medium font-poppins-custom flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1074_4569)">
                    <path d="M14.6668 7.38527V7.99861C14.666 9.43622 14.2005 10.8351 13.3397 11.9865C12.4789 13.1379 11.269 13.9803 9.8904 14.3879C8.51178 14.7955 7.03834 14.7465 5.68981 14.2483C4.34128 13.7501 3.18993 12.8293 2.40747 11.6233C1.62501 10.4173 1.25336 8.99065 1.34795 7.55615C1.44254 6.12165 1.9983 4.75616 2.93235 3.66332C3.8664 2.57049 5.12869 1.80886 6.53096 1.49204C7.93322 1.17521 9.40034 1.32017 10.7135 1.90527M6.00017 7.33194L8.00017 9.33194L14.6668 2.66527" stroke="#001D21" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_1074_4569">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>

                      Accept & Invest
                    </button>
                    <button className="px-5 py-2.5 bg-[#F4F6F5] text-[#0A2A2E] border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Invites;

