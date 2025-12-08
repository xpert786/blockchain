import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import logo from "/src/assets/img/logo.png";

import loginimg from "/src/assets/img/loginimg1.svg";
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";

const QuickProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: "",
    taxResidency: "",
    investorCategory: "individual",
  });
  const [countries, setCountries] = useState([
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "Singapore",
    "UAE",
    "India",
  ]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [showComplianceAlert, setShowComplianceAlert] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const restrictedCountries = ["Iran", "North Korea", "Syria"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // If country and taxResidency were same before change, keep them in sync
      const wereSame = prev.country === prev.taxResidency;
      const next = { ...prev, [name]: value };
      if (name === "country" && wereSame) next.taxResidency = value;
      return next;
    });

    // Show compliance alert for restricted jurisdictions
    if (name === "country") {
      setShowComplianceAlert(restrictedCountries.includes(value));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, investorCategory: category }));
    setOpenDropdown(null);
  };

  const handleCountrySelect = (country) => {
    setFormData((prev) => {
      const wereSame = prev.country === prev.taxResidency;
      const next = { ...prev, country };
      if (wereSame) next.taxResidency = country;
      return next;
    });
    setOpenDropdown(null);
    setShowComplianceAlert(restrictedCountries.includes(country));
  };

  const handleTaxResidencySelect = (residency) => {
    setFormData((prev) => ({ ...prev, taxResidency: residency }));
    setOpenDropdown(null);
  };

  const formatBackendError = (err) => {
    const backendData = err?.response?.data;
    if (backendData) {
      if (typeof backendData === "object" && (backendData.detail || backendData.error)) {
        return backendData.detail || backendData.error;
      }
      return typeof backendData === "object" ? JSON.stringify(backendData) : String(backendData);
    }
    return err.message || "An unknown error occurred.";
  };

  const showToast = (message, type = "info", duration = 4000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "info" }), duration);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Fetch country list and try to auto-detect user's country by IP
  useEffect(() => {
    (async () => {
      setLoadingCountries(true);
      try {
        // Fetch countries from restcountries (public API) using fields to reduce payload
        const resp = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2,flags");
        const names = resp.data
          .map((c) => c?.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        if (names && names.length) setCountries(names);
      } catch (err) {
        console.warn("Could not fetch countries list, using fallback list.", err);
      }

      try {
        // Try to detect user's country via IP
        const ipResp = await axios.get("https://ipapi.co/json/");
        const detected = ipResp.data?.country_name || ipResp.data?.country;
        if (detected) {
          setFormData((prev) => ({
            ...prev,
            country: detected,
            taxResidency: prev.taxResidency || detected,
          }));
        }
      } catch (err) {
        console.warn("Could not auto-detect country by IP:", err);
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  // Submit quick profile to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showComplianceAlert) {
      showToast("Cannot proceed: Your jurisdiction is not supported.", "error");
      return;
    }

    setSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/profile/quick-setup/`;
      const token = localStorage.getItem("accessToken");
      const payload = {
        country_of_residence: formData.country,
        tax_residency: formData.taxResidency,
        investor_type: (formData.investorCategory || "").toLowerCase(),
      };

      await axios.patch(finalUrl, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      showToast("Profile saved successfully.", "success");
      // After saving, if phone is not verified, send user to verify phone
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const statusUrl = `${API_URL.replace(/\/$/, "")}/api/registration-flow/get_registration_status/`;
        if (token) {
          const statusResp = await axios.get(statusUrl, { headers: { Authorization: `Bearer ${token}` } });
          const status = statusResp.data || null;
          if (status && status.phone_verified === false && status.email_verified === false) {
            // If neither email nor phone are verified, send user to verify phone
            navigate("/verify-phone");
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch registration status after quick profile save:', err);
      }
    } catch (err) {
      console.error("Error saving quick profile:", err);
      showToast(formatBackendError(err), "error");
    } finally {
      setSaving(false);
    }
  };

  

  const taxResidencies = [...countries, "Other"];

  const investorCategories = [
    { value: "individual", label: "Individual" },
    { value: "family_office", label: "Family Office" },
    { value: "corporate_vehicle", label: "Corporate Vehicle" },
    { value: "trust_foundation", label: "Trust / Foundation" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[650px] bg-white rounded-3xl overflow-visible">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full overflow-hidden">
          {/* Purple background and content layout */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col justify-between relative overflow-hidden p-8">
            
            {/* Logo/Branding (Top) */}
            <img src={logo} alt="Login Logo" className="w-1/3 max-w-[150px] h-auto object-contain" />
            
            {/* Main Text Content (Middle - Takes up remaining space) */}
            <div className="flex flex-col items-center justify-center flex-grow ">
                <h1 className="text-[30px] font-semibold text-white font-poppins-custom">Invest Globally. <br />
                Compliantly. Confidently.</h1>
                <p className="text-white font-poppins-custom leading-tight mr-16 mt-2">Built for global accredited investors and <br />
                syndicate leads.</p>
            </div>
            

            {/* Image Content (Bottom - MOVED HERE) */}
            <div className="flex justify-start items-end w-full space-x-3 mt-7">
              <img src={loginimg} alt="Login Asset 1" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg2} alt="Login Asset 2" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg3} alt="Login Asset 3" className="w-1/3 max-w-[50px] h-auto object-contain" />
            </div>
            
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6 overflow-visible relative z-10">
          <div className="w-full max-w-md relative">
            <div className="mb-8">
              <h1 className="text-3xl text-[#001D21] font-medium mb-2">Quick Profile Setup</h1>
              <p className="text-[#6B8A8D] font-poppins-custom text-sm">Tell us about yourself.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-40">
              {/* Country of Residence */}
              <div className="relative">
                <label htmlFor="country" className="block text-md font-normal text-[#001D21] font-poppins-custom mb-2">
                  Country of Residence
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('country')}
                    className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none text-[#0A2A2E] font-poppins-custom cursor-pointer flex items-center justify-between"
                  >
                    <span>{formData.country || (loadingCountries ? 'Detecting country...' : "Enter your Country")}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`}
                      fill="#0A2A2E" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === 'country' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      {countries.map((country, index) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full px-4 py-3 text-left font-poppins-custom transition-colors whitespace-normal ${
                            formData.country === country
                              ? 'bg-[#001D21] text-white font-medium'
                              : 'bg-white text-[#0A2A2E] hover:bg-[#F4F6F5]'
                          } ${index !== countries.length - 1 ? 'border-b border-[#E0E0E0]' : ''}`}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tax Residency */}
              <div className="relative">
                <label htmlFor="taxResidency" className="block text-md font-normal text-[#001D21] font-poppins-custom mb-2">
                  Tax Residency
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('taxResidency')}
                    className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none text-[#0A2A2E] font-poppins-custom cursor-pointer flex items-center justify-between"
                  >
                    <span>{formData.taxResidency || "Tax Residency"}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openDropdown === 'taxResidency' ? 'rotate-180' : ''}`}
                      fill="#0A2A2E" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === 'taxResidency' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      {taxResidencies.map((residency, index) => (
                        <button
                          key={residency}
                          type="button"
                          onClick={() => handleTaxResidencySelect(residency)}
                          className={`w-full px-4 py-3 text-left font-poppins-custom transition-colors whitespace-normal ${
                            formData.taxResidency === residency
                              ? 'bg-[#001D21] text-white font-medium'
                              : 'bg-white text-[#0A2A2E] hover:bg-[#F4F6F5]'
                          } ${index !== taxResidencies.length - 1 ? 'border-b border-[#E0E0E0]' : ''}`}
                        >
                          {residency}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Investor Category - Custom Dropdown */}
              <div className="relative">
                <label htmlFor="investorCategory" className="block text-md font-normal text-[#001D21] font-poppins-custom mb-2">
                  Investor Category
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('category')}
                    className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none text-black font-poppins-custom appearance-none cursor-pointer flex items-center justify-between"
                  >
                    <span>{investorCategories.find((c) => c.value === formData.investorCategory)?.label || 'Select Category'}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                      fill="black" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === 'category' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50">
                      {investorCategories.map((category, index) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => handleCategorySelect(category.value)}
                          className={`w-full px-4 py-3 text-left font-poppins-custom transition-colors whitespace-normal ${
                            formData.investorCategory === category.value
                              ? 'bg-[#001D21] text-white font-medium'
                              : 'bg-white text-[#0A2A2E] hover:bg-[#F4F6F5]'
                          } ${index !== investorCategories.length - 1 ? 'border-b border-[#E0E0E0]' : ''}`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Conditional Compliance Alert */}
              {showComplianceAlert && (
                <div className="bg-[#F8D7DA] border border-[#F5C2C7] rounded-lg p-4">
                  <h3 className="text-[#842029] font-semibold text-sm mb-1 font-poppins-custom">
                    Conditional Compliance Alert
                  </h3>
                  <p className="text-[#842029] text-sm font-poppins-custom">
                    Due to local regulations, we cannot support investments from your jurisdiction.
                  </p>
                </div>
              )}

              {/* Continue Button */}
              <button
                type="button"
                disabled={showComplianceAlert || saving}
                onClick={() => navigate('/jurisdiction')}
                className={`w-full py-3 px-4 rounded-lg font-semibold font-poppins-custom transition-colors duration-200 cursor-pointer ${
                  showComplianceAlert
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#00866B] text-white hover:bg-[#006B54]"
                }`}
              >
                {saving ? 'Saving...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Simple toast */}
      {toast.visible && (
        <div className={`fixed right-4 bottom-6 z-50 px-4 py-2 rounded shadow-lg ${toast.type === 'error' ? 'bg-red-600 text-white' : toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default QuickProfile;
