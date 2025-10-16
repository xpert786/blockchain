import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LeadInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accreditation: "", // No default selection
    understandRequirements: false,
    sectorFocus: ["Fintech", "Healthcare", "Technology"],
    geographyFocus: ["Fintech", "Healthcare", "Technology"],
    existingLpNetwork: "No",
    lpBaseSize: 50,
    enablePlatformLpAccess: false
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectorRemove = (sector) => {
    setFormData(prev => ({
      ...prev,
      sectorFocus: prev.sectorFocus.filter(s => s !== sector)
    }));
  };

  const handleGeographyRemove = (geo) => {
    setFormData(prev => ({
      ...prev,
      geographyFocus: prev.geographyFocus.filter(g => g !== geo)
    }));
  };

  const handleNext = () => {
    navigate("/syndicate-creation/entity-profile");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Step 1: Lead Info</h1>
        <p className="text-gray-600">Personal and investment focus information.</p>
      </div>

      {/* Accreditation Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Accreditation</h2>
            <p className="text-gray-600 mb-4">
              To be a syndicate, you must be a <span className="text-purple-400 font-semibold">accredited Investor</span>
            </p>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="accreditation"
              value="accredited"
              checked={formData.accreditation === "accredited"}
              onChange={(e) => handleInputChange("accreditation", e.target.value)}
              className="mr-3"
            />
            <span className="text-gray-700">I am an accredited investor</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="accreditation"
              value="not-accredited"
              checked={formData.accreditation === "not-accredited"}
              onChange={(e) => handleInputChange("accreditation", e.target.value)}
              className="mr-3"
            />
            <span className="text-gray-700">I am not an accredited investor</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.understandRequirements}
              onChange={(e) => handleInputChange("understandRequirements", e.target.checked)}
              className="mr-3"
            />
            <span className="text-gray-700">I understand I must meet regulatory requirements to lead syndicates</span>
          </label>
        </div>
      </div>

      {/* Sector Focus Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sector Focus</h2>
        <div className="border border-gray-300 rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2">
          {formData.sectorFocus.map((sector) => (
            <span
              key={sector}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {sector}
              <button
                onClick={() => handleSectorRemove(sector)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
          <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Geography Focus Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Geography Focus</h2>
        <div className="border border-gray-300 rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2">
          {formData.geographyFocus.map((geo) => (
            <span
              key={geo}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {geo}
              <button
                onClick={() => handleGeographyRemove(geo)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
          <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Existing LP Network Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing LP Network</h2>
        <p className="text-gray-600 mb-4">How many LPs do you have to invest in your deal?</p>
        
        <div className="border border-gray-300 rounded-lg p-3 w-full max-w-xs">
          <select
            value={formData.existingLpNetwork}
            onChange={(e) => handleInputChange("existingLpNetwork", e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Conditional Fields - Only show when "Yes" is selected */}
        {formData.existingLpNetwork === "Yes" && (
          <div className="mt-6 space-y-6">
            {/* LP Base Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LP Base Size
              </label>
              <input
                type="number"
                value={formData.lpBaseSize}
                onChange={(e) => handleInputChange("lpBaseSize", parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 w-full max-w-xs"
                placeholder="Enter LP base size"
              />
            </div>

            {/* Enable Platform LP Access */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enablePlatformLpAccess"
                checked={formData.enablePlatformLpAccess}
                onChange={(e) => handleInputChange("enablePlatformLpAccess", e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-600 rounded"
              />
              <label
                htmlFor="enablePlatformLpAccess"
                className="text-sm font-medium text-gray-700 flex items-center gap-2 relative group"
              >
                Enable Platform LP Access
                {/* Tooltip */}
                <div className="relative flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block
                               w-64 p-3 bg-white text-gray-800 text-xs rounded-lg shadow-lg border border-purple-300
                               before:content-[''] before:absolute before:left-1/2 before:top-full before:-translate-x-1/2
                               before:border-8 before:border-transparent before:border-t-purple-300"
                  >
                    Allow platform LPs to discover and invest in your deals. This increases your potential investor pool and can help you raise funds faster.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Info Box - Only show when "No" is selected */}
        {formData.existingLpNetwork === "No" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <p className="font-medium">Don't Worry, You Can Still Leverage Platform LPs To Raise Funds</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LeadInfo;
