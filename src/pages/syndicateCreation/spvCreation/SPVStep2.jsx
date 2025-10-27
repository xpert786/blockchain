import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPVStep2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transactionType: "",
    instrumentType: "",
    valuation: "",
    shareClass: "Preferred",
    round: "Seed",
    roundSize: "",
    yourAllocation: "100000"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step3");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step1");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms</h1>
        <p className="text-gray-600">Define the financial and legal terms for your SPV.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Transaction Type */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Transaction Type</h2>
          <p className="text-sm text-gray-600 mb-4">This helps with regulatory and legal structuring of your deal</p>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionType"
                value="primary"
                checked={formData.transactionType === "primary"}
                onChange={(e) => handleInputChange("transactionType", e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">Primary</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionType"
                value="secondary"
                checked={formData.transactionType === "secondary"}
                onChange={(e) => handleInputChange("transactionType", e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">Secondary</span>
            </label>
          </div>
        </div>

        {/* Instrument Type */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Instrument Type</h2>
          <p className="text-sm text-gray-600 mb-4">Determines the legal instrument used for the deal</p>
          <select
            value={formData.instrumentType}
            onChange={(e) => handleInputChange("instrumentType", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
          >
            <option value="">Select Instrument type</option>
            <option value="equity">Equity</option>
            <option value="convertible-note">Convertible Note</option>
            <option value="safe">SAFE</option>
            <option value="revenue-share">Revenue Share</option>
          </select>
        </div>

        {/* Valuation */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Valuation</h2>
          <p className="text-sm text-gray-600 mb-4">This helps with regulatory and legal structuring of your deal</p>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="valuation"
                value="pre-money"
                checked={formData.valuation === "pre-money"}
                onChange={(e) => handleInputChange("valuation", e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">Pre money</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="valuation"
                value="post-money"
                checked={formData.valuation === "post-money"}
                onChange={(e) => handleInputChange("valuation", e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">Post money</span>
            </label>
          </div>
        </div>

        {/* Share Class and Round */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Share class</h2>
            <select
              value={formData.shareClass}
              onChange={(e) => handleInputChange("shareClass", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="Preferred">Preferred</option>
              <option value="Common">Common</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Round</h2>
            <select
              value={formData.round}
              onChange={(e) => handleInputChange("round", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
              <option value="Growth">Growth</option>
            </select>
          </div>
        </div>

        {/* Round Size */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Round Size</h2>
          <input
            type="number"
            value={formData.roundSize}
            onChange={(e) => handleInputChange("roundSize", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            placeholder="Enter total round size"
          />
        </div>

        {/* Your Allocation */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Allocation</h2>
          <input
            type="number"
            value={formData.yourAllocation}
            onChange={(e) => handleInputChange("yourAllocation", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:scale-102 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
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

export default SPVStep2;
