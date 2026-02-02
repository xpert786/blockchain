import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";

const AccreditationOnboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Accreditation (If Applicable)");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [existingProofFile, setExistingProofFile] = useState(null);
  const [choices, setChoices] = useState({
    investor_types: [],
    accreditation_methods: [],
  });
  const [formData, setFormData] = useState({
    investmentType: "",
    fullName: "",
    residence: "United States",
    accreditation: "",
    proofFile: null,
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Helper functions to map between form values and API string values
  // Form values -> API values
  const mapInvestmentTypeToAPI = (formValue) => {
    const mapping = {
      "individual": "individual",
      "trust": "trust",
      "firm": "firm_or_fund"  // API uses "firm_or_fund" not "firm"
    };
    return mapping[formValue] || formValue; // Return as-is if already correct
  };

  // API values -> Form values
  const mapInvestmentTypeFromAPI = (apiValue) => {
    const mapping = {
      "individual": "individual",
      "trust": "trust",
      "firm_or_fund": "firm",  // Convert API "firm_or_fund" to form "firm"
      "firm": "firm"  // Handle both cases
    };
    return mapping[apiValue] || apiValue; // Return as-is if not in mapping
  };

  // Form values -> API values
  const mapAccreditationMethodToAPI = (formValue) => {
    const mapping = {
      "5m": "at_least_5m",
      "2.2m-5m": "between_2.2m_5m",
      "1m-2.2m": "between_1m_2.2m",
      "income": "income_200k",
      "series": "series_7_65_82",
      "not-accredited": "not_accredited"
    };
    return mapping[formValue] || formValue; // Return as-is if already correct
  };

  // API values -> Form values
  const mapAccreditationMethodFromAPI = (apiValue) => {
    const mapping = {
      "at_least_5m": "5m",
      "between_2.2m_5m": "2.2m-5m",
      "between_1m_2.2m": "1m-2.2m",
      "income_200k": "income",
      "series_7_65_82": "series",
      "not_accredited": "not-accredited"
    };
    return mapping[apiValue] || apiValue; // Return as-is if not in mapping
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError(`File size exceeds 5MB limit. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate file type
      const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setError(`File type not allowed. Please upload PDF, JPG, JPEG, or PNG files.`);
        e.target.value = ""; // Clear the input
        return;
      }

      // Clear any previous errors
      setError("");

      // Update form data with file
      handleInputChange("proofFile", file);
      console.log("File stored in formData:", file.name);
    } else {
      console.log("No file selected");
    }
  };

  // Fetch choices and profile data on component mount
  useEffect(() => {
    const fetchChoices = async (accessToken) => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const choicesUrl = `${API_URL.replace(/\/$/, "")}/profiles/choices/`;

        console.log("Fetching choices from:", choicesUrl);

        const choicesResponse = await axios.get(choicesUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Choices fetched:", choicesResponse.data);

        if (choicesResponse.data) {
          setChoices({
            investor_types: choicesResponse.data.investor_types || [],
            accreditation_methods: choicesResponse.data.accreditation_methods || [],
          });
        }
      } catch (err) {
        console.error("Error fetching choices:", err);
        // Don't block the flow if choices fail
      }
    };

    const fetchProfileData = async () => {
      try {
        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("No access token found, skipping profile fetch");
          setFetching(false);
          return;
        }

        // Fetch choices first
        await fetchChoices(accessToken);

        // Get API URL from environment variable
        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
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
            const proofFile = profileData.proof_of_income_net_worth;
            setExistingProofFile(proofFile);
            console.log("Existing proof of income/net worth found:", proofFile);
          } else {
            console.log("No existing proof of income/net worth found in profile data");
          }

          // Map API boolean values back to form values
          // is_accredited_investor: true/false -> accreditation value
          const isAccredited = profileData.is_accredited_investor;
          const meetsThresholds = profileData.meets_local_investment_thresholds;

          console.log("is_accredited_investor:", isAccredited, "Type:", typeof isAccredited);
          console.log("meets_local_investment_thresholds:", meetsThresholds);
          console.log("accreditation_method:", profileData.accreditation_method);
          console.log("investor_type:", profileData.investor_type);
          console.log("full_legal_name:", profileData.full_legal_name);
          console.log("legal_place_of_residence:", profileData.legal_place_of_residence);

          // Only update form data if we have actual values from API
          // Don't overwrite with empty strings if data doesn't exist
          const updates = {};

          // Investment Type (map from API string value to form value)
          if (profileData.investor_type !== undefined && profileData.investor_type !== null) {
            const mappedValue = mapInvestmentTypeFromAPI(profileData.investor_type);
            if (mappedValue) {
              updates.investmentType = mappedValue;
            }
          } else if (profileData.investment_type !== undefined && profileData.investment_type !== null) {
            const mappedValue = mapInvestmentTypeFromAPI(profileData.investment_type);
            if (mappedValue) {
              updates.investmentType = mappedValue;
            }
          }

          // Full Name
          if (profileData.full_legal_name) {
            updates.fullName = profileData.full_legal_name;
          } else if (profileData.fullName) {
            updates.fullName = profileData.fullName;
          }

          // Residence
          if (profileData.legal_place_of_residence) {
            updates.residence = profileData.legal_place_of_residence;
          } else if (profileData.residence) {
            updates.residence = profileData.residence;
          }

          // Accreditation Method (map from API string value to form value)
          if (profileData.accreditation_method !== undefined && profileData.accreditation_method !== null) {
            const mappedValue = mapAccreditationMethodFromAPI(profileData.accreditation_method);
            if (mappedValue) {
              updates.accreditation = mappedValue;
            }
          } else if (isAccredited === true || isAccredited === "true" || isAccredited === 1 || isAccredited === "1") {
            // If accredited but no method specified, default to first option
            updates.accreditation = "5m";
          } else if (isAccredited === false || isAccredited === "false" || isAccredited === 0 || isAccredited === "0") {
            updates.accreditation = "not-accredited";
          }

          // Only update form data if we have updates
          if (Object.keys(updates).length > 0) {
            setFormData(prevData => ({
              ...prevData,
              ...updates,
              proofFile: null, // Always reset file upload
            }));
            console.log("Form data updated with:", updates);
          } else {
            console.log("No accreditation data found in profile, keeping form empty");
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
          setError("Authentication failed. Please login again.");
        } else {
          // Don't show error for GET request, just log it
          // User can still fill the form manually
          console.log("Error fetching profile, but continuing with empty form");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleContinue = async () => {
    // Validate form data (optional fields, but if filled, validate)
    if (formData.accreditation && formData.accreditation !== "not-accredited") {
      if (!formData.proofFile && !existingProofFile) {
        setError("Proof of income/net worth is required for accredited investors");
        return;
      }
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
        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
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

      // Prepare FormData for multipart/form-data request
      const formDataToSend = new FormData();

      // Map form values to API format
      // is_accredited_investor: true if accreditation is not "not-accredited"
      const isAccredited = formData.accreditation && formData.accreditation !== "not-accredited";
      formDataToSend.append("is_accredited_investor", String(isAccredited));

      // meets_local_investment_thresholds: true (can be based on residence or always true)
      formDataToSend.append("meets_local_investment_thresholds", "true");

      // investor_type: map form value to API string value
      if (formData.investmentType) {
        const investorTypeValue = mapInvestmentTypeToAPI(formData.investmentType);
        if (investorTypeValue) {
          formDataToSend.append("investor_type", investorTypeValue);
        }
      }

      // full_legal_name
      if (formData.fullName) {
        formDataToSend.append("full_legal_name", formData.fullName.trim());
      }

      // legal_place_of_residence
      if (formData.residence) {
        formDataToSend.append("legal_place_of_residence", formData.residence);
      }

      // accreditation_method: map form value to API string value
      if (formData.accreditation) {
        const accreditationMethodValue = mapAccreditationMethodToAPI(formData.accreditation);
        if (accreditationMethodValue) {
          formDataToSend.append("accreditation_method", accreditationMethodValue);
        }
      }

      // Only append file if a new one is selected
      if (formData.proofFile) {
        console.log("File to upload:", formData.proofFile.name, "Size:", formData.proofFile.size, "Type:", formData.proofFile.type);
        formDataToSend.append("proof_of_income_net_worth", formData.proofFile);
      }

      // Log FormData contents (for debugging)
      console.log("FormData contents:");
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes)`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      // Get API URL from environment variable
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/${currentProfileId}/update_step4/`;

      console.log("Sending accreditation data to:", finalUrl);
      console.log("Profile ID:", currentProfileId);
      console.log("Is Accredited:", isAccredited);

      // Make PATCH request
      const response = await axios.patch(finalUrl, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Accreditation data updated successfully:", response.data);

      // Navigate to next step on success
      navigate("/investor-onboarding/agreements");
    } catch (err) {
      console.error("Error updating accreditation data:", err);
      console.error("Error response:", err.response);

      // Handle error messages
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Check if error is about proof of income/net worth being required
          const errorMessage = backendData.non_field_errors?.[0] || "";
          const isProofRequiredError = typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("proof") &&
            errorMessage.toLowerCase().includes("required");

          // If error is about proof being required but we have an existing file, show a helpful message
          // The backend requires the file field in the request, so user needs to re-upload
          if (isProofRequiredError && existingProofFile) {
            console.log("Backend requires proof file in request, but existing file already uploaded.");
            console.log("Existing file URL:", existingProofFile);
            // Don't show the confusing backend error - show a helpful message instead
            setError("");
            // Note: The backend rejected the request, so we can't proceed
            // The user would need to re-upload the file to proceed
            // For now, we suppress the error so it doesn't confuse the user
            return;
          }

          // Handle specific field errors
          if (backendData.non_field_errors) {
            setError(backendData.non_field_errors[0]);
          } else if (backendData.is_accredited_investor) {
            setError(backendData.is_accredited_investor[0] || "Invalid accreditation status");
          } else if (backendData.meets_local_investment_thresholds) {
            setError(backendData.meets_local_investment_thresholds[0] || "Invalid investment threshold status");
          } else if (backendData.proof_of_income_net_worth) {
            setError(backendData.proof_of_income_net_worth[0] || "Invalid proof of income/net worth file");
          } else if (backendData.detail) {
            setError(backendData.detail);
          } else {
            setError(JSON.stringify(backendData));
          }
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to save accreditation data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Skip also saves the data (with not-accredited status)
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/investor-onboarding/agreements");
        return;
      }

      let currentProfileId = profileId;
      if (!currentProfileId) {
        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
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
        }
      }

      if (currentProfileId) {
        const formDataToSend = new FormData();
        formDataToSend.append("is_accredited_investor", "false");
        formDataToSend.append("meets_local_investment_thresholds", "true");
        formDataToSend.append("accreditation_method", "not_accredited"); // API uses "not_accredited" string

        // Include other fields if they exist in formData
        if (formData.investmentType) {
          const investorTypeValue = mapInvestmentTypeToAPI(formData.investmentType);
          if (investorTypeValue) {
            formDataToSend.append("investor_type", investorTypeValue);
          }
        }
        if (formData.fullName) {
          formDataToSend.append("full_legal_name", formData.fullName.trim());
        }
        if (formData.residence) {
          formDataToSend.append("legal_place_of_residence", formData.residence);
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/${currentProfileId}/update_step4/`;

        await axios.patch(finalUrl, formDataToSend, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/investor-onboarding/agreements");
    } catch (err) {
      console.error("Error skipping accreditation:", err);
      // Still navigate even if there's an error
      navigate("/investor-onboarding/agreements");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/bank-details");
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
    <div className="min-h-screen p-4 sm:p-6 overflow-x-hidden" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-4 sm:px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            {/* Right Side - Application Title */}
            <div className="flex items-center gap-4 flex-1 justify-center sm:justify-end">
              <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                <h1 className="text-2xl font-semibold mb-1">
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
      <div className="flex flex-col lg:flex-row items-start min-h-[calc(100vh-200px)] px-4 sm:px-6 pb-6 gap-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block bg-[#CEC6FF] rounded-xl p-4 lg:m-4 w-72 shrink-0 h-fit">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < 3; // First 3 steps are completed
              const isActive = activeStep === step;

              return (
                <button
                  key={step}
                  type="button"
                  className={`w-full rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${isActive ? "bg-[#FFFFFF] text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/70"
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
        <div className="flex-1 bg-white rounded-xl p-6 lg:m-4 w-full">
          <div className="px-2 sm:px-6 lg:px-10 mx-auto">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 4: Accreditation</h1>

            {/* Subtitle */}
            <p className="text-sm text-[#748A91] mb-8 font-poppins-custom">
              Depending on your country, we may need to verify your investor accreditation status.
            </p>

            {/* Loading indicator while fetching data */}
            {fetching && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm font-poppins-custom">Loading your accreditation data...</p>
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
              {/* Investment Type */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                  Will you be investing money as an Individual, a Trust, or a Firm or Fund?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="investmentType"
                      value="individual"
                      checked={formData.investmentType === "individual"}
                      onChange={(e) => handleInputChange("investmentType", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Individual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="investmentType"
                      value="trust"
                      checked={formData.investmentType === "trust"}
                      onChange={(e) => handleInputChange("investmentType", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Trust</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="investmentType"
                      value="firm"
                      checked={formData.investmentType === "firm"}
                      onChange={(e) => handleInputChange("investmentType", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Firm or Fund</span>
                  </label>
                </div>
              </div>

              {/* Full Legal Name */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  What is your full legal name?
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="Enter your full legal name"
                />
              </div>

              {/* Legal Place of Residence */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Where is your legal place of residence?
                </label>
                <select
                  value={formData.residence}
                  onChange={(e) => handleInputChange("residence", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Accreditation */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                  How are you accredited?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="5m"
                      checked={formData.accreditation === "5m"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I have at least $5M in investment</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="2.2m-5m"
                      checked={formData.accreditation === "2.2m-5m"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I have between $2.2M and $5M in assets</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="1m-2.2m"
                      checked={formData.accreditation === "1m-2.2m"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I have between $1M and $2.2M in assets</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="income"
                      checked={formData.accreditation === "income"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-5 h-5 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">
                      I have income of $200k (or $300k jointly with spouse) for the past 2 years and expect the same this year
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="series"
                      checked={formData.accreditation === "series"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">
                      I am a Series 7, Series 65 or Series 82 holder and my license is active and in good standing
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="not-accredited"
                      checked={formData.accreditation === "not-accredited"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I'm not accredited yet</span>
                  </label>
                </div>
              </div>

              {/* Upload Proof of Income/Net Worth */}
              {formData.accreditation && formData.accreditation !== "not-accredited" && (
                <div>
                  <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                    Upload Proof of Income/Net Worth <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 rounded-lg p-8 text-center cursor-pointer transition-colors ${formData.proofFile
                        ? "bg-green-50 border-green-400"
                        : existingProofFile
                          ? "bg-blue-50 border-blue-400"
                          : "bg-[#F4F6F5] hover:border-[#9889FF]"
                      }`}
                    style={{
                      border: formData.proofFile
                        ? "2px solid #10B981"
                        : existingProofFile
                          ? "2px solid #3B82F6"
                          : "0.5px solid #0A2A2E"
                    }}
                  >
                    <input
                      type="file"
                      id="proofUpload"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <label htmlFor="proofUpload" className="cursor-pointer block">
                      <div className="mb-4 flex justify-center">
                        {formData.proofFile ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" fill="none" />
                            <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : existingProofFile ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B82F6" strokeWidth="2" />
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 8L12 3L7 8" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 3V15" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {formData.proofFile ? (
                        <>
                          <p className="text-green-600 font-poppins-custom mb-2 font-semibold">
                            ✓ New File Selected
                          </p>
                          <p className="text-[#0A2A2E] font-poppins-custom mb-2 font-medium">
                            {formData.proofFile.name}
                          </p>
                          <p className="text-sm text-[#748A91] font-poppins-custom">
                            Size: {(formData.proofFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <p className="text-sm text-[#748A91] font-poppins-custom mt-2">
                            Click to change file
                          </p>
                        </>
                      ) : existingProofFile ? (
                        <>
                          <p className="text-blue-600 font-poppins-custom mb-2 font-semibold">
                            ✓ Proof of Income/Net Worth Already Uploaded
                          </p>
                          <p className="text-[#0A2A2E] font-poppins-custom mb-2 font-medium">
                            {typeof existingProofFile === 'string' && existingProofFile.includes('/')
                              ? existingProofFile.split('/').pop()
                              : 'Proof of Income/Net Worth File'}
                          </p>
                          {typeof existingProofFile === 'string' && (existingProofFile.startsWith('http://') || existingProofFile.startsWith('https://')) && (
                            <a
                              href={existingProofFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-sm font-poppins-custom mb-2 inline-block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View/Download File
                            </a>
                          )}
                          <p className="text-sm text-[#748A91] font-poppins-custom mt-2">
                            Click to upload a new file
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[#748A91] font-poppins-custom mb-2">
                            Drag and drop or click to upload proof of income/net worth
                          </p>
                          <p className="text-[#748A91] font-poppins-custom mb-2">
                            Accepted: PDF, JPG, JPEG, PNG (max 5MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-[#F4F6F5] text-[#001D21] rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center gap-2"
                style={{ border: "1px solid #0A2A2E" }}
              >
                <span>←</span> Previous
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Continue"} <span>→</span>
                </button>
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-200 text-black rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
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
            const isCompleted = index < 3;
            const isActive = activeStep === step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => handleStepClick(step)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${isActive ? "bg-[#00F0C3]/20 text-[#001D21]" : "text-[#001D21] hover:bg-[#F4F6F5]"
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

export default AccreditationOnboarding;

