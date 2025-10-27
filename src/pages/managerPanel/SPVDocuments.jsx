import React from "react";
import {FilesIcon} from "../../components/Icons";

const SPVDocuments = () => {
  const documents = [
    {
      id: 1,
      name: "Private Placement Memorandum",
      type: "PDF",
      uploadedDate: "Jan 15, 2024",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white"
    },
    {
      id: 2,
      name: "Operating Agreement",
      type: "PDF",
      uploadedDate: "Jan 15, 2024",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white"
    },
    {
      id: 3,
      name: "Subscription Agreement",
      type: "PDF",
      uploadedDate: "Jan 15, 2024",
      status: "Raising",
      statusColor: "bg-[#22C55E] text-white"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">SPV Documents</h2>
        
        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search SPVs by name, ID, or focus area..."
              className="w-full pl-10 pr-4 py-2 ! bg-[#F4F6F5] border border-gray-300 rounded-lg focus:outline-none"
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
          <button className="flex items-center space-x-2 px-4 py-2 !border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <span className="text=[#0A2A2E]">Filter</span>
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
            <div key={doc.id} className="!border border-[#E2E2FB] rounded-lg p-4 bg-[#F9F8FF] hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <FilesIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type} • Uploaded: {doc.uploadedDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${doc.statusColor}`}>
                  {doc.status}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-sm text-[#001D21] bg-[#F4F6F5] hover:bg-gray-200 !border border-[#01373D] rounded-lg transition-colors">
                    View
                  </button>
                  <button className="px-4 py-2 text-sm text-[#001D21] bg-[#F4F6F5] hover:bg-[#00D4A3] !border border-[#01373D] rounded-lg transition-colors">
                    Download
                  </button>
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
