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

