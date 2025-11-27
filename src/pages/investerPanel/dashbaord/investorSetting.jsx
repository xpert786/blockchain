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

