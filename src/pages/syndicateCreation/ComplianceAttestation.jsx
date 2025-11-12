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
    antiMoneyLaundering: false,
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

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
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
            
            // Get compliance data from step_data or profile
            const riskRegulatoryAttestation = stepData.risk_regulatory_attestation || 
                                             profile.risk_regulatory_attestation || 
                                             false;
            const jurisdictionalComplianceAcknowledged = stepData.jurisdictional_compliance_acknowledged || 
                                                         profile.jurisdictional_compliance_acknowledged || 
                                                         false;
            const additionalPoliciesPath = stepData.additional_compliance_policies || 
                                          profile.additional_compliance_policies;
            
            console.log("✅ Risk Regulatory Attestation:", riskRegulatoryAttestation);
            console.log("✅ Jurisdictional Compliance Acknowledged:", jurisdictionalComplianceAcknowledged);
            console.log("✅ Additional Policies Path:", additionalPoliciesPath);
            
            // Check if we have any data
            if (riskRegulatoryAttestation || jurisdictionalComplianceAcknowledged || additionalPoliciesPath) {
              setHasExistingData(true);
              
              // Populate form with existing data
              setFormData({
                regulatoryCompliance: riskRegulatoryAttestation || false,
                antiMoneyLaundering: jurisdictionalComplianceAcknowledged || false,
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

      if (!formData.antiMoneyLaundering) {
        throw new Error("Please acknowledge the jurisdictional compliance requirements.");
      }

      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add required fields - convert boolean to string "true"/"false"
      formDataToSend.append("risk_regulatory_attestation", formData.regulatoryCompliance ? "true" : "false");
      formDataToSend.append("jurisdictional_compliance_acknowledged", formData.antiMoneyLaundering ? "true" : "false");

      // Handle additional policies file
      // For PATCH: If no new file, don't send file field (keeps existing file)
      // For POST: Send file if exists, otherwise don't send (optional field)
      if (additionalPolicies) {
        formDataToSend.append("additional_compliance_policies", additionalPolicies);
        console.log("Additional policies file will be uploaded:", additionalPolicies.name);
      } else if (!hasExistingData) {
        // For new data, file is optional - don't send if not provided
        console.log("No additional policies file for new data");
      } else {
        // For existing data, don't send file field (keeps existing file)
        console.log("No new additional policies file, keeping existing file");
      }

      // Get API URL
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
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
      
      // Use PATCH if data exists, POST if it's new
      if (hasExistingData) {
        console.log("🔄 Updating existing data with PATCH");
        response = await axios.patch(finalUrl, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
        console.log("Compliance attestation updated successfully:", response.data);
      } else {
        console.log("➕ Creating new data with POST");
        response = await axios.post(finalUrl, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
        console.log("Compliance attestation created successfully:", response.data);
        // Mark that data now exists for future updates
        setHasExistingData(true);
      }

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
        {/* Risk & Regulatory Attestation */}
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.regulatoryCompliance}
              onChange={(e) => handleInputChange("regulatoryCompliance", e.target.checked)}
              className="mt-1"
            />
            <span className="font-medium text-gray-800">Risk & Regulatory Attestation</span>
          </label>
          
          <div className="mt-4 p-4 bg-[#F9F8FF] rounded-lg">
            <p className="text-gray-700 mb-3">I acknowledge and understand that:</p>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Leading syndicates involves significant regulatory responsibilities.</li>
              <li>• I must comply with all applicable securities laws and regulations.</li>
              <li>• I am responsible for ensuring all investors meet accreditation requirements.</li>
              <li>• I understand the risks associated with private investment activities.</li>
              <li>• I will maintain proper records and documentation as required by law.</li>
              <li>• I may be subject to regulatory examination and enforcement actions.</li>
            </ul>
          </div>
        </div>

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
              checked={formData.antiMoneyLaundering}
              onChange={(e) => handleInputChange("antiMoneyLaundering", e.target.checked)}
              className="mt-1"
            />
            <span className="text-gray-700">I acknowledge and agree to comply with all jurisdictional requirements listed above.</span>
          </label>
        </div>

        {/* Additional Policies (Optional) */}
        <div>
          <h2 className="text-xl font-medium  text-[#0A2A2E] text-gray-800 mb-2">Additional Policies (Optional)</h2>
          <p className="text-gray-600 mb-4">Upload any additional compliance policies, procedures, or documentation you'd like to include.</p>
          
          <label htmlFor="additionalPolicies" className="cursor-pointer">
            <div className="border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-8 text-center hover:bg-[#F0F2F1] transition-colors">
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
          disabled={loading || !formData.regulatoryCompliance || !formData.antiMoneyLaundering}
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
