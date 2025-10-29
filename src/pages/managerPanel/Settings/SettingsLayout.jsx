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
  BanknotesIcon 
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
import BankDetails from "./BankDetails";

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("general-info");

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
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#01373D] mb-2">Settings</h1>
        <p className="text-lg text-gray-600">Manage your account settings and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-80 bg-white rounded-lg p-6 h-fit">
          <div className="space-y-2">
            {settingsTabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors font-poppins-custom ${
                    activeTab === tab.id
                      ? "bg-[#00F0C3] text-black"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm">
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
            <Route path="/bank-details" element={<BankDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
