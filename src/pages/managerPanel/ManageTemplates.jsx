import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageTemplates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Fallback templates
  const fallbackTemplates = [
    {
      id: 1,
      name: "Investment Agreement",
      description: "Standard investment agreement for SPV participation",
      version: "v2.1",
      category: "legal",
      type: "Legal",
      status: "Active",
      is_active: true,
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      required_fields: [
        { name: "investor_name", label: "Investor Name", type: "text", required: true },
        { name: "spv_name", label: "Spv Name", type: "text", required: true },
        { name: "investment_amount", label: "Investment Amount", type: "number", required: true },
        { name: "shares", label: "Shares", type: "number", required: true },
        { name: "percentage", label: "Percentage", type: "number", required: true }
      ]
    },
    {
      id: 2,
      name: "Transfer Agreement",
      description: "Agreement for secondary transfer of ownership",
      version: "v2.1",
      category: "legal",
      type: "Legal",
      status: "Active",
      is_active: true,
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      required_fields: [
        { name: "transferor_name", label: "Transferor Name", type: "text", required: true },
        { name: "transferee_name", label: "Transferee Name", type: "text", required: true },
        { name: "shares_transferred", label: "Shares Transferred", type: "number", required: true },
        { name: "transfer_price", label: "Transfer Price", type: "number", required: true }
      ]
    },
    {
      id: 3,
      name: "KYC Document Package",
      description: "Complete KYC documentation bundle",
      version: "v1.0",
      category: "legal",
      type: "Legal",
      status: "Active",
      is_active: true,
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      required_fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "date_of_birth", label: "Date Of Birth", type: "date", required: true },
        { name: "ssn", label: "SSN", type: "text", required: true },
        { name: "accreditation_status", label: "Accreditation Status", type: "text", required: true }
      ]
    },
    {
      id: 4,
      name: "SPV Summary Document",
      description: "Executive summary of SPV terms and conditions",
      version: "v1.0",
      category: "informational",
      type: "Informational",
      status: "Active",
      is_active: true,
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      required_fields: [
        { name: "spv_name", label: "Spv Name", type: "text", required: true },
        { name: "manager_name", label: "Manager Name", type: "text", required: true },
        { name: "target_amount", label: "Target Amount", type: "number", required: true },
        { name: "minimum_investment", label: "Minimum Investment", type: "number", required: true },
        { name: "strategy", label: "Strategy", type: "text", required: true }
      ]
    }
  ];

  // Fetch individual template details with required_fields
  const fetchTemplateDetails = async (templateId, token) => {
    try {
      const API_BASE = getApiUrl();
      const apiUrl = `${API_BASE}/document-templates/${templateId}/`;
      console.log(`Fetching template details from: ${apiUrl}`);
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      console.error(`Error fetching template ${templateId} details:`, err);
      return null;
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getAccessToken();
      if (!token) {
        throw new Error("Please log in to view templates.");
      }

      const API_BASE = getApiUrl();
      const apiUrl = `${API_BASE}/document-templates/`;
      console.log("Fetching templates list from:", apiUrl);
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let templatesData = [];
      // Handle different response structures
      console.log("API Response:", response.data);
      console.log("API Response Type:", typeof response.data);
      console.log("Is Array?", Array.isArray(response.data));
      
      if (Array.isArray(response.data)) {
        templatesData = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        templatesData = response.data.results;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        templatesData = response.data.data;
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        // Single template object - convert to array
        templatesData = [response.data];
      }

      // Fetch full details for each template to get required_fields
      console.log(`Fetching details for ${templatesData.length} templates...`);
      const templatesWithDetails = await Promise.all(
        templatesData.map(async (template) => {
          // Fetch individual template details to get required_fields
          const fullDetails = await fetchTemplateDetails(template.id, token);
          if (fullDetails) {
            // Merge full details with the list data
            return { ...template, ...fullDetails };
          }
          return template;
        })
      );

      // Ensure required_fields is properly parsed for each template
      const processedTemplates = templatesWithDetails.map(template => {
        console.log(`Processing template ${template.id}:`, {
          name: template.name,
          required_fields_raw: template.required_fields,
          required_fields_type: typeof template.required_fields
        });
        
        // If required_fields is a string, try to parse it as JSON
        if (typeof template.required_fields === 'string') {
          try {
            template.required_fields = JSON.parse(template.required_fields);
            console.log(`Parsed required_fields for template ${template.id}:`, template.required_fields);
          } catch (e) {
            console.warn('Failed to parse required_fields for template', template.id, e);
            template.required_fields = [];
          }
        }
        
        // Ensure it's an array
        if (!Array.isArray(template.required_fields)) {
          console.warn(`Template ${template.id} required_fields is not an array:`, template.required_fields);
          template.required_fields = [];
        } else {
          console.log(`Template ${template.id} has ${template.required_fields.length} required fields:`, template.required_fields);
        }
        
        return template;
      });

      console.log("Fetched and processed templates:", processedTemplates);
      setTemplates(processedTemplates);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to load templates");
      // Use fallback templates if API fails
      setTemplates(fallbackTemplates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const tabs = [
    { id: "all", label: "All", count: 5 },
    { id: "active", label: "Active", count: 4 },
    { id: "draft", label: "Draft", count: 1 },
    { id: "archived", label: "Archived", count: 0 }
  ];

  const handleCreateTemplate = () => {
    setShowCreateModal(true);
  };

  // Create template form state
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    version: "",
    category: "legal",
    template_file: null,
    required_fields: [],
    enable_digital_signature: true,
    is_active: true
  });

  const [currentField, setCurrentField] = useState({
    name: "",
    label: "",
    type: "text",
    required: true
  });

  const handleCreateFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "template_file") {
      setCreateFormData(prev => ({
        ...prev,
        template_file: files[0] || null
      }));
    } else {
      setCreateFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addRequiredField = () => {
    if (currentField.name && currentField.label) {
      setCreateFormData(prev => ({
        ...prev,
        required_fields: [...prev.required_fields, { ...currentField }]
      }));
      setCurrentField({ name: "", label: "", type: "text", required: true });
    }
  };

  const removeRequiredField = (index) => {
    setCreateFormData(prev => ({
      ...prev,
      required_fields: prev.required_fields.filter((_, i) => i !== index)
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError("");
      const token = getAccessToken();
      if (!token) {
        throw new Error("Please log in to create templates.");
      }

      if (!createFormData.template_file) {
        setError("Please select a template file.");
        return;
      }

      const API_BASE = getApiUrl();
      const apiUrl = `${API_BASE}/document-templates/`;
      console.log("Creating template at:", apiUrl);
      const formData = new FormData();
      formData.append("name", createFormData.name);
      formData.append("description", createFormData.description);
      formData.append("version", createFormData.version);
      formData.append("category", createFormData.category);
      formData.append("template_file", createFormData.template_file);
      formData.append("required_fields", JSON.stringify(createFormData.required_fields));
      formData.append("enable_digital_signature", createFormData.enable_digital_signature.toString());
      formData.append("is_active", createFormData.is_active.toString());

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh templates
      await fetchTemplates();
      
      // Reset form and close modal
      setCreateFormData({
        name: "",
        description: "",
        version: "",
        category: "legal",
        template_file: null,
        required_fields: [],
        enable_digital_signature: true,
        is_active: true
      });
      setCurrentField({ name: "", label: "", type: "text", required: true });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating template:", err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to create template");
    } finally {
      setCreating(false);
    }
  };

  const handleEditTemplate = (template) => {
    console.log("Edit template:", template);
  };

  const handleDuplicateTemplate = (template) => {
    console.log("Duplicate template:", template);
  };

  const handleArchiveTemplate = (template) => {
    console.log("Archive template:", template);
  };

  // Helper function to get display fields with both name and label
  const getDisplayFields = (template) => {
    console.log(`getDisplayFields called for template ${template.id}:`, {
      name: template.name,
      required_fields: template.required_fields,
      required_fields_type: typeof template.required_fields,
      is_array: Array.isArray(template.required_fields)
    });

    if (!template.required_fields) {
      console.log(`Template ${template.id} has no required_fields property`);
      return [];
    }

    // Handle string (JSON) format
    if (typeof template.required_fields === 'string') {
      try {
        const parsed = JSON.parse(template.required_fields);
        console.log(`Parsed required_fields string for template ${template.id}:`, parsed);
        template.required_fields = parsed;
      } catch (e) {
        console.warn('Failed to parse required_fields as JSON:', e);
        return [];
      }
    }

    // Ensure it's an array
    if (!Array.isArray(template.required_fields)) {
      console.warn(`Template ${template.id} required_fields is not an array:`, template.required_fields);
      return [];
    }

    // If array is empty, return empty
    if (template.required_fields.length === 0) {
      console.log(`Template ${template.id} has empty required_fields array`);
      return [];
    }

    // If first item is an object, map to field objects
    if (typeof template.required_fields[0] === 'object' && template.required_fields[0] !== null) {
      const fields = template.required_fields.map(f => ({
        name: f.name || '',
        label: f.label || f.name || '',
        type: f.type || 'text',
        required: f.required !== undefined ? f.required : true
      }));
      console.log(`Mapped fields for template ${template.id}:`, fields);
      return fields;
    }

    // If it's an array of strings, convert to objects
    const fields = template.required_fields.map(f => ({
      name: typeof f === 'string' ? f : (f.name || ''),
      label: typeof f === 'string' ? f : (f.label || f.name || ''),
      type: typeof f === 'string' ? 'text' : (f.type || 'text'),
      required: true
    }));
    console.log(`Converted string array to fields for template ${template.id}:`, fields);
    return fields;
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Templates</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage document templates</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search templates by name or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#FFFFFF]"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-sm text-gray-600">Loading templates...</div>
        </div>
      )}

      {/* Templates List */}
      {!loading && (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No templates found. Create your first template to get started.</p>
              <button
                onClick={handleCreateTemplate}
                className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Template
              </button>
            </div>
          ) : (
            templates.map((template) => {
              const displayFields = getDisplayFields(template);
              // Debug logging
              if (template.required_fields) {
                console.log(`Template ${template.id} (${template.name}) required_fields:`, template.required_fields);
                console.log(`Parsed displayFields:`, displayFields);
              }
              const statusColor = template.is_active !== false ? "bg-[#22C55E] text-[#FFFFFF]" : "bg-gray-200 text-gray-800";
              const status = template.is_active !== false ? "Active" : "Inactive";
              const categoryDisplay = template.category || template.type || "Legal";
              
              return (
                <div key={template.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900">{template.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description || "No description"}</p>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {template.version && (
                            <span className="px-2 py-1 !border border-[#01373D] text-[#01373D] rounded-full text-xs font-medium">
                              {template.version}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${
                            categoryDisplay.toLowerCase() === "legal" 
                              ? "text-[#01373D]" 
                              : " text-blue-800"
                          }`}>
                            {categoryDisplay.charAt(0).toUpperCase() + categoryDisplay.slice(1)}
                          </span>
                          {template.enable_digital_signature && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Digital Signature
                            </span>
                          )}
                        </div>
                        {displayFields.length > 0 ? (
                          <div className="mb-3">
                          
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {displayFields.map((field, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#A99BFF] text-[#001D21] rounded-[36px] text-xs font-medium"
                                    title={`Field Name: ${field.name || 'N/A'} | Label: ${field.label || 'N/A'} | Type: ${field.type || 'text'} | Required: ${field.required ? 'Yes' : 'No'}`}
                                  >
                                    <span>{field.label || field.name}</span>
                                    {field.name && field.name !== field.label && (
                                      <span className="text-[#001D21]/60 text-[10px]">({field.name})</span>
                                    )}
                                    {field.type && field.type !== 'text' && (
                                      <span className="ml-1 px-1.5 py-0.5 bg-[#001D21]/10 rounded text-[10px]">{field.type}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                                
                            
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3">
                            <p className="text-sm text-gray-500 italic">No required fields defined</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${statusColor}`}>
                        {status}
                      </span>
                <div className="flex items-center justify-end gap-2">
                  <button className="p-2 bg-[#F4F6F5] rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-[#F4F6F5] rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-[#F4F6F5] rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-[#F4F6F5] rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-poppins-custom">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-semibold text-gray-900 font-poppins-custom">Create New Template</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={createFormData.name}
                    onChange={handleCreateFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Investment Agreement Template"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={createFormData.description}
                    onChange={handleCreateFormChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose of this template"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Version *</label>
                    <input
                      type="text"
                      name="version"
                      value={createFormData.version}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={createFormData.category}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="legal">Legal</option>
                      <option value="informational">Informational</option>
                      <option value="financial">Financial</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template File *</label>
                  <input
                    type="file"
                    name="template_file"
                    onChange={handleCreateFormChange}
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {createFormData.template_file && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {createFormData.template_file.name}</p>
                  )}
                </div>
              </div>

              {/* Required Fields */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Required Fields</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                    <input
                      type="text"
                      value={currentField.name}
                      onChange={(e) => setCurrentField(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., investor_name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                    <input
                      type="text"
                      value={currentField.label}
                      onChange={(e) => setCurrentField(prev => ({ ...prev, label: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Investor Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={currentField.type}
                      onChange={(e) => setCurrentField(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addRequiredField}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  Add Field
                </button>

                {/* Added Fields List */}
                {createFormData.required_fields.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Added Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {createFormData.required_fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          <span>{field.label}</span>
                          <button
                            type="button"
                            onClick={() => removeRequiredField(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Options</h3>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enable_digital_signature"
                    name="enable_digital_signature"
                    checked={createFormData.enable_digital_signature}
                    onChange={handleCreateFormChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enable_digital_signature" className="text-sm font-medium text-gray-700">
                    Enable Digital Signature
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={createFormData.is_active}
                    onChange={handleCreateFormChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Set as Active
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError("");
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !createFormData.template_file}
                  className="px-6 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTemplates;
