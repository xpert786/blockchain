import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ManageTemplates from "./ManageTemplates";
import GeneratedDocuments from "./GeneratedDocuments";
import { FilesaddIcon, BlackfileIcon } from "../../components/Icons"

const DocumentTemplateEngine = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "generate");

  // Update active tab when URL parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['generate', 'manage', 'generated'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // State for generate document functionality
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    defaultFeeRate: "",
    defaultClosePeriodDays: "",
    legalEntityName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState("");

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      setTemplatesError("");

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setTemplatesError("Authentication required. Please log in again.");
          setTemplatesLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const apiEndpoint = `${API_URL.replace(/\/$/, "")}/document-templates/`;

        const response = await axios.get(apiEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        console.log("Templates API response:", response.data);

        // Map API response to component format
        const mappedTemplates = (response.data?.results || []).map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          version: template.version ? `v${template.version}` : "v1.0",
          type: template.category ? template.category.charAt(0).toUpperCase() + template.category.slice(1) : "Legal",
          category: template.category,
          configurableFields: template.configurable_fields || [],
          enableDigitalSignature: template.enable_digital_signature || false,
          isActive: template.is_active !== false,
          apiData: template // Store full API data for reference
        }));

        // Filter only active templates
        const activeTemplates = mappedTemplates.filter(t => t.isActive);
        setTemplates(activeTemplates);

        // Set first template as default if available
        if (activeTemplates.length > 0 && !selectedTemplate) {
          setSelectedTemplate(activeTemplates[0]);
          // Set default values from template configurable fields
          const defaultValues = {};
          activeTemplates[0].configurableFields.forEach(field => {
            if (field.default_value !== undefined && field.default_value !== "") {
              if (field.name === "default_fee_rate") {
                defaultValues.defaultFeeRate = field.default_value;
              } else if (field.name === "default_close_period_days") {
                defaultValues.defaultClosePeriodDays = field.default_value.toString();
              } else if (field.name === "legal_entity_name") {
                defaultValues.legalEntityName = field.default_value;
              }
            }
          });
          if (Object.keys(defaultValues).length > 0) {
            setFormData(prev => ({ ...prev, ...defaultValues }));
          }
        }
      } catch (error) {
        console.error('Error fetching templates:', error);

        if (error.response) {
          const errorData = error.response.data;
          const errorMessage = errorData?.detail || errorData?.error || errorData?.message ||
            (typeof errorData === 'string' ? errorData : 'Failed to load templates');
          setTemplatesError(errorMessage);
        } else if (error.request) {
          setTemplatesError("Network error. Please check your connection and try again.");
        } else {
          setTemplatesError(error.message || "An unexpected error occurred. Please try again.");
        }
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []); // Empty dependency array - only run on mount

  // Remove auto-selection - let user click to select

  const tabs = [
    { id: "generate", label: "Generate Documents" },
    { id: "manage", label: "Manage Templates" },
    { id: "generated", label: "Generated Documents" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Reset form data when template changes
    setFormData({
      defaultFeeRate: "",
      defaultClosePeriodDays: "",
      legalEntityName: ""
    });

    // Set default values from template configurable fields
    const defaultValues = {};
    template.configurableFields?.forEach(field => {
      if (field.default_value !== undefined && field.default_value !== "") {
        if (field.name === "default_fee_rate") {
          defaultValues.defaultFeeRate = field.default_value;
        } else if (field.name === "default_close_period_days") {
          defaultValues.defaultClosePeriodDays = field.default_value.toString();
        } else if (field.name === "legal_entity_name") {
          defaultValues.legalEntityName = field.default_value;
        }
      }
    });
    if (Object.keys(defaultValues).length > 0) {
      setFormData(prev => ({ ...prev, ...defaultValues }));
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Update URL parameter without page reload
    setSearchParams({ tab: tabId });
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    // Validate required field
    if (!formData.defaultClosePeriodDays) {
      setError("Please enter Default Close Period Days");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      // Get API URL from environment or use default
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const apiEndpoint = `${API_URL.replace(/\/$/, "")}/documents/generate-from-template/`;

      // Prepare field_data object
      const fieldData = {
        default_close_period_days: formData.defaultClosePeriodDays,
        legal_entity_name: formData.legalEntityName || "",
      };

      // Add default_fee_rate if provided
      if (formData.defaultFeeRate) {
        fieldData.default_fee_rate = formData.defaultFeeRate;
      }

      // Prepare request payload
      const payload = {
        template_id: selectedTemplate.id,
        field_data: fieldData
      };

      console.log("Sending API request:", payload);

      // Make API call
      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        withCredentials: true // Include cookies (csrftoken, sessionid)
      });

      console.log("API response:", response.data);

      // Create document object from API response or use form data
      const newDocument = {
        id: response.data?.id || response.data?.document_id || Date.now(),
        templateName: selectedTemplate.name,
        templateId: selectedTemplate.id,
        templateVersion: selectedTemplate.version,
        templateType: selectedTemplate.type,
        documentId: response.data?.document_id || response.data?.id || `DOC-${Date.now()}`,
        defaultFeeRate: formData.defaultFeeRate || "",
        defaultClosePeriodDays: formData.defaultClosePeriodDays,
        legalEntityName: formData.legalEntityName || "",
        status: response.data?.status || "Draft",
        createdAt: response.data?.created_at || new Date().toISOString(),
        apiResponse: response.data // Store full API response for reference
      };

      // Save to localStorage as backup
      try {
        const existing = localStorage.getItem('generatedDocuments');
        const documents = existing ? JSON.parse(existing) : [];
        documents.unshift(newDocument);
        localStorage.setItem('generatedDocuments', JSON.stringify(documents));

        // Dispatch event to notify other components
        window.dispatchEvent(new Event('generatedDocumentsUpdated'));
      } catch (storageError) {
        console.warn('Error saving to localStorage:', storageError);
        // Continue even if localStorage fails
      }

      // Switch to generated tab instead of navigating away
      handleTabClick("generated");
    } catch (error) {
      console.error('Error generating document:', error);

      // Handle error response
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.detail || errorData?.error || errorData?.message ||
          (typeof errorData === 'string' ? errorData : 'Failed to generate document');
        setError(errorMessage);
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(error.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurableFields = () => {
    console.log("Configurable fields clicked");
    // Handle configurable fields modal or navigation
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
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "generate"
                ? "bg-[#00F0C3] text-black"
                : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
              }`}
          >
            Generate Documents
          </button>
          <button
            onClick={() => handleTabClick("manage")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "manage"
                ? "bg-[#00F0C3] text-black"
                : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
              }`}
          >
            Manage Templates
          </button>
          <button
            onClick={() => handleTabClick("generated")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "generated"
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

            {/* Templates Loading State */}
            {templatesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
                  <p className="text-sm text-gray-600">Loading templates...</p>
                </div>
              </div>
            )}

            {/* Templates Error State */}
            {!templatesLoading && templatesError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {templatesError}
              </div>
            )}

            {/* Templates List */}
            {!templatesLoading && !templatesError && (
              <>
                {templates.length === 0 ? (
                  <div className="bg-[#F9F8FF] rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 text-[#00F0C3] flex items-center justify-center">
                      <FilesaddIcon />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-4 text-center">No templates available</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedTemplate?.id === template.id
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
                              {template.version && (
                                <span className={`px-3 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${selectedTemplate?.id === template.id
                                    ? "bg-[#FFFFFF] text-[#01373D]"
                                    : "bg-[#FFFFFF] text-gray-700"
                                  }`}>
                                  {template.version}
                                </span>
                              )}
                              {template.type && (
                                <span className={`px-3 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${template.type === "Legal"
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
              </>
            )}
          </div>

          {/* Right Panel - Syndicate Document Defaults */}
          <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Syndicate Document Defaults</h2>
                <p className="text-sm sm:text-base text-gray-600">Select a template to see required fields</p>
              </div>

            </div>

            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Fee Rate
                    </label>
                    <input
                      type="text"
                      name="defaultFeeRate"
                      value={formData.defaultFeeRate}
                      onChange={handleInputChange}
                      placeholder="Enter value, e.g. 2.00%"
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Close Period Days *
                    </label>
                    <input
                      type="text"
                      name="defaultClosePeriodDays"
                      value={formData.defaultClosePeriodDays}
                      onChange={handleInputChange}
                      placeholder="Enter value, e.g. 30"
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legal Entity Name
                    </label>
                    <input
                      type="text"
                      name="legalEntityName"
                      value={formData.legalEntityName}
                      onChange={handleInputChange}
                      placeholder="Enter Entity Name...."
                      className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateDocument}
                  disabled={loading}
                  className="w-full bg-[#00F0C3] hover:bg-[#00D4A3] disabled:bg-gray-400 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <BlackfileIcon />
                      <span>Generate Document</span>
                    </>
                  )}
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
