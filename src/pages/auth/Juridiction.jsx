import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import logo from "/src/assets/img/logo.png";
import createaccount from "/src/assets/img/createaccount.svg";

import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";
import bgLogo from "/src/assets/img/bg-logo.svg";
import accreditationRules from "../../data/accreditation_rules.json";

const Juridiction = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Role selected:", selectedRole);
    
    // Save role to localStorage for SignUp page
    localStorage.setItem("tempUserData", JSON.stringify({
      role: selectedRole
    }));
    
    // Navigate to signup page
    navigate("/signup");
  };

  // Accreditation check state
  const [detectedCountry, setDetectedCountry] = useState("");
  const [jurisdictionCode, setJurisdictionCode] = useState("default");
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitMode, setSubmitMode] = useState("complete"); // 'complete' or 'partial'

  useEffect(() => {
    // Fetch investor profile ID and quick profile data
    (async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Get investor_id from /api/investor-progress/ endpoint
        try {
          const progressResp = await axios.get(`${API_URL.replace(/\/$/, "")}/investor-progress/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Get investor_id from response
          if (progressResp.data?.investor_id) {
            setProfileId(progressResp.data.investor_id);
            console.log("✅ Found investor_id from investor-progress:", progressResp.data.investor_id);
          } else {
            console.warn("⚠️ No investor_id found in investor-progress response");
          }
        } catch (progressErr) {
          console.warn("Could not fetch investor progress:", progressErr?.message || progressErr);
        }

        // Attempt to fetch quick profile to determine country
        try {
          const resp = await axios.get(`${API_URL.replace(/\/$/, "")}/profile/quick-setup/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const country = resp.data?.country_of_residence || resp.data?.country || "";
          if (country) {
            setDetectedCountry(country);
            const code = mapCountryToJurisdiction(country);
            setJurisdictionCode(code);
            const ruleSet = accreditationRules[code] || accreditationRules["default"];
            setRules(ruleSet?.natural_person_rules || []);
          }
        } catch (err) {
          console.warn("Could not fetch quick profile for jurisdiction detection:", err?.message || err);
        }
      } catch (err) {
        console.warn("Error in useEffect:", err?.message || err);
      }
    })();
  }, []);

  const mapCountryToJurisdiction = (countryName) => {
    if (!countryName) return "default";
    const name = countryName.toLowerCase();
    if (name.includes("united states") || name === "usa" || name === "us") return "us";
    if (name.includes("singapore") || name === "sg") return "sg";
    if (name.includes("united kingdom") || name.includes("uk") || name.includes("britain") || name.includes("england")) return "uk";
    if (name.includes("hong kong")) return "hk";
    if (name.includes("australia")) return "au";
    if (name.includes("uae") || name.includes("united arab emirates")) return "uae";
    if (name.includes("india")) return "in";
    // fallback to default
    return "default";
  };

  const toggleRule = (rule) => {
    setSelectedRules((prev) => {
      if (prev.includes(rule)) return prev.filter((r) => r !== rule);
      return [...prev, rule];
    });
  };

  const handleAccreditationSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setError("No access token found. Please login again.");
        setSaving(false);
        return;
      }

      // Get investor_id if not already set
      let currentProfileId = profileId;
      if (!currentProfileId) {
        try {
          const progressResp = await axios.get(`${API_URL.replace(/\/$/, "")}/investor-progress/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (progressResp.data?.investor_id) {
            currentProfileId = progressResp.data.investor_id;
            setProfileId(currentProfileId);
            console.log("✅ Found investor_id from investor-progress:", currentProfileId);
          } else {
            setError("No investor profile found. Please complete your profile setup first.");
            setSaving(false);
            return;
          }
        } catch (progressErr) {
          console.error("Could not fetch investor progress:", progressErr);
          setError("Could not find your investor profile. Please try again or contact support.");
          setSaving(false);
          return;
        }
      }

      const url = `${API_URL.replace(/\/$/, "")}/profiles/${currentProfileId}/accreditation_check/`;
      console.log("📋 Submitting accreditation check to:", url);
      console.log("📋 Profile ID:", currentProfileId);

      // Build payload depending on submitMode
      let payload = { accreditation_jurisdiction: jurisdictionCode };
      if (submitMode === "complete") {
        payload = {
          accreditation_jurisdiction: jurisdictionCode,
          accreditation_rules_selected: selectedRules,
          accreditation_check_completed: true,
        };
      }

      console.log("📋 Payload:", payload);

      // Use PATCH only. If server returns any error, show it to the user.
      await axios.patch(url, payload, { 
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        } 
      });
      
      setSuccess("Accreditation check updated.");
      // navigate to Terms of Service after successful submission
      navigate("/terms-of-service");
    } catch (patchErr) {
      console.error("PATCH failed for accreditation check:", patchErr);
      console.error("Error response:", patchErr.response);
      // Surface backend response body where available
      const backendBody = patchErr?.response?.data;
      const status = patchErr?.response?.status;
      let message = patchErr?.message || String(patchErr);
      if (backendBody) {
        if (typeof backendBody === "object") {
          message = backendBody.detail || backendBody.error || JSON.stringify(backendBody);
        } else {
          message = String(backendBody);
        }
      }
      if (status) message = `(${status}) ${message}`;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full">
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
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6 ">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] text-semibold mb-2">Jurisdiction-Aware Accreditation
Check </h1>
                <p className="text-sm text-gray-700">Detected country: <strong>{detectedCountry || 'Not detected'}</strong></p>
                <p className="text-sm text-gray-700">Jurisdiction: <strong>{(accreditationRules[jurisdictionCode]?.jurisdiction) || accreditationRules['default'].jurisdiction}</strong></p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAccreditationSubmit(); }} className="space-y-6">

              {/* Accreditation check section (auto-detected jurisdiction) */}
              <div className="bg-gray-50 p-4 rounded-lg border">
              

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select the rules that apply to you</label>
                  {rules && rules.length ? (
                    rules.map((r, idx) => (
                      <label key={idx} className="flex items-start gap-2 mb-2">
                        <input type="checkbox" checked={selectedRules.includes(r)} onChange={() => toggleRule(r)} className="mt-1" />
                        <span className="text-sm text-gray-800">{r}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No jurisdiction-specific rules available; using default rules.</p>
                  )}

                  <div className="mt-3 w-full text-center h-8 bg-[#F4F6F5] border-1 border-[#0A2A2E] rounded-lg flex items-center justify-center">
                    <p className="text-[#748A91] text-sm font-thin">
                        You may be asked to upload documentation before investing.
                    </p>
                  </div>

                  {error && <div className="text-red-600 text-sm mt-2">{JSON.stringify(error)}</div>}
                </div>
              </div>

           
             <div className="mt-4">
                
                <button type="submit" disabled={saving || (submitMode === 'complete' && selectedRules.length === 0)} className="bg-[#0A3A38] text-white px-4 py-2 rounded w-full">
                  {saving ? 'Submitting...' : (submitMode === 'complete' ? 'Submit Accreditation Check' : 'Submit Jurisdiction Only')}
                </button>
             </div>
              
            </form>

                                
          </div>
        </div>
      </div>
    </div>
  );
};

export default Juridiction;
