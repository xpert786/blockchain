import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneratedDocuments = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const documents = [
    {
      id: 1,
      name: "Investment Agreement",
      investor: "Alice Investor",
      spv: "SPV-001",
      date: "3/15/2024",
      status: "Active",
      statusColor: "bg-[#22C55E] text-white",
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
      statusColor: "bg-[#E9BB30] text-white",
      signatories: [
        { name: "Bob Smith", status: "pending", date: null },
        { name: "Sarah Wilson", status: "signed", date: "3/15/2024" }
      ]
    }
  ];

  const handleDownload = (doc) => {
    console.log("Download document:", doc);
  };

  const handlePreview = (doc) => {
    console.log("Preview document:", doc);
  };

  const handleSign = (doc) => {
    console.log("Sign document:", doc);
  };

  const getStatusIcon = (status) => {
    if (status === "signed") {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (status === "pending") {
      return (
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
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
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg p-4 sm:p-6 !border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{doc.name}</h3>
                  
                  {/* Metadata with icons */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{doc.investor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{doc.spv}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  
                  {/* Signatories */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Signatories:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doc.signatories.map((signatory, index) => (
                        <div key={index} className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-700">{signatory.name}</span>
                            {signatory.date ? (
                              <span className="text-xs text-green-600 font-medium">{signatory.date}</span>
                            ) : (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium w-fit">
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="shrink-0">
                            {getStatusIcon(signatory.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${doc.statusColor}`}>
                  {doc.status}
                </span>
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handlePreview(doc)}
                    className="p-2 bg-gray-100 rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="p-2 bg-gray-100 rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V3" />
                    </svg>
                  </button>
                  {doc.status === "Pending Signature" && (
                    <button 
                      onClick={() => handleSign(doc)}
                      className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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