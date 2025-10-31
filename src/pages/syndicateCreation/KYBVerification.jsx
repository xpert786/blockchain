import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {UpsyndicateIcon} from "../../components/Icons";


const KYBVerification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyLegalName: "",
    fullName: "",
    position: "",
    incorporationCertificate: null,
    bankStatement: null,
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    postalCode: "",
    country: "",
    proofOfAddress: null,
    beneficiaryIdentity: null,
    beneficiaryProofOfAddress: null,
    soeEligibility: "Hidden",
    notarySigning: "NO",
    deedOfAdherence: "NO",
    contactNumber: "NO",
    contactEmail: "NO",
    agreeToTerms: false
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

  const handleNext = () => {
    navigate("/syndicate-creation/compliance-attestation");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/entity-profile");
  };

  const FileUploadArea = ({ label, field, accept = ".pdf,.jpg,.jpeg,.png" }) => (
    <div>
      <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
        {label}
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
          {formData[field] && (
            <p className="text-green-600 mt-2">✓ {formData[field].name}</p>
          )}
        </div>
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 3: KYB Verification</h1>
        <p className="text-gray-600">Trustworthy business starts here with fast, accurate KYB verification</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Company Information Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Company Legal Name *
            </label>
            <input
              type="text"
              value={formData.companyLegalName}
              onChange={(e) => handleInputChange("companyLegalName", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Your Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Your Position *
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <FileUploadArea 
            label="Company certificate of incorporation" 
            field="incorporationCertificate" 
          />

          <FileUploadArea 
            label="Company bank statement of the account you wish to receive The invest in" 
            field="bankStatement" 
          />
        </div>

        {/* Address Information Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange("addressLine1", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange("addressLine2", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Town/City
            </label>
            <input
              type="text"
              value={formData.townCity}
              onChange={(e) => handleInputChange("townCity", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
              Postal Code/Zip Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <FileUploadArea 
            label="Company Proof Of Address" 
            field="proofOfAddress" 
          />
        </div>

        {/* Beneficiary Owner & Eligibility Section */}
        <div className="space-y-6">
          <FileUploadArea 
            label="Beneficiary Owner Identity Document" 
            field="beneficiaryIdentity" 
          />

          <FileUploadArea 
            label="Beneficiary Owner Proof Of Address" 
            field="beneficiaryProofOfAddress" 
          />

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              S/SIE Eligibility
            </label>
            <select
              value={formData.soeEligibility}
              onChange={(e) => handleInputChange("soeEligibility", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Hidden">Hidden</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Is Notary / Wet Signing Of Document At Close Or Conversion Of Share
            </label>
            <select
              value={formData.notarySigning}
              onChange={(e) => handleInputChange("notarySigning", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Will You Required Unlocksley To Sign a Deed Of adherence in Order To Close The Deal
            </label>
            <select
              value={formData.deedOfAdherence}
              onChange={(e) => handleInputChange("deedOfAdherence", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Investee Company Contact Number
            </label>
            <select
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Investee Company Email
            </label>
            <select
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="mr-3"
              />
              <span className="text-gray-700">I Agree To Investee Terms</span>
            </label>
          </div>
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
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default KYBVerification;