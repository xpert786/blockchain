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
  const [invites, setInvites] = useState([]);
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

  // Format deadline
  const formatDeadline = (days) => {
    if (!days || days <= 0) return "Expired";
    if (days === 1) return "1 Day";
    return `${days} Days`;
  };

  // Fetch invites from API
  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/dashboard/invites/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Invites API response:", data);

        // Map API response to component data structure
        const mappedInvites = data.results?.map(invite => ({
          id: invite.id,
          spvId: invite.spv_id,
          name: invite.syndicate_name || invite.company_name || "Unnamed Invite",
          leader: invite.led_by || "Unknown",
          description: invite.description || `${invite.company_name || invite.syndicate_name} - ${invite.sector || "General"} sector opportunity in ${invite.stage || "Seed"} stage.`,
          tags: [
            ...(invite.tags || []),
            invite.sector,
            invite.stage,
            invite.status === "Active" ? "Active" : invite.status
          ].filter(Boolean),
          allocated: formatAllocated(invite.allocated),
          raised: formatCurrency(invite.raised),
          target: formatCurrency(invite.target),
          minInvestment: formatCurrency(invite.min_investment),
          deadline: formatDeadline(invite.deadline),
          expired: !invite.deadline || invite.deadline <= 0,
          rawData: invite // Keep raw data for navigation
        })) || [];

        setInvites(mappedInvites);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch invites:", response.status, errorText);
        setError("Failed to load invites. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching invites:", err);
      setError(err.message || "Network error loading invites.");
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchInvites}
                className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No invites available at the moment.</p>
            </div>
          ) : (
            invites.map((invite, index) => (
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
                        className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom ${tag === "Expired"
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
                    style={{ border: "0.5px solid #E2E2FB" }}
                  >
                    <p className="text-xs text-[#001D21] font-poppins-custom mb-1">Allocated</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.allocated}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                    style={{ border: "0.5px solid #E2E2FB" }}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Raised</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.raised}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                    style={{ border: "0.5px solid #E2E2FB" }}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Target</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.target}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                    style={{ border: "0.5px solid #E2E2FB" }}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Min. Investment</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.minInvestment}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between bg-[#F9F8FF] rounded-lg p-2"
                    style={{ border: "0.5px solid #E2E2FB" }}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Deadline</p>
                    <p className={`text-base font-semibold font-poppins-custom ${invite.expired ? "text-red-600" : "text-[#0A2A2E]"
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
                      <button
                        onClick={() => navigate(`/investor-panel/tax-documents/${invite.id || invite.spvId || '1'}`, {
                          state: {
                            document: {
                              id: invite.id || invite.spvId || '1',
                              investmentName: invite.name,
                              company: invite.name,
                              taxYear: new Date().getFullYear().toString(),
                              issueDate: invite.rawData?.invited_at || new Date().toLocaleDateString('en-GB'),
                              status: "Available",
                              stage: invite.tags?.find(tag => ['Seed', 'Series A', 'Series B', 'Series C'].includes(tag)) || "Seed",
                              valuation: invite.target,
                              expectedReturns: "3-5x",
                              timeline: invite.deadline,
                              fundingProgress: 65,
                              fundingRaised: invite.raised,
                              fundingTarget: invite.target,
                              documentTitle: `${invite.name} Investment Document`,
                              size: "2.5 MB",
                              rawData: invite.rawData || invite
                            }
                          }
                        })}
                        className="px-5 py-2.5 bg-[#00F0C3] text-black rounded-lg hover:bg-[#16a34a] transition-colors font-medium font-poppins-custom flex items-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1074_4569)">
                            <path d="M14.6668 7.38527V7.99861C14.666 9.43622 14.2005 10.8351 13.3397 11.9865C12.4789 13.1379 11.269 13.9803 9.8904 14.3879C8.51178 14.7955 7.03834 14.7465 5.68981 14.2483C4.34128 13.7501 3.18993 12.8293 2.40747 11.6233C1.62501 10.4173 1.25336 8.99065 1.34795 7.55615C1.44254 6.12165 1.9983 4.75616 2.93235 3.66332C3.8664 2.57049 5.12869 1.80886 6.53096 1.49204C7.93322 1.17521 9.40034 1.32017 10.7135 1.90527M6.00017 7.33194L8.00017 9.33194L14.6668 2.66527" stroke="#001D21" strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                          <defs>
                            <clipPath id="clip0_1074_4569">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        Accept & Invest
                      </button>
                      <button className="px-5 py-2.5 bg-[#F4F6F5] text-[#0A2A2E] border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Invites;

