import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageTemplates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);

  const templates = [
    {
      id: 1,
      name: "Investment Agreement",
      description: "Standard investment agreement for SPV participation",
      version: "v2.1",
      type: "Legal",
      status: "Active",
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      requiredFields: ["Investor Name", "Spv Name", "Investment Amount", "Shares", "Percentage"]
    },
    {
      id: 2,
      name: "Transfer Agreement",
      description: "Agreement for secondary transfer of ownership",
      version: "v2.1",
      type: "Legal",
      status: "Active",
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      requiredFields: ["Transferor Name", "Transferee Name", "Shares Transferred", "Transfer Price"]
    },
    {
      id: 3,
      name: "KYC Document Package",
      description: "Complete KYC documentation bundle",
      version: "v1.0",
      type: "Legal",
      status: "Active",
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      requiredFields: ["Full Name", "Address", "Date Of Birth", "Ssn", "Accreditation Status"]
    },
    {
      id: 4,
      name: "SPV Summary Document",
      description: "Executive summary of SPV terms and conditions",
      version: "v1.0",
      type: "Informational",
      status: "Active",
      statusColor: "bg-[#22C55E] text-[#FFFFFF]",
      requiredFields: ["Spv Name", "Manager Name", "Target Amount", "Minimum Investment", "Strategy"]
    }
  ];

  const tabs = [
    { id: "all", label: "All", count: 5 },
    { id: "active", label: "Active", count: 4 },
    { id: "draft", label: "Draft", count: 1 },
    { id: "archived", label: "Archived", count: 0 }
  ];

  const handleCreateTemplate = () => {
    navigate('/manager-panel/document-template-engine');
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

  return (
    <div className="space-y-6">
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

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((template) => (
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
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-1 !border border-[#01373D] text-[#01373D] rounded-full text-xs font-medium">
                      {template.version}
                    </span>
                    <span className={`px-2 py-1 rounded-full !border border-[#01373D] text-xs font-medium ${
                      template.type === "Legal" 
                        ? "text-[#01373D]" 
                        : " text-blue-800"
                    }`}>
                      {template.type}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.requiredFields.map((field, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#A99BFF] text-[#001D21] rounded-[36px] text-xs"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${template.statusColor}`}>
                  {template.status}
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
        ))}
      </div>
    </div>
  );
};

export default ManageTemplates;
