import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";

const BasicInfo = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Basic Information");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    country: "United States",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
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

        // Check if profile data exists - API returns paginated response with results array
        if (response.data && response.data.results && response.data.results.length > 0) {
          const profileData = response.data.results[0]; // Get first profile from results array

          console.log("Profile data to populate:", profileData);

          // Parse phone number: API returns "+1-1231231231232", split into code and number
          let phoneCode = "+1";
          let phoneNumber = "";
          if (profileData.phone_number) {
            // Split phone number by first dash: "+1-1231231231232" -> ["+1", "1231231231232"]
            const phoneParts = profileData.phone_number.split("-");
            if (phoneParts.length > 1) {
              phoneCode = phoneParts[0]; // "+1"
              phoneNumber = phoneParts.slice(1).join(""); // "1231231231232" (remove any remaining dashes)
            } else {
              // If no dash, try to extract code from beginning using regex
              const match = profileData.phone_number.match(/^(\+\d{1,3})(.*)$/);
              if (match) {
                phoneCode = match[1];
                phoneNumber = match[2].replace(/^-/, ""); // Remove leading dash if present
              } else {
                phoneNumber = profileData.phone_number;
              }
            }
          }

          // Update form data with fetched values
          setFormData({
            fullName: profileData.full_name || "",
            email: profileData.email_address || "",
            phoneCode: phoneCode,
            phoneNumber: phoneNumber,
            country: profileData.country_of_residence || "United States",
          });

          console.log("Form data updated with:", {
            fullName: profileData.full_name,
            email: profileData.email_address,
            phoneCode: phoneCode,
            phoneNumber: phoneNumber,
            country: profileData.country_of_residence,
          });
        } else {
          console.log("No profile data found in response");
        }
      } catch (err) {
        // If profile doesn't exist (404), that's okay - just don't populate
        if (err.response?.status === 404) {
          console.log("Profile not found, starting with empty form");
        } else {
          console.error("Error fetching profile:", err);
          // Don't show error for GET request, just log it
          // User can still fill the form manually
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleContinue = async () => {
    // Validate form data
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!formData.country) {
      setError("Country of residence is required");
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

      // Format phone number: combine phoneCode and phoneNumber with dashes
      // Example: "+1" + "000-000-0000" = "+1-000-000-0000"
      const formattedPhoneNumber = `${formData.phoneCode}-${formData.phoneNumber}`;

      // Prepare API payload
      const payload = {
        full_name: formData.fullName.trim(),
        email_address: formData.email.trim(),
        phone_number: formattedPhoneNumber,
        country_of_residence: formData.country,
      };

      // Get API URL from environment variable
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/my_profile/`;

      console.log("Sending profile data to:", finalUrl);
      console.log("Payload:", payload);

      // Make PATCH request to update profile
      const response = await axios.patch(finalUrl, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Profile updated successfully:", response.data);

      // Navigate to next step on success
      navigate("/investor-onboarding/kyc-verification");
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Error response:", err.response);

      // Handle error messages
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          if (backendData.non_field_errors) {
            setError(backendData.non_field_errors[0]);
          } else if (backendData.full_name) {
            setError(backendData.full_name[0] || "Invalid full name");
          } else if (backendData.email_address) {
            setError(backendData.email_address[0] || "Invalid email address");
          } else if (backendData.phone_number) {
            setError(backendData.phone_number[0] || "Invalid phone number");
          } else if (backendData.country_of_residence) {
            setError(backendData.country_of_residence[0] || "Invalid country");
          } else if (backendData.detail) {
            setError(backendData.detail);
          } else {
            setError(JSON.stringify(backendData));
          }
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    // Navigate back or disable if first step
    navigate("/investor-panel/welcome");
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
    // Navigate based on step
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
    <div className="min-h-screen px-4 sm:px-6 py-6" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-5 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            {/* Right Side - Application Title and Information */}
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
        <div className="hidden lg:block w-72 shrink-0 bg-[#CEC6FF] rounded-xl p-6 ml-0 lg:ml-4">
          <div className="space-y-2">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => handleStepClick(step)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors font-poppins-custom ${activeStep === step ? "bg-white text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/60"
                  }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-5 sm:p-6 lg:p-8 lg:mr-4">
          <div className="mx-auto w-full max-w-3xl">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 1: Basic Info</h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#748A91] mb-8 font-poppins-custom text-center sm:text-left">
              Tell us a bit about yourself to get started with your investment journey.
            </p>

            {/* Loading indicator while fetching data */}
            {fetching && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm font-poppins-custom">Loading your profile data...</p>
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
              {/* Full Name */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Country Code Dropdown */}
                  <div className="sm:w-32">
                    <div className="bg-[#F4F6F5] rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-[#9889FF] focus-within:border-transparent" style={{ border: "0.5px solid #0A2A2E" }}>
                      <span className="text-2xl">🇺🇸</span>
                      <select
                        value={formData.phoneCode}
                        onChange={(e) => handleInputChange("phoneCode", e.target.value)}
                        className="flex-1  outline-none bg-transparent text-[#0A2A2E] font-poppins-custom cursor-pointer"
                      >
                        <option value="+1">+1 US</option>
                        <option value="+44">+44 UK</option>
                        <option value="+33">+33 FR</option>
                        <option value="+49">+49 DE</option>
                      </select>
                    </div>
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                      placeholder="000 - 000 - 0000"
                    />
                  </div>
                </div>
              </div>

              {/* Country of Residence */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Country of Residence <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
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
        <div className="p-4 space-y-2 overflow-y-auto">
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => handleStepClick(step)}
              className={`w-full text-left rounded-lg px-4 py-3 transition-colors font-poppins-custom ${activeStep === step ? "bg-[#00F0C3]/20 text-[#001D21]" : "text-[#001D21] hover:bg-[#F4F6F5]"
                }`}
            >
              {step}
            </button>
          ))}
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

export default BasicInfo;

