import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPVStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    industry: "",
    stage: "",
    fundingGoal: "",
    minimumInvestment: "",
    maximumInvestment: "",
    dealType: "",
    investmentTerms: "",
    additionalInfo: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step2");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/success");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Deal Information</h1>
            <p className="text-gray-600">Provide basic information about the investment opportunity.</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter company name"
                required
              />
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description *
              </label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                placeholder="Describe the company and its business model"
                required
              />
            </div>

            {/* Industry and Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="technology">Technology</option>
                  <option value="saas">SaaS</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange("stage", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select stage</option>
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="growth">Growth</option>
                </select>
              </div>
            </div>

            {/* Funding Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Goal *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.fundingGoal}
                  onChange={(e) => handleInputChange("fundingGoal", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter funding goal"
                  required
                />
              </div>
            </div>

            {/* Investment Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Investment *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.minimumInvestment}
                    onChange={(e) => handleInputChange("minimumInvestment", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Minimum investment amount"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Investment *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.maximumInvestment}
                    onChange={(e) => handleInputChange("maximumInvestment", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Maximum investment amount"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Deal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Type *
              </label>
              <select
                value={formData.dealType}
                onChange={(e) => handleInputChange("dealType", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select deal type</option>
                <option value="equity">Equity</option>
                <option value="convertible-note">Convertible Note</option>
                <option value="safe">SAFE</option>
                <option value="revenue-share">Revenue Share</option>
              </select>
            </div>

            {/* Investment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Terms
              </label>
              <textarea
                value={formData.investmentTerms}
                onChange={(e) => handleInputChange("investmentTerms", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                placeholder="Describe key investment terms and conditions"
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                placeholder="Any additional details about the investment opportunity"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end pt-8 mt-8">
        
            <button
              onClick={handleNext}
              className="bg-[#00F0C3] hover:scale-102 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
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

export default SPVStep1;
