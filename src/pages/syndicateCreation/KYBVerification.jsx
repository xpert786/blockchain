import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UpsyndicateIcon } from "../../components/Icons";

const KYBVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    entityLegalName: "",
    entityType: "Individual",
    countryOfIncorporation: "",
    registrationNumber: "",
    // Registered Address
    registeredStreetAddress: "",
    registeredPostalCode: "",
    registeredState: "",
    registeredArea: "",
    registeredCity: "",
    registeredCountry: "",
    // Operating Address (Optional)
    operatingStreetAddress: "",
    operatingPostalCode: "",
    operatingState: "",
    operatingArea: "",
    operatingCity: "",
    operatingCountry: "",
    // Company Documents
    certOfIncorporation: null,
    registeredAddressDoc: null,
    directorsRegister: null,
    // Trust / Foundation Documents
    trustDeed: null,
    // Partnership Documents
    partnershipAgreement: null
  });

  // Store existing file URLs from API
  const [existingFiles, setExistingFiles] = useState({
    certOfIncorporation: null,
    registeredAddressDoc: null,
    directorsRegister: null,
    trustDeed: null,
    partnershipAgreement: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  // Fetch existing step3a data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const step3aUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3a/`;

        console.log("=== Fetching Step3a Data ===");
        console.log("API URL:", step3aUrl);

        const response = await axios.get(step3aUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Step3a response:", response.data);
        console.log("Step3a response structure:", JSON.stringify(response.data, null, 2));

        if (response.data && response.status === 200) {
          const responseData = response.data;
          // API response has data nested under 'data' key: { data: { entity_legal_name: ... } }
          const nestedData = responseData.data || {};
          const profile = responseData.profile || {};
          const stepData = responseData.step_data || {};

          // Check nested data first (most common structure), then root level, then step_data, then profile
          const hasNestedData = nestedData.entity_legal_name !== undefined ||
            nestedData.registration_number !== undefined ||
            nestedData.registered_street_address !== undefined ||
            nestedData.operating_street_address !== undefined;

          const hasRootData = responseData.entity_legal_name !== undefined ||
            responseData.registration_number !== undefined ||
            responseData.registered_street_address !== undefined ||
            responseData.operating_street_address !== undefined;

          // Priority: nested data > root level > step_data > profile
          let sourceData = {};
          if (hasNestedData) {
            sourceData = nestedData;
            console.log("✅ Using nested data.data");
          } else if (hasRootData) {
            sourceData = responseData;
            console.log("✅ Using root level data");
          } else if (Object.keys(stepData).length > 0) {
            sourceData = stepData;
            console.log("✅ Using step_data");
          } else {
            sourceData = profile;
            console.log("✅ Using profile");
          }

          console.log("✅ Source data:", JSON.stringify(sourceData, null, 2));
          console.log("✅ Source data keys:", Object.keys(sourceData));

          // Helper function to capitalize entity type
          const capitalizeEntityType = (type) => {
            if (!type) return "Individual";
            const lower = String(type).toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
          };

          // Map API response to form data - use same pattern as EntityProfile.jsx
          setFormData(prev => ({
            ...prev,
            entityLegalName: sourceData.entity_legal_name || prev.entityLegalName,
            entityType: sourceData.entity_type ? capitalizeEntityType(sourceData.entity_type) : prev.entityType,
            countryOfIncorporation: sourceData.country_of_incorporation || prev.countryOfIncorporation,
            registrationNumber: sourceData.registration_number || prev.registrationNumber,
            registeredStreetAddress: sourceData.registered_street_address || prev.registeredStreetAddress,
            registeredArea: sourceData.registered_area_landmark || prev.registeredArea,
            registeredPostalCode: sourceData.registered_postal_code || prev.registeredPostalCode,
            registeredCity: sourceData.registered_city || prev.registeredCity,
            registeredState: sourceData.registered_state || prev.registeredState,
            registeredCountry: sourceData.registered_country || prev.registeredCountry,
            operatingStreetAddress: sourceData.operating_street_address || prev.operatingStreetAddress,
            operatingArea: sourceData.operating_area_landmark || prev.operatingArea,
            operatingPostalCode: sourceData.operating_postal_code || prev.operatingPostalCode,
            operatingCity: sourceData.operating_city || prev.operatingCity,
            operatingState: sourceData.operating_state || prev.operatingState,
            operatingCountry: sourceData.operating_country || prev.operatingCountry,
            // Keep file fields as null (files are not pre-filled, only URLs would be)
            certOfIncorporation: null,
            registeredAddressDoc: null,
            directorsRegister: null,
            trustDeed: null,
            partnershipAgreement: null
          }));

          // Store existing file URLs from API
          setExistingFiles({
            certOfIncorporation: sourceData.certificate_of_incorporation_url || null,
            registeredAddressDoc: sourceData.registered_address_proof_url || null,
            directorsRegister: sourceData.directors_register_url || null,
            trustDeed: sourceData.trust_deed_url || null,
            partnershipAgreement: sourceData.partnership_agreement_url || null
          });

          console.log("✅ Form populated with existing Step3a data");
        }
      } catch (err) {
        // If 404, no existing data - that's fine
        if (err.response?.status === 404) {
          console.log("No existing Step3a data found - will create new");
        } else {
          console.error("Error fetching existing Step3a data:", err);
        }
      }
    };

    fetchExistingData();
  }, []);

  const handleNext = async () => {
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.entityLegalName.trim()) {
      setError("Entity Legal Name is required.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const step3aUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3a/`;

      // Check if any files are being uploaded
      const hasFiles = formData.certOfIncorporation ||
        formData.registeredAddressDoc ||
        formData.directorsRegister ||
        formData.trustDeed ||
        formData.partnershipAgreement;

      if (hasFiles) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();

        // Add text fields
        formDataToSend.append("entity_legal_name", formData.entityLegalName);
        formDataToSend.append("entity_type", formData.entityType.toLowerCase());
        formDataToSend.append("country_of_incorporation", formData.countryOfIncorporation || "");
        formDataToSend.append("registration_number", formData.registrationNumber || "");
        formDataToSend.append("registered_street_address", formData.registeredStreetAddress || "");
        formDataToSend.append("registered_area_landmark", formData.registeredArea || "");
        formDataToSend.append("registered_postal_code", formData.registeredPostalCode || "");
        formDataToSend.append("registered_city", formData.registeredCity || "");
        formDataToSend.append("registered_state", formData.registeredState || "");
        formDataToSend.append("registered_country", formData.registeredCountry || "");
        formDataToSend.append("operating_street_address", formData.operatingStreetAddress || "");
        formDataToSend.append("operating_area_landmark", formData.operatingArea || "");
        formDataToSend.append("operating_postal_code", formData.operatingPostalCode || "");
        formDataToSend.append("operating_city", formData.operatingCity || "");
        formDataToSend.append("operating_state", formData.operatingState || "");
        formDataToSend.append("operating_country", formData.operatingCountry || "");

        // Add files if they exist
        if (formData.certOfIncorporation) {
          formDataToSend.append("certificate_of_incorporation", formData.certOfIncorporation);
        }
        if (formData.registeredAddressDoc) {
          formDataToSend.append("registered_address_proof", formData.registeredAddressDoc);
        }
        if (formData.directorsRegister) {
          formDataToSend.append("directors_register", formData.directorsRegister);
        }
        if (formData.trustDeed) {
          formDataToSend.append("trust_deed", formData.trustDeed);
        }
        if (formData.partnershipAgreement) {
          formDataToSend.append("partnership_agreement", formData.partnershipAgreement);
        }

        console.log("=== PATCH Step3a Data (with files) ===");
        console.log("API URL:", step3aUrl);

        const response = await axios.patch(step3aUrl, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
            // Note: Don't set Content-Type header - axios will set it automatically with boundary for FormData
          }
        });

        console.log("✅ Step3a updated successfully:", response.data);
      } else {
        // Use JSON for text-only updates
        const requestData = {
          entity_legal_name: formData.entityLegalName,
          entity_type: formData.entityType.toLowerCase(),
          country_of_incorporation: formData.countryOfIncorporation || "",
          registration_number: formData.registrationNumber || "",
          registered_street_address: formData.registeredStreetAddress || "",
          registered_area_landmark: formData.registeredArea || "",
          registered_postal_code: formData.registeredPostalCode || "",
          registered_city: formData.registeredCity || "",
          registered_state: formData.registeredState || "",
          registered_country: formData.registeredCountry || "",
          operating_street_address: formData.operatingStreetAddress || "",
          operating_area_landmark: formData.operatingArea || "",
          operating_postal_code: formData.operatingPostalCode || "",
          operating_city: formData.operatingCity || "",
          operating_state: formData.operatingState || "",
          operating_country: formData.operatingCountry || ""
        };

        console.log("=== PATCH Step3a Data (JSON) ===");
        console.log("API URL:", step3aUrl);
        console.log("Request Data:", requestData);

        const response = await axios.patch(step3aUrl, requestData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("✅ Step3a updated successfully:", response.data);
      }

      // Navigate to next step on success
      // If Entity Type is "Individual", skip Beneficial Owners and go directly to Compliance Attestation
      // Otherwise, go to Beneficial Owners first
      if (formData.entityType.toLowerCase() === "individual") {
        navigate("/syndicate-creation/compliance-attestation");
      } else {
        navigate("/syndicate-creation/beneficial-owners");
      }
    } catch (err) {
      console.error("Error updating Step3a:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessages = Object.values(backendData).flat();
          setError(errorMessages.join(", ") || "Failed to update KYB verification.");
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to update KYB verification. Please try again.");
      }
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/entity-profile");
  };

  const FileUploadArea = ({ label, field, accept = ".pdf,.jpg,.jpeg,.png", optional = false }) => {
    const file = formData[field];
    const existingFileUrl = existingFiles[field];

    // Extract filename from URL
    const getFileNameFromUrl = (url) => {
      if (!url) return null;
      try {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1] || 'Uploaded file';
      } catch {
        return 'Uploaded file';
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
          {label} {optional && <span className="text-gray-500">(optional)</span>}
        </label>
        <label htmlFor={field} className="cursor-pointer">
          <div className="border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-8 text-center hover:bg-[#F0F2F1] transition-colors">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileUpload(field, e.target.files[0])}
              className="hidden"
              id={field}
            />
            <div className="mb-4 flex justify-center">
              <UpsyndicateIcon />
            </div>
            <p className="text-gray-500">Click to upload Files</p>
            {file && (
              <p className="text-green-600 mt-2">✓ {file.name}</p>
            )}
            {!file && existingFileUrl && (
              <div className="mt-2">
                <p className="text-green-600">✓ {getFileNameFromUrl(existingFileUrl)}</p>
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View file
                </a>
              </div>
            )}
          </div>
        </label>
        {(file || existingFileUrl) && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, [field]: null }));
              setExistingFiles(prev => ({ ...prev, [field]: null }));
              const fileInput = document.getElementById(field);
              if (fileInput) fileInput.value = "";
            }}
            className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-[#001D21] mb-2">Step 3a: Required Business Info</h1>
        <p className="text-gray-600">Trustworthy business starts here with fast, accurate KYB verification.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Business Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
              Entity Legal Name
            </label>
            <input
              type="text"
              value={formData.entityLegalName}
              onChange={(e) => handleInputChange("entityLegalName", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Entity name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
              Entity Type
            </label>
            <div className="relative">
              <select
                value={formData.entityType}
                onChange={(e) => handleInputChange("entityType", e.target.value)}
                className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
                <option value="Partnership">Partnership</option>
                <option value="Trust">Trust</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
              Country of Incorporation
            </label>
            <input
              type="text"
              value={formData.countryOfIncorporation}
              onChange={(e) => handleInputChange("countryOfIncorporation", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Autofill"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
              Registration Number / Company Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                placeholder="Enter the number"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Registered Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#0A2A2E]">Registered Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.registeredStreetAddress}
                  onChange={(e) => handleInputChange("registeredStreetAddress", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Flat No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.registeredPostalCode}
                  onChange={(e) => handleInputChange("registeredPostalCode", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.registeredState}
                  onChange={(e) => handleInputChange("registeredState", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter State name"
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Area/ landmark
                </label>
                <input
                  type="text"
                  value={formData.registeredArea}
                  onChange={(e) => handleInputChange("registeredArea", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter Area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.registeredCity}
                  onChange={(e) => handleInputChange("registeredCity", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter City Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.registeredCountry}
                  onChange={(e) => handleInputChange("registeredCountry", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter Country name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Address (Optional) */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#0A2A2E]">Operating Address (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.operatingStreetAddress}
                  onChange={(e) => handleInputChange("operatingStreetAddress", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Flat No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.operatingPostalCode}
                  onChange={(e) => handleInputChange("operatingPostalCode", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.operatingState}
                  onChange={(e) => handleInputChange("operatingState", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter State name"
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Area/ landmark
                </label>
                <input
                  type="text"
                  value={formData.operatingArea}
                  onChange={(e) => handleInputChange("operatingArea", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter Area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.operatingCity}
                  onChange={(e) => handleInputChange("operatingCity", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter City Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.operatingCountry}
                  onChange={(e) => handleInputChange("operatingCountry", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter Country name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Upload Sections */}
        <div className="space-y-6">
          {/* Company Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0A2A2E]">Company</h2>
            <FileUploadArea
              label="Cert of Incorporation"
              field="certOfIncorporation"
            />
            <FileUploadArea
              label="Registered address"
              field="registeredAddressDoc"
            />
            <FileUploadArea
              label="Directors register"
              field="directorsRegister"
              optional={true}
            />
          </div>

          {/* Trust / Foundation Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0A2A2E]">Trust / Foundation</h2>
            <FileUploadArea
              label="Trust deed"
              field="trustDeed"
            />
          </div>

          {/* Partnership Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0A2A2E]">Partnership</h2>
            <FileUploadArea
              label="Partnership agreement"
              field="partnershipAgreement"
            />
          </div>
        </div>

        {/* Compliance Text */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Compliance Text:</p>
          <p className="text-sm text-gray-600">
            Unlocksley uses regulated KYB/KYC providers to verify your entity and its beneficial owners.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] hover:bg-[#E8EAE9] text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 !border border-[#01373D]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
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

export default KYBVerification;
