import React, { useState } from "react";
import {UpdateContactIcon, SavechangesIcon } from "../../../components/Icons";

const GeneralInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    bio: "Experienced venture capital manager with 10+ years in early-stage technology investments.",
    link: "URI: https://extrnallinks.com"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    console.log("Saving general info:", formData);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-row gap-2 items-center sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0">
        <div className="flex sm:justify-start">
          <UpdateContactIcon />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#01373D]">General Information</h2>
        </div>
      </div>

      {/* Logo Upload Section */}
      <div>
        <div className="!border-1 border-dashed border-[#E2E2E2] rounded-lg p-6 sm:p-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-[#F4F6F5] mx-auto sm:mx-0">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <button className="px-3 py-2 !border border-[#01373D] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-poppins-custom text-base">
                Update Logo
              </button>
              <p className="text-sm sm:text-base text-gray-500 mt-3 font-poppins-custom">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">First Name</label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Last Name</label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] resize-none font-poppins-custom"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Link</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <SavechangesIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default GeneralInfo;
