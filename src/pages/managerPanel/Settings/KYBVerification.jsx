import React, { useState, useEffect } from "react";

// --- Inline Icons ---
const ShieldCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const DownsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#748A91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const RightErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const KYBVerification = () => {
  // --- Configuration ---
  const API_URL = "http://168.231.121.7/blockchain-backend/api/syndicate/settings/kyb-verification/";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzI5Njg3LCJpYXQiOjE3NjQzMTE2ODcsImp0aSI6Ijk5NzA1NzUyNGY5ZjQ2OTU5MTIzOTQyMWEwOWI1YjY4IiwidXNlcl9pZCI6IjY0In0.gt2lL5WVEjTHsEudojWQhP0APayBtG8CfwWgLpH6bA0";

  // --- State ---
  const [formData, setFormData] = useState({
    companyLegalName: "",
    fullName: "",
    position: "",
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    postalCode: "",
    country: "",
    // Dropdowns / Selects
    spvEligibility: "Hidden",      // sse_eligibility
    notarySigning: "NO",           // is_notary_wet_signing
    deedOfAdherence: "NO",         // will_require_unlockley
    // Contact Info (Changed from Dropdown to Input based on API data)
    contactNumber: "",             // investee_company_contact_number
    email: "",                     // investee_company_email
    agreeToTerms: false            // agree_to_investee_terms
  });

  // Store file objects. Keys match API form field names for clarity
  const [files, setFiles] = useState({
    certificate_of_incorporation: null,
    company_bank_statement: null,
    company_proof_of_address: null,
    beneficiary_owner_identity_document: null,
    beneficiary_owner_proof_of_address: null
  });

  const [existingFiles, setExistingFiles] = useState({}); // To show if files are already uploaded
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Effects ---
  useEffect(() => {
    fetchKYBData();
  }, []);

  const fetchKYBData = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Updated to handle { success: true, data: { ... } } structure
        if (result.success && result.data) {
           const data = result.data;
           setFormData({
            companyLegalName: data.company_legal_name || "",
            fullName: data.kyb_full_name || "",
            position: data.kyb_position || "",
            addressLine1: data.address_line_1 || "",
            addressLine2: data.address_line_2 || "",
            townCity: data.town_city || "",
            postalCode: data.postal_code || "",
            country: data.country || "",
            
            // Map API values (lowercase/yes/no) to UI State (Capitalized for display if needed)
            spvEligibility: mapApiToUi(data.sse_eligibility, "Hidden"),
            notarySigning: mapApiToUi(data.is_notary_wet_signing, "NO"),
            deedOfAdherence: mapApiToUi(data.will_require_unlockley, "NO"),
            
            contactNumber: data.investee_company_contact_number || "",
            email: data.investee_company_email || "",
            agreeToTerms: data.agree_to_investee_terms === true
          });

          // Store info about existing files using the _url fields provided in response
          setExistingFiles({
             certificate_of_incorporation: data.certificate_of_incorporation_url,
             company_bank_statement: data.company_bank_statement_url,
             company_proof_of_address: data.company_proof_of_address_url,
             beneficiary_owner_identity_document: data.beneficiary_owner_identity_document_url,
             beneficiary_owner_proof_of_address: data.beneficiary_owner_proof_of_address_url
          });
        }
      }
    } catch (error) {
      console.error("Error fetching KYB data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to map API "yes"/"no" to UI "YES"/"NO" or keep "Hidden"
  const mapApiToUi = (val, defaultVal) => {
    if (!val) return defaultVal;
    if (val.toLowerCase() === 'yes') return 'YES';
    if (val.toLowerCase() === 'no') return 'NO';
    if (val.toLowerCase() === 'hidden') return 'Hidden';
    return val; // Fallback
  };

  // Helper to map UI back to API
  const mapUiToApi = (val) => {
    if (!val) return "";
    return val.toLowerCase();
  };

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleOptionSelect = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
    setOpenDropdown(null);
  };

  const handleFileChange = (e, fieldKey) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldKey]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    // Construct FormData for PATCH
    const apiPayload = new FormData();
    
    apiPayload.append('company_legal_name', formData.companyLegalName);
    apiPayload.append('kyb_full_name', formData.fullName);
    apiPayload.append('kyb_position', formData.position);
    apiPayload.append('address_line_1', formData.addressLine1);
    apiPayload.append('address_line_2', formData.addressLine2);
    apiPayload.append('town_city', formData.townCity);
    apiPayload.append('postal_code', formData.postalCode);
    apiPayload.append('country', formData.country);
    
    apiPayload.append('sse_eligibility', mapUiToApi(formData.spvEligibility));
    apiPayload.append('is_notary_wet_signing', mapUiToApi(formData.notarySigning));
    apiPayload.append('will_require_unlockley', mapUiToApi(formData.deedOfAdherence));
    
    apiPayload.append('investee_company_contact_number', formData.contactNumber);
    apiPayload.append('investee_company_email', formData.email);
    apiPayload.append('agree_to_investee_terms', formData.agreeToTerms);

    // Append files only if a new file is selected
    Object.keys(files).forEach(key => {
      if (files[key]) {
        apiPayload.append(key, files[key]);
      }
    });

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: apiPayload
      });

      if (response.ok) {
        const result = await response.json();
        console.log("KYB Updated:", result);
        alert("KYB Verification details saved successfully!");
        // Refresh data to show uploaded file state if necessary
        fetchKYBData(); 
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error saving data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper component for File Upload Box
  const FileUploadBox = ({ label, fieldKey, existingFile, currentFile }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">{label}</label>
      <div 
        className={`border border-[#0A2A2E] rounded-lg p-6 text-center hover:bg-gray-50 transition-colors bg-[#F4F6F5] ${currentFile ? 'border-green-500 bg-green-50' : ''}`}
      >
        <div className="flex flex-col items-center">
          <DownsIcon />
          <div className="mt-2 text-sm text-gray-600 font-poppins-custom">
            <label className="cursor-pointer">
              <span className="font-medium text-[#748A91] hover:text-[#5a6b70]">
                {currentFile ? currentFile.name : (existingFile ? "Replace File (File Exists)" : "Click to upload Files")}
              </span>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileChange(e, fieldKey)} 
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </label>
            {existingFile && !currentFile && (
               <a 
                 href={existingFile} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-xs text-green-600 mt-1 block hover:underline"
                 onClick={(e) => e.stopPropagation()} // Prevent triggering file input
               >
                 ✓ View Current File
               </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading KYB Data...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon />
            <h2 className="text-2xl font-bold text-[#01373D]">Step 3: KYB Verification</h2>
        </div>
        <p className="text-gray-600 font-poppins-custom">Trustworthy business starts here with fast, accurate KYB verification</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Company legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyLegalName"
              value={formData.companyLegalName}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Your Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>

          {/* File Upload Sections */}
          <FileUploadBox 
            label="Company certificate of incorporation" 
            fieldKey="certificate_of_incorporation"
            existingFile={existingFiles.certificate_of_incorporation}
            currentFile={files.certificate_of_incorporation}
          />

          <FileUploadBox 
            label="Company Bank statement of the account you wish to receive The Invest in" 
            fieldKey="company_bank_statement"
            existingFile={existingFiles.company_bank_statement}
            currentFile={files.company_bank_statement}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              placeholder="Enter address"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              placeholder="Enter address"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Town/City</label>
            <input
              type="text"
              name="townCity"
              value={formData.townCity}
              onChange={handleInputChange}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Postal Code/ Zip Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Enter zip code"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter country"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
        </div>

        {/* Additional File Upload Sections */}
        <div className="space-y-4">
            <FileUploadBox 
                label="Company Proof Of Address" 
                fieldKey="company_proof_of_address"
                existingFile={existingFiles.company_proof_of_address}
                currentFile={files.company_proof_of_address}
            />
            <FileUploadBox 
                label="Beneficiary Owner Identity Document" 
                fieldKey="beneficiary_owner_identity_document"
                existingFile={existingFiles.beneficiary_owner_identity_document}
                currentFile={files.beneficiary_owner_identity_document}
            />
            <FileUploadBox 
                label="Beneficiary Owner Proof Of Address" 
                fieldKey="beneficiary_owner_proof_of_address"
                existingFile={existingFiles.beneficiary_owner_proof_of_address}
                currentFile={files.beneficiary_owner_proof_of_address}
            />
        </div>

        {/* Custom Dropdown Selectors */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">S/SIE Eligibility</label>
            <div className="relative">
              <div 
                onClick={() => handleDropdownClick('spvEligibility')}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] font-poppins-custom flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">{formData.spvEligibility}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'spvEligibility' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openDropdown === 'spvEligibility' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#0A2A2E] rounded-lg shadow-lg">
                  {['Hidden', 'YES', 'NO'].map(opt => (
                     <div key={opt} onClick={() => handleOptionSelect('spvEligibility', opt)} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">
                        {opt}
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Is Notary / Wet Signing Of Document At Close Or Conversion Of Share</label>
            <div className="relative">
              <div 
                onClick={() => handleDropdownClick('notarySigning')}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] font-poppins-custom flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">{formData.notarySigning}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'notarySigning' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openDropdown === 'notarySigning' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#0A2A2E] rounded-lg shadow-lg">
                  {['YES', 'NO'].map(opt => (
                     <div key={opt} onClick={() => handleOptionSelect('notarySigning', opt)} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">
                        {opt}
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Will You Required Unlocksley To Sign a Deed Of adherence in Order To Close The Deal</label>
            <div className="relative">
              <div 
                onClick={() => handleDropdownClick('deedOfAdherence')}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] font-poppins-custom flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">{formData.deedOfAdherence}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'deedOfAdherence' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openDropdown === 'deedOfAdherence' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#0A2A2E] rounded-lg shadow-lg">
                  {['YES', 'NO'].map(opt => (
                     <div key={opt} onClick={() => handleOptionSelect('deedOfAdherence', opt)} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">
                        {opt}
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Changed from Dropdown to Input based on API Data Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Investee Company Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="+1-555-0123"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Investee Company Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contact@company.com"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="w-4 h-4 text-[#00F0C3] border-gray-300 rounded focus:ring-[#00F0C3]"
          />
          <label className="text-sm text-gray-700 font-poppins-custom">I Agree To Investee Terms</label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{isSaving ? 'Saving...' : 'Submit'}</span>
            <RightErrorIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default KYBVerification;