import React, { useState } from "react";
import { ShieldCheckIcon, DownsIcon, RightErrorIcon  } from "../../../components/Icons";

const KYBVerification = () => {
  const [formData, setFormData] = useState({
    companyLegalName: "",
    fullName: "",
    position: "",
    selectOption: "",
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    postalCode: "",
    country: "",
    spvEligibility: "Hidden",
    notarySigning: "NO",
    deedOfAdherence: "NO",
    contactNumber: "NO",
    email: "NO",
    agreeToTerms: false
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = (e) => {
    console.log("File uploaded:", e.target.files[0]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("KYB Verification submitted:", formData);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#01373D] mb-2">Step 3: KYB Verification</h2>
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

          {/* File Upload Sections - Right after Your Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Company certificate of incorporation</label>
            <div className="border-1 border-[#0A2A2E] rounded-lg p-8 text-center hover:border-[#0A2A2E] transition-colors bg-[#F4F6F5]">
              <div className="flex flex-col items-center">
                <DownsIcon/>
                <p className="text-sm text-gray-600 font-poppins-custom">
                  <button type="button" className="font-medium text-[#748A91] hover:text-[#748A91]">
                    Click to upload Files
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Company Bank statement of the account you wish to receive The Invest in</label>
            <div className="!border-1 border-[#0A2A2E] rounded-lg p-8 text-center hover:border-[#0A2A2E] transition-colors bg-[#F4F6F5]">
              
              <div className="flex flex-col items-center">
              <DownsIcon/>
                <p className="text-sm text-gray-600 font-poppins-custom">
                  <button type="button" className="font-medium text-[#748A91] hover:text-[#748A91]">
                    Click to upload Files
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              placeholder="Enter name"
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
              placeholder="Enter name"
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
              placeholder="Enter name"
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
              placeholder="Enter name"
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
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>
        </div>

        {/* Additional File Upload Sections */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Company Proof Of Address</label>
            <div className="!border-1 border-[#0A2A2E] rounded-lg p-8 text-center hover:border-[#0A2A2E] transition-colors bg-[#F4F6F5]">
            <div className="flex flex-col items-center">
            <DownsIcon/>
                <p className="text-sm text-gray-600 font-poppins-custom">
                  <button type="button" className="font-medium text-[#748A91] hover:text-[#748A91]">
                    Click to upload Files
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Beneficiary Owner Identity Document</label>
            <div className="border-1 border-[#0A2A2E] rounded-lg p-8 text-center hover:border-[#0A2A2E] transition-colors bg-[#F4F6F5]">
            <div className="flex flex-col items-center">
            <DownsIcon/>
                <p className="text-sm text-gray-600 font-poppins-custom">
                  <button type="button" className="font-medium text-[#748A91] hover:text-[#748A91]">
                    Click to upload Files
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Beneficiary Owner Proof Of Address</label>
            <div className="border-1 border-[#0A2A2E] rounded-lg p-8 text-center hover:border-[#0A2A2E] transition-colors bg-[#F4F6F5]">
            <div className="flex flex-col items-center">
            <DownsIcon/>
                <p className="text-sm text-gray-600 font-poppins-custom">
                  <button type="button" className="font-medium text-[#748A91] hover:text-[#748A91]">
                    Click to upload Files
                  </button>
                </p>
              </div>
            </div>
          </div>
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
                  <div 
                    onClick={() => handleOptionSelect('spvEligibility', 'Hidden')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    Hidden
                  </div>
                  <div 
                    onClick={() => handleOptionSelect('spvEligibility', 'Yes')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    Yes
                  </div>
                  <div 
                    onClick={() => handleOptionSelect('spvEligibility', 'No')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    No
                  </div>
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
                  <div 
                    onClick={() => handleOptionSelect('notarySigning', 'NO')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    NO
                  </div>
                  <div 
                    onClick={() => handleOptionSelect('notarySigning', 'YES')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    YES
                  </div>
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
                  <div 
                    onClick={() => handleOptionSelect('deedOfAdherence', 'NO')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    NO
                  </div>
                  <div 
                    onClick={() => handleOptionSelect('deedOfAdherence', 'YES')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    YES
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Investee Company Contact Number</label>
            <div className="relative">
              <div 
                onClick={() => handleDropdownClick('contactNumber')}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] font-poppins-custom flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">{formData.contactNumber}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'contactNumber' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openDropdown === 'contactNumber' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#0A2A2E] rounded-lg shadow-lg">
                  <div 
                    onClick={() => handleOptionSelect('contactNumber', 'NO')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    NO
                  </div>
                  <div 
                    onClick={() => handleOptionSelect('contactNumber', 'YES')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    YES
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Investee Company Email</label>
            <div className="relative">
              <div 
                onClick={() => handleDropdownClick('email')}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] font-poppins-custom flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">{formData.email}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'email' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {openDropdown === 'email' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#0A2A2E] rounded-lg shadow-lg">
                  <div 
                    onClick={() => handleOptionSelect('email', 'NO')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    NO
                  </div>
                  <div 
                    onClick={() => handleOptionSelect('email', 'YES')}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer font-poppins-custom text-gray-700"
                  >
                    YES
                  </div>
                </div>
              )}
            </div>
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
            className="flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
          >
            <span>Submit</span>
            <RightErrorIcon  />
          </button>
        </div>
      </form>
    </div>
  );
};

export default KYBVerification;
