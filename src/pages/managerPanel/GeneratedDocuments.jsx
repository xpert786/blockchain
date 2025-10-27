import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneratedDocuments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("generated");

  const documents = [
    {
      id: 1,
      name: "Investment Agreement",
      investor: "Alice Investor",
      spv: "SPV-001",
      date: "3/15/2024",
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      signatories: [
        { name: "Alice Investor", status: "signed", date: "3/15/2024" },
        { name: "John Manager", status: "signed", date: "3/15/2024" }
      ]
    },
    {
      id: 2,
      name: "Transfer Agreement",
      investor: "Alice Investor",
      spv: "SPV-001",
      date: "3/15/2024",
      status: "Pending Signature",
      statusColor: "bg-orange-100 text-orange-800",
      signatories: [
        { name: "Bob Smith", status: "pending", date: null },
        { name: "Sarah Wilson", status: "signed", date: "3/15/2024" }
      ]
    }
  ];

  const tabs = [
    { id: "generate", label: "Generate Documents" },
    { id: "manage", label: "Manage Templates" },
    { id: "generated", label: "Generated Documents" }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "generate") {
      navigate('/manager-panel/documents');
    } else if (tabId === "manage") {
      navigate('/manager-panel/manage-templates');
    }
  };

  const getStatusIcon = (status) => {
    if (status === "signed") {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
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
      <div className="bg-white rounded-lg p-3 w-fit mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search Templates"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white"
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

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{document.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${document.statusColor}`}>
                      {document.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>{document.investor} • {document.spv} • {document.date}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Signatories:</p>
                    <div className="space-y-2">
                      {document.signatories.map((signatory, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {getStatusIcon(signatory.status)}
                          <span className="text-sm text-gray-600">{signatory.name}</span>
                          {signatory.status === "signed" && signatory.date && (
                            <span className="text-xs text-gray-500">({signatory.date})</span>
                          )}
                          {signatory.status === "pending" && (
                            <span className="text-xs text-orange-600">(Pending)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  {document.status === "Pending Signature" && (
                    <button className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Sign</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedDocuments;
