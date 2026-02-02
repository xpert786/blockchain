import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";

const BankDetails = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Bank Details / Payment Setup");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [existingProofFile, setExistingProofFile] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    accountHolderName: "",
    swiftCode: "",
    proofFile: null,
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

          // Check if proof_of_bank_ownership exists
          if (profileData.proof_of_bank_ownership) {
            const proofFile = profileData.proof_of_bank_ownership;
            setExistingProofFile(proofFile);
            console.log("Existing proof of bank ownership found:", proofFile);
          } else {
            console.log("No existing proof of bank ownership found in profile data");
          }

          // Update form data with fetched values
          setFormData({
            accountNumber: profileData.bank_account_number || "",
            bankName: profileData.bank_name || "",
            accountHolderName: profileData.account_holder_name || "",
            swiftCode: profileData.swift_ifsc_code || "",
            proofFile: null, // New file upload (if user wants to change)
          });

          console.log("Form data updated with bank details");
        } else {
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
    if (!formData.accountNumber.trim()) {
      setError("Bank account number is required");
      return;
    }
    if (!formData.bankName.trim()) {
      setError("Bank name is required");
      return;
    }
    if (!formData.accountHolderName.trim()) {
      setError("Account holder's name is required");
      return;
    }
    if (!formData.swiftCode.trim()) {
      setError("SWIFT/IFSC/Sort code is required");
      return;
    }
    if (!formData.proofFile && !existingProofFile) {
      setError("Proof of bank ownership is required");
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
          setError("Profile not found. Please complete previous steps first.");
          setLoading(false);
          return;
        }
      }

      // Prepare FormData for multipart/form-data request
      const formDataToSend = new FormData();

      // Only append file if a new one is selected
      if (formData.proofFile) {
        console.log("File to upload:", formData.proofFile.name, "Size:", formData.proofFile.size, "Type:", formData.proofFile.type);
        formDataToSend.append("proof_of_bank_ownership", formData.proofFile);
      }

      formDataToSend.append("bank_account_number", formData.accountNumber.trim());
      formDataToSend.append("bank_name", formData.bankName.trim());
      formDataToSend.append("account_holder_name", formData.accountHolderName.trim());
      formDataToSend.append("swift_ifsc_code", formData.swiftCode.trim());

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
      const finalUrl = `${API_URL.replace(/\/$/, "")}/profiles/${currentProfileId}/update_step3/`;

      console.log("Sending bank details to:", finalUrl);
      console.log("Profile ID:", currentProfileId);

      // Make PATCH request
      const response = await axios.patch(finalUrl, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Bank details updated successfully:", response.data);

      // Navigate to next step on success
      navigate("/investor-onboarding/accreditation");
    } catch (err) {
      console.error("Error updating bank details:", err);
      console.error("Error response:", err.response);

      // Handle error messages
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          if (backendData.non_field_errors) {
            setError(backendData.non_field_errors[0]);
          } else if (backendData.bank_account_number) {
            setError(backendData.bank_account_number[0] || "Invalid bank account number");
          } else if (backendData.bank_name) {
            setError(backendData.bank_name[0] || "Invalid bank name");
          } else if (backendData.account_holder_name) {
            setError(backendData.account_holder_name[0] || "Invalid account holder name");
          } else if (backendData.swift_ifsc_code) {
            setError(backendData.swift_ifsc_code[0] || "Invalid SWIFT/IFSC code");
          } else if (backendData.proof_of_bank_ownership) {
            setError(backendData.proof_of_bank_ownership[0] || "Invalid proof of bank ownership file");
          } else if (backendData.detail) {
            setError(backendData.detail);
          } else {
            setError(JSON.stringify(backendData));
          }
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to save bank details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/kyc-verification");
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
            {steps.map((step, index) => (
              <button
                key={step}
                onClick={() => handleStepClick(step)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors font-poppins-custom ${activeStep === step ? "bg-white text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/60"
                  } flex items-center gap-2`}
              >
                {index < 2 && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                    <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>{step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-5 sm:p-6 lg:p-8 lg:mr-4">
          <div className="mx-auto w-full max-w-3xl">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 3: Bank Details / Payment Setup</h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#748A91] mb-8 font-poppins-custom text-center sm:text-left">
              Securely add your bank or wallet details for payouts and fund transfers.
            </p>

            {/* Loading indicator while fetching data */}
            {fetching && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm font-poppins-custom">Loading your bank details...</p>
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
              {/* Bank Account Number / Wallet Address */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Bank Account Number / Wallet Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="e.g., 1234567890"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="e.g., JPMorgan Chase, HDFC Bank"
                />
              </div>

              {/* Account Holder's Name */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Account Holder's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="e.g., John A. Smith"
                />
              </div>

              {/* SWIFT/IFSC/Sort Code */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  SWIFT/IFSC/Sort Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={(e) => handleInputChange("swiftCode", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="e.g., CHASUS33"
                />
              </div>

              {/* Upload Proof of Bank Ownership */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom flex items-center gap-2">
                  Upload Proof of Bank Ownership
                  <div className="relative group">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.41699 9.91797H7.58366V6.41797H6.41699V9.91797ZM7.00033 5.2513C7.1656 5.2513 7.30424 5.1953 7.41624 5.0833C7.52824 4.9713 7.58405 4.83286 7.58366 4.66797C7.58327 4.50308 7.52727 4.36464 7.41566 4.25264C7.30405 4.14064 7.1656 4.08464 7.00033 4.08464C6.83505 4.08464 6.6966 4.14064 6.58499 4.25264C6.47338 4.36464 6.41738 4.50308 6.41699 4.66797C6.4166 4.83286 6.4726 4.9715 6.58499 5.08389C6.69738 5.19627 6.83583 5.25208 7.00033 5.2513ZM7.00033 12.8346C6.19338 12.8346 5.43505 12.6814 4.72533 12.375C4.0156 12.0685 3.39824 11.653 2.87324 11.1284C2.34824 10.6038 1.93272 9.98641 1.62666 9.2763C1.3206 8.56619 1.16738 7.80786 1.16699 7.0013C1.1666 6.19475 1.31983 5.43641 1.62666 4.7263C1.93349 4.01619 2.34902 3.39883 2.87324 2.87422C3.39747 2.34961 4.01483 1.93408 4.72533 1.62764C5.43583 1.32119 6.19416 1.16797 7.00033 1.16797C7.80649 1.16797 8.56483 1.32119 9.27533 1.62764C9.98583 1.93408 10.6032 2.34961 11.1274 2.87422C11.6516 3.39883 12.0674 4.01619 12.3746 4.7263C12.6818 5.43641 12.8348 6.19475 12.8337 7.0013C12.8325 7.80786 12.6793 8.56619 12.374 9.2763C12.0687 9.98641 11.6532 10.6038 11.1274 11.1284C10.6016 11.653 9.98427 12.0687 9.27533 12.3756C8.56638 12.6824 7.80805 12.8354 7.00033 12.8346Z" fill="#E9BB30" />
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute left-0 top-6 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <span className="text-xs text-[#0A2A2E] font-poppins-custom">
                        e.g., canceled cheque, bank statement
                      </span>
                    </div>
                  </div>
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
                          ✓ Proof of Bank Ownership Already Uploaded
                        </p>
                        <p className="text-[#0A2A2E] font-poppins-custom mb-2 font-medium">
                          {typeof existingProofFile === 'string' && existingProofFile.includes('/')
                            ? existingProofFile.split('/').pop()
                            : 'Proof of Bank Ownership File'}
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
                          Drag and drop or click to upload proof of bank ownership
                        </p>
                        <p className="text-[#748A91] font-poppins-custom mb-2">
                          Accepted: PDF, JPG, JPEG, PNG (max 5MB)
                        </p>
                        <p className="text-[#748A91] font-poppins-custom text-sm">
                          e.g., canceled cheque, bank statement
                        </p>
                      </>
                    )}
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
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => handleStepClick(step)}
              className={`w-full text-left rounded-lg px-4 py-3 transition-colors font-poppins-custom flex items-center gap-2 ${activeStep === step ? "bg-[#00F0C3]/20 text-[#001D21]" : "text-[#001D21] hover:bg-[#F4F6F5]"
                }`}
            >
              {index < 2 && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                  <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span>{step}</span>
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

export default BankDetails;

