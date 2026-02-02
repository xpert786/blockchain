import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";

const FinalReview = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Final Review");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Get access token from localStorage (preferred) or use the one from your curl if needed for testing
      const accessToken = localStorage.getItem("accessToken");

      // If you strictly need the hardcoded token from the curl command for testing, uncomment below:
      // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MDY1ODEyLCJpYXQiOjE3NjQwNDc4MTIsImp0aSI6Ijc0MzYzNzBmMDkwZjQ5ZDA5ZjU5NGE1NWViNjU4YTI0IiwidXNlcl9pZCI6IjIifQ.hz35dR_es8sj15iIT67KG8hRacwM9jdPZj40iAzV1iI";

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Use the profile ID from the fetched data, or fallback to '2' from your curl command
      const profileId = profileData?.id || "";

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const submitUrl = `${API_URL.replace(/\/$/, "")}/profiles/${profileId}/submit_application/`;

      console.log("Submitting application to:", submitUrl);

      // Execute the POST request
      const response = await axios.post(
        submitUrl,
        {}, // Empty body as per --data ''
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Application Submitted Successfully:", response.data);
      navigate("/investor-onboarding/confirmation");

    } catch (err) {
      console.error("Error submitting application:", err);
      if (err.response) {
        setError(`Submission failed: ${err.response.data?.detail || err.response.statusText}`);
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/agreements");
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

  // Helper function to extract filename from URL
  const getFilenameFromUrl = (url) => {
    if (!url) return "N/A";
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      // Remove query parameters if any
      return filename.split("?")[0];
    } catch (error) {
      return "N/A";
    }
  };

  // Helper function to format date from YYYY-MM-DD to MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to mask account number (show last 4 digits)
  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "N/A";
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  // Helper function to format boolean to Yes/No
  const formatBoolean = (value) => {
    if (value === true || value === "true" || value === 1 || value === "1") {
      return "Yes";
    }
    return "No";
  };

  // Helper function to convert API boolean to actual boolean
  const toBoolean = (value) => {
    if (value === true || value === "true" || value === 1 || value === "1") {
      return true;
    }
    if (value === false || value === "false" || value === 0 || value === "0" || value === null || value === undefined) {
      return false;
    }
    return false;
  };

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setFetching(true);
        setError("");

        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("No access token found, skipping profile fetch");
          setFetching(false);
          return;
        }

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

        // Check if profile data exists
        if (response.data && response.data.results && response.data.results.length > 0) {
          const profile = response.data.results[0];
          setProfileData(profile);
          console.log("Profile data set:", profile);
        } else {
          console.log("No profile data found");
          setError("No profile data found. Please complete the onboarding steps first.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        if (err.response) {
          setError(`Failed to fetch profile: ${err.response.data?.detail || err.response.statusText}`);
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An error occurred while fetching profile data.");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

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
              const isCompleted = index < 5; // First 5 steps are completed
              const isActive = activeStep === step;

              return (
                <button
                  key={step}
                  type="button"
                  className={`w-full rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${isActive ? "bg-white text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/70"
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
          <div className="w-full max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom text-center sm:text-left">Final Review & Submit</h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#748A91] mb-8 font-poppins-custom text-center sm:text-left">
              Please review all information before submitting your syndicate application for platform compliance review.
            </p>

            {/* Loading State */}
            {fetching && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3]"></div>
                <p className="mt-2 text-[#748A91] font-poppins-custom">Loading profile data...</p>
              </div>
            )}

            {/* Error State */}
            {error && !fetching && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 font-poppins-custom">{error}</p>
              </div>
            )}

            {/* Review Sections */}
            {!fetching && profileData && (
              <div className="space-y-6">
                {/* Lead Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Lead Information</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Full Name:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.full_name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Email Address:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.email_address || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Country:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.country_of_residence || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Phone Number:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.phone_number || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Role:</span>
                      <span className="text-[#748A91] font-poppins-custom">Investor</span>
                    </div>
                  </div>
                </div>

                {/* KYC Details Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">KYC Details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Date of Birth:</span>
                      <span className="text-[#748A91] font-poppins-custom">{formatDate(profileData.date_of_birth)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">ID Uploaded:</span>
                      {profileData.government_id ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                          </svg>
                          <a href={profileData.government_id} target="_blank" rel="noopener noreferrer" className="text-[#748A91] font-poppins-custom hover:text-[#00F0C3] underline">
                            {getFilenameFromUrl(profileData.government_id)}
                          </a>
                        </>
                      ) : (
                        <span className="text-[#748A91] font-poppins-custom">N/A</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Street Address:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.street_address || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">City:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.city || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">State/Province:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.state_province || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Zip/Postal Code:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.zip_postal_code || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Country:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.country || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Details Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Bank Details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Bank Name:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.bank_name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Account Number:</span>
                      <span className="text-[#748A91] font-poppins-custom">{maskAccountNumber(profileData.bank_account_number)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Account Holder Name:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.account_holder_name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">SWIFT/IFSC Code:</span>
                      <span className="text-[#748A91] font-poppins-custom">{profileData.swift_ifsc_code || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Proof of Bank Ownership:</span>
                      {profileData.proof_of_bank_ownership ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                          </svg>
                          <a href={profileData.proof_of_bank_ownership} target="_blank" rel="noopener noreferrer" className="text-[#748A91] font-poppins-custom hover:text-[#00F0C3] underline">
                            {getFilenameFromUrl(profileData.proof_of_bank_ownership)}
                          </a>
                        </>
                      ) : (
                        <span className="text-[#748A91] font-poppins-custom">N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Accreditation (Optional) Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Accreditation (Optional)</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Accredited Investor:</span>
                      <span className="text-[#748A91] font-poppins-custom">{formatBoolean(profileData.is_accredited_investor)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Meets Local Investment Thresholds:</span>
                      <span className="text-[#748A91] font-poppins-custom">{formatBoolean(profileData.meets_local_investment_thresholds)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[#0A2A2E] font-poppins-custom mr-2">Proof Document:</span>
                      {profileData.proof_of_income_net_worth ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                          </svg>
                          <a href={profileData.proof_of_income_net_worth} target="_blank" rel="noopener noreferrer" className="text-[#748A91] font-poppins-custom hover:text-[#00F0C3] underline">
                            {getFilenameFromUrl(profileData.proof_of_income_net_worth)}
                          </a>
                        </>
                      ) : (
                        <span className="text-[#748A91] font-poppins-custom">N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agreements Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Agreements</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      {toBoolean(profileData.terms_and_conditions_accepted) && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                        </svg>
                      )}
                      <span className="text-[#0A2A2E] font-poppins-custom">Terms & Conditions</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      {toBoolean(profileData.risk_disclosure_accepted) && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                        </svg>
                      )}
                      <span className="text-[#0A2A2E] font-poppins-custom">Risk Disclosure</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      {toBoolean(profileData.privacy_policy_accepted) && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                        </svg>
                      )}
                      <span className="text-[#0A2A2E] font-poppins-custom">Privacy Policy</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      {toBoolean(profileData.confirmation_of_true_information) && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E" />
                        </svg>
                      )}
                      <span className="text-[#0A2A2E] font-poppins-custom">Confirmation of True Information</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 mt-12">
              <button
                onClick={handlePrevious}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-[#F4F6F5] text-[#001D21] rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ border: "1px solid #0A2A2E" }}
              >
                <span>←</span> Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Review
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 2.5L9.16667 10.8333M17.5 2.5L12.5 17.5L9.16667 10.8333M17.5 2.5L2.5 7.5L9.16667 10.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
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
            const isCompleted = index < 5;
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

export default FinalReview;