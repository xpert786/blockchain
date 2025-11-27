import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";

const AcceptAgreements = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Accept Agreements");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSubStep, setCurrentSubStep] = useState(4); // 4 or 5
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [existingProofFile, setExistingProofFile] = useState(null);
  const [formData, setFormData] = useState({
    proofFile: null,
    isAccredited: "yes",
    meetsThresholds: "yes",
    termsAccepted: false,
    riskAccepted: false,
    privacyAccepted: false,
    allAccepted: false,
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange("proofFile", file);
    }
  };

  const handleRemoveFile = () => {
    handleInputChange("proofFile", null);
  };

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("No access token found, skipping profile fetch");
          setFetching(false);
          return;
        }

        // Get API URL from environment variable
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/`;

        console.log("Fetching profile data from:", finalUrl);

        // Make GET request to fetch profile
        const response = await axios.get(finalUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Profile data fetched:", response.data);
        console.log("Full response structure:", JSON.stringify(response.data, null, 2));

        // Check if profile data exists - API returns paginated response with results array
        if (response.data && response.data.results && response.data.results.length > 0) {
          const profileData = response.data.results[0]; // Get first profile from results array
          setProfileId(profileData.id); // Store profile ID for PATCH request

          console.log("Profile data to populate:", profileData);
          console.log("Available fields in profileData:", Object.keys(profileData));
          console.log("Full profile data:", JSON.stringify(profileData, null, 2));

          // Check if proof_of_income_net_worth exists
          if (profileData.proof_of_income_net_worth) {
            const proofFileUrl = profileData.proof_of_income_net_worth;
            setExistingProofFile(proofFileUrl);
            console.log("Existing proof of income/net worth found:", proofFileUrl);
          } else {
            console.log("No existing proof of income/net worth found in profile data");
            setExistingProofFile(null);
          }

          // Only update form data if we have actual values from API
          const updates = {};
          
          // Helper function to convert various boolean formats to boolean
          const toBoolean = (value) => {
            if (value === true || value === "true" || value === 1 || value === "1") return true;
            if (value === false || value === "false" || value === 0 || value === "0") return false;
            return undefined;
          };
          
          // Map API boolean values to form checkboxes
          // Check multiple possible field name variations
          const termsValue = profileData.terms_and_conditions_accepted !== undefined 
            ? profileData.terms_and_conditions_accepted 
            : profileData.termsAccepted !== undefined 
            ? profileData.termsAccepted 
            : undefined;
          
          const riskValue = profileData.risk_disclosure_accepted !== undefined 
            ? profileData.risk_disclosure_accepted 
            : profileData.riskAccepted !== undefined 
            ? profileData.riskAccepted 
            : undefined;
          
          const privacyValue = profileData.privacy_policy_accepted !== undefined 
            ? profileData.privacy_policy_accepted 
            : profileData.privacyAccepted !== undefined 
            ? profileData.privacyAccepted 
            : undefined;
          
          const confirmationValue = profileData.confirmation_of_true_information !== undefined 
            ? profileData.confirmation_of_true_information 
            : profileData.allAccepted !== undefined 
            ? profileData.allAccepted 
            : profileData.confirmationAccepted !== undefined
            ? profileData.confirmationAccepted
            : undefined;

          // Map is_accredited_investor and meets_local_investment_thresholds for step 4
          const isAccreditedValue = profileData.is_accredited_investor !== undefined 
            ? profileData.is_accredited_investor 
            : undefined;
          
          const meetsThresholdsValue = profileData.meets_local_investment_thresholds !== undefined 
            ? profileData.meets_local_investment_thresholds 
            : undefined;

          console.log("Raw values from API:");
          console.log("is_accredited_investor:", isAccreditedValue, "Type:", typeof isAccreditedValue);
          console.log("meets_local_investment_thresholds:", meetsThresholdsValue, "Type:", typeof meetsThresholdsValue);
          console.log("terms_and_conditions_accepted:", termsValue, "Type:", typeof termsValue);
          console.log("risk_disclosure_accepted:", riskValue, "Type:", typeof riskValue);
          console.log("privacy_policy_accepted:", privacyValue, "Type:", typeof privacyValue);
          console.log("confirmation_of_true_information:", confirmationValue, "Type:", typeof confirmationValue);

          // Map is_accredited_investor to isAccredited ("yes" or "no")
          if (isAccreditedValue !== undefined) {
            const boolValue = toBoolean(isAccreditedValue);
            if (boolValue !== undefined) {
              updates.isAccredited = boolValue ? "yes" : "no";
              console.log("Mapped is_accredited_investor:", isAccreditedValue, "→ isAccredited:", updates.isAccredited);
            }
          }

          // Map meets_local_investment_thresholds to meetsThresholds ("yes" or "no")
          if (meetsThresholdsValue !== undefined) {
            const boolValue = toBoolean(meetsThresholdsValue);
            if (boolValue !== undefined) {
              updates.meetsThresholds = boolValue ? "yes" : "no";
              console.log("Mapped meets_local_investment_thresholds:", meetsThresholdsValue, "→ meetsThresholds:", updates.meetsThresholds);
            }
          }

          // Map agreement checkboxes
          if (termsValue !== undefined) {
            const boolValue = toBoolean(termsValue);
            if (boolValue !== undefined) {
              updates.termsAccepted = boolValue;
            }
          }
          if (riskValue !== undefined) {
            const boolValue = toBoolean(riskValue);
            if (boolValue !== undefined) {
              updates.riskAccepted = boolValue;
            }
          }
          if (privacyValue !== undefined) {
            const boolValue = toBoolean(privacyValue);
            if (boolValue !== undefined) {
              updates.privacyAccepted = boolValue;
            }
          }
          if (confirmationValue !== undefined) {
            const boolValue = toBoolean(confirmationValue);
            if (boolValue !== undefined) {
              updates.allAccepted = boolValue;
            }
          }

          // Always update form data with whatever we found (even if empty)
          // This ensures API data overrides default values
          setFormData(prevData => ({
            ...prevData,
            ...updates,
          }));
          
          console.log("Form data updated with:", updates);
          console.log("Final formData state will be:", {
            isAccredited: updates.isAccredited !== undefined ? updates.isAccredited : formData.isAccredited,
            meetsThresholds: updates.meetsThresholds !== undefined ? updates.meetsThresholds : formData.meetsThresholds,
            termsAccepted: updates.termsAccepted !== undefined ? updates.termsAccepted : formData.termsAccepted,
            riskAccepted: updates.riskAccepted !== undefined ? updates.riskAccepted : formData.riskAccepted,
            privacyAccepted: updates.privacyAccepted !== undefined ? updates.privacyAccepted : formData.privacyAccepted,
            allAccepted: updates.allAccepted !== undefined ? updates.allAccepted : formData.allAccepted,
          });
          
          if (Object.keys(updates).length === 0) {
            console.log("No agreement data found in profile, keeping default form values");
            console.log("Searched for fields: is_accredited_investor, meets_local_investment_thresholds, terms_and_conditions_accepted, risk_disclosure_accepted, privacy_policy_accepted, confirmation_of_true_information");
          }
        } else {
          console.log("No profile data found in response");
          console.log("Response structure:", response.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        console.error("Error response:", err.response);
        console.error("Error status:", err.response?.status);
        console.error("Error data:", err.response?.data);
        
        // If profile doesn't exist (404), that's okay - just don't populate
        if (err.response?.status === 404) {
          console.log("Profile not found (404), starting with empty form");
        } else if (err.response?.status === 401) {
          console.log("Unauthorized (401), token may be expired");
        } else {
          console.log("Error fetching profile, but continuing with empty form");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  // Debug: Log formData changes
  useEffect(() => {
    console.log("FormData state changed:", formData);
  }, [formData]);

  const handleContinue = async () => {
    if (currentSubStep === 4) {
      // Move to Step 5 (legal agreements)
      setCurrentSubStep(5);
    } else {
      // Step 5: Validate and submit agreements
      if (!formData.termsAccepted || !formData.riskAccepted || !formData.privacyAccepted || !formData.allAccepted) {
        setError("Please accept all agreements to continue");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

        // Get profile ID if not already set
        let currentProfileId = profileId;
        if (!currentProfileId) {
          // Fetch profile to get ID
          const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
          const profilesUrl = `${API_URL.replace(/\/$/, "")}/profiles/`;
          const profileResponse = await axios.get(profilesUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
          
          if (profileResponse.data?.results?.length > 0) {
            currentProfileId = profileResponse.data.results[0].id;
            setProfileId(currentProfileId);
          } else {
            setError("Profile not found. Please complete previous steps first.");
            setLoading(false);
            return;
          }
        }

        // Prepare API payload
        const payload = {
          terms_and_conditions_accepted: formData.termsAccepted,
          risk_disclosure_accepted: formData.riskAccepted,
          privacy_policy_accepted: formData.privacyAccepted,
          confirmation_of_true_information: formData.allAccepted,
        };

        // Get API URL from environment variable
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/${currentProfileId}/update_step5/`;

        console.log("Sending agreements data to:", finalUrl);
        console.log("Profile ID:", currentProfileId);
        console.log("Payload:", payload);

        // Make PATCH request
        const response = await axios.patch(finalUrl, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Agreements updated successfully:", response.data);

        // Navigate to final review on success
        navigate("/investor-onboarding/final-review");
      } catch (err) {
        console.error("Error updating agreements:", err);
        console.error("Error response:", err.response);

        // Handle error messages
        const backendData = err.response?.data;
        if (backendData) {
          if (typeof backendData === "object") {
            // Handle specific field errors
            if (backendData.non_field_errors) {
              setError(backendData.non_field_errors[0]);
            } else if (backendData.terms_and_conditions_accepted) {
              setError(backendData.terms_and_conditions_accepted[0] || "Invalid terms acceptance");
            } else if (backendData.risk_disclosure_accepted) {
              setError(backendData.risk_disclosure_accepted[0] || "Invalid risk disclosure acceptance");
            } else if (backendData.privacy_policy_accepted) {
              setError(backendData.privacy_policy_accepted[0] || "Invalid privacy policy acceptance");
            } else if (backendData.confirmation_of_true_information) {
              setError(backendData.confirmation_of_true_information[0] || "Invalid confirmation");
            } else if (backendData.detail) {
              setError(backendData.detail);
            } else {
              setError(JSON.stringify(backendData));
            }
          } else {
            setError(String(backendData));
          }
        } else {
          setError(err.message || "Failed to save agreements. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSubStep === 5) {
      // Go back to Step 4
      setCurrentSubStep(4);
    } else {
      // Go back to previous page
      navigate("/investor-onboarding/accreditation");
    }
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
    const stepRoutes = {
      "Basic Information": "/investor-onboarding/basic-info",
      "KYC / Identity Verification": "/investor-onboarding/kyc-verification",
      "Bank Details / Payment Setup": "/investor-onboarding/bank-details",
      "Accreditation (If Applicable)": "/investor-onboarding/accreditation",
      "Accept Agreements": "/investor-onboarding/agreements",
      "Final Review": "/investor-onboarding/final-review",
      "Confirmation & Redirect": "/investor-onboarding/confirmation",
    };
    if (stepRoutes[step]) {
      navigate(stepRoutes[step]);
      setIsMobileMenuOpen(false);
    }
  };

  const steps = [
    "Basic Information",
    "KYC / Identity Verification",
    "Bank Details / Payment Setup",
    "Accreditation (If Applicable)",
    "Accept Agreements",
    "Final Review",
    "Confirmation & Redirect",
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 overflow-x-hidden" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-4 sm:px-5 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            {/* Right Side - Application Title */}
            <div className="flex items-center justify-center md:justify-end gap-4 flex-1">
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <h1 className="text-xl sm:text-2xl font-semibold mb-1">
                  <span className="text-[#9889FF]">Investor</span>{" "}
                  <span className="text-[#001D21]">Onboarding</span>
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#01373D] text-[#01373D]"
                aria-label="Open onboarding menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Sidebar */}
        <div className="hidden lg:block bg-[#CEC6FF] rounded-xl p-4 lg:ml-4 w-72 shrink-0 h-fit">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < 4; // First 4 steps are completed
              const isActive = activeStep === step;

              return (
                <button
                  key={step}
                  type="button"
                  className={`w-full rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${
                    isActive ? "bg-white text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/70"
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  {isCompleted && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                      <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="font-medium">{step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-5 sm:p-6 lg:p-8 lg:mr-4 w-full">
          <div className="mx-auto w-full max-w-4xl">
            {currentSubStep === 4 ? (
              <>
                {/* Title */}
                <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom text-center sm:text-left">Step 4: Accept Agreements</h1>
                
                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#748A91] mb-8 font-poppins-custom text-center sm:text-left">
                  Depending on your country, we may need to verify your investor accreditation status.
                </p>

                {/* Loading indicator while fetching data */}
                {fetching && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-600 text-sm font-poppins-custom">Loading your agreements data...</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-poppins-custom">{error}</p>
                  </div>
                )}

                {/* Form Sections */}
                <div className="space-y-6">
              {/* Upload Proof of Income or Net Worth */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom flex items-center gap-2">
                  Upload Proof of Income or Net Worth
                  <div className="relative group">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.41699 9.91797H7.58366V6.41797H6.41699V9.91797ZM7.00033 5.2513C7.1656 5.2513 7.30424 5.1953 7.41624 5.0833C7.52824 4.9713 7.58405 4.83286 7.58366 4.66797C7.58327 4.50308 7.52727 4.36464 7.41566 4.25264C7.30405 4.14064 7.1656 4.08464 7.00033 4.08464C6.83505 4.08464 6.6966 4.14064 6.58499 4.25264C6.47338 4.36464 6.41738 4.50308 6.41699 4.66797C6.4166 4.83286 6.4726 4.9715 6.58499 5.08389C6.69738 5.19627 6.83583 5.25208 7.00033 5.2513ZM7.00033 12.8346C6.19338 12.8346 5.43505 12.6814 4.72533 12.375C4.0156 12.0685 3.39824 11.653 2.87324 11.1284C2.34824 10.6038 1.93272 9.98641 1.62666 9.2763C1.3206 8.56619 1.16738 7.80786 1.16699 7.0013C1.1666 6.19475 1.31983 5.43641 1.62666 4.7263C1.93349 4.01619 2.34902 3.39883 2.87324 2.87422C3.39747 2.34961 4.01483 1.93408 4.72533 1.62764C5.43583 1.32119 6.19416 1.16797 7.00033 1.16797C7.80649 1.16797 8.56483 1.32119 9.27533 1.62764C9.98583 1.93408 10.6032 2.34961 11.1274 2.87422C11.6516 3.39883 12.0674 4.01619 12.3746 4.7263C12.6818 5.43641 12.8348 6.19475 12.8337 7.0013C12.8325 7.80786 12.6793 8.56619 12.374 9.2763C12.0687 9.98641 11.6532 10.6038 11.1274 11.1284C10.6016 11.653 9.98427 12.0687 9.27533 12.3756C8.56638 12.6824 7.80805 12.8354 7.00033 12.8346Z" fill="#E9BB30"/>
                    </svg>
                  </div>
                </label>
                
                {/* Upload Area - Always Visible */}
                <div className="border-2  border-dashed bg-[#F4F6F5] rounded-lg p-4 text-center cursor-pointer hover:border-[#9889FF] transition-colors mb-4" style={{ borderColor: "#E2E2FB" }}>
                  <input
                    type="file"
                    id="proofUpload"
                    onChange={handleFileChange}
                    accept=".pdf,.docx"
                    className="hidden"
                  />
                  <label htmlFor="proofUpload" className="cursor-pointer">
                    <div className="text-left flex flex-row gap-2">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.3337 23.6933H16.667V17.4333L19.467 20.2333L20.411 19.2827L16.0003 14.872L11.5897 19.2827L12.5417 20.2253L15.3337 17.4333V23.6933ZM8.82166 28C8.20744 28 7.69499 27.7947 7.28433 27.384C6.87366 26.9733 6.66788 26.4609 6.66699 25.8467V6.15333C6.66699 5.54 6.87277 5.028 7.28433 4.61733C7.69588 4.20667 8.20833 4.00089 8.82166 4H19.3337L25.3337 10V25.8467C25.3337 26.46 25.1283 26.9724 24.7177 27.384C24.307 27.7956 23.7941 28.0009 23.179 28H8.82166ZM18.667 10.6667V5.33333H8.82166C8.61633 5.33333 8.42788 5.41867 8.25633 5.58933C8.08477 5.76 7.99944 5.948 8.00033 6.15333V25.8467C8.00033 26.0511 8.08566 26.2391 8.25633 26.4107C8.42699 26.5822 8.61499 26.6676 8.82033 26.6667H23.1803C23.3848 26.6667 23.5728 26.5813 23.7443 26.4107C23.9159 26.24 24.0012 26.0516 24.0003 25.8453V10.6667H18.667Z" fill="#22C55E"/>
                      </svg>
                    <p className="text-[#748A91] font-poppins-custom mb-1">
                      Upload Documents File
                    </p>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      <span className="text-[#748A91] underline">choose file</span>
                    </p>

                    </div>
                   
                  </label>
                </div>

                {/* Uploaded File Display - Show when file is uploaded or exists */}
                {(formData.proofFile || existingProofFile) && (
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.833 7.5013H15.4163L10.833 2.91797V7.5013ZM4.99967 1.66797H11.6663L16.6663 6.66797V16.668C16.6663 17.11 16.4907 17.5339 16.1782 17.8465C15.8656 18.159 15.4417 18.3346 14.9997 18.3346H4.99967C4.55765 18.3346 4.13372 18.159 3.82116 17.8465C3.5086 17.5339 3.33301 17.11 3.33301 16.668V3.33464C3.33301 2.89261 3.5086 2.46868 3.82116 2.15612C4.13372 1.84356 4.55765 1.66797 4.99967 1.66797ZM9.10801 10.368C9.44967 11.118 9.88301 11.7346 10.383 12.1596L10.7247 12.4263C9.99967 12.5596 8.99967 12.793 7.94134 13.2013L7.84967 13.2346L8.26634 12.368C8.64134 11.643 8.91634 10.9846 9.10801 10.368ZM14.508 13.543C14.658 13.393 14.733 13.2013 14.7413 12.993C14.7663 12.8263 14.7247 12.668 14.6413 12.5346C14.3997 12.143 13.7747 11.9596 12.7413 11.9596L11.6663 12.018L10.9413 11.5346C10.4163 11.1013 9.94134 10.343 9.60801 9.4013L9.64134 9.28464C9.91634 8.1763 10.1747 6.83464 9.62467 6.28464C9.5574 6.21931 9.47782 6.16799 9.39056 6.13366C9.3033 6.09933 9.21009 6.08266 9.11634 6.08464H8.91634C8.60801 6.08464 8.33301 6.40964 8.25801 6.7263C7.94967 7.83464 8.13301 8.44297 8.44134 9.4513V9.45964C8.23301 10.193 7.96634 11.043 7.54134 11.9013L6.74134 13.4013L5.99967 13.8096C4.99967 14.4346 4.52467 15.1346 4.43301 15.5763C4.39967 15.7346 4.41634 15.8763 4.47467 16.0263L4.49967 16.068L4.89967 16.3263L5.26634 16.418C5.94134 16.418 6.70801 15.6263 7.74134 13.8596L7.89134 13.8013C8.74967 13.5263 9.81634 13.3346 11.2497 13.1763C12.108 13.6013 13.1163 13.793 13.7497 13.793C14.1163 13.793 14.3663 13.7013 14.508 13.543ZM14.1663 12.9513L14.2413 13.043C14.233 13.1263 14.208 13.1346 14.1663 13.1513H14.133L13.9747 13.168C13.5913 13.168 12.9997 13.0096 12.3913 12.743C12.4663 12.6596 12.4997 12.6596 12.583 12.6596C13.7497 12.6596 14.083 12.868 14.1663 12.9513ZM6.52467 14.168C5.98301 15.1596 5.49134 15.7096 5.11634 15.8346C5.15801 15.518 5.53301 14.968 6.12467 14.4263L6.52467 14.168ZM9.04134 8.40964C8.84967 7.65964 8.84134 7.0513 8.98301 6.7013L9.04134 6.6013L9.16634 6.64297C9.30801 6.84297 9.32467 7.10963 9.24134 7.55964L9.21634 7.69297L9.08301 8.3763L9.04134 8.40964Z" fill="#EF5350"/>
                      </svg>
                      
                      <span className="text-[#0A2A2E] font-poppins-custom">
                        {formData.proofFile 
                          ? formData.proofFile.name 
                          : existingProofFile 
                          ? (existingProofFile.includes('/') ? existingProofFile.split('/').pop() : 'Proof of Income/Net Worth')
                          : "NetWorth.pdf"}
                      </span>

                      {formData.proofFile && (
                        <>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                            <div className="bg-[#8A2BE2] h-2 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                          <span className="text-sm text-[#0A2A2E] font-poppins-custom">100%</span>
                        </>
                      )}
                      {existingProofFile && !formData.proofFile && (
                        <a 
                          href={existingProofFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm font-poppins-custom ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View/Download
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {formData.proofFile && (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                          </svg>
                          <button onClick={handleRemoveFile} className="text-[#0A2A2E] hover:text-red-500">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-[#748A91] font-poppins-custom">
                    Supported file Type: .pdf, .docx
                  </p>
                  <p className="text-xs text-[#748A91] font-poppins-custom">
                    Maximum Size: 5MB
                  </p>
                </div>
              </div>

              {/* Are you an accredited investor? */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom flex items-center gap-2">
                  Are you an accredited investor?
                  <div className="relative group">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.41699 9.91797H7.58366V6.41797H6.41699V9.91797ZM7.00033 5.2513C7.1656 5.2513 7.30424 5.1953 7.41624 5.0833C7.52824 4.9713 7.58405 4.83286 7.58366 4.66797C7.58327 4.50308 7.52727 4.36464 7.41566 4.25264C7.30405 4.14064 7.1656 4.08464 7.00033 4.08464C6.83505 4.08464 6.6966 4.14064 6.58499 4.25264C6.47338 4.36464 6.41738 4.50308 6.41699 4.66797C6.4166 4.83286 6.4726 4.9715 6.58499 5.08389C6.69738 5.19627 6.83583 5.25208 7.00033 5.2513ZM7.00033 12.8346C6.19338 12.8346 5.43505 12.6814 4.72533 12.375C4.0156 12.0685 3.39824 11.653 2.87324 11.1284C2.34824 10.6038 1.93272 9.98641 1.62666 9.2763C1.3206 8.56619 1.16738 7.80786 1.16699 7.0013C1.1666 6.19475 1.31983 5.43641 1.62666 4.7263C1.93349 4.01619 2.34902 3.39883 2.87324 2.87422C3.39747 2.34961 4.01483 1.93408 4.72533 1.62764C5.43583 1.32119 6.19416 1.16797 7.00033 1.16797C7.80649 1.16797 8.56483 1.32119 9.27533 1.62764C9.98583 1.93408 10.6032 2.34961 11.1274 2.87422C11.6516 3.39883 12.0674 4.01619 12.3746 4.7263C12.6818 5.43641 12.8348 6.19475 12.8337 7.0013C12.8325 7.80786 12.6793 8.56619 12.374 9.2763C12.0687 9.98641 11.6532 10.6038 11.1274 11.1284C10.6016 11.653 9.98427 12.0687 9.27533 12.3756C8.56638 12.6824 7.80805 12.8354 7.00033 12.8346Z" fill="#E9BB30"/>
                    </svg>
                  </div>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isAccredited"
                      value="yes"
                      checked={formData.isAccredited === "yes"}
                      onChange={(e) => handleInputChange("isAccredited", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isAccredited"
                      value="no"
                      checked={formData.isAccredited === "no"}
                      onChange={(e) => handleInputChange("isAccredited", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">No</span>
                  </label>
                </div>
              </div>

              {/* Do you meet your local investment thresholds? */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom flex items-center gap-2">
                  Do you meet your local investment thresholds?
                  <div className="relative group">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.41699 9.91797H7.58366V6.41797H6.41699V9.91797ZM7.00033 5.2513C7.1656 5.2513 7.30424 5.1953 7.41624 5.0833C7.52824 4.9713 7.58405 4.83286 7.58366 4.66797C7.58327 4.50308 7.52727 4.36464 7.41566 4.25264C7.30405 4.14064 7.1656 4.08464 7.00033 4.08464C6.83505 4.08464 6.6966 4.14064 6.58499 4.25264C6.47338 4.36464 6.41738 4.50308 6.41699 4.66797C6.4166 4.83286 6.4726 4.9715 6.58499 5.08389C6.69738 5.19627 6.83583 5.25208 7.00033 5.2513ZM7.00033 12.8346C6.19338 12.8346 5.43505 12.6814 4.72533 12.375C4.0156 12.0685 3.39824 11.653 2.87324 11.1284C2.34824 10.6038 1.93272 9.98641 1.62666 9.2763C1.3206 8.56619 1.16738 7.80786 1.16699 7.0013C1.1666 6.19475 1.31983 5.43641 1.62666 4.7263C1.93349 4.01619 2.34902 3.39883 2.87324 2.87422C3.39747 2.34961 4.01483 1.93408 4.72533 1.62764C5.43583 1.32119 6.19416 1.16797 7.00033 1.16797C7.80649 1.16797 8.56483 1.32119 9.27533 1.62764C9.98583 1.93408 10.6032 2.34961 11.1274 2.87422C11.6516 3.39883 12.0674 4.01619 12.3746 4.7263C12.6818 5.43641 12.8348 6.19475 12.8337 7.0013C12.8325 7.80786 12.6793 8.56619 12.374 9.2763C12.0687 9.98641 11.6532 10.6038 11.1274 11.1284C10.6016 11.653 9.98427 12.0687 9.27533 12.3756C8.56638 12.6824 7.80805 12.8354 7.00033 12.8346Z" fill="#E9BB30"/>
                    </svg>
                    
                    {/* Tooltip */}
                    <div className="absolute left-0 top-6 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-3 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="text-xs text-[#0A2A2E] font-poppins-custom font-thin">
                        By answering, you confirm that you are self-certifying your compliance with your local investment rules. Unlocksley does not verify this information and is not responsible for inaccuracies or misrepresentations.
                      </p>
                    </div>
                  </div>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="meetsThresholds"
                      value="yes"
                      checked={formData.meetsThresholds === "yes"}
                      onChange={(e) => handleInputChange("meetsThresholds", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="meetsThresholds"
                      value="no"
                      checked={formData.meetsThresholds === "no"}
                      onChange={(e) => handleInputChange("meetsThresholds", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 mt-12">
              <button
                onClick={handlePrevious}
                    className="w-full sm:w-auto px-6 py-3 bg-[#F4F6F5] text-[#001D21] rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2"
                style={{ border: "1px solid #0A2A2E" }}
              >
                <span>←</span> Previous
              </button>
              <button
                onClick={handleContinue}
                    className="w-full sm:w-auto px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2"
              >
                Continue <span>→</span>
              </button>
            </div>
              </>
            ) : (
              <>
                {/* Step 5: Legal Agreements */}
                <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom text-center sm:text-left">Step 5: Accept Agreements</h1>
                
                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#748A91] mb-8 font-poppins-custom text-center sm:text-left">
                  Please review and accept the legal agreements to continue with your investment journey.
                </p>

                {/* Loading indicator while fetching data */}
                {fetching && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-600 text-sm font-poppins-custom">Loading your agreements data...</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-poppins-custom">{error}</p>
                  </div>
                )}

                {/* Legal Documents Section */}
                <div className="space-y-4 mb-8">
                  {/* Terms & Conditions */}
                  <div className="bg-[#F4F6F5] rounded-lg p-4 flex items-center justify-between" style={{ border: "0.5px solid #E8EAED" }}>
                    <span className="text-[#0A2A2E] font-medium font-poppins-custom">Terms & Conditions</span>
                    <button className="px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#16A34A] transition-colors font-medium font-poppins-custom">
                      View
                    </button>
                  </div>

                  {/* Risk Disclosure */}
                  <div className="bg-[#F4F6F5] rounded-lg p-4 flex items-center justify-between" style={{ border: "0.5px solid #E8EAED" }}>
                    <span className="text-[#0A2A2E] font-medium font-poppins-custom">Risk Disclosure</span>
                    <button className="px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#16A34A] transition-colors font-medium font-poppins-custom">
                      View
                    </button>
                  </div>

                  {/* Privacy Policy */}
                  <div className="bg-[#F4F6F5] rounded-lg p-4 flex items-center justify-between" style={{ border: "0.5px solid #E8EAED" }}>
                    <span className="text-[#0A2A2E] font-medium font-poppins-custom">Privacy Policy</span>
                    <button className="px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#16A34A] transition-colors font-medium font-poppins-custom">
                      View
                    </button>
                  </div>
                </div>

                {/* Acceptance Checkboxes */}
                <div className="space-y-4 mb-8">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
                      className="w-4 h-4 accent-black border-gray-300 mt-1"
                    />
                    <span className="text-[#748A91] font-poppins-custom">
                      I have read and agree to the Terms & Conditions
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.riskAccepted}
                      onChange={(e) => handleInputChange("riskAccepted", e.target.checked)}
                      className="w-4 h-4 accent-black border-gray-300 mt-1"
                    />
                    <span className="text-[#748A91] font-poppins-custom">
                      I acknowledge and understand the associated investment risks
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.privacyAccepted}
                      onChange={(e) => handleInputChange("privacyAccepted", e.target.checked)}
                      className="w-4 h-4 accent-black border-gray-300 mt-1"
                    />
                    <span className="text-[#748A91] font-poppins-custom">
                      I agree to the Privacy Policy and data usage terms
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.allAccepted}
                      onChange={(e) => handleInputChange("allAccepted", e.target.checked)}
                      className="w-4 h-4 accent-black border-gray-300 mt-1"
                    />
                        <span className="text-[#748A91] font-poppins-custom">
                      I confirm that all the information provided is true and I accept all the agreements above.
                    </span>
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 mt-12">
                  <button
                    onClick={handlePrevious}
                    className="w-full sm:w-auto px-6 py-3 bg-[#F4F6F5] text-[#001D21] rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2"
                    style={{ border: "1px solid #0A2A2E" }}
                  >
                    <span>←</span> Previous
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Continue"} <span>→</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-[#01373D]">Onboarding Steps</h4>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
            aria-label="Close onboarding menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          {steps.map((step, index) => {
            const isCompleted = index < 4;
            const isActive = activeStep === step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => handleStepClick(step)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${
                  isActive ? "bg-[#00F0C3]/20 text-[#001D21]" : "text-[#001D21] hover:bg-[#F4F6F5]"
                }`}
              >
                {isCompleted && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                    <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="font-medium">{step}</span>
              </button>
            );
          })}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default AcceptAgreements;

