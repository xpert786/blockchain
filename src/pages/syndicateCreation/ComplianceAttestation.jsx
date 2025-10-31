import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpsyndicateIcon } from "../../components/Icons";

const ComplianceAttestation = () => {
  const navigate = useNavigate();
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

  const handleNext = () => {
    navigate("/syndicate-creation/final-review");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/kyb-verification");
  };

  const allChecked = Object.values(formData).every(value => value === true);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 3: Compliance & Attestation</h1>
        <p className="text-gray-600">Review regulatory requirements and provide necessary attestations.</p>
      </div>

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
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="additionalPolicies"
              />
              <div className="mb-4 flex justify-center">
                <UpsyndicateIcon />
              </div>
              <p className="text-gray-500">Click to upload Files</p>
            </div>
          </label>
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

export default ComplianceAttestation;
