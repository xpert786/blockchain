import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPVStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    portfolioCompany: "",
    companyStage: "pre-seed",
    countryOfIncorporation: "",
    incorporationType: "",
    founderEmail: "",
    displayName: "",
    pitchDeck: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        pitchDeck: file
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.ms-powerpoint" || file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation")) {
      setFormData(prev => ({
        ...prev,
        pitchDeck: file
      }));
    }
  };

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step2");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-medium text-gray-800">Company Overview</h1>
            <p className="text-gray-600">Let's start by gathering some basic information about the deal you're creating.</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Portfolio Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Company
              </label>
              <input
                type="text"
                value={formData.portfolioCompany}
                onChange={(e) => handleInputChange("portfolioCompany", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter company"
              />
            </div>

            {/* Company Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company stage
              </label>
              <select
                value={formData.companyStage}
                onChange={(e) => handleInputChange("companyStage", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B</option>
                <option value="growth">Growth</option>
              </select>
            </div>

            {/* Country of Incorporation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of incorporation
              </label>
              <select
                value={formData.countryOfIncorporation}
                onChange={(e) => handleInputChange("countryOfIncorporation", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose county of incorporation</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Incorporation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incorporation type
              </label>
              <select
                value={formData.incorporationType}
                onChange={(e) => handleInputChange("incorporationType", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose incorporation type</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="c-corp">C-Corp</option>
                <option value="s-corp">S-Corp</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Founder Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Founder email
                <span className="ml-2 relative inline-block group">
                  <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-yellow-100 text-xs text-gray-700 rounded-lg border border-yellow-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none z-10 transition-all shadow-lg">
                    Our platform will reach out to this contact to validate the deal.
                  </span>
                </span>
              </label>
              <input
                type="email"
                value={formData.founderEmail}
                onChange={(e) => handleInputChange("founderEmail", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter founder email"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange("displayName", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Display name for SPV"
              />
            </div>

            {/* Upload Pitch Deck */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Pitch Deck
              </label>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
                id="pitch-deck-upload"
              />
              <label
                htmlFor="pitch-deck-upload"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full border-1  bg-[#F4F6F5] border-[#0A2A2E] rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors block"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600">
                  Drag and drop or click to upload pitch deck (PDF, PPT, PPTX)
                </p>
                {formData.pitchDeck && (
                  <p className="text-sm text-gray-500 mt-2">{formData.pitchDeck.name}</p>
                )}
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200 mt-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleNext}
                className="bg-[#00F0C3] hover:scale-102 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
  );
};

export default SPVStep1;
