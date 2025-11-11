import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageTemplates from "./ManageTemplates";
import GeneratedDocuments from "./GeneratedDocuments";
import {FilesaddIcon, BlackfileIcon} from "../../components/Icons"

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

  // Remove auto-selection - let user click to select

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
  };

  const handleGenerateDocument = () => {
    if (selectedTemplate) {
      navigate('/manager-panel/generate-document', { state: { template: selectedTemplate } });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 space-y-6">
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center sm:text-left">Document Template Engine</h1>
        <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">Generate and manage legal documents from templates</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <button
            onClick={() => handleTabClick("generate")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "generate"
                ? "bg-[#00F0C3] text-black"
                : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
            }`}
          >
            Generate Documents
          </button>
          <button
            onClick={() => handleTabClick("manage")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "manage"
                ? "bg-[#00F0C3] text-black"
                : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
            }`}
          >
            Manage Templates
          </button>
          <button
            onClick={() => handleTabClick("generated")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "generated"
                ? "bg-[#00F0C3] text-black"
                : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
            }`}
          >
            Generated Documents
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Panel - Select Template */}
          <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Select Template</h2>
              <p className="text-sm sm:text-base text-gray-600">Choose a document template to generate</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? "!border border-[#01373D] bg-[#E2E2FB]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <FilesaddIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${
                          selectedTemplate?.id === template.id
                            ? "bg-[#FFFFFF] text-[#01373D]"
                            : "bg-[#FFFFFF] text-gray-700"
                        }`}>
                          {template.version}
                        </span>
                        <span className={`px-3 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${
                          template.type === "Legal" 
                            ? "bg-white text-[#01373D] !border border-[#01373D]" 
                            : template.type === "Compliance"
                            ? "bg-white text-[#01373D] border !border border-[#01373D]"
                            : "bg-white text-[#01373D] border !border border-[#01373D]"
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
          <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Document Data</h2>
              <p className="text-sm sm:text-base text-gray-600">Select a template to see required fields</p>
            </div>
            
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
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spv Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter spv name"
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Investment amount"
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shares *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter shares"
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter percentage"
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
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
                  className="w-full bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BlackfileIcon />
                  <span>Generate Document</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#F9F8FF] rounded-lg p-6 flex flex-col items-center justify-center h-64 sm:h-[500px]">
                <div className="w-12 h-12 sm:w-16 sm:h-16 text-[#00F0C3] flex items-center justify-center">
                  <FilesaddIcon />
                </div>
                <p className="text-sm sm:text-lg font-medium text-gray-600 mt-4 text-center">Select A Template To Begin</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <ManageTemplates />
        </div>
      )}
      {activeTab === "generated" && (
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <GeneratedDocuments />
        </div>
      )}
    </div>
  );
};

export default DocumentTemplateEngine;
