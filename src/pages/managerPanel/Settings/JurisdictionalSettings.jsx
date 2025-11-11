import React, { useState } from "react";
import { GlobeAltIcon, SaveIcon,JusIcon } from "../../../components/Icons";

const JurisdictionalSettings = () => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const jurisdictions = [
    { value: "delaware", label: "Delaware (Series LLC)" },
    { value: "bvi", label: "BVI (Business Company)" },
    { value: "adgm", label: "ADGM (SPV)" }
  ];

  const handleJurisdictionChange = (e) => {
    setSelectedJurisdiction(e.target.value);
  };

  const handleSave = () => {
    console.log("Jurisdictional settings saved:", selectedJurisdiction);
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top header white card */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-start sm:gap-3 gap-4">
        <div className="flex items-center justify-center sm:justify-start">
          <JusIcon className="mt-0.5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg md:text-xl text-[#001D21]">Jurisdictional Settings</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-poppins-custom mt-1">Manage Legal And Compliance Configurations For Your Selected Jurisdiction.</p>
        </div>
      </div>

      {/* Jurisdiction selection card */}
      <div className="bg-white rounded-xl px-5 md:px-6 py-6 w-full">
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-3">
          <label className="block text-xs md:text-sm font-medium text-gray-700 font-poppins-custom mb-1 md:mb-0 md:mr-3 min-w-fit">Jurisdiction:</label>
          <div className="relative w-full md:max-w-xs flex items-center">
            <div className="relative w-full">
              <select
                value={selectedJurisdiction}
                onChange={handleJurisdictionChange}
                className="w-full px-3 py-3.5 !border border-[#E2E2FB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom appearance-none"
              >
                <option value="" className="!border border-[#E2E2FB]">Select SPV Jurisdiction</option>
                {jurisdictions.map((jurisdiction) => (
                  <option key={jurisdiction.value} value={jurisdiction.value}>
                    {jurisdiction.label}
                  </option>
                ))}
              </select>
              {/* The dropdown caret (SVG) overlays select field */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Question mark button tightly after select */}
            <div className="flex items-center ml-4 sm:ml-6 relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-base font-bold focus:outline-none"
                style={{ lineHeight: 1, backgroundColor: "#000000", border: "1px solid #F5DE8A", color: "#FFFFFF" }}
                tabIndex={0}
              >
                ?
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-3 px-2 py-2 bg-yellow-100 border border-yellow-300 rounded shadow-lg z-10 min-w-[210px] whitespace-nowrap">
                  <div className="text-xs text-yellow-700 font-poppins-custom text-center leading-tight">
                    More jurisdiction and legal <br/>customizations coming soon
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-300"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JurisdictionalSettings;
