import React, { useState } from "react";
import { GlobeAltIcon, SaveIcon } from "../../../components/Icons";

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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <GlobeAltIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Jurisdictional Settings</h2>
          <p className="text-gray-600 font-poppins-custom">Manage Legal And Compliance Configurations For Your Selected Jurisdiction.</p>
        </div>
      </div>

      {/* Jurisdiction Selection */}
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Jurisdiction:</label>
        <div className="relative">
          <select
            value={selectedJurisdiction}
            onChange={handleJurisdictionChange}
            className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom appearance-none"
          >
            <option value="">Select SPV Jurisdiction</option>
            {jurisdictions.map((jurisdiction) => (
              <option key={jurisdiction.value} value={jurisdiction.value}>
                {jurisdiction.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Question Mark Icon with Tooltip */}
        <div className="relative inline-block ml-3">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg z-10">
              <p className="text-sm text-gray-800 font-poppins-custom whitespace-nowrap">
                More jurisdiction and legal customizations coming soon
              </p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-300"></div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <SaveIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default JurisdictionalSettings;
