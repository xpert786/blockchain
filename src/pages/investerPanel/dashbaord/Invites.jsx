import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import { HomeIcon, InvitesIcon, PortfolioIcon, TaxesIcon, MessagesIcon, SettingsIcon, AlertsIcon } from "./icon.jsx";

const Invites = () => {
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

  const pendingCount = invites.filter((invite) => !invite.expired).length;

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
     

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 bg-white rounded-lg p-6">
          <div>
            <h1 className="text-3xl sm:text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
              Your <span className="text-[#9889FF]">Invites</span>
            </h1>
            <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
              Exclusive investment opportunities you've been invited to
            </p>
          </div>
          <div
            className="w-full sm:w-auto px-4 py-2 bg-[#F9F8FF] text-[#001D21] rounded-lg font-medium font-poppins-custom text-center"
            style={{ border: "0.5px solid #748A91" }}
          >
            {pendingCount} Pending
          </div>
        </div>

        {/* Invite Cards */}
        <div className="space-y-6">
          {invites.map((invite, index) => (
            <div key={index} className={`bg-white rounded-lg p-6 border border-gray-200 ${invite.expired ? "opacity-50" : ""}`}>
              {/* Header: Name and Leader */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
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
              <div className="flex flex-wrap items-center gap-2 mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
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
              <div className="flex flex-wrap items-center gap-3">
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

