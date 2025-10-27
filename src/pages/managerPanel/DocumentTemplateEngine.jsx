import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DocumentTemplateEngine = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: "Investment Agreement",
      description: "Standard investment agreement for SPV participation",
      version: "v2.1",
      type: "Legal"
    },
    {
      id: 2,
      name: "Transfer Agreement",
      description: "Agreement for secondary transfer of ownership",
      version: "v1.0",
      type: "Legal"
    },
    {
      id: 3,
      name: "KYC Document Package",
      description: "Complete KYC documentation bundle",
      version: "v1.0",
      type: "Compliance"
    },
    {
      id: 4,
      name: "SPV Summary Document",
      description: "Executive summary of SPV terms and conditions",
      version: "v1.2",
      type: "Informational"
    }
  ];

  const tabs = [
    { id: "generate", label: "Generate Documents" },
    { id: "manage", label: "Manage Templates" },
    { id: "generated", label: "Generated Documents" }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "manage") {
      navigate('/manager-panel/manage-templates');
    } else if (tabId === "generated") {
      navigate('/manager-panel/generated-documents');
    }
  };

  const handleGenerateDocument = () => {
    if (selectedTemplate) {
      navigate('/manager-panel/generate-document', { state: { template: selectedTemplate } });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Template Engine</h1>
        <p className="text-lg text-gray-600">Generate and manage legal documents from templates</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("generate")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "generate"
              ? "bg-[#00F0C3] text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Generate Documents
        </button>
        <button
          onClick={() => navigate('/manager-panel/manage-templates')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "manage"
              ? "bg-[#00F0C3] text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Manage Templates
        </button>
        <button
          onClick={() => navigate('/manager-panel/generated-documents')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "generated"
              ? "bg-[#00F0C3] text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Generated Documents
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Select Template */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Template</h2>
          <p className="text-gray-600 mb-6">Choose a document template to generate</p>
          
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id
                    ? "border-[#00F0C3] bg-[#F0FDF4]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-[#00F0C3] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                        {template.version}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.type === "Legal" 
                          ? "bg-[#00F0C3] text-white" 
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {template.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Document Data */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Data</h2>
          <p className="text-gray-600 mb-6">Select a template to see required fields</p>
          
          {selectedTemplate ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investor Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Investor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spv Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter spv name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Investment amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shares *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shares"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Percentage *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter percentage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="digitalSignature"
                  className="h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                />
                <label htmlFor="digitalSignature" className="ml-2 text-sm text-gray-700">
                  Enable digital signature workflow
                </label>
              </div>
              
              <button
                onClick={handleGenerateDocument}
                className="w-full bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Generate Document</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#F9F8FF] rounded-lg p-6 flex flex-col items-center justify-center h-[500px]">
              <svg className="w-16 h-16 text-[#00F0C3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-gray-600 mt-4">Select A Template To Begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateEngine;
