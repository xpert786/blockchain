import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  if (typeof range === "string") {
  switch (range) {
    case "1-10": return 10;
    case "11-25": return 25;
    case "26-50": return 50;
    case "51-100": return 100;
    case "100+": return 150;
    default: return 50;
  }
  }
  return 50;
};

const LeadInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    countryOfResidence: "",
    shortBio: "",
    linkedIn: "",
    email: "",
    currentRole: "",
    yearsOfExperience: "",
    typicalCheckSize: "",
    accreditation: "",
    understandRequirements: false,
    understandResponsibilities: false,
    sectorFocus: [],
    geographyFocus: [],
    existingLpNetwork: "No",
    lpBaseSize: 50,
    enablePlatformLpAccess: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [sectors, setSectors] = useState([]);
  const [geographies, setGeographies] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showGeographyDropdown, setShowGeographyDropdown] = useState(false);
  const sectorDropdownRef = useRef(null);
  const geographyDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAccreditationModal, setShowAccreditationModal] = useState(false);

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

  // Memoized helper functions
  const sectorOptions = sectors.filter(s => !formData.sectorFocus.includes(s.id));
  const geographyOptions = geographies.filter(g => !formData.geographyFocus.includes(g.id));
  const getSectorName = useCallback((id) => sectors.find(s => s.id === id)?.name ?? `Sector ${id}`, [sectors]);
  const getGeographyName = useCallback((id) => geographies.find(g => g.id === id)?.name ?? `Geography ${id}`, [geographies]);

  // Check if form should be disabled
  const isDisabled = formData.accreditation === "not-accredited";

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

  // === FETCH EXISTING DATA ===
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setLoadingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const url = (path) => `${API_URL.replace(/\/$/, "")}${path}`;

        // Parallel fetch sectors/geographies and step1 data
        let sgRes, step1Res;
        
        try {
          [sgRes, step1Res] = await Promise.all([
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
            }).catch(e => {
              if (e.response?.status === 404) {
                return null; // No existing data
              }
              throw e;
            })
          ]);
        } catch (err) {
          // If sectors/geographies fetch fails, try to continue with step1
          if (err.config?.url?.includes('sectors-geographies')) {
            console.warn("Failed to fetch sectors/geographies:", err);
            step1Res = await axios.get(url("/syndicate/step1/"), {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }).catch(e => e.response?.status === 404 ? null : null);
          } else {
            throw err;
          }
        }

        // Setup selector lists
        if (mounted && sgRes?.data) {
          const sectorsList = sgRes.data.sectors || [];
          const geographiesList = sgRes.data.geographies || [];
          setSectors(sectorsList);
          setGeographies(geographiesList);
        }

        // Get email from localStorage or user profile if not in step1
        let userEmail = "";
        try {
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          userEmail = userData.email || "";
          
          // If not in localStorage, try to fetch from profile
          if (!userEmail) {
            try {
              const profileRes = await axios.get(url("/profiles/"), {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

              if (profileRes.data?.results?.[0]?.email) {
                userEmail = profileRes.data.results[0].email;
              } else if (profileRes.data?.email) {
                userEmail = profileRes.data.email;
              }
            } catch (profileErr) {
              console.warn("Could not fetch email from profile:", profileErr);
            }
          }
        } catch (e) {
          console.warn("Could not get email from localStorage:", e);
        }

        // Prefill form data if exists
        if (step1Res && step1Res.status === 200 && step1Res.data) {
          const data = step1Res.data;
          console.log("Fetched step1 data:", data);
          
          if (mounted) {
            // Handle nested data structure if present
            const stepData = data.step_data || data;
            const profileData = data.profile || {};
            
            // Combine step_data and profile data, with step_data taking precedence
            const combinedData = {
              ...profileData,
              ...stepData,
              ...data // Top level data takes highest precedence
            };

            console.log("Combined data for form:", combinedData);
            console.log("User email from localStorage/profile:", userEmail);

            setFormData(prev => ({
              ...prev,
              fullName: combinedData.full_name || prev.fullName,
              shortBio: combinedData.short_bio || prev.shortBio,
              countryOfResidence: combinedData.country_of_residence || prev.countryOfResidence,
              email: combinedData.email || userEmail || prev.email,
              currentRole: combinedData.current_role_title || combinedData.current_role || prev.currentRole,
              yearsOfExperience: combinedData.years_of_experience || prev.yearsOfExperience,
              linkedIn: combinedData.linkedin_profile || combinedData.linkedin || prev.linkedIn,
              typicalCheckSize: combinedData.typical_check_size || prev.typicalCheckSize,
              accreditation: combinedData.is_accredited === "yes" || combinedData.is_accredited === true ? "accredited" : 
                            combinedData.is_accredited === "no" || combinedData.is_accredited === false ? "not-accredited" : prev.accreditation,
              understandRequirements: combinedData.understands_regulatory_requirements !== undefined ? combinedData.understands_regulatory_requirements : prev.understandRequirements,
              understandResponsibilities: combinedData.understands_regulatory_requirements !== undefined ? combinedData.understands_regulatory_requirements : prev.understandResponsibilities,
              sectorFocus: combinedData.sector_ids || (combinedData.sectors ? combinedData.sectors.map(s => s.id || s) : []) || prev.sectorFocus,
              geographyFocus: combinedData.geography_ids || (combinedData.geographies ? combinedData.geographies.map(g => g.id || g) : []) || prev.geographyFocus,
              existingLpNetwork: combinedData.existing_lp_count && combinedData.existing_lp_count !== "0" && combinedData.existing_lp_count !== 0 ? "Yes" : "No",
              lpBaseSize: combinedData.lp_base_size ? parseInt(combinedData.lp_base_size, 10) : 
                         (combinedData.existing_lp_count && combinedData.existing_lp_count !== "0" ? mapRangeToLpBaseSize(combinedData.existing_lp_count) : prev.lpBaseSize),
              enablePlatformLpAccess: combinedData.enable_platform_lp_access !== undefined ? combinedData.enable_platform_lp_access : prev.enablePlatformLpAccess
            }));
            
            console.log("Form data updated with email:", formData.email);
          }
        } else {
          // Even if no step1 data, set email from userData
          if (mounted && userEmail) {
            setFormData(prev => ({
              ...prev,
              email: userEmail
            }));
            console.log("Set email from userData/profile:", userEmail);
          }
          console.log("No existing step1 data found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        console.error("Error details:", err.response?.data);
        if (mounted) {
          // Don't show error if it's just 404 (no existing data)
          if (err.response?.status !== 404) {
            setError("Failed to load data. Please refresh the page.");
          }
        }
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  // === FORM SUBMIT ===
  const handleNext = async () => {
    setError("");
    
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.fullName) return setError("Please enter your full name.");
      if (!formData.countryOfResidence) return setError("Please select your country of residence.");
      if (!formData.email) return setError("Please enter your email.");
      if (!formData.currentRole) return setError("Please enter your current role/title.");
    if (!formData.accreditation) return setError("Please select your accreditation status.");
    if (!formData.understandRequirements) return setError("You must acknowledge that you understand the regulatory requirements.");
      if (!formData.understandResponsibilities) return setError("You must acknowledge the syndicate lead responsibilities.");
      if (isDisabled) return setError("Only accredited investors can launch a syndicate.");
      
      // Move to step 2
      setCurrentStep(2);
    } else {
      // Validate step 2
    if (!formData.sectorFocus.length) return setError("Please select at least one sector focus.");
    if (!formData.geographyFocus.length) return setError("Please select at least one geography focus.");

      // Submit data to API
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("You must be logged in to continue. Please log in again.");
        navigate("/login");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const url = `${API_URL.replace(/\/$/, "")}/syndicate/step1/`;

        // Map form data to API payload format
      const payload = {
          full_name: formData.fullName,
          short_bio: formData.shortBio,
          country_of_residence: formData.countryOfResidence,
          current_role_title: formData.currentRole,
          years_of_experience: formData.yearsOfExperience,
          linkedin_profile: formData.linkedIn,
          typical_check_size: formData.typicalCheckSize,
        is_accredited: formData.accreditation === "accredited" ? "yes" : "no",
        understands_regulatory_requirements: formData.understandRequirements,
        sector_ids: formData.sectorFocus,
        geography_ids: formData.geographyFocus,
        existing_lp_count: formData.existingLpNetwork === "Yes" ? mapLpBaseSizeToRange(formData.lpBaseSize) : "0",
          lp_base_size: formData.existingLpNetwork === "Yes" ? formData.lpBaseSize.toString() : undefined,
        enable_platform_lp_access: formData.existingLpNetwork === "Yes" ? formData.enablePlatformLpAccess : false
      };

        await axios.patch(url, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Navigate to next page after successful submission
      navigate("/syndicate-creation/entity-profile");
    } catch (err) {
        console.error("Error submitting step1 data:", err);
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
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setError("");
    }
  };

  // === JSX ===
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl text-[#001D21] mb-2">Step 1: Lead Info</h1>
        <p className="text-gray-600">
          {currentStep === 1 
            ? "Personal and jurisdiction details." 
            : "Define your investment focus and LP network preferences."}
        </p>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Step 1: Personal Details and Accreditation */}
      {currentStep === 1 && (
        <>

      {/* Personal and Jurisdiction Details - Two Column Layout */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Personal and Jurisdiction Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => handleInputChange("fullName", e.target.value)}
                placeholder="Enter Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
              <div className="relative">
                <select
                  value={formData.countryOfResidence}
                  onChange={e => handleInputChange("countryOfResidence", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors appearance-none pr-10"
                >
                  <option value="">Select</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="SG">Singapore</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="HK">Hong Kong</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="Other">Other</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
              <input
                type="text"
                value={formData.shortBio}
                onChange={e => handleInputChange("shortBio", e.target.value)}
                placeholder="Enter Bio"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn (optional)</label>
              <input
                type="text"
                value={formData.linkedIn}
                onChange={e => handleInputChange("linkedIn", e.target.value)}
                placeholder="Enter LinkedIn URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                placeholder="Enter Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Role / Title</label>
              <input
                type="text"
                value={formData.currentRole}
                onChange={e => handleInputChange("currentRole", e.target.value)}
                placeholder="Enter Role"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Investing Experience</label>
              <div className="relative">
                <select
                  value={formData.yearsOfExperience}
                  onChange={e => handleInputChange("yearsOfExperience", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors appearance-none pr-10"
                >
                  <option value="">Select</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typical Check Size (optional)</label>
              <div className="relative">
                <select
                  value={formData.typicalCheckSize}
                  onChange={e => handleInputChange("typicalCheckSize", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F4F6F5] outline-none focus:border-[#00F0C3] transition-colors appearance-none pr-10"
                >
                  <option value="">Select</option>
                  <option value="<10k">Less than $10k</option>
                  <option value="10k-50k">$10k - $50k</option>
                  <option value="50k-100k">$50k - $100k</option>
                  <option value="100k-250k">$100k - $250k</option>
                  <option value="250k-500k">$250k - $500k</option>
                  <option value="500k-1m">$500k - $1M</option>
                  <option value="1m+">$1M+</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accreditation Section with KYC */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Accreditation*</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">KYC Status:</span>
          <button
            type="button"
            className="bg-[#00F0C3] hover:bg-teal-600 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Start Verification
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
       
       
      
      </div>

      {/* Syndicate Lead Responsibilities */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Syndicate Lead Responsibilities</h2>
        <div className="bg-[#F9F8FF] border-1 border-[#E2E2FB] rounded-lg p-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-800 mb-3">To maintain global compliance and protect investor eligibility:</p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Unlocksley SPVs are private offerings intended for accredited or otherwise qualified investors.</li>
              <li>• Syndicate Leads must not publicly advertise, mass solicit, or share confidential deal information outside the platform.</li>
              <li>• Investor access must be limited to LPs who have been approved on Unlocksley.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-3">I confirm that as a Syndicate Lead, I will:</p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Invite only accredited or otherwise qualified investors into my syndicate;</li>
              <li>• Avoid public advertising, mass marketing, or general solicitation of deals;</li>
              <li>• Share deal materials only with approved LPs inside Unlocksley;</li>
              <li>• Ensure all LPs are eligible to invest based on their jurisdiction;</li>
              <li>• Provide accurate information during syndicate formation.</li>
            </ul>
          </div>
        </div>
        <div className="pt-2">
          <label className="flex items-start sm:items-center gap-3">
            <input
              type="checkbox"
              checked={formData.understandResponsibilities}
              onChange={e => handleInputChange("understandResponsibilities", e.target.checked)}
              className="mt-1 sm:mt-0"
            />
            <span className="text-gray-700">
              I acknowledge the syndicate lead responsibilities
            </span>
          </label>
        </div>
      </div>

      <div className={`space-y-4 ${isDisabled ? 'bg-[#F4F6F5] border-1 border-[#000000] p-6 rounded-lg' : ''}`}>
        <h2 className="text-xl text-[#0A2A2E]">Accreditation*</h2>
      
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
        </>
      )}

      {/* Step 2: Investment Focus and LP Network */}
      {currentStep === 2 && (
        <>
      {/* Sector Focus */}
          <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Sector Focus</h2>
        <div className="relative" ref={sectorDropdownRef}>
          <div
                className="border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] cursor-pointer"
                onClick={() => setShowSectorDropdown(s => !s)}
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
                  {sectorOptions.length > 0 ? (
                sectorOptions.map(sector => (
                  <button
                    type="button"
                    key={sector.id}
                    onClick={() => handleSectorAdd(sector.id)}
                    className="w-full text-left px-4 py-2 text-sm text-[#0A2A2E] hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{sector.name}</div>
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
          <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Geography Focus</h2>
        <div className="relative" ref={geographyDropdownRef}>
          <div
                className="border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] cursor-pointer"
                onClick={() => setShowGeographyDropdown(g => !g)}
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
                  {geographyOptions.length > 0 ? (
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
          <div className="space-y-4">
        <h2 className="text-xl text-[#0A2A2E]">Existing LP Network</h2>
            <p className="text-gray-600">How many LPs do you have to invest in your deals?</p>
        <div className="border border-[#0A2A2E] rounded-lg p-3 w-full sm:max-w-xs bg-[#F4F6F5]">
          <select
            value={formData.existingLpNetwork}
            onChange={e => handleInputChange("existingLpNetwork", e.target.value)}
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
                className="form-checkbox h-5 w-5 text-purple-600 rounded"
              />
              <label
                htmlFor="enablePlatformLpAccess"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enable Platform LP Access
              </label>
            </div>
          </div>
        )}
          </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-gray-50 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
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
        </>
      )}

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
