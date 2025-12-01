import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DontIcon } from "../../components/Icons";
import accreditationRules from "../../data/accreditation_rules.json";

// Utility functions
const mapLpBaseSizeToRange = (size) => {
  if (size <= 10) return "1-10";
  if (size <= 25) return "11-25";
  if (size <= 50) return "26-50";
  if (size <= 100) return "51-100";
  return "100+";
};

const mapRangeToLpBaseSize = (range) => {
  switch (range) {
    case "1-10": return 10;
    case "11-25": return 25;
    case "26-50": return 50;
    case "51-100": return 100;
    case "100+": return 150;
    default: return 50;
  }
};

const getIdArray = arr => Array.isArray(arr) ? arr.map(x => x.id).filter(Boolean) : [];

const LeadInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accreditation: "",
    understandRequirements: false,
    sectorFocus: [],
    geographyFocus: [],
    existingLpNetwork: "No",
    lpBaseSize: 50,
    enablePlatformLpAccess: false
  });

  const [sectors, setSectors] = useState([]);
  const [geographies, setGeographies] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showGeographyDropdown, setShowGeographyDropdown] = useState(false);
  const sectorDropdownRef = useRef(null);
  const geographyDropdownRef = useRef(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [showAccreditationModal, setShowAccreditationModal] = useState(false);
  const [userResidence, setUserResidence] = useState(null);

  // === LOAD DATA ===
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("You must be logged in to continue.");
          return;
        }
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const url = (path) => `${API_URL.replace(/\/$/, "")}${path}`;

        // Parallel fetch sectors/geographies and prefill step1 data
        const [sgRes, step1Res] = await Promise.all([
          axios.get(url("/syndicate/sectors-geographies/"), {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }),
          axios.get(url("/syndicate/step1/"), {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }).catch(e => e.response?.status === 404 ? null : Promise.reject(e))
        ]);

        // Setup selector lists
        const sectorsList = sgRes?.data?.sectors || [];
        const geographiesList = sgRes?.data?.geographies || [];
        if (mounted) {
          setSectors(sectorsList);
          setGeographies(geographiesList);
        }

        if (step1Res && step1Res.status === 200 && step1Res.data) {
          const { step_data = {}, profile = {} } = step1Res.data;
          const accreditation = (step_data.is_accredited || profile.is_accredited) === "yes" || (step_data.is_accredited || profile.is_accredited) === true ? "accredited"
            : (step_data.is_accredited || profile.is_accredited) === "no" || (step_data.is_accredited || profile.is_accredited) === false ? "not-accredited"
            : "";
          const understandRequirements = !!(step_data.understands_regulatory_requirements || profile.understands_regulatory_requirements);
          const lpCount = step_data.existing_lp_count || profile.existing_lp_count;
          const isLpNetworkYes = lpCount && lpCount !== "0" && lpCount !== 0;
          const sectorIds = getIdArray(profile.sectors);
          const geographyIds = getIdArray(profile.geographies);
          const enablePlatformLpAccess = !!(step_data.enable_platform_lp_access || profile.enable_platform_lp_access);

          setHasExistingData(true);
          setFormData({
            accreditation,
            understandRequirements,
            sectorFocus: sectorIds,
            geographyFocus: geographyIds,
            existingLpNetwork: isLpNetworkYes ? "Yes" : "No",
            lpBaseSize: isLpNetworkYes && lpCount ? mapRangeToLpBaseSize(lpCount) : 50,
            enablePlatformLpAccess
          });
        } else {
          setHasExistingData(false);
          setFormData(prev => ({
            ...prev,
            sectorFocus: [],
            geographyFocus: []
          }));
        }
      } catch (err) {
        setError("Failed to load sectors and geographies. Please refresh the page.");
      } finally {
        if (mounted) setLoadingData(false);
      }
    };
    fetchData();
    return () => { mounted = false; }
  }, []);

  // === OUTSIDE CLICK HANDLERS FOR DROPDOWNS ===
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === GENERAL HANDLERS ===
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSectorAdd = useCallback((sectorId) => {
    setFormData(prev => prev.sectorFocus.includes(sectorId) ? prev : {
      ...prev,
      sectorFocus: [...prev.sectorFocus, sectorId]
    });
    setShowSectorDropdown(false);
  }, []);

  const handleSectorRemove = useCallback((sectorId) => {
    setFormData(prev => ({
      ...prev,
      sectorFocus: prev.sectorFocus.filter(id => id !== sectorId)
    }));
  }, []);

  const handleGeographyAdd = useCallback((geographyId) => {
    setFormData(prev => prev.geographyFocus.includes(geographyId) ? prev : {
      ...prev,
      geographyFocus: [...prev.geographyFocus, geographyId]
    });
    setShowGeographyDropdown(false);
  }, []);

  const handleGeographyRemove = useCallback((geographyId) => {
    setFormData(prev => ({
      ...prev,
      geographyFocus: prev.geographyFocus.filter(id => id !== geographyId)
    }));
  }, []);

  // Memoized helper functions for efficiency
  const sectorOptions = sectors.filter(s => !formData.sectorFocus.includes(s.id));
  const geographyOptions = geographies.filter(g => !formData.geographyFocus.includes(g.id));
  const getSectorName = useCallback((id) => sectors.find(s => s.id === id)?.name ?? `Sector ${id}`, [sectors]);
  const getGeographyName = useCallback((id) => geographies.find(g => g.id === id)?.name ?? `Geography ${id}`, [geographies]);

  // Check if form should be disabled
  const isDisabled = formData.accreditation === "not-accredited";

  // Close dropdowns when form is disabled
  useEffect(() => {
    if (isDisabled) {
      setShowSectorDropdown(false);
      setShowGeographyDropdown(false);
    }
  }, [isDisabled]);

  // Map country name to accreditation rule code
  const mapCountryToCode = (countryName) => {
    if (!countryName) return "default";
    
    const countryLower = countryName.toLowerCase();
    
    // Map common country names to codes
    if (countryLower.includes("united states") || countryLower === "us" || countryLower === "usa") {
      return "us";
    } else if (countryLower.includes("united kingdom") || countryLower === "uk" || countryLower.includes("britain")) {
      return "uk";
    } else if (countryLower.includes("singapore") || countryLower === "sg") {
      return "sg";
    } else if (countryLower.includes("uae") || countryLower.includes("united arab emirates")) {
      return "uae";
    } else if (countryLower.includes("hong kong") || countryLower === "hk") {
      return "hk";
    } else if (countryLower.includes("australia") || countryLower === "au") {
      return "au";
    } else if (countryLower.includes("european union") || countryLower === "eu" || 
               countryLower.includes("germany") || countryLower.includes("france") || 
               countryLower.includes("spain") || countryLower.includes("italy") ||
               countryLower.includes("netherlands") || countryLower.includes("belgium")) {
      return "eu";
    }
    
    return "default";
  };

  // Get accreditation rules based on user residence
  const getAccreditationRules = () => {
    const code = userResidence ? mapCountryToCode(userResidence) : "default";
    return accreditationRules[code] || accreditationRules.default;
  };

  // Fetch user profile to get tax residence
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const profileUrl = `${API_URL.replace(/\/$/, "")}/profiles/`;

        const response = await axios.get(profileUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data && response.data.results && response.data.results.length > 0) {
          const profileData = response.data.results[0];
          if (profileData.legal_place_of_residence) {
            setUserResidence(profileData.legal_place_of_residence);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        // If profile fetch fails, use default rules
      }
    };

    fetchUserProfile();
  }, []);

  // === FORM SUBMIT ===
  const handleNext = async () => {
    setError("");
    // Fast validation
    if (!formData.accreditation) return setError("Please select your accreditation status.");
    if (!formData.understandRequirements) return setError("You must acknowledge that you understand the regulatory requirements.");
    if (!formData.sectorFocus.length) return setError("Please select at least one sector focus.");
    if (!formData.geographyFocus.length) return setError("Please select at least one geography focus.");

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("You must be logged in to continue. Please log in again.");
        navigate("/login");
        return;
      }
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step1/`;
      const payload = {
        is_accredited: formData.accreditation === "accredited" ? "yes" : "no",
        understands_regulatory_requirements: formData.understandRequirements,
        sector_ids: formData.sectorFocus,
        geography_ids: formData.geographyFocus,
        existing_lp_count: formData.existingLpNetwork === "Yes" ? mapLpBaseSizeToRange(formData.lpBaseSize) : "0",
        enable_platform_lp_access: formData.existingLpNetwork === "Yes" ? formData.enablePlatformLpAccess : false
      };

      let response;
      if (hasExistingData) {
        response = await axios.patch(finalUrl, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } else {
        response = await axios.post(finalUrl, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setHasExistingData(true);
      }
      navigate("/syndicate-creation/entity-profile");
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        setError(
          typeof backendData === "object"
            ? backendData.message || backendData.error || JSON.stringify(backendData)
            : String(backendData)
        );
      } else {
        setError(err.message || "Failed to submit lead information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // === JSX ===
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl text-[#001D21] mb-2">Step 1: Lead Info</h1>
        <p className="text-gray-600">Personal and investment focus information.</p>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Accreditation */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Accreditation</h2>
        <p className="text-gray-600">
          To be a syndicate, you must be a{" "}
          <button
            type="button"
            onClick={() => setShowAccreditationModal(true)}
            className="text-purple-400 font-semibold hover:text-purple-500 underline cursor-pointer"
          >
            Accredited Investor
          </button>
        </p>
        <div className="space-y-3">
          {["accredited", "not-accredited"].map((val) => (
            <label key={val} className="flex items-start sm:items-center gap-3">
              <input
                type="radio"
                name="accreditation"
                value={val}
                checked={formData.accreditation === val}
                onChange={e => handleInputChange("accreditation", e.target.value)}
                className="mt-1 sm:mt-0"
              />
              <span className="text-gray-700">
                I am{val === "not-accredited" ? " not" : ""} an accredited investor
              </span>
            </label>
          ))}
        </div>
        <div className="pt-2">
          <label className={`flex items-start sm:items-center gap-3 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="checkbox"
              checked={formData.understandRequirements}
              onChange={e => handleInputChange("understandRequirements", e.target.checked)}
              disabled={isDisabled}
              className="mt-1 sm:mt-0"
            />
            <span className="text-gray-700">
              I understand I must meet regulatory requirements to lead syndicates
            </span>
          </label>
        </div>
        {isDisabled && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            Only accredited investors can launch a syndicate on Unlocksley
          </div>
        )}
      </div>

      {/* Sector Focus */}
      <div className={`space-y-4 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-xl text-[#0A2A2E]">Sector Focus</h2>
        <div className="relative" ref={sectorDropdownRef}>
          <div
            className={`border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !isDisabled && setShowSectorDropdown(s => !s)}
          >
            {formData.sectorFocus.length > 0 ? formData.sectorFocus.map((sectorId) => (
              <span
                key={sectorId}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                onClick={e => e.stopPropagation()}
              >
                {getSectorName(sectorId)}
                <button
                  onClick={e => { e.stopPropagation(); handleSectorRemove(sectorId); }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Remove sector"
                  tabIndex={-1}
                  type="button"
                >×</button>
              </span>
            )) : (
              <span className="text-gray-400 text-sm">Select sectors...</span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showSectorDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showSectorDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500">Loading sectors...</div>
              ) : sectorOptions.length > 0 ? (
                sectorOptions.map(sector => (
                  <button
                    type="button"
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

      {/* Geography Focus */}
      <div className={`space-y-4 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-xl text-[#0A2A2E]">Geography Focus</h2>
        <div className="relative" ref={geographyDropdownRef}>
          <div
            className={`border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !isDisabled && setShowGeographyDropdown(g => !g)}
          >
            {formData.geographyFocus.length > 0 ? formData.geographyFocus.map((geographyId) => (
              <span
                key={geographyId}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                onClick={e => e.stopPropagation()}
              >
                {getGeographyName(geographyId)}
                <button
                  onClick={e => { e.stopPropagation(); handleGeographyRemove(geographyId); }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Remove geography"
                  tabIndex={-1}
                  type="button"
                >×</button>
              </span>
            )) : (
              <span className="text-gray-400 text-sm">Select geographies...</span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showGeographyDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showGeographyDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500">Loading geographies...</div>
              ) : geographyOptions.length > 0 ? (
                geographyOptions.map(geography => (
                  <button
                    type="button"
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
      <div className={`space-y-4 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-xl text-[#0A2A2E]">Existing LP Network</h2>
        <p className="text-gray-600">How many LPs do you have to invest in your deal?</p>
        <div className="border border-[#0A2A2E] rounded-lg p-3 w-full sm:max-w-xs bg-[#F4F6F5]">
          <select
            value={formData.existingLpNetwork}
            onChange={e => handleInputChange("existingLpNetwork", e.target.value)}
            disabled={isDisabled}
            className="w-full bg-transparent outline-none"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        {formData.existingLpNetwork === "Yes" && (
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LP Base Size</label>
              <input
                type="number"
                value={formData.lpBaseSize}
                onChange={e => handleInputChange("lpBaseSize", parseInt(e.target.value, 10) || 0)}
                disabled={isDisabled}
                className="border border-[#0A2A2E] rounded-lg p-3 w-full sm:max-w-xs bg-[#F4F6F5]"
                placeholder="Enter LP base size"
                min={1}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enablePlatformLpAccess"
                checked={formData.enablePlatformLpAccess}
                onChange={e => handleInputChange("enablePlatformLpAccess", e.target.checked)}
                disabled={isDisabled}
                className="form-checkbox h-5 w-5 text-purple-600 rounded"
              />
              <label
                htmlFor="enablePlatformLpAccess"
                className="text-sm font-medium text-gray-700 flex items-center gap-2 relative group"
              >
                Enable Platform LP Access
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
            disabled={loading || isDisabled}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? "Submitting..." : "Next"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Accreditation Rules Modal */}
      {showAccreditationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAccreditationModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0A2A2E]">Accreditation Rules</h2>
              <button
                type="button"
                onClick={() => setShowAccreditationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {(() => {
                const rules = getAccreditationRules();
                return (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-[#0A2A2E] mb-2">{rules.label}</h3>
                      <p className="text-sm text-gray-500 mb-4">{rules.jurisdiction}</p>
                      <p className="text-gray-700 mb-6">{rules.user_facing_summary}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-[#0A2A2E] mb-3">Natural Person Rules</h4>
                      <ul className="space-y-2">
                        {rules.natural_person_rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span className="text-gray-700">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-[#0A2A2E] mb-3">Entity Rules</h4>
                      <ul className="space-y-2">
                        {rules.entity_rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span className="text-gray-700">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rules.references && rules.references.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-[#0A2A2E] mb-3">References</h4>
                        <ul className="space-y-2">
                          {rules.references.map((ref, index) => (
                            <li key={index}>
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-500 hover:text-purple-600 underline"
                              >
                                {ref.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {rules.notes && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 italic">{rules.notes}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAccreditationModal(false)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadInfo;
