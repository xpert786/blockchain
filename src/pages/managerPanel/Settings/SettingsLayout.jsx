import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { 
  PersonIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  DocumentCheckIcon, 
  GlobeAltIcon, 
  BuildingOfficeIcon, 
  BellIcon, 
  CurrencyDollarIcon, 
  BanknotesIcon, 
} from "../../../components/Icons";

// Import all settings pages
import GeneralInfo from "./GeneralInfo";
import KYBVerification from "./KYBVerification";
import TeamManagement from "./TeamManagement";
import ComplianceAccreditation from "./ComplianceAccreditation";
import JurisdictionalSettings from "./JurisdictionalSettings";
import PortfolioOutreach from "./PortfolioOutreach";
import NotificationsCommunication from "./NotificationsCommunication";
import FeeRecipientSetup from "./FeeRecipientSetup";
import AddFeeRecipient from "./AddFeeRecipient";
import BankDetails from "./BankDetails";

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("general-info");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const settingsTabs = [
    { id: "general-info", label: "General Info", icon: PersonIcon, path: "/manager-panel/settings/general-info" },
    { id: "kyb-verification", label: "KYB Verification", icon: ShieldCheckIcon, path: "/manager-panel/settings/kyb-verification" },
    { id: "team-management", label: "Team Management", icon: UsersIcon, path: "/manager-panel/settings/team-management" },
    { id: "compliance-accreditation", label: "Compliance & Accreditation", icon: DocumentCheckIcon, path: "/manager-panel/settings/compliance-accreditation" },
    { id: "jurisdictional-settings", label: "Jurisdictional Settings", icon: GlobeAltIcon, path: "/manager-panel/settings/jurisdictional-settings" },
    { id: "portfolio-outreach", label: "Portfolio Company Outreach", icon: BuildingOfficeIcon, path: "/manager-panel/settings/portfolio-outreach" },
    { id: "notifications-communication", label: "Notifications & Communication", icon: BellIcon, path: "/manager-panel/settings/notifications-communication" },
    { id: "fee-recipient-setup", label: "Fee Recipient Setup", icon: CurrencyDollarIcon, path: "/manager-panel/settings/fee-recipient-setup" },
    { id: "bank-details", label: "Bank Details", icon: BanknotesIcon, path: "/manager-panel/settings/bank-details" }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
    setIsMobileMenuOpen(false);
  };

  // Set active tab based on current path
  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentTab = settingsTabs.find(tab => currentPath.includes(tab.id));
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#01373D] mb-2">Settings</h3>
          <p className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#01373D] text-[#01373D]"
          aria-label="Open settings menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white rounded-lg p-6 h-fit">
          <div className="space-y-2">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors font-poppins-custom ${
                  activeTab === tab.id ? "bg-[#00F0C3] text-black" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-white rounded-lg">
          <Routes>
            <Route path="/" element={<GeneralInfo />} />
            <Route path="/general-info" element={<GeneralInfo />} />
            <Route path="/kyb-verification" element={<KYBVerification />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/compliance-accreditation" element={<ComplianceAccreditation />} />
            <Route path="/jurisdictional-settings" element={<JurisdictionalSettings />} />
            <Route path="/portfolio-outreach" element={<PortfolioOutreach />} />
            <Route path="/notifications-communication" element={<NotificationsCommunication />} />
            <Route path="/fee-recipient-setup" element={<FeeRecipientSetup />} />
            <Route path="/AddFeeRecipient" element={<AddFeeRecipient />} />
            <Route path="/bank-details" element={<BankDetails />} />
          </Routes>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-[#01373D]">Settings</h4>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
            aria-label="Close settings menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors font-poppins-custom ${
                activeTab === tab.id ? "bg-[#00F0C3] text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      {isMobileMenuOpen && (
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close menu overlay"
        />
      )}
    </div>
  );
};

export default SettingsLayout;
