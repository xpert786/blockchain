import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DontIcon } from "../../components/Icons";

const LeadInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accreditation: "", // No default selection
    understandRequirements: false,
    sectorFocus: [], // Array of sector IDs
    geographyFocus: [], // Array of geography IDs
    existingLpNetwork: "No",
    lpBaseSize: 50,
    enablePlatformLpAccess: false
  });

  const [sectors, setSectors] = useState([]);
  const [geographies, setGeographies] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showGeographyDropdown, setShowGeographyDropdown] = useState(false);
  const sectorDropdownRef = useRef(null);
  const geographyDropdownRef = useRef(null);

  // Fetch sectors and geographies on component mount
  useEffect(() => {
    const fetchSectorsAndGeographies = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("You must be logged in to continue.");
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/sectors-geographies/`;

        const response = await axios.get(finalUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Sectors and Geographies fetched:", response.data);
        setSectors(response.data.sectors || []);
        setGeographies(response.data.geographies || []);
      } catch (err) {
        console.error("Error fetching sectors and geographies:", err);
        setError("Failed to load sectors and geographies. Please refresh the page.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchSectorsAndGeographies();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setShowSectorDropdown(false);
      }
      if (geographyDropdownRef.current && !geographyDropdownRef.current.contains(event.target)) {
        setShowGeographyDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectorAdd = (sectorId) => {
    if (!formData.sectorFocus.includes(sectorId)) {
      setFormData(prev => ({
        ...prev,
        sectorFocus: [...prev.sectorFocus, sectorId]
      }));
    }
    setShowSectorDropdown(false);
  };

  const handleSectorRemove = (sectorId) => {
    setFormData(prev => ({
      ...prev,
      sectorFocus: prev.sectorFocus.filter(id => id !== sectorId)
    }));
  };

  const handleGeographyAdd = (geographyId) => {
    if (!formData.geographyFocus.includes(geographyId)) {
      setFormData(prev => ({
        ...prev,
        geographyFocus: [...prev.geographyFocus, geographyId]
      }));
    }
    setShowGeographyDropdown(false);
  };

  const handleGeographyRemove = (geographyId) => {
    setFormData(prev => ({
      ...prev,
      geographyFocus: prev.geographyFocus.filter(id => id !== geographyId)
    }));
  };

  // Get sector name by ID
  const getSectorName = (sectorId) => {
    const sector = sectors.find(s => s.id === sectorId);
    return sector ? sector.name : `Sector ${sectorId}`;
  };

  // Get geography name by ID
  const getGeographyName = (geographyId) => {
    const geography = geographies.find(g => g.id === geographyId);
    return geography ? geography.name : `Geography ${geographyId}`;
  };

  // Map LP base size to API format (ranges)
  const mapLpBaseSizeToRange = (size) => {
    if (size <= 10) return "1-10";
    if (size <= 25) return "11-25";
    if (size <= 50) return "26-50";
    if (size <= 100) return "51-100";
    return "100+";
  };

  // Get available sectors (not already selected)
  const getAvailableSectors = () => {
    return sectors.filter(sector => !formData.sectorFocus.includes(sector.id));
  };

  // Get available geographies (not already selected)
  const getAvailableGeographies = () => {
    return geographies.filter(geography => !formData.geographyFocus.includes(geography.id));
  };

  const handleNext = async () => {
    setError("");
    
    // Validation
    if (!formData.accreditation) {
      setError("Please select your accreditation status.");
      return;
    }
    
    if (!formData.understandRequirements) {
      setError("You must acknowledge that you understand the regulatory requirements.");
      return;
    }

    if (formData.sectorFocus.length === 0) {
      setError("Please select at least one sector focus.");
      return;
    }

    if (formData.geographyFocus.length === 0) {
      setError("Please select at least one geography focus.");
      return;
    }

    setLoading(true);

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setError("You must be logged in to continue. Please log in again.");
        navigate("/login");
        return;
      }

      // Prepare API payload
      const payload = {
        is_accredited: formData.accreditation === "accredited" ? "yes" : "no",
        understands_regulatory_requirements: formData.understandRequirements,
        sector_ids: formData.sectorFocus, // Already IDs
        geography_ids: formData.geographyFocus, // Already IDs
        existing_lp_count: formData.existingLpNetwork === "Yes" 
          ? mapLpBaseSizeToRange(formData.lpBaseSize) 
          : "0",
        enable_platform_lp_access: formData.existingLpNetwork === "Yes" 
          ? formData.enablePlatformLpAccess 
          : false,
      };

      console.log("=== LeadInfo API Call ===");
      console.log("Payload:", payload);

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step1/`;

      console.log("Calling API:", finalUrl);

      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("LeadInfo submitted successfully:", response.data);

      // Navigate to next step
      navigate("/syndicate-creation/entity-profile");
      
    } catch (err) {
      console.error("Error submitting LeadInfo:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessage = backendData.message || 
            backendData.error || 
            JSON.stringify(backendData);
          setError(errorMessage);
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to submit lead information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 1: Lead Info</h1>
        <p className="text-gray-600">Personal and investment focus information.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Accreditation Section */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Accreditation</h2>
        <p className="text-gray-600">
          To be a syndicate, you must be a <span className="text-purple-400 font-semibold">accredited Investor</span>
        </p>

        <div className="space-y-3">
          <label className="flex items-start sm:items-center gap-3">
            <input
              type="radio"
              name="accreditation"
              value="accredited"
              checked={formData.accreditation === "accredited"}
              onChange={(e) => handleInputChange("accreditation", e.target.value)}
              className="mt-1 sm:mt-0"
            />
            <span className="text-gray-700">I am an accredited investor</span>
          </label>

          <label className="flex items-start sm:items-center gap-3">
            <input
              type="radio"
              name="accreditation"
              value="not-accredited"
              checked={formData.accreditation === "not-accredited"}
              onChange={(e) => handleInputChange("accreditation", e.target.value)}
              className="mt-1 sm:mt-0"
            />
            <span className="text-gray-700">I am not an accredited investor</span>
          </label>
        </div>

        <div className="pt-2">
          <label className="flex items-start sm:items-center gap-3">
            <input
              type="checkbox"
              checked={formData.understandRequirements}
              onChange={(e) => handleInputChange("understandRequirements", e.target.checked)}
              className="mt-1 sm:mt-0"
            />
            <span className="text-gray-700">I understand I must meet regulatory requirements to lead syndicates</span>
          </label>
        </div>
      </div>

      {/* Sector Focus Section */}
      <div className="space-y-4">
        <h2 className="text-xl text-xl text-[#0A2A2E]">Sector Focus</h2>
        <div className="relative" ref={sectorDropdownRef}>
          <div 
            className="border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] cursor-pointer"
            onClick={() => setShowSectorDropdown(!showSectorDropdown)}
          >
            {formData.sectorFocus.length > 0 ? (
              formData.sectorFocus.map((sectorId) => (
                <span
                  key={sectorId}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getSectorName(sectorId)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectorRemove(sectorId);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Select sectors...</span>
            )}
            <svg 
              className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showSectorDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showSectorDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500">Loading sectors...</div>
              ) : getAvailableSectors().length > 0 ? (
                getAvailableSectors().map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => handleSectorAdd(sector.id)}
                    className="w-full text-left px-4 py-2 text-sm text-[#0A2A2E] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{sector.name}</div>
                    {sector.description && (
                      <div className="text-xs text-gray-500">{sector.description}</div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">All sectors selected</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Geography Focus Section */}
      <div className="space-y-4">
        <h2 className=" text-xl text-[#0A2A2E]">Geography Focus</h2>
        <div className="relative" ref={geographyDropdownRef}>
          <div 
            className="border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] cursor-pointer"
            onClick={() => setShowGeographyDropdown(!showGeographyDropdown)}
          >
            {formData.geographyFocus.length > 0 ? (
              formData.geographyFocus.map((geographyId) => (
                <span
                  key={geographyId}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getGeographyName(geographyId)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGeographyRemove(geographyId);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Select geographies...</span>
            )}
            <svg 
              className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showGeographyDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showGeographyDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500">Loading geographies...</div>
              ) : getAvailableGeographies().length > 0 ? (
                getAvailableGeographies().map((geography) => (
                  <button
                    key={geography.id}
                    onClick={() => handleGeographyAdd(geography.id)}
                    className="w-full text-left px-4 py-2 text-sm text-[#0A2A2E] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{geography.name}</div>
                    <div className="text-xs text-gray-500">{geography.region}</div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">All geographies selected</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Existing LP Network Section */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Existing LP Network</h2>
        <p className="text-gray-600">How many LPs do you have to invest in your deal?</p>
        
        <div className="border border-[#0A2A2E] rounded-lg p-3 w-full sm:max-w-xs bg-[#F4F6F5]">
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
                className="border border-[#0A2A2E] rounded-lg p-3 w-full sm:max-w-xs bg-[#F4F6F5]"
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
          <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <DontIcon />
            <p className="font-medium">Don't Worry, You Can Still Leverage Platform LPs To Raise Funds</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-200">
        <div />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={handleNext}
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? "Submitting..." : "Next"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadInfo;
