import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GeneratedDocuments = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Map API status to display status
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending_signatures":
      case "pending_signature":
        return {
          status: "Pending Signature",
          statusColor: "bg-[#E9BB30] text-white"
        };
      case "signed":
      case "completed":
      case "active":
        return {
          status: "Active",
          statusColor: "bg-[#22C55E] text-white"
        };
      case "draft":
        return {
          status: "Draft",
          statusColor: "bg-gray-400 text-white"
        };
      default:
        return {
          status: status || "Unknown",
          statusColor: "bg-gray-400 text-white"
        };
    }
  };

  // Fetch generated documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError("");

      try {
        const API_URL = getApiUrl();
        const accessToken = getAccessToken();
        
        if (!accessToken) {
          throw new Error("No access token found. Please login again.");
        }

        const response = await axios.get(`${API_URL}/documents/generated-documents/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Generated documents fetched:", response.data);
        
        // Handle different response formats
        let documentsData = [];
        if (Array.isArray(response.data)) {
          documentsData = response.data;
        } else if (response.data?.results) {
          documentsData = response.data.results;
        } else if (response.data?.data) {
          documentsData = response.data.data;
        }

        // Map API response to component format
        const mappedDocuments = documentsData.map((doc) => {
          const docDetail = doc.generated_document_detail || {};
          const templateDetail = doc.template_detail || {};
          const generatedByDetail = doc.generated_by_detail || {};
          const statusInfo = getStatusInfo(docDetail.status);

          // Build signatories array from API data
          const signatories = [];
          if (docDetail.signatories_count > 0) {
            // If we have signed and pending counts, create placeholder signatories
            if (docDetail.signed_count > 0) {
              for (let i = 0; i < docDetail.signed_count; i++) {
                signatories.push({
                  name: `Signatory ${i + 1}`,
                  status: "signed",
                  date: formatDate(docDetail.updated_at)
                });
              }
            }
            if (docDetail.pending_signatures_count > 0) {
              for (let i = 0; i < docDetail.pending_signatures_count; i++) {
                signatories.push({
                  name: `Signatory ${docDetail.signed_count + i + 1}`,
                  status: "pending",
                  date: null
                });
              }
            }
          }

          return {
            id: doc.id,
            documentId: docDetail.document_id || doc.id,
            name: templateDetail.name || docDetail.title || "Untitled Document",
            title: docDetail.title || templateDetail.name || "Untitled Document",
            investor: generatedByDetail.full_name || generatedByDetail.username || "Unknown",
            spv: docDetail.document_id || `DOC-${doc.id}`,
            date: formatDate(docDetail.created_at || doc.generated_at),
            status: statusInfo.status,
            statusColor: statusInfo.statusColor,
            signatories: signatories,
            templateId: doc.template,
            documentType: docDetail.document_type,
            enableDigitalSignature: doc.enable_digital_signature || false,
            originalData: doc // Keep original data for reference
          };
        });

        setDocuments(mappedDocuments);
      } catch (err) {
        console.error("Error fetching generated documents:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load generated documents";
        setError(errorMessage);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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
            placeholder="Search Documents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
            <p className="text-sm text-gray-600">Loading documents...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && documents.length === 0 && (
        <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 text-gray-400 mb-4">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600">No generated documents found</p>
          <p className="text-sm text-gray-500 mt-2">Generate your first document from a template</p>
        </div>
      )}

      {/* Documents List */}
      {!loading && !error && documents.length > 0 && (
        <div className="space-y-4">
          {documents
            .filter((doc) => {
              if (!searchQuery) return true;
              const query = searchQuery.toLowerCase();
              return (
                doc.name?.toLowerCase().includes(query) ||
                doc.title?.toLowerCase().includes(query) ||
                doc.investor?.toLowerCase().includes(query) ||
                doc.documentId?.toLowerCase().includes(query)
              );
            })
            .map((doc) => (
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
                  {doc.signatories && doc.signatories.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Signatories ({doc.signatories.length}):</p>
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
                  )}
                  {(!doc.signatories || doc.signatories.length === 0) && doc.enableDigitalSignature && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Signatories:</p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-600">No signatory information available</p>
                      </div>
                    </div>
                  )}
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
                  {(doc.status === "Pending Signature" || doc.status === "Pending") && doc.enableDigitalSignature && (
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
        )}
    </div>
  );
};

export default GeneratedDocuments;