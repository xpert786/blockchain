import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";

const KYCVerification = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("KYC / Identity Verification");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [existingGovernmentId, setExistingGovernmentId] = useState(null); // Store existing file URL/path
  const [formData, setFormData] = useState({
    idFile: null,
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
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
      console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError(`File size exceeds 5MB limit. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate file type
      const allowedTypes = [".pdf", ".ppt", ".pptx", ".jpg", ".jpeg", ".png"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setError(`File type not allowed. Please upload PDF, PPT, PPTX, JPG, JPEG, or PNG files.`);
        e.target.value = ""; // Clear the input
        return;
      }

      // Clear any previous errors
      setError("");

      // Update form data with file
      handleInputChange("idFile", file);
      console.log("File stored in formData:", file.name);
    } else {
      console.log("No file selected");
    }
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
          setProfileId(profileData.id); // Store profile ID for PATCH request

          console.log("Profile data to populate:", profileData);

          // Check if government_id exists (could be URL, file path, or file object)
          if (profileData.government_id) {
            // Store the existing government ID (could be a URL string or file path)
            const govtId = profileData.government_id;
            setExistingGovernmentId(govtId);
            console.log("Existing government ID found:", govtId);
            console.log("Government ID type:", typeof govtId);
          } else {
            console.log("No existing government ID found in profile data");
          }

          // Parse date of birth from "2001-09-26" format to month, day, year
          let birthMonth = "";
          let birthDay = "";
          let birthYear = "";
          if (profileData.date_of_birth) {
            const dateParts = profileData.date_of_birth.split("-");
            if (dateParts.length === 3) {
              birthYear = dateParts[0]; // "2001"
              birthMonth = dateParts[1]; // "09"
              birthDay = dateParts[2]; // "26"

              // Convert month number to month name
              const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              const monthIndex = parseInt(birthMonth) - 1;
              if (monthIndex >= 0 && monthIndex < 12) {
                birthMonth = monthNames[monthIndex];
              }
            }
          }

          // Update form data with fetched values
          setFormData({
            idFile: null, // New file upload (if user wants to change)
            birthMonth: birthMonth,
            birthDay: birthDay,
            birthYear: birthYear,
            streetAddress: profileData.street_address || "",
            city: profileData.city || "",
            state: profileData.state_province || "",
            zipCode: profileData.zip_postal_code || "",
            country: profileData.country || "",
          });

          console.log("Form data updated with KYC data");
        } else {
          // If no profile exists, we still need to get profile ID from basic info
          // For now, we'll get it when user submits
          console.log("No profile data found in response");
        }
      } catch (err) {
        // If profile doesn't exist (404), that's okay - just don't populate
        if (err.response?.status === 404) {
          console.log("Profile not found, starting with empty form");
        } else {
          console.error("Error fetching profile:", err);
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleContinue = async () => {
    // Validate form data

    // Validate file: either new file selected OR existing file exists
    if (!formData.idFile && !existingGovernmentId) {
      setError("Please upload a government-issued ID");
      return;
    }

    if (!formData.birthMonth || !formData.birthDay || !formData.birthYear) {
      setError("Date of birth is required");
      return;
    }
    if (!formData.streetAddress.trim()) {
      setError("Street address is required");
      return;
    }
    if (!formData.city.trim()) {
      setError("City is required");
      return;
    }
    if (!formData.state.trim()) {
      setError("State/Province is required");
      return;
    }
    if (!formData.zipCode.trim()) {
      setError("ZIP/Postal code is required");
      return;
    }
    if (!formData.country) {
      setError("Country is required");
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
          setError("Profile not found. Please complete basic info first.");
          setLoading(false);
          return;
        }
      }

      // Convert month name to number (e.g., "September" -> "09")
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthIndex = monthNames.indexOf(formData.birthMonth);
      const monthNumber = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, "0") : "";

      // Format date of birth as "YYYY-MM-DD"
      const dateOfBirth = `${formData.birthYear}-${monthNumber}-${String(formData.birthDay).padStart(2, "0")}`;

      // Prepare FormData for multipart/form-data request
      const formDataToSend = new FormData();

      // Only append file if a new file is selected (user wants to update/replace existing file)
      if (formData.idFile) {
        console.log("File to upload:", formData.idFile.name, "Size:", formData.idFile.size, "Type:", formData.idFile.type);
        formDataToSend.append("government_id", formData.idFile);
      } else {
        console.log("No new file selected, keeping existing government_id");
      }

      formDataToSend.append("date_of_birth", dateOfBirth);
      formDataToSend.append("street_address", formData.streetAddress.trim());
      formDataToSend.append("city", formData.city.trim());
      formDataToSend.append("state_province", formData.state.trim());
      formDataToSend.append("zip_postal_code", formData.zipCode.trim());
      formDataToSend.append("country", formData.country);

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
      const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/${currentProfileId}/update_step2/`;

      console.log("Sending KYC data to:", finalUrl);
      console.log("Profile ID:", currentProfileId);
      console.log("Date of birth:", dateOfBirth);

      // Make PATCH request
      const response = await axios.patch(finalUrl, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("KYC data updated successfully:", response.data);

      // Navigate to next step on success
      navigate("/investor-onboarding/bank-details");
    } catch (err) {
      console.error("Error updating KYC data:", err);
      console.error("Error response:", err.response);

      // Handle error messages
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          if (backendData.non_field_errors) {
            setError(backendData.non_field_errors[0]);
          } else if (backendData.government_id) {
            setError(backendData.government_id[0] || "Invalid government ID file");
          } else if (backendData.date_of_birth) {
            setError(backendData.date_of_birth[0] || "Invalid date of birth");
          } else if (backendData.street_address) {
            setError(backendData.street_address[0] || "Invalid street address");
          } else if (backendData.city) {
            setError(backendData.city[0] || "Invalid city");
          } else if (backendData.state_province) {
            setError(backendData.state_province[0] || "Invalid state/province");
          } else if (backendData.zip_postal_code) {
            setError(backendData.zip_postal_code[0] || "Invalid ZIP/postal code");
          } else if (backendData.country) {
            setError(backendData.country[0] || "Invalid country");
          } else if (backendData.detail) {
            setError(backendData.detail);
          } else {
            setError(JSON.stringify(backendData));
          }
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to save KYC data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/basic-info");
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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

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
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 2: KYC / Identity Verification</h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#748A91] mb-4 font-poppins-custom text-center sm:text-left">
              Help us verify your identity to meet compliance and protect your investment account.
            </p>

            {/* Loading indicator while fetching data */}
            {fetching && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm font-poppins-custom">Loading your KYC data...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-poppins-custom">{error}</p>
              </div>
            )}

            {/* Accepted IDs Highlight */}
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 mb-8 inline-block text-center sm:text-left">
              <span className="text-sm text-[#0A2A2E] font-poppins-custom">
                Accepted: Passport, Driver's License, etc.
              </span>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">
              {/* Upload Government-Issued ID */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom flex items-center gap-2">
                  Upload Government-Issued ID <span className="text-red-500">*</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-help">
                    <circle cx="8" cy="8" r="7" stroke="#748A91" strokeWidth="1.5" fill="none" />
                    <path d="M8 5V8M8 11H8.01" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </label>
                <div
                  className={`border-2 rounded-lg p-8 text-center cursor-pointer transition-colors ${formData.idFile
                      ? "bg-green-50 border-green-400"
                      : existingGovernmentId
                        ? "bg-blue-50 border-blue-400"
                        : "bg-[#F4F6F5] hover:border-[#9889FF]"
                    }`}
                  style={{
                    border: formData.idFile
                      ? "2px solid #10B981"
                      : existingGovernmentId
                        ? "2px solid #3B82F6"
                        : "0.5px solid #0A2A2E"
                  }}
                >
                  <input
                    type="file"
                    id="idUpload"
                    onChange={handleFileChange}
                    accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label htmlFor="idUpload" className="cursor-pointer block">
                    <div className="mb-4 flex justify-center">
                      {formData.idFile ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" fill="none" />
                          <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : existingGovernmentId ? (
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
                    {formData.idFile ? (
                      <>
                        <p className="text-green-600 font-poppins-custom mb-2 font-semibold">
                          ✓ New File Selected
                        </p>
                        <p className="text-[#0A2A2E] font-poppins-custom mb-2 font-medium">
                          {formData.idFile.name}
                        </p>
                        <p className="text-sm text-[#748A91] font-poppins-custom">
                          Size: {(formData.idFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <p className="text-sm text-[#748A91] font-poppins-custom mt-2">
                          Click to change file
                        </p>
                      </>
                    ) : existingGovernmentId ? (
                      <>
                        <p className="text-blue-600 font-poppins-custom mb-2 font-semibold">
                          ✓ Government ID Already Uploaded
                        </p>
                        <p className="text-[#0A2A2E] font-poppins-custom mb-2 font-medium">
                          {typeof existingGovernmentId === 'string' && existingGovernmentId.includes('/')
                            ? existingGovernmentId.split('/').pop()
                            : 'Government ID File'}
                        </p>
                        {typeof existingGovernmentId === 'string' && (existingGovernmentId.startsWith('http://') || existingGovernmentId.startsWith('https://')) && (
                          <a
                            href={existingGovernmentId}
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
                          Drag and drop or click to upload Government ID
                        </p>
                        <p className="text-[#748A91] font-poppins-custom mb-2">
                          Accepted: PDF, PPT, PPTX, JPG, JPEG, PNG (max 5MB)
                        </p>
                        <p className="text-[#748A91] font-poppins-custom text-sm">
                          Front and back in a single file
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex">
                    <select
                      value={formData.birthMonth}
                      onChange={(e) => handleInputChange("birthMonth", e.target.value)}
                      className="w-fit bg-[#F4F6F5] text-[#748A91] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex">
                    <select
                      value={formData.birthDay}
                      onChange={(e) => handleInputChange("birthDay", e.target.value)}
                      className="w-fit bg-[#F4F6F5] text-[#748A91] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex">
                    <select
                      value={formData.birthYear}
                      onChange={(e) => handleInputChange("birthYear", e.target.value)}
                      className="w-fit bg-[#F4F6F5] text-[#748A91] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                  Residential Address<span className="text-red-500">*</span>
                </label>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                      Street Address:
                    </label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                      placeholder="e.g., 123 Main Street"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                      City:
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                      placeholder="e.g., New York"
                    />
                  </div>

                  {/* State / Province and ZIP / Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                        State / Province:
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                        style={{ border: "0.5px solid #0A2A2E" }}
                        placeholder="e.g., California"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                        ZIP / Postal Code:
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                        style={{ border: "0.5px solid #0A2A2E" }}
                        placeholder="e.g., 10001"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                      Country:
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Select your country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
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

export default KYCVerification;

