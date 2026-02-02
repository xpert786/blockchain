import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Files2Icon, WatchsIcon, SecondFilesIcon, RightssIcon, View1Icon, View2Icon, View3Icon, FilesaddIcon } from "../../components/Icons";

const ManageDocuments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
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
          statusColor: "bg-orange-100 text-orange-800",
          tab: "pending"
        };
      case "signed":
      case "completed":
        return {
          status: "Signed",
          statusColor: "bg-green-100 text-green-800",
          tab: "signed"
        };
      case "draft":
        return {
          status: "Draft",
          statusColor: "bg-gray-100 text-gray-800",
          tab: "drafts"
        };
      case "approved":
        return {
          status: "Approved",
          statusColor: "bg-purple-100 text-purple-800",
          tab: "all"
        };
      default:
        return {
          status: status || "Unknown",
          statusColor: "bg-gray-100 text-gray-800",
          tab: "all"
        };
    }
  };

  // Format file size
  const formatFileSize = (mb) => {
    if (!mb && mb !== 0) return "N/A";
    if (mb === 0) return "0 MB";
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  // Fetch documents from API
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

        console.log("Documents fetched:", response.data);

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

          // Build subtitle
          const subtitleParts = [
            templateDetail.name || docDetail.title || "Document",
            generatedByDetail.full_name || generatedByDetail.username || "Unknown",
            formatDate(docDetail.created_at || doc.generated_at)
          ];
          const subtitle = subtitleParts.join(' • ');

          // Build alert message
          let alert = null;
          if (statusInfo.status === "Pending Signature" && docDetail.pending_signatures_count > 0) {
            alert = `Waiting For Signatures From ${docDetail.pending_signatures_count} ${docDetail.pending_signatures_count === 1 ? 'Party' : 'Parties'}`;
          }

          return {
            id: doc.id,
            title: docDetail.title || templateDetail.name || "Untitled Document",
            subtitle: subtitle,
            documentId: docDetail.document_id || `DOC-${doc.id}`,
            version: docDetail.version || templateDetail.version || "v1.0",
            fileSize: formatFileSize(docDetail.file_size_mb),
            signatories: docDetail.signatories_count || 0,
            status: statusInfo.status,
            statusColor: statusInfo.statusColor,
            alert: alert,
            templateId: doc.template,
            documentType: docDetail.document_type,
            enableDigitalSignature: doc.enable_digital_signature || false,
            originalData: doc
          };
        });

        setDocuments(mappedDocuments);
      } catch (err) {
        console.error("Error fetching documents:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load documents";
        setError(errorMessage);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Calculate tab counts
  const tabCounts = {
    all: documents.length,
    pending: documents.filter(doc => doc.status === "Pending Signature" || doc.status === "Pending Review").length,
    signed: documents.filter(doc => doc.status === "Signed" || doc.status === "Completed").length,
    drafts: documents.filter(doc => doc.status === "Draft").length
  };

  const tabs = [
    { id: "all", label: "All", count: tabCounts.all },
    { id: "pending", label: "Pending", count: tabCounts.pending },
    { id: "signed", label: "Signed", count: tabCounts.signed },
    { id: "drafts", label: "Drafts", count: tabCounts.drafts }
  ];

  // Filter documents based on active tab and search query
  const filteredDocuments = documents.filter((doc) => {
    // Filter by tab
    if (activeTab === "pending") {
      if (doc.status !== "Pending Signature" && doc.status !== "Pending Review") return false;
    } else if (activeTab === "signed") {
      if (doc.status !== "Signed" && doc.status !== "Completed") return false;
    } else if (activeTab === "drafts") {
      if (doc.status !== "Draft") return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.title?.toLowerCase().includes(query) ||
        doc.documentId?.toLowerCase().includes(query) ||
        doc.subtitle?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate summary statistics
  const summaryStats = {
    total: documents.length,
    pendingSignatures: documents.filter(doc => doc.status === "Pending Signature").length,
    signed: documents.filter(doc => doc.status === "Signed" || doc.status === "Completed").length,
    finalized: documents.filter(doc => doc.status === "Signed" || doc.status === "Completed" || doc.status === "Approved").length
  };

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
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
              Manage <span className="text-[#9889FF]">Documents</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Manage investment documents and agreements
            </p>
          </div>
          <button
            onClick={() => navigate('/manager-panel/document-template-engine')}
            className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#CAE6FF] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Total Documents</p>
                <Files2Icon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
                <p className="text-xs text-green-600">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-[#D7F8F0] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Pending Signatures</p>
                <WatchsIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">{summaryStats.pendingSignatures}</p>
                <p className="text-xs text-green-600">{summaryStats.pendingSignatures > 0 ? `${summaryStats.pendingSignatures} urgent` : 'All clear'}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#E2E2FB] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Signed Documents</p>
                <SecondFilesIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">{summaryStats.signed}</p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFEFE8] rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Finalized</p>
                <RightssIcon />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">{summaryStats.finalized}</p>
                <p className="text-xs text-green-600">Finalized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${activeTab === tab.id
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search documents by name, ID, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none"
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
        <div className="flex items-center justify-between md:justify-start gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <View1Icon />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <View2Icon />
          </button>
          <button className="p-2 bg-[#01373D] text-white rounded-lg">
            <View3Icon />
          </button>
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
      {!loading && !error && filteredDocuments.length === 0 && (
        <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 text-gray-400 mb-4">
            <FilesaddIcon />
          </div>
          <p className="text-lg font-medium text-gray-600">No documents found</p>
          <p className="text-sm text-gray-500 mt-2">
            {searchQuery ? "Try adjusting your search query" : "Create your first document"}
          </p>
        </div>
      )}

      {/* Documents List */}
      {!loading && !error && filteredDocuments.length > 0 && (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <FilesaddIcon />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">{doc.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {doc.subtitle.split(' • ')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {doc.subtitle.split(' • ')[1]}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {doc.subtitle.split(' • ')[2]}
                    </span>
                    {doc.subtitle.split(' • ')[3] && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {doc.subtitle.split(' • ')[3]}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                    <div className={`p-3 rounded-lg mb-4 flex items-center ${doc.alert.includes('Admin Review') ? 'bg-[#00CC991A] text-black' : 'bg-[#FFD9661A] text-black'
                      }`}>
                      {doc.alert.includes('Admin Review') ? (
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <p className="text-sm font-medium">{doc.alert}</p>
                    </div>
                  )}

                  {/* Bottom Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-4">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-[#F4F6F5] text-black hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-sm font-medium">Preview</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-[#F4F6F5] text-black hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V3" />
                      </svg>
                      <span className="text-sm font-medium">Download</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end md:gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-black hover:text-gray-800 transition-colors border border-gray-300 rounded-lg bg-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-2 text-black hover:text-gray-800 transition-colors border border-gray-300 rounded-lg bg-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <path d="M7 10l5 5 5-5" />
                        <path d="M12 15V3" />
                      </svg>
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
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
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
      )}
    </div>
  );
};

export default ManageDocuments;
