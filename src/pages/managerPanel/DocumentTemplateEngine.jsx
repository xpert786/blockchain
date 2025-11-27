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
  const [templateDetails, setTemplateDetails] = useState(null);
  const [formData, setFormData] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

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

      const response = await axios.get(`${API_URL}/document-templates/`, {
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

  const tabs = [
    { id: "generate", label: "Generate Documents" },
    { id: "manage", label: "Manage Templates" },
    { id: "generated", label: "Generated Documents" }
  ];

  // Fetch template details when a template is selected
  const fetchTemplateDetails = async (templateId) => {
    setLoadingDetails(true);
    setTemplateDetails(null);
    setFormData({});
    setDetailsError("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await axios.get(`${API_URL}/document-templates/${templateId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Template details fetched:", response.data);
      setTemplateDetails(response.data);
      
      // Initialize form data with empty values for required fields
      const initialFormData = {};
      if (response.data.required_fields && Array.isArray(response.data.required_fields)) {
        response.data.required_fields.forEach(field => {
          initialFormData[field.name] = "";
        });
      }
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error fetching template details:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load template details";
      setDetailsError(errorMessage);
      setTemplateDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setGenerateError("");
    setGenerateSuccess(false);
    if (template && template.id) {
      fetchTemplateDetails(template.id);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear error when user starts typing
    if (generateError) {
      setGenerateError("");
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Clear selected template when switching tabs
    if (tabId !== "generate") {
      setSelectedTemplate(null);
      setTemplateDetails(null);
      setFormData({});
      setDetailsError("");
    }
  };

  // Generate document from template
  const handleGenerateDocument = async () => {
    if (!selectedTemplate || !templateDetails) {
      setGenerateError("Please select a template first.");
      return;
    }

    // Validate required fields
    const requiredFields = templateDetails.required_fields || [];
    const missingFields = requiredFields.filter(field => {
      if (field.required) {
        const value = formData[field.name];
        return !value || value.toString().trim() === "";
      }
      return false;
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(f => f.label || f.name).join(", ");
      setGenerateError(`Please fill in all required fields: ${missingFieldNames}`);
      return;
    }

    setGenerating(true);
    setGenerateError("");
    setGenerateSuccess(false);

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      // Get user data from localStorage for signatories
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.user_id || userData.id;

      // Build the request payload
      const payload = {
        template_id: selectedTemplate.id || templateDetails.id,
        field_data: formData,
        enable_digital_signature: templateDetails.enable_digital_signature || false,
        title: `${selectedTemplate.name || templateDetails.name} - ${new Date().toLocaleDateString()}`,
        description: templateDetails.description || `Generated document from ${selectedTemplate.name || templateDetails.name} template`,
      };

      // Add optional fields if available
      // You can get these from route params, localStorage, or context as needed
      const urlParams = new URLSearchParams(window.location.search);
      const spvId = urlParams.get("spv_id") || localStorage.getItem("currentSpvId");
      const syndicateId = urlParams.get("syndicate_id") || localStorage.getItem("currentSyndicateId");

      if (spvId) {
        payload.spv_id = parseInt(spvId);
      }

      if (syndicateId) {
        payload.syndicate_id = parseInt(syndicateId);
      }

      // Add signatories if digital signature is enabled
      if (templateDetails.enable_digital_signature && userId) {
        payload.signatories = [
          {
            user_id: userId,
            role: "Manager"
          }
        ];
      }

      console.log("Generating document with payload:", payload);

      const response = await axios.post(`${API_URL}/documents/generate-from-template/`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Document generated successfully:", response.data);
      setGenerateSuccess(true);

      // Clear form data after successful generation
      const initialFormData = {};
      if (templateDetails.required_fields && Array.isArray(templateDetails.required_fields)) {
        templateDetails.required_fields.forEach(field => {
          initialFormData[field.name] = "";
        });
      }
      setFormData(initialFormData);

      // Navigate to generated documents after a short delay
      setTimeout(() => {
        setActiveTab("generated");
        setGenerateSuccess(false);
      }, 2000);

    } catch (err) {
      console.error("Error generating document:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to generate document";
      setGenerateError(errorMessage);
    } finally {
      setGenerating(false);
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
                  onClick={fetchTemplates}
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
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
                      <p className="text-sm text-gray-600">Loading template details...</p>
                    </div>
                  </div>
                ) : detailsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{detailsError}</p>
                    <button
                      onClick={() => selectedTemplate && selectedTemplate.id && fetchTemplateDetails(selectedTemplate.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : templateDetails ? (
                  <>
                    <div className="space-y-4">
                      {templateDetails.required_fields && Array.isArray(templateDetails.required_fields) && templateDetails.required_fields.length > 0 ? (
                        templateDetails.required_fields.map((field, index) => (
                          <div key={field.name || index}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label || field.name} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.type === "textarea" || field.type === "text_area" ? (
                              <textarea
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={`Enter ${field.label || field.name}`}
                                required={field.required}
                                rows={4}
                                className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                              />
                            ) : field.type === "number" ? (
                              <input
                                type="number"
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={`Enter ${field.label || field.name}`}
                                required={field.required}
                                className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                              />
                            ) : field.type === "email" ? (
                              <input
                                type="email"
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={`Enter ${field.label || field.name}`}
                                required={field.required}
                                className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                              />
                            ) : field.type === "date" ? (
                              <input
                                type="date"
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                required={field.required}
                                className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                              />
                            ) : (
                              <input
                                type="text"
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={`Enter ${field.label || field.name}`}
                                required={field.required}
                                className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-600">No required fields specified for this template.</p>
                        </div>
                      )}
                    </div>
                    
                    {templateDetails.enable_digital_signature !== undefined && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="digitalSignature"
                          defaultChecked={templateDetails.enable_digital_signature}
                          className="h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                          disabled
                        />
                        <label htmlFor="digitalSignature" className="ml-2 text-sm text-gray-700">
                          Enable digital signature workflow {templateDetails.enable_digital_signature ? "(Enabled)" : "(Disabled)"}
                        </label>
                      </div>
                    )}

                    {generateError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">{generateError}</p>
                      </div>
                    )}

                    {generateSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-600">Document generated successfully! Redirecting to generated documents...</p>
                      </div>
                    )}
                    
                    <button
                      onClick={handleGenerateDocument}
                      disabled={generating}
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        generating
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-[#00F0C3] hover:bg-[#00D4A3] text-black"
                      }`}
                    >
                      {generating ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                          <span>Generating Document...</span>
                        </>
                      ) : (
                        <>
                          <BlackfileIcon />
                          <span>Generate Document</span>
                        </>
                      )}
                    </button>
                  </>
                ) : null}
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
