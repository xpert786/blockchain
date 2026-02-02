import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UpsyndicateIcon } from "../../components/Icons";

const ComplianceAttestation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [additionalPolicies, setAdditionalPolicies] = useState(null);
  const [additionalPoliciesUrl, setAdditionalPoliciesUrl] = useState(null); // Store file URL from API
  const [formData, setFormData] = useState({
    regulatoryCompliance: false,
    dataProtection: false,
    termsAndConditions: false,
    privacyPolicy: false,
    riskDisclosure: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdditionalPolicies(file);
      // Clear file URL when new file is selected
      setAdditionalPoliciesUrl(null);
    }
  };

  // Helper function to construct file URL from API response
  const constructFileUrl = (filePath) => {
    if (!filePath) return null;

    const baseDomain = "http://168.231.121.7";

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    } else if (filePath.startsWith('/')) {
      if (filePath.startsWith('/api/blockchain-backend/')) {
        return `${baseDomain}${filePath.replace(/^\/api/, '')}`;
      } else if (filePath.startsWith('/blockchain-backend/')) {
        return `${baseDomain}${filePath}`;
      } else if (filePath.startsWith('/media/')) {
        return `${baseDomain}/blockchain-backend${filePath}`;
      } else {
        return `${baseDomain}/blockchain-backend${filePath}`;
      }
    } else {
      return `${baseDomain}/blockchain-backend/${filePath}`;
    }
  };

  // Fetch existing step3 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const step3Url = `${API_URL.replace(/\/$/, "")}/syndicate/step3/`;

        console.log("=== Fetching Step3 Data ===");
        console.log("API URL:", step3Url);

        try {
          const step3Response = await axios.get(step3Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("Step3 response:", step3Response.data);

          if (step3Response.data && step3Response.status === 200) {
            const responseData = step3Response.data;

            console.log("📦 Full Step3 response structure:", JSON.stringify(responseData, null, 2));

            // Get step_data and profile (same structure as step1/step2)
            const stepData = responseData.step_data || {};
            const profile = responseData.profile || {};

            console.log("✅ step_data:", stepData);
            console.log("✅ profile:", profile);

            // Get compliance data from step_data, profile, or root level
            const nestedData = responseData.data || {};
            const riskRegulatoryAttestation = nestedData.risk_regulatory_attestation ||
              stepData.risk_regulatory_attestation ||
              profile.risk_regulatory_attestation ||
              responseData.risk_regulatory_attestation ||
              false;
            const additionalPoliciesPath = nestedData.additional_compliance_policies ||
              stepData.additional_compliance_policies ||
              profile.additional_compliance_policies ||
              responseData.additional_compliance_policies;

            console.log("✅ Risk Regulatory Attestation:", riskRegulatoryAttestation);
            console.log("✅ Additional Policies Path:", additionalPoliciesPath);

            // Check if we have any data
            if (riskRegulatoryAttestation || additionalPoliciesPath) {
              setHasExistingData(true);

              // Populate form with existing data
              setFormData({
                regulatoryCompliance: riskRegulatoryAttestation || false,
                dataProtection: false,
                termsAndConditions: false,
                privacyPolicy: false,
                riskDisclosure: false
              });

              // If additional policies file exists as URL, set it for display
              if (additionalPoliciesPath) {
                const fileUrl = constructFileUrl(additionalPoliciesPath);
                setAdditionalPoliciesUrl(fileUrl);
                console.log("✅ Additional policies file URL set:", fileUrl);
                console.log("✅ Original additional policies value from API:", additionalPoliciesPath);
              }

              console.log("✅ Form populated with existing Step3 data");
            } else {
              setHasExistingData(false);
            }
          } else {
            setHasExistingData(false);
          }
        } catch (step3Err) {
          // If step3 data doesn't exist (404), it's fine - user will create new
          if (step3Err.response?.status === 404) {
            console.log("No existing step3 data found - will create new");
            setHasExistingData(false);
          } else {
            console.error("Error fetching existing step3 data:", step3Err);
            console.error("Error details:", step3Err.response?.data);
            console.error("Error status:", step3Err.response?.status);
          }
        }
      } catch (err) {
        console.error("Error in fetchExistingData:", err);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    fetchExistingData();
  }, []);

  const handleNext = async () => {
    setLoading(true);
    setError("");

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      // Validate required fields
      if (!formData.regulatoryCompliance) {
        throw new Error("Please acknowledge the Risk & Regulatory Attestation.");
      }

      // Get API URL
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3/`;

      console.log("=== Compliance Attestation API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("API URL:", finalUrl);
      console.log("Form Data:", {
        regulatoryCompliance: formData.regulatoryCompliance,
        antiMoneyLaundering: formData.antiMoneyLaundering,
        hasAdditionalPoliciesFile: !!additionalPolicies,
        hasAdditionalPoliciesUrl: !!additionalPoliciesUrl
      });

      let response;

      // If there's a file to upload, use FormData; otherwise use JSON
      if (additionalPolicies) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        formDataToSend.append("risk_regulatory_attestation", formData.regulatoryCompliance);
        formDataToSend.append("additional_compliance_policies", additionalPolicies);

        console.log("🔄 Sending with FormData (file included)");
        response = await axios.patch(finalUrl, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
      } else {
        // Use JSON format (as shown in curl command)
        const requestData = {
          risk_regulatory_attestation: formData.regulatoryCompliance
        };

        console.log("🔄 Sending with JSON (no file)");
        response = await axios.patch(finalUrl, requestData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      }

      console.log("Compliance attestation saved successfully:", response.data);
      // Mark that data now exists for future updates
      setHasExistingData(true);

      // Navigate to next step on success
      navigate("/syndicate-creation/final-review");

    } catch (err) {
      console.error("Compliance attestation error:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessages = Object.values(backendData).flat();
          setError(errorMessages.join(", ") || "Failed to submit compliance attestation.");
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to submit compliance attestation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/kyb-verification");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 3: Compliance & Attestation</h1>
        <p className="text-gray-600">Review regulatory requirements and provide necessary attestations.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-8">


        {/* Risk & Regulatory Attestation Warning */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-800">Risk & Regulatory Attestation</span>
          </div>
          <p className="text-gray-600 mb-4">Based on your home jurisdiction (United States), the following restrictions apply:</p>

          <div className="p-4 bg-[#FDECEC] !border border-red-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">United States Requirements</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Must comply with SEC regulations for private placements</li>
              <li>• Limited to accredited investors only</li>
              <li>• Required to file Form D within 15 days of first sale</li>
              <li>• Cannot engage in general solicitation or advertising</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 mt-4">
            <input
              type="checkbox"
              checked={formData.regulatoryCompliance}
              onChange={(e) => handleInputChange("regulatoryCompliance", e.target.checked)}
              className="mt-1"
            />
            <span className="text-gray-700">I acknowledge and agree to comply with all risk and regulatory requirements listed above.</span>
          </label>
        </div>


        {/* Additional Policies (Optional) */}
        <div>
          <h2 className="text-xl font-medium  text-[#0A2A2E] text-gray-800 mb-2">Additional Policies (Optional)</h2>
          <p className="text-gray-600 mb-4">Upload any additional compliance policies, procedures, or documentation you'd like to include.</p>

          <label htmlFor="additionalPolicies" className="cursor-pointer">
            <div className="border bordaper-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-8 text-center hover:bg-[#F0F2F1] transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="additionalPolicies"
              />
              <div className="mb-4 flex justify-center">
                <UpsyndicateIcon />
              </div>
              <p className="text-gray-500">Click to upload Files</p>
              {additionalPolicies && (
                <p className="text-green-600 mt-2">✓ {additionalPolicies.name}</p>
              )}
              {additionalPoliciesUrl && !additionalPolicies && (
                <div className="mt-2">
                  <p className="text-blue-600 text-sm">✓ File loaded from server</p>
                  <a
                    href={additionalPoliciesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-500 text-xs underline mt-1 inline-block"
                  >
                    View existing file
                  </a>
                </div>
              )}
            </div>
          </label>
          {(additionalPolicies || additionalPoliciesUrl) && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setAdditionalPolicies(null);
                setAdditionalPoliciesUrl(null);
                const fileInput = document.getElementById("additionalPolicies");
                if (fileInput) fileInput.value = "";
              }}
              className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
          {additionalPolicies && (
            <p className="text-xs text-gray-500 mt-2">Selected: {additionalPolicies.name}</p>
          )}
          {additionalPoliciesUrl && !additionalPolicies && (
            <p className="text-xs text-gray-500 mt-2">Current file loaded from server</p>
          )}
        </div>

        <div className="p-4 bg-[#FDECEC] !border border-red-200 rounded-lg flex flex-row gap-5 items-center">
          <div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.1083 14.9999L11.4417 3.3332C11.2963 3.0767 11.0855 2.86335 10.8308 2.71492C10.576 2.56649 10.2865 2.48828 9.99167 2.48828C9.69685 2.48828 9.4073 2.56649 9.15257 2.71492C8.89783 2.86335 8.68703 3.0767 8.54167 3.3332L1.875 14.9999C1.72807 15.2543 1.65103 15.5431 1.65168 15.837C1.65233 16.1308 1.73065 16.4192 1.87871 16.673C2.02676 16.9269 2.23929 17.137 2.49475 17.2822C2.7502 17.4274 3.03951 17.5025 3.33334 17.4999H16.6667C16.9591 17.4996 17.2463 17.4223 17.4994 17.2759C17.7525 17.1295 17.9627 16.9191 18.1088 16.6658C18.2548 16.4125 18.3317 16.1252 18.3316 15.8328C18.3316 15.5404 18.2545 15.2531 18.1083 14.9999Z" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 7.5V10.8333" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 14.167H10.01" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 ">Compliance</h3>
            <p className="text-[#748A91] mb-3 text-sm font-thin">KYB verification is still pending. You can continue, but KYB must be approved before publishing SPVs or accepting LP capital.</p>
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 !border border-[#01373D]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={loading || !formData.regulatoryCompliance}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Next"}
          {!loading && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ComplianceAttestation;
