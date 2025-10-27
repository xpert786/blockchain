import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GenerateDocument = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template;

  const [formData, setFormData] = useState({
    investorName: "",
    spvName: "",
    investmentAmount: "",
    shares: "",
    percentage: "",
    digitalSignature: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Document generated with data:', formData);
    // Handle document generation here
    navigate('/manager-panel/generated-documents');
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Template Selected</h2>
          <p className="text-gray-600 mb-6">Please select a template to generate a document.</p>
          <button
            onClick={() => navigate('/manager-panel/documents')}
            className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/manager-panel/documents')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Generate Document</h1>
        </div>
        <p className="text-lg text-gray-600">Fill in the required information to generate your document</p>
      </div>

      {/* Template Info */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
            <p className="text-gray-600 mb-3">{template.description}</p>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {template.version}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {template.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investor Name *
              </label>
              <input
                type="text"
                name="investorName"
                value={formData.investorName}
                onChange={handleInputChange}
                placeholder="Enter Investor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SPV Name *
              </label>
              <input
                type="text"
                name="spvName"
                value={formData.spvName}
                onChange={handleInputChange}
                placeholder="Enter SPV name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount *
              </label>
              <input
                type="text"
                name="investmentAmount"
                value={formData.investmentAmount}
                onChange={handleInputChange}
                placeholder="Enter Investment amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shares *
              </label>
              <input
                type="text"
                name="shares"
                value={formData.shares}
                onChange={handleInputChange}
                placeholder="Enter shares"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage *
              </label>
              <input
                type="text"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                placeholder="Enter percentage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="digitalSignature"
              name="digitalSignature"
              checked={formData.digitalSignature}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
            />
            <label htmlFor="digitalSignature" className="ml-2 text-sm text-gray-700">
              Enable digital signature workflow
            </label>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <button
              type="submit"
              className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Generate Document</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/manager-panel/documents')}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateDocument;
