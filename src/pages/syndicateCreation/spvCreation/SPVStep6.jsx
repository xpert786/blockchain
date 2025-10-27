import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPVStep6 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dealName: "",
    accessMode: "private",
    tags: ["Fintech", "Healthcare", "Technology", "North America", "Europe", "Asia"],
    syndicateSelector: "",
    dealMemo: "",
    document: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      document: file
    }));
  };

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step7");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step5");
  };

  const handleGenerateAI = () => {
    console.log("Generate with AI clicked");
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Additional Information</h1>
        <p className="text-gray-600">Configure how your SPV will appear to investors and control access settings.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Deal name */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Deal name</label>
          <input
            type="text"
            value={formData.dealName}
            onChange={(e) => handleInputChange("dealName", e.target.value)}
            className="w-full border border-[#0A2A2E]    rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter your deal name"
          />
        </div>

        {/* Access Mode */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">Access Mode</label>
          <div className="flex space-x-4">
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
                    <path d="M7.41 7.41C7.18894 7.61599 7.01163 7.86439 6.88866 8.14039C6.76568 8.41638 6.69955 8.71432 6.69422 9.01643C6.68889 9.31854 6.74447 9.61863 6.85763 9.89879C6.97079 10.179 7.13923 10.4335 7.35288 10.6471C7.56654 10.8608 7.82104 11.0292 8.10121 11.1424C8.38137 11.2555 8.68146 11.3111 8.98357 11.3058C9.28568 11.3004 9.58362 11.2343 9.85961 11.1113C10.1356 10.9884 10.384 10.8111 10.59 10.59M8.0475 3.81C8.36348 3.77063 8.68157 3.75059 9 3.75C14.25 3.75 16.5 9 16.5 9C16.1647 9.71784 15.7442 10.3927 15.2475 11.01M4.9575 4.9575C3.46594 5.97347 2.2724 7.36894 1.5 9C1.5 9 3.75 14.25 9 14.25C10.4369 14.2539 11.8431 13.8338 13.0425 13.0425M1.5 1.5L16.5 16.5" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#0A2A2E]"
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
                    <path d="M1.5 9C1.5 9 3.75 3.75 9 3.75C14.25 3.75 16.5 9 16.5 9C16.5 9 14.25 14.25 9 14.25C3.75 14.25 1.5 9 1.5 9Z" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#0A2A2E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 p-3 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] min-h-[50px]">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-[#0A2A2E]"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
            <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Syndicate selector */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Syndicate selector</label>
          <div className="relative">
            <select
              value={formData.syndicateSelector}
              onChange={(e) => handleInputChange("syndicateSelector", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">Select syndicate</option>
              <option value="syndicate1">Syndicate 1</option>
              <option value="syndicate2">Syndicate 2</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Leave blank to use default naming convention</p>
        </div>

        {/* Deal Memo */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Deal Memo</label>
          <div className="relative">
            <textarea
              value={formData.dealMemo}
              onChange={(e) => handleInputChange("dealMemo", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white h-32 pr-28"
              placeholder="Enter deal memo"
              style={{ resize: "vertical" }}
            />
            <div className="absolute left-3 bottom-3 flex space-x-2">
              <button
                type="button"
                onClick={handleGenerateAI}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-[#0A2A2E]"
              >
                Generate with AI
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-[#0A2A2E]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Upload a Document */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">Upload a Document</label>
            <div className="border-1  border-[#0A2A2E] rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="document-upload"
            />
            <label htmlFor="document-upload" className="cursor-pointer">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600">Drag and drop or click to upload document (PDF, DOCX)</p>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 border border-[#0A2A2E]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-[#00F0C3] hover:scale-102 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 border border-[#0A2A2E] "
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

export default SPVStep6;
