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
  SettingsIcon,
  TaxDocumentsDownloadIcon,
  AlertsIcon
  
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
    placeholder: "United States"
  },
  {
    label: "Tax Domicile",
    placeholder: "United States"
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

const accreditationInfo = {
  type: "U.S. Reg D Rule 501(a)",
  expiry: "12/31/2025",
  verificationStatus: "Verified",
  verificationHelp: "Current accreditation verification"
};

const accreditationDocuments = [
  { title: "Income Statement", status: "Uploaded" },
  { title: "Net Worth Statement", status: "Uploaded" },
  { title: "Professional License", status: "Uploaded" }
];

const taxComplianceInfo = {
  tin: "123-45-6789",
  isUSPerson: true,
  w9Submitted: true,
  k1Acceptance: true,
  taxConsent: true,
  amlStatus: "Passed"
};

const eligibilityRules = {
  allowDelaware: true,
  allowBvi: false,
  autoReroute: true,
  annualCommitment: "500000",
  stagePreferences: [
    { label: "Early Stage", selected: false },
    { label: "Growth", selected: true },
    { label: "Late Stage", selected: true }
  ]
};

const financialSettings = {
  preferredCurrency: "USD (US Dollar)",
  bankAccountsCount: 2,
  escrowPartner: "Silicon Valley Bank",
  notificationPrefs: [
    { label: "Email", selected: false },
    { label: "Sms", selected: true },
    { label: "In App", selected: false }
  ],
  carryPreference: "Detailed Breakdown"
};

const portfolioSettings = {
  viewSetting: "Deal-by-Deal",
  transferConsent: true,
  liquidityPreference: "Long-term Holdings",
  whitelistEnabled: false
};

const securitySettings = {
  twoFactorEnabled: true,
  sessionTimeout: "30 minutes"
};

const privacySettings = {
  softWallPreview: true,
  discoveryOptIn: false,
  anonymity: false
};

const renderToggle = (isOn) => (
  <div
    className={`relative w-12 h-6 rounded-full transition-colors ${isOn ? "bg-[#0A2A2E]" : "bg-[#E5E7EB]"}`}
  >
    <span
      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
      style={{ transform: isOn ? "translateX(24px)" : "translateX(0)" }}
    />
  </div>
);

const renderCheckbox = (checked) => (
  <input
    type="checkbox"
    readOnly
    checked={checked}
    className="h-4 w-4 rounded border-[#0A2A2E] text-[#00F0C3] focus:ring-[#00F0C3]"
  />
);

const InvestorSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState("settings");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Identity");
  const [showTabsDropdown, setShowTabsDropdown] = useState(false);
  const tabsDropdownRef = useRef(null);

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
      if (tabsDropdownRef.current && !tabsDropdownRef.current.contains(event.target)) {
        setShowTabsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            style={{ backgroundColor: "#00F0C3" }}
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

      <main className="w-full px-4 sm:px-6 py-8 space-y-6">
        <section className="p-4 sm:p-6 md:p-8">
          <div className="bg-white border border-[#E5E7EB] rounded-md p-4 sm:p-6 flex flex-col gap-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-medium font-poppins-custom">
              <span className="text-[#7A61EA]">Account</span> <span className="text-[#0A2A2E]">Settings</span>
            </h1>
            <p className="text-sm text-[#748A91] font-poppins-custom">
              Manage your comprehensive account preferences and compliance settings
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Tabs - Dropdown on mobile, vertical sidebar on desktop */}
            <aside className="w-full lg:w-1/4">
              {/* Mobile Dropdown */}
              <div className="lg:hidden relative" ref={tabsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowTabsDropdown(!showTabsDropdown)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-4 py-3 flex items-center justify-between text-sm font-medium font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5] transition-colors"
                >
                  <span>{activeTab}</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${showTabsDropdown ? "rotate-180" : ""}`}
                  >
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {showTabsDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                    {settingsTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          setShowTabsDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium font-poppins-custom transition-colors border-b border-[#E5E7EB] last:border-b-0 ${
                          tab === activeTab
                            ? "bg-[#00F0C3] text-[#001D21]"
                            : "text-[#0A2A2E] hover:bg-[#F4F6F5]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Vertical Sidebar */}
              <div className="hidden lg:block bg-white border border-[#E5E7EB] rounded-md p-4 space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium font-poppins-custom transition-colors ${
                      tab === activeTab
                        ? "bg-[#00F0C3] text-[#001D21]"
                        : "text-[#0A2A2E] bg-[#F4F6F5] hover:bg-[#F3F4F6] border border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1 space-y-6">
            {activeTab === "Identity" && (
            <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
              <header className="flex items-start gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Identity & Jurisdiction</h2>
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
                      <input
                        type="text"
                        readOnly
                        value={field.placeholder}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-row items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 22V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Jurisdiction Status</p>
                        <p className="text-xs text-[#748A91] font-poppins-custom">Auto-tagged based on residence</p>
                </div>
                 
                </div>
                
                <span className="inline-flex items-center justify-center px-4 py-1 bg-[#22C55E] text-white text-xs font-semibold rounded-md">
                  Approved
                </span>
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                >
                  Save Identity Information
                </button>
              </div>
            </section>
            )}

            {activeTab === "Accreditation" && (
            <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
              <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 3L4 7V12C4 16.97 7.58 21.43 12 22C16.42 21.43 20 16.97 20 12V7L12 3Z"
                    stroke="#00F0C3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M10.5 12L12 13.5L15 10.5" stroke="#00F0C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Accreditation Status</h2>
                  <p className="text-sm text-[#748A91] font-poppins-custom">
                    Investor accreditation verification and documentation
                  </p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                    Accreditation Type
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={accreditationInfo.type}
                    className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                    Accreditation Expiry/Review Date
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={accreditationInfo.expiry}
                    className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                
                  <div>
                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Verification Status</p>
                    <p className="text-xs text-[#748A91] font-poppins-custom">{accreditationInfo.verificationHelp}</p>
                  </div>
                </div>
                <span className="inline-flex items-center justify-center px-4 py-1 bg-[#22C55E] text-white text-xs rounded-md">
                  {accreditationInfo.verificationStatus}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Required Documents</p>
                {accreditationDocuments.map((document) => (
                  <div
                    key={document.title}
                    className="flex items-center justify-between gap-3 bg-[#F5F9F7] border border-[#D1DED8] rounded-md px-4 py-3"
                  >
                    <span className="text-sm text-[#0A2A2E] font-poppins-custom">{document.title}</span>
                    <span className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium text-[#0A2A2E] bg-white border border-[#C5D5CD] rounded-lg">
                      {document.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                >
                  Save Accreditation Details
                </button>
              </div>
            </section>
            )}

            {activeTab === "Tax & Compliance" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H8" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Tax & Compliance</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Tax identification and compliance documentation
                    </p>
                  </div>
                </header>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                      Tax Identification Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={taxComplianceInfo.tin}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">U.S. Person Status</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom">For tax reporting purposes</p>
                    </div>
                    {renderToggle(taxComplianceInfo.isUSPerson)}
                  </div>

                  <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">W-9 Form Submitted</p>
                      </div>
                      {renderToggle(taxComplianceInfo.w9Submitted)}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">K-1 Acceptance</p>
                        <p className="text-xs text-[#748A91] font-poppins-custom">Accept K-1 tax documents</p>
                      </div>
                      {renderToggle(taxComplianceInfo.k1Acceptance)}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Tax Reporting Consent</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom">Receive tax documents electronically</p>
                    </div>
                    {renderToggle(taxComplianceInfo.taxConsent)}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">AML/KYC Status</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom">Anti-money laundering verification</p>
                    </div>
                    <span className="inline-flex items-center justify-center px-4 py-1 bg-[#22C55E] text-white text-xs rounded-md">
                      {taxComplianceInfo.amlStatus}
                    </span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                  >
                    Save Tax & Compliance
                  </button>
                </div>
              </section>
            )}

            {activeTab === "Eligibility" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12H22" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Investment Eligibility Rules</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Jurisdiction preferences and investment constraints
                    </p>
                  </div>
                </header>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">Jurisdiction Preferences</p>

                    {[
                      {
                        title: "Delaware SPVs",
                        description: "Allow investment in Delaware entities",
                        value: eligibilityRules.allowDelaware
                      },
                      {
                        title: "BVI SPVs",
                        description: "Allow investment in British Virgin Islands entities",
                        value: eligibilityRules.allowBvi
                      },
                      {
                        title: "Auto-Reroute Consent",
                        description: "Offer alternative jurisdiction if ineligible",
                        value: eligibilityRules.autoReroute
                      }
                    ].map((item, index) => (
                      <div
                        key={item.title}
                        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                          index < 2 ? "border-b border-[#E5E7EB] pb-4" : ""
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">{item.title}</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">{item.description}</p>
                        </div>
                        {renderToggle(item.value)}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom">
                      Max Annual Commitment (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-sm text-[#0A2A2E] font-medium font-poppins-custom">
                        $
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={eligibilityRules.annualCommitment}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md pl-8 pr-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-[#748A91] font-poppins-custom">Self-imposed annual investment limit</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Deal Stage Preferences</p>
                    <div className="flex flex-wrap gap-6">
                      {eligibilityRules.stagePreferences.map((stage) => (
                        <label key={stage.label} className="flex items-center gap-2 text-sm text-[#0A2A2E] font-poppins-custom">
                          <input
                            type="checkbox"
                            readOnly
                            checked={stage.selected}
                            className="h-4 w-4 rounded border-[#0A2A2E] text-[#00F0C3] focus:ring-[#00F0C3]"
                          />
                          {stage.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                  >
                    Save Eligibility Rules
                  </button>
                </div>
              </section>
            )}

            {activeTab === "Financial" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 10H22" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Financial & Transaction Settings</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Currency preferences and banking information
                    </p>
                  </div>
                </header>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Preferred Investment Currency
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={financialSettings.preferredCurrency}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>

                  <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Linked Bank Accounts</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom">For wires and distributions</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-lg text-[#0A2A2E] font-poppins-custom flex  justify-end gap-2">
                        {financialSettings.bankAccountsCount}
                      </span>
                      <button className="px-4 py-2 bg-[#F4F6F5] border border-[#D1DED8] rounded-md text-xs font-medium text-[#0A2A2E] font-poppins-custom">
                        Manage
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Escrow Partner Selection
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={financialSettings.escrowPartner}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Capital Call Notification Preferences</p>
                    <div className="flex flex-wrap items-center gap-6 mt-3">
                      {financialSettings.notificationPrefs.map((pref) => (
                        <label key={pref.label} className="flex items-center gap-2 text-sm text-[#0A2A2E] font-poppins-custom">
                          {renderCheckbox(pref.selected)}
                          {pref.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Carry/Fees Display Preference
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={financialSettings.carryPreference}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                  >
                    Save Financial Settings
                  </button>
                </div>
              </section>
            )}

            {activeTab === "Portfolio" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 20V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V20" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Portfolio & Liquidity</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Portfolio display and secondary market preferences
                    </p>
                  </div>
                </header>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Portfolio View Settings
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={portfolioSettings.viewSetting}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Secondary Transfer Consent</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom">Allow listing holdings for resale</p>
                    </div>
                    {renderToggle(portfolioSettings.transferConsent)}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Liquidity Preference
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={portfolioSettings.liquidityPreference}
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                    <p className="text-xs text-[#748A91] font-poppins-custom mt-2">Self-imposed annual investment limit</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Whitelist For Secondary Trading</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom">Pre-approved counterparties</p>
                    </div>
                    {renderToggle(portfolioSettings.whitelistEnabled)}
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                  >
                    Save Portfolio Settings
                  </button>
                </div>
              </section>
            )}

            {activeTab === "Security & Privacy" && (
              <section className="space-y-6">
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                  <header className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8C6 6.4087 6.63214 4.88258 7.75736 3.75736C8.88258 2.63214 10.4087 2 12 2C13.5913 2 15.1174 2.63214 16.2426 3.75736C17.3679 4.88258 18 6.4087 18 8C18 15 21 17 21 17H3C3 17 6 15 6 8Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.3008 21C10.4682 21.3044 10.7142 21.5583 11.0133 21.7352C11.3123 21.912 11.6534 22.0053 12.0008 22.0053C12.3482 22.0053 12.6892 21.912 12.9883 21.7352C13.2873 21.5583 13.5334 21.3044 13.7008 21" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    <div>
                      <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Security & Access</h2>
                      <p className="text-sm text-[#748A91] font-poppins-custom">
                        Manage your account security and access controls
                      </p>
                    </div>
                  </header>

                  <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Two-Factor Authentication</p>
                        <p className="text-xs text-[#748A91] font-poppins-custom">Email, SMS, or authenticator app</p>
                      </div>
                      {renderToggle(securitySettings.twoFactorEnabled)}
                    </div>

                    <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.91602 1.16797H4.08268C3.43835 1.16797 2.91602 1.6903 2.91602 2.33464V11.668C2.91602 12.3123 3.43835 12.8346 4.08268 12.8346H9.91602C10.5603 12.8346 11.0827 12.3123 11.0827 11.668V2.33464C11.0827 1.6903 10.5603 1.16797 9.91602 1.16797Z" stroke="#22C55E" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 10.5H7.00583" stroke="#22C55E" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <p className="text-sm font-medium text-[#22C55E] font-poppins-custom">2FA Enabled</p>
                      </div>
                      <p className="text-xs text-[#748A91] font-poppins-custom">
                        Two-factor authentication is active on your account.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                        Session Timeout (minutes)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={securitySettings.sessionTimeout}
                          className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                        />
                        <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Device Management</p>
                        <p className="text-xs text-[#748A91] font-poppins-custom">View and remove logged-in devices</p>
                      </div>
                      <button className="px-4 py-2 bg-[#F4F6F5] border border-[#D1DED8] rounded-md text-xs font-medium text-[#0A2A2E] font-poppins-custom">
                        Manage Devices
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-lg font-medium text-[#0A2A2E] font-poppins-custom">Password Change</p>
                      <div className="flex flex-col md:flex-col  md:justify-between gap-3">
                        {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                          <div key={label}>
                            <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                              {label}
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                readOnly
                                placeholder={
                                  label === "Current Password"
                                    ? "Enter current password"
                                    : label === "New Password"
                                    ? "Enter new password"
                                    : "Confirm new password"
                                }
                                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                              />
                              {label !== "Confirm New Password" && (
                                <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">
                                  👁
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-start">
                        <button className="px-4 py-2 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button
                      type="button"
                      className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                    >
                      Save Security Settings
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                  <header className="flex items-start gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#00F0C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <div>
                      <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Privacy & Visibility</h2>
                      <p className="text-sm text-[#748A91] font-poppins-custom">
                        Control your privacy settings and profile visibility
                      </p>
                    </div>
                  </header>

                  <div className="space-y-4 border-b border-[#E5E7EB] pb-4">
                    {[
                      {
                        title: "Soft-Wall Deal Preview",
                        description: "Show teaser info before full KYC",
                        value: privacySettings.softWallPreview
                      },
                      {
                        title: "Discovery Opt-In",
                        description: "Allow syndicate leads outside network to invite you",
                        value: privacySettings.discoveryOptIn
                      },
                      {
                        title: "Anonymity Preference",
                        description: "Hide name from other LPs in same SPV",
                        value: privacySettings.anonymity
                      }
                    ].map((item) => (
                      <div key={item.title} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">{item.title}</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">{item.description}</p>
                        </div>
                        {renderToggle(item.value)}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Data Export & Deletion</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="px-4 py-2 bg-[#F4F6F5] border border-[#D1DED8] rounded-md text-xs font-medium text-[#0A2A2E] font-poppins-custom">
                        <div className="flex items-center gap-2">
                            <TaxDocumentsDownloadIcon />
                            <span>Save Portfolio Settings</span>
                        </div>
                      </button>
                      <button className="px-4 py-2 bg-[#ED1C24] border border-[#FCA5A5] rounded-md text-xs font-medium text-white font-poppins-custom">
                        Delete Account
                      </button>
                    </div>
                    <p className="text-xs text-[#748A91] font-poppins-custom">
                      Export your data or permanently delete your account and all associated data.
                    </p>
                  </div>

                  <div className="flex justify-start">
                    <button
                      type="button"
                      className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Communication" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 11.5V12C21.0006 13.3072 20.6147 14.5872 19.8954 15.6884C19.1761 16.7897 18.1548 17.6621 16.9411 18.2057C15.7273 18.7492 14.3704 18.9407 13.0473 18.7561C11.7241 18.5715 10.496 18.0196 9.5 17.17L5 19L6.83001 14.5C6.11342 13.3652 5.72376 12.0311 5.71146 10.6615C5.69915 9.29189 6.06471 7.95244 6.76484 6.80429C7.46498 5.65614 8.47 4.74547 9.66463 4.18449C10.8593 3.62351 12.1907 3.4364 13.4934 3.64427C14.7961 3.85213 16.0124 4.44508 16.9642 5.34516C17.9159 6.24524 18.5586 7.40574 18.8065 8.67268"
                      stroke="#00F0C3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Communication & Notifications</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Manage how you receive updates and communications
                    </p>
                  </div>
                </header>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="Email"
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Update Frequency
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="Weekly Digest"
                        className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">▼</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-[#E5E7EB] pt-4">
                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Event Alerts</p>
                    <div className="space-y-3">
                      {[
                        { title: "Capital Calls", description: "Investment funding requests", value: true },
                        { title: "Secondary Offers", description: "Secondary market opportunities", value: true },
                        { title: "Portfolio Updates", description: "Performance and valuation changes", value: true },
                        { title: "Distributions", description: "Dividend and return payments", value: true },
                        { title: "Marketing Consent", description: "Product updates and partner offers", value: false }
                      ].map((item) => (
                        <div key={item.title} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">{item.title}</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">{item.description}</p>
                          </div>
                    
                        
                          {renderToggle(item.value)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors"
                  >
                    Save Communication Settings
                  </button>
                </div>
              </section>
            )}

            {activeTab !== "Identity" &&
              activeTab !== "Accreditation" &&
              activeTab !== "Tax & Compliance" &&
              activeTab !== "Eligibility" &&
              activeTab !== "Financial" &&
              activeTab !== "Portfolio" &&
              activeTab !== "Security & Privacy" &&
              activeTab !== "Communication" && (
                <section className="bg-white border border-dashed border-[#D8DEE4] rounded-3xl p-6 text-center text-sm text-[#748A91] font-poppins-custom">
                  This section will be available soon.
                </section>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InvestorSettings;

