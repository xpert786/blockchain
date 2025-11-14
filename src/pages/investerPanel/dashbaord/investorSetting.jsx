import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {
  HomeIcon,
  InvitesIcon,
  PortfolioIcon,
  TaxesIcon,
  MessagesIcon,
  SettingsIcon
} from "./icon.jsx";

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const settingsTabs = [
  "Identity",
  "Accreditation",
  "Tax & Compliance",
  "Eligibility",
  "Financial",
  "Portfolio",
  "Security & Privacy",
  "Communication"
];

const identityFields = [
  {
    label: "Full Legal Name (as per ID)",
    placeholder: "John Michael Smith"
  },
  {
    label: "Country of Residence",
    placeholder: "United States",
    type: "select"
  },
  {
    label: "Tax Domicile",
    placeholder: "United States",
    type: "select"
  },
  {
    label: "National ID / Passport Number",
    placeholder: "123-45-6789"
  },
  {
    label: "Date of Birth",
    placeholder: "15-06-1985"
  },
  {
    label: "Full Legal Name (as per ID)",
    placeholder: "123 Main St, New York, NY 10001"
  }
];

const InvestorSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState("settings");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/investor-panel/invest")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/portfolio")) {
      setActiveNav("portfolio");
    } else if (location.pathname.includes("/investor-panel/top-syndicates")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/wishlist")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/invites")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/tax-documents")) {
      setActiveNav("taxes");
    } else if (location.pathname.includes("/investor-panel/messages")) {
      setActiveNav("messages");
    } else {
      setActiveNav("settings");
    }
  }, [location.pathname]);

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

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img src={logoImage} alt="Unlocksley Logo" className="h-20 w-20 object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search SPVs, investors, documents..."
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => navigate("/investor-panel/notifications")}
                className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
              >
                <div className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                  <span className="text-[#01373D] text-xs font-bold">2</span>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <img src={profileImage} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              <button>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full">
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
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showInvestDropdown && (
              <div
                className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]"
                style={{ border: "1px solid #000" }}
              >
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

      <main className="w-full px-6 py-8 space-y-6">
        <section className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-3xl font-medium text-[#7A61EA] font-poppins-custom">
              Account <span className="text-[#0A2A2E]">Settings</span>
            </h1>
            <p className="text-sm text-[#748A91] font-poppins-custom">
              Manage your comprehensive account preferences and compliance settings
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="bg-[#F7F7F8] border border-[#E5E7EB] rounded-3xl p-4 w-full lg:w-1/4 space-y-2">
              {settingsTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium font-poppins-custom transition-colors ${
                    tab === "Identity"
                      ? "bg-[#00F0C3] text-[#001D21]"
                      : "text-[#0A2A2E] bg-white hover:bg-[#F3F4F6] border border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </aside>

            <section className="flex-1 bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-6">
              <header className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E9F8F3] flex items-center justify-center text-[#0A2A2E] font-semibold">
                  ID
                </div>
                <div>
                  <h2 className="text-xl font-medium text-[#0A2A2E] font-poppins-custom">Identity & Jurisdiction</h2>
                  <p className="text-sm text-[#748A91] font-poppins-custom">
                    Legal identity and residency information
                  </p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {identityFields.map((field, index) => {
                  const isFullWidth = index === 0 || index === identityFields.length - 1;
                  return (
                    <div key={field.label} className={isFullWidth ? "md:col-span-2" : ""}>
                      <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={field.placeholder}
                          readOnly
                          className="w-full bg-[#F5F7F9] border border-[#D8DEE4] rounded-2xl px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Jurisdiction Status</p>
                  <p className="text-xs text-[#748A91] font-poppins-custom">Auto-tagged based on residence</p>
                </div>
                <span className="inline-flex items-center justify-center px-4 py-2 bg-[#00F0C3] text-[#001D21] text-xs font-semibold rounded-full">
                  Approved
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-2xl text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                >
                  Save Identity Information
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InvestorSetting;

