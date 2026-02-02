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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError("");

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("Authentication required. Please log in again.");
          setLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const apiEndpoint = `${API_URL.replace(/\/$/, "")}/document-generations/`;

        const response = await axios.get(apiEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        console.log("Document generations API response:", response.data);

        // Map API response to component format and filter only documents with investor_name
        const allDocuments = (response.data?.results || []).map((doc) => ({
          id: doc.id,
          name: doc.generated_document_detail?.title || doc.template_detail?.name || "Untitled Document",
          title: doc.generated_document_detail?.title || doc.template_detail?.name || "Untitled Document",
          templateName: doc.template_detail?.name || "Unknown Template",
          investor: doc.generation_data?.investor_name || null,
          spv: doc.generation_data?.spv_name || doc.generation_data?.legal_entity_name || "N/A",
          documentId: doc.generated_document_detail?.document_id || `DOC-${doc.id}`,
          date: doc.generated_at || doc.generated_document_detail?.created_at || new Date().toISOString(),
          status: doc.generated_document_detail?.status || "draft",
          statusColor: getStatusInfo(doc.generated_document_detail?.status || "draft").statusColor,
          enableDigitalSignature: doc.enable_digital_signature || false,
          signatoriesCount: doc.generated_document_detail?.signatories_count || 0,
          signedCount: doc.generated_document_detail?.signed_count || 0,
          pendingSignaturesCount: doc.generated_document_detail?.pending_signatures_count || 0,
          investmentAmount: doc.generation_data?.investment_amount || null,
          defaultFeeRate: doc.generation_data?.default_fee_rate || "",
          defaultClosePeriodDays: doc.generation_data?.default_close_period_days || "",
          createdByName: doc.generated_by_detail?.full_name || doc.generated_by_detail?.username || "Unknown",
          apiData: doc // Store full API data for reference
        }));

        // Filter to only show documents with investor_name
        const documentsWithInvestor = allDocuments.filter(doc => doc.investor);

        setDocuments(documentsWithInvestor);
      } catch (error) {
        console.error('Error fetching documents:', error);

        if (error.response) {
          const errorData = error.response.data;
          const errorMessage = errorData?.detail || errorData?.error || errorData?.message ||
            (typeof errorData === 'string' ? errorData : 'Failed to load documents');
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

    fetchDocuments();

    // Listen for custom event when documents are updated
    const handleDocumentsUpdate = () => {
      fetchDocuments();
    };

    window.addEventListener('generatedDocumentsUpdated', handleDocumentsUpdate);

    return () => {
      window.removeEventListener('generatedDocumentsUpdated', handleDocumentsUpdate);
    };
  }, []);

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


  const handleDownload = (doc) => {
    console.log("Download document:", doc);
  };

  const handlePreview = async (doc) => {
    setPreviewDocument(doc);
    setShowPreviewModal(true);
    setPdfUrl(null);
    setPreviewError("");
    setPreviewLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setPreviewError("Authentication required. Please log in again.");
        setPreviewLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const apiEndpoint = `${API_URL.replace(/\/$/, "")}/document-generations/${doc.id}/view/`;

      // Fetch PDF from API
      const response = await axios.get(apiEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/pdf, application/json'
        },
        responseType: 'blob', // Important: get binary data
        withCredentials: true
      });

      console.log("PDF preview response:", response);

      // Create blob URL from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error fetching PDF preview:', error);

      if (error.response) {
        // Check if response is JSON (error message) or PDF
        if (error.response.headers['content-type']?.includes('application/json')) {
          const errorData = error.response.data;
          const errorMessage = errorData?.detail || errorData?.error || errorData?.message ||
            'Failed to load PDF preview';
          setPreviewError(errorMessage);
        } else {
          setPreviewError("Failed to load PDF preview. The document may not be available yet.");
        }
      } else if (error.request) {
        setPreviewError("Network error. Please check your connection and try again.");
      } else {
        setPreviewError(error.message || "An unexpected error occurred.");
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewDocument(null);
    // Clean up blob URL to prevent memory leaks
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setPreviewError("");
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
          <p className="text-lg font-medium text-gray-600">No investor documents found</p>
          <p className="text-sm text-gray-500 mt-2">Documents sent to investors will appear here</p>
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
                doc.title?.toLowerCase().includes(query) ||
                doc.templateName?.toLowerCase().includes(query) ||
                doc.investor?.toLowerCase().includes(query) ||
                doc.spv?.toLowerCase().includes(query) ||
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
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{doc.title || doc.templateName}</h3>

                      {/* Metadata with icons */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">{doc.investor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{doc.spv}</span>
                        </div>
                        {doc.investmentAmount && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>${doc.investmentAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(doc.date)}</span>
                        </div>
                        {doc.documentId && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            <span className="text-xs">{doc.documentId}</span>
                          </div>
                        )}
                      </div>

                      {/* Signatories Info */}
                      {doc.enableDigitalSignature && (
                        <div className="mt-4">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {doc.signatoriesCount > 0 && (
                              <span>Signatories: {doc.signedCount}/{doc.signatoriesCount}</span>
                            )}
                            {doc.pendingSignaturesCount > 0 && (
                              <span className="text-orange-600">Pending: {doc.pendingSignaturesCount}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${doc.statusColor}`}>
                      {getStatusInfo(doc.status).status}
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
                      {(doc.status === "pending_signature" || doc.status === "pending" || getStatusInfo(doc.status).status === "Pending Signature") && doc.enableDigitalSignature && (
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

      {/* PDF Preview Modal */}
      {showPreviewModal && previewDocument && (
        <div className="fixed inset-0 bg-[#01373DB2] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{previewDocument.title || previewDocument.templateName}</h2>
                {previewDocument.documentId && (
                  <p className="text-sm text-gray-500 mt-1">Document ID: {previewDocument.documentId}</p>
                )}
              </div>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden p-4 sm:p-6">
              {previewLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
                    <p className="text-sm text-gray-600">Loading PDF preview...</p>
                  </div>
                </div>
              )}

              {previewError && !previewLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 text-red-400 mx-auto mb-4">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">Unable to load PDF</p>
                    <p className="text-sm text-gray-600 mb-4">{previewError}</p>
                    <button
                      onClick={handleClosePreview}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {pdfUrl && !previewLoading && !previewError && (
                <div className="h-full w-full">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border border-gray-300 rounded-lg"
                    title="PDF Preview"
                    style={{ minHeight: '600px' }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {pdfUrl && !previewLoading && !previewError && (
              <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t">
                <a
                  href={pdfUrl}
                  download={`${previewDocument.title || 'document'}.pdf`}
                  className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                >
                  Download PDF
                </a>
                <button
                  onClick={handleClosePreview}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedDocuments;