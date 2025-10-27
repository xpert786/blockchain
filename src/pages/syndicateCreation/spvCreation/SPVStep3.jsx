import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPVStep3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adviserEntity: "Platform Advisers LLC",
    masterPartnershipEntity: "",
    fundLead: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step4");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step2");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Adviser & Legal Structure</h1>
        <p className="text-gray-600">Configure the legal and advisory structure for your SPV.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Adviser Entity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Adviser Entity</h2>
          <div className="flex space-x-4">
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.adviserEntity === "Platform Advisers LLC"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("adviserEntity", "Platform Advisers LLC")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Platform Advisers LLC</p>
                  <p className="text-sm text-gray-500">Default</p>
                </div>
                <input
                  type="radio"
                  name="adviserEntity"
                  value="Platform Advisers LLC"
                  checked={formData.adviserEntity === "Platform Advisers LLC"}
                  onChange={() => handleInputChange("adviserEntity", "Platform Advisers LLC")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>

            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.adviserEntity === "Self-Advised Entity"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("adviserEntity", "Self-Advised Entity")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Self-Advised Entity</p>
                  <p className="text-sm text-[#22C55E]">Additional $1,000 setup fee applies</p>
                </div>
                <input
                  type="radio"
                  name="adviserEntity"
                  value="Self-Advised Entity"
                  checked={formData.adviserEntity === "Self-Advised Entity"}
                  onChange={() => handleInputChange("adviserEntity", "Self-Advised Entity")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Master Partnership Entity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Master Partnership Entity</h2>
          <p className="text-sm text-gray-600 mb-4">This will appear on the cap table</p>
          <select
            value={formData.masterPartnershipEntity}
            onChange={(e) => handleInputChange("masterPartnershipEntity", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
          >
            <option value="">Select master partnership entity</option>
            <option value="entity1">Entity 1</option>
            <option value="entity2">Entity 2</option>
            <option value="entity3">Entity 3</option>
          </select>
        </div>

        {/* Fund Lead */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Fund Lead</h2>
          <p className="text-sm text-gray-600 mb-4">This person will be designated in fund documentation</p>
          <select
            value={formData.fundLead}
            onChange={(e) => handleInputChange("fundLead", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparen                                                                  t bg-[#F4F6F5]"
          >
            <option value="">Select fund lead</option>
            <option value="lead1">Lead 1</option>
            <option value="lead2">Lead 2</option>
            <option value="lead3">Lead 3</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
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

export default SPVStep3;



