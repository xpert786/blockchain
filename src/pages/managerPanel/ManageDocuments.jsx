import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Files2Icon, WatchsIcon, SecondFilesIcon,RightssIcon,View1Icon,View2Icon,View3Icon } from "../../components/Icons";

const ManageDocuments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);

  const documents = [
    {
      id: 1,
      title: "Investment Agreement - Tech Startup Fund Q4",
      subtitle: "Investment Agreement • John Manager • 3/15/2024 • SPV-001",
      documentId: "DOC-001",
      version: "v1.2",
      fileSize: "2.4 MB",
      signatories: 24,
      status: "Signed",
      statusColor: "bg-green-100 text-green-800",
      alert: null
    },
    {
      id: 2,
      title: "KYC Documentation - Sarah Connor",
      subtitle: "KYC Document • Sarah Connor • 3/14/2024",
      documentId: "DOC-002",
      version: "v1.0",
      fileSize: "3.1 MB",
      signatories: 0,
      status: "Pending Review",
      statusColor: "bg-orange-100 text-orange-800",
      alert: "Document Requires Admin Review"
    },
    {
      id: 3,
      title: "Term Sheet - Real Estate Opportunity",
      subtitle: "Term Sheet • Sarah Wilson • 3/10/2024 • SPV-002",
      documentId: "DOC-003",
      version: "v2.1",
      fileSize: "1.8 MB",
      signatories: 0,
      status: "Draft",
      statusColor: "bg-gray-100 text-gray-800",
      alert: null
    },
    {
      id: 4,
      title: "Compliance Report Q1 2024",
      subtitle: "Compliance Report • Admin User • 3/10/2024",
      documentId: "DOC-004",
      version: "v1.0",
      fileSize: "5.2 MB",
      signatories: 3,
      status: "Approved",
      statusColor: "bg-purple-100 text-purple-800",
      alert: null
    },
    {
      id: 5,
      title: "Transfer Agreement - Alice To Bob",
      subtitle: "Transfer Agreement • Alice Investor • 3/9/2024 • SPV-003",
      documentId: "DOC-005",
      version: "v1.0",
      fileSize: "1.2 MB",
      signatories: 1,
      status: "Pending Signature",
      statusColor: "bg-orange-100 text-orange-800",
      alert: "Waiting For Signatures From 1 Parties"
    }
  ];

  const tabs = [
    { id: "all", label: "All", count: 5 },
    { id: "pending", label: "Pending", count: 2 },
    { id: "signed", label: "Signed", count: 0 },
    { id: "drafts", label: "Drafts", count: 1 }
  ];

  const handleViewDetails = (document) => {
    navigate('/manager-panel/document-template-engine', { state: { document } });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 mb-8">
  {/* Header Section */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Manage <span className="text-[#9889FF]">Documents</span>
      </h1>
      <p className="text-lg text-gray-600">
        Manage investment documents and agreements
      </p>
    </div>
    <button className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
      <span>Create Document</span>
    </button>
  </div>

  {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-[#CAE6FF] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Documents</p>
            <Files2Icon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-xs text-green-600">+8 this month</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#D7F8F0] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Signatures</p>
            <WatchsIcon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-green-600">2 urgent</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#E2E2FB] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Signed Documents</p>
            <SecondFilesIcon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-green-600">+5 this week</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#FFEFE8] rounded-2xl p-8 h-32">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Finalized</p>
            <RightssIcon />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">10</p>
            <p className="text-xs text-green-600">+5 this week</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Tabs */}
      <div className="bg-white rounded-lg p-3 w-fit mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-[10px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar and Icons */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search SPVs by name, ID, or focus area..."
            className="w-full pl-10 pr-4 py-2 !border border-gray-300 rounded-lg focus:outline-none  bg-[#FFFFFF]"
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
        <div className="flex items-center space-x-2">
          {/* View1Icon - Inactive */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <View1Icon />
          </button>
          
          {/* View2Icon - Inactive */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors ">
            <View2Icon />
          </button>
          
          {/* View3Icon - Active */}
          <button className="p-2 text-white hover:text-gray-200 transition-colors ">
            <View3Icon />
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.subtitle}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Document ID</p>
                    <p className="text-sm font-medium text-gray-900">{doc.documentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Version</p>
                    <p className="text-sm font-medium text-gray-900">{doc.version}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Size</p>
                    <p className="text-sm font-medium text-gray-900">{doc.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Signatories</p>
                    <p className="text-sm font-medium text-gray-900">{doc.signatories}</p>
                  </div>
                </div>

                {doc.alert && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    doc.alert.includes('Admin Review') ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <p className="text-sm font-medium">{doc.alert}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${doc.statusColor}`}>
                  {doc.status}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg text-sm font-medium transition-colors">
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg text-sm font-medium transition-colors">
                    Download
                  </button>
                  {doc.status === "Draft" && (
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                  )}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === doc.id ? null : doc.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                      </svg>
                    </button>
                    
                    {openDropdown === doc.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDropdown(null);
                              navigate('/manager-panel/document-template-engine');
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-black bg-[#00F0C3] hover:bg-[#00D4A3] transition-colors rounded-lg mb-2 cursor-pointer border-0"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Edit Document
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Version History
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete Document
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDocuments;
