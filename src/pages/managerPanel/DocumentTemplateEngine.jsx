import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ManageTemplates from "./ManageTemplates";
import GeneratedDocuments from "./GeneratedDocuments";
import {FilesaddIcon, BlackfileIcon} from "../../components/Icons"

const DocumentTemplateEngine = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Fetch templates from API
  const fetchTemplates = async () => {
    setLoading(true);
    setError("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await axios.get(`${API_URL}/api/document-templates/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Templates fetched:", response.data);
      
      // Handle different response formats
      let templatesData = [];
      if (Array.isArray(response.data)) {
        templatesData = response.data;
      } else if (response.data?.results) {
        templatesData = response.data.results;
      } else if (response.data?.data) {
        templatesData = response.data.data;
      } else if (response.data?.templates) {
        templatesData = response.data.templates;
      }

      // Map API response to component format
      const mappedTemplates = templatesData.map((template) => ({
        id: template.id || template.template_id,
        name: template.name || template.template_name || "Unnamed Template",
        description: template.description || template.desc || "",
        version: template.version || template.template_version || "v1.0",
        type: template.type || template.category || template.template_type || "Legal",
        ...template // Include all other fields from API
      }));

      setTemplates(mappedTemplates);
    } catch (err) {
      console.error("Error fetching templates:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load templates";
      setError(errorMessage);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "generate") {
      fetchTemplates();
    }
  }, [activeTab]);

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
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
                  <p className="text-sm text-gray-600">Loading templates...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Retry
                </button>
              </div>
            ) : templates.length === 0 ? (
              <div className="bg-[#F9F8FF] rounded-lg p-6 flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 flex items-center justify-center">
                  <FilesaddIcon />
                </div>
                <p className="text-sm sm:text-lg font-medium text-gray-600 mt-4 text-center">No templates available</p>
              </div>
            ) : (
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
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">{template.description || "No description available"}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          {template.version && (
                            <span className={`px-3 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${
                              selectedTemplate?.id === template.id
                                ? "bg-[#FFFFFF] text-[#01373D]"
                                : "bg-[#FFFFFF] text-gray-700"
                            }`}>
                              {template.version}
                            </span>
                          )}
                          {template.type && (
                            <span className={`px-3 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${
                              template.type === "Legal" 
                                ? "bg-white text-[#01373D] !border border-[#01373D]" 
                                : template.type === "Compliance"
                                ? "bg-white text-[#01373D] border !border border-[#01373D]"
                                : "bg-white text-[#01373D] border !border border-[#01373D]"
                            }`}>
                              {template.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
