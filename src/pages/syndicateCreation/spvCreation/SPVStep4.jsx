import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPVStep4 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jurisdiction: "",
    entityType: "",
    minimumLPInvestment: "",
    targetClosingDate: "",
    totalCarry: "",
    carryRecipient: "",
    gpCommitment: "",
    dealPartners: "",
    dealName: "",
    accessMode: "private"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step5");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step3");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Fundraising & Jurisdiction Selection</h1>
        <p className="text-gray-600">Select the jurisdiction for your SPV and review the legal structure.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Jurisdiction for the deal */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Jurisdiction for the deal</label>
          <p className="text-sm text-gray-600 mb-4">This will appear on the cap table</p>
          <div className="relative">
            <select
              value={formData.jurisdiction}
              onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">Select jurisdiction</option>
              <option value="delaware">Delaware, USA</option>
              <option value="cayman">Cayman Islands</option>
              <option value="singapore">Singapore</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Entity Type */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Entity Type</label>
          <p className="text-sm text-gray-600 mb-4">Auto-selected based on jurisdiction</p>
          <div className="relative">
            <select
              value={formData.entityType}
              onChange={(e) => handleInputChange("entityType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">Choose entity type</option>
              <option value="llc">LLC</option>
              <option value="c-corp">C-Corp</option>
              <option value="lp">LP</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Minimum LP Investment */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Minimum LP Investment ($)</label>
          <input
            type="number"
            value={formData.minimumLPInvestment}
            onChange={(e) => handleInputChange("minimumLPInvestment", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter minimum investment"
          />
        </div>

        {/* Target Closing Date */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Target Closing Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              value={formData.targetClosingDate}
              onChange={(e) => handleInputChange("targetClosingDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            />
          </div>
        </div>

        {/* Total Carry */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Total Carry (%)</label>
          <input
            type="number"
            value={formData.totalCarry}
            onChange={(e) => handleInputChange("totalCarry", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter carry percentage"
          />
        </div>

        {/* Carry Recipient */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Carry Recipient</label>
          <input
            type="text"
            value={formData.carryRecipient}
            onChange={(e) => handleInputChange("carryRecipient", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter carry recipient entity"
          />
        </div>

        {/* GP Commitment */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">GP Commitment</label>
          <input
            type="number"
            value={formData.gpCommitment}
            onChange={(e) => handleInputChange("gpCommitment", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter GP commitment amount"
          />
        </div>

        {/* Deal Partners */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Deal Partners</label>
          <div className="relative">
            <select
              value={formData.dealPartners}
              onChange={(e) => handleInputChange("dealPartners", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">List co-investors or strategic partners</option>
              <option value="partner1">Partner A</option>
              <option value="partner2">Partner B</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Deal name */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Deal name</label>
          <input
            type="text"
            value={formData.dealName}
            onChange={(e) => handleInputChange("dealName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter your deal name"
          />
        </div>

        {/* Access Mode */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">Access Mode</label>
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.accessMode === "private"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("accessMode", "private")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.41 7.41C7.18894 7.61599 7.01163 7.86439 6.88866 8.14039C6.76568 8.41638 6.69955 8.71432 6.69422 9.01643C6.68889 9.31854 6.74447 9.61863 6.85763 9.89879C6.97079 10.179 7.13923 10.4335 7.35288 10.6471C7.56654 10.8608 7.82104 11.0292 8.10121 11.1424C8.38137 11.2555 8.68146 11.3111 8.98357 11.3058C9.28568 11.3004 9.58362 11.2343 9.85961 11.1113C10.1356 10.9884 10.384 10.8111 10.59 10.59M8.0475 3.81C8.36348 3.77063 8.68157 3.75059 9 3.75C14.25 3.75 16.5 9 16.5 9C16.1647 9.71784 15.7442 10.3927 15.2475 11.01M4.9575 4.9575C3.46594 5.97347 2.2724 7.36894 1.5 9C1.5 9 3.75 14.25 9 14.25C10.4369 14.2539 11.8431 13.8338 13.0425 13.0425M1.5 1.5L16.5 16.5" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <p className="font-medium text-gray-900">Private</p>
                    <p className="text-sm text-gray-500">Only invited investors can view and participate in this deal</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="accessMode"
                  value="private"
                  checked={formData.accessMode === "private"}
                  onChange={() => handleInputChange("accessMode", "private")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>

            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.accessMode === "public"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("accessMode", "public")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 9C1.5 9 3.75 3.75 9 3.75C14.25 3.75 16.5 9 16.5 9C16.5 9 14.25 14.25 9 14.25C3.75 14.25 1.5 9 1.5 9Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <p className="font-medium text-gray-900">Visible to all</p>
                    <p className="text-sm text-gray-500">Deal will be visible to all qualified investors</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="accessMode"
                  value="public"
                  checked={formData.accessMode === "public"}
                  onChange={() => handleInputChange("accessMode", "public")}
                  className="h-4 w-4 text-blue-600 focus:ring-[#00F0C3]  border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
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
  );
};

export default SPVStep4;
