import React, { useState } from "react";

const SPVDocuments = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const documents = [
    {
      id: 1,
      name: "Investment Agreement - Tech Startup Fund Q4",
      type: "Investment Agreement",
      version: "v1.2",
      fileSize: "2.4 MB",
      uploadedBy: "John Manager",
      uploadedDate: "3/15/2024",
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      downloadCount: 24
    },
    {
      id: 2,
      name: "Term Sheet - HealthTech Investment",
      type: "Term Sheet",
      version: "v1.0",
      fileSize: "1.8 MB",
      uploadedBy: "Sarah Wilson",
      uploadedDate: "3/14/2024",
      status: "Draft",
      statusColor: "bg-gray-100 text-gray-800",
      downloadCount: 12
    },
    {
      id: 3,
      name: "KYC Documentation Package",
      type: "Compliance",
      version: "v2.1",
      fileSize: "3.2 MB",
      uploadedBy: "Admin User",
      uploadedDate: "3/12/2024",
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      downloadCount: 8
    },
    {
      id: 4,
      name: "Transfer Agreement Template",
      type: "Legal Document",
      version: "v1.1",
      fileSize: "1.5 MB",
      uploadedBy: "John Manager",
      uploadedDate: "3/10/2024",
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      downloadCount: 15
    },
    {
      id: 5,
      name: "Compliance Report Q1 2024",
      type: "Report",
      version: "v1.0",
      fileSize: "2.1 MB",
      uploadedBy: "Admin User",
      uploadedDate: "3/8/2024",
      status: "Archived",
      statusColor: "bg-gray-100 text-gray-800",
      downloadCount: 5
    }
  ];

  const handleDownload = (doc) => {
    console.log("Download document:", doc);
  };

  const handlePreview = (doc) => {
    console.log("Preview document:", doc);
  };

  const handleEdit = (doc) => {
    console.log("Edit document:", doc);
  };

  const handleDelete = (doc) => {
    console.log("Delete document:", doc);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">SPV Documents</h2>
        <button className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          <span>Filter</span>
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{doc.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{doc.type} • Version {doc.version}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Size</p>
                    <p className="text-sm font-medium text-gray-900">{doc.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Uploaded By</p>
                    <p className="text-sm font-medium text-gray-900">{doc.uploadedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                    <p className="text-sm font-medium text-gray-900">{doc.uploadedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Downloads</p>
                    <p className="text-sm font-medium text-gray-900">{doc.downloadCount}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-3">
                  <button 
                    onClick={() => handlePreview(doc)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm">Preview</span>
                  </button>
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V3" />
                    </svg>
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button 
                  onClick={() => handleEdit(doc)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
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
                            handleEdit(doc);
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
                            handleDownload(doc);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdown(null);
                            handleDelete(doc);
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
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end mt-6">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">←</button>
          <button className="px-3 py-1 text-sm bg-[#00F0C3] text-black rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">→</button>
        </div>
      </div>
    </div>
  );
};

export default SPVDocuments;
