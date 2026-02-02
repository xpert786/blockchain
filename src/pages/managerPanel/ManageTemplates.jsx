import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageTemplates = () => {
  const navigate = useNavigate();
  const [generatedDocuments, setGeneratedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    investorName: "",
    spvName: "",
    investmentAmount: "",
    defaultFeeRate: "",
    closePeriodDays: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [spvList, setSpvList] = useState([]);
  const [spvLoading, setSpvLoading] = useState(false);
  const [investorList, setInvestorList] = useState([]);
  const [investorLoading, setInvestorLoading] = useState(false);
  const [filteredInvestors, setFilteredInvestors] = useState([]);

  // Fetch generated documents from API
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
        const apiEndpoint = `${API_URL.replace(/\/$/, "")}/documents/generated-documents/`;

        const response = await axios.get(apiEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        console.log("Generated documents API response:", response.data);

        // Map API response to component format
        const mappedDocuments = (response.data || []).map((doc) => ({
          id: doc.id,
          templateName: doc.template_detail?.name || "Unknown Template",
          templateId: doc.template || doc.template_detail?.id,
          templateVersion: doc.template_detail?.version ? `v${doc.template_detail.version}` : "v1.0",
          templateType: doc.template_detail?.category ?
            doc.template_detail.category.charAt(0).toUpperCase() + doc.template_detail.category.slice(1) : "Legal",
          documentId: doc.generated_document_detail?.document_id || `DOC-${doc.id}`,
          defaultFeeRate: doc.generation_data?.default_fee_rate || "",
          defaultClosePeriodDays: doc.generation_data?.default_close_period_days || "",
          legalEntityName: doc.generation_data?.legal_entity_name || "",
          status: doc.generated_document_detail?.status || "draft",
          createdAt: doc.generated_at || doc.generated_document_detail?.created_at || new Date().toISOString(),
          title: doc.generated_document_detail?.title || "",
          documentType: doc.generated_document_detail?.document_type || "other",
          version: doc.generated_document_detail?.version || "1.0",
          fileSizeMb: doc.generated_document_detail?.file_size_mb || 0,
          signatoriesCount: doc.generated_document_detail?.signatories_count || 0,
          signedCount: doc.generated_document_detail?.signed_count || 0,
          pendingSignaturesCount: doc.generated_document_detail?.pending_signatures_count || 0,
          createdByName: doc.generated_by_detail?.full_name || doc.generated_by_detail?.username || "Unknown",
          // Template details for modal
          templateDetail: doc.template_detail || null,
          scope: doc.template_detail?.scope || "spv",
          jurisdiction: doc.template_detail?.jurisdiction_scope || "global",
          description: doc.template_detail?.description || "",
          investorName: doc.generation_data?.investor_name || null, // Store investor name to filter
          apiData: doc // Store full API data for reference
        }));

        // Filter to only show documents WITHOUT investor_name (templates created directly, not sent to investors)
        const templatesOnly = mappedDocuments.filter(doc => !doc.investorName);

        setGeneratedDocuments(templatesOnly);
      } catch (error) {
        console.error('Error fetching generated documents:', error);

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

    // Listen for custom event when documents are updated (from GenerateDocument)
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

  // Map status to display status
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending_signatures":
      case "pending_signature":
      case "pending":
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
          status: status || "Draft",
          statusColor: "bg-gray-400 text-white"
        };
    }
  };

  // Filter documents based on search query
  const filteredDocuments = generatedDocuments.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.templateName?.toLowerCase().includes(query) ||
      doc.title?.toLowerCase().includes(query) ||
      doc.documentId?.toLowerCase().includes(query) ||
      doc.legalEntityName?.toLowerCase().includes(query) ||
      doc.createdByName?.toLowerCase().includes(query)
    );
  });

  const handleDownload = (doc) => {
    console.log("Download document:", doc);
    // Handle download logic here
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

  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("Authentication required. Please log in again.");
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        // Note: Update this endpoint if your API has a delete endpoint
        // const apiEndpoint = `${API_URL.replace(/\/$/, "")}/api/documents/generated-documents/${docId}/`;
        // await axios.delete(apiEndpoint, {
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`,
        //   },
        //   withCredentials: true
        // });

        // For now, just remove from local state
        // TODO: Implement API delete call when endpoint is available
        const updated = generatedDocuments.filter(doc => doc.id !== docId);
        setGeneratedDocuments(updated);
        window.dispatchEvent(new Event('generatedDocumentsUpdated'));
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  const handleSendToInvestor = async (doc) => {
    setSelectedDocument(doc);
    // Pre-fill form with existing data
    setFormData({
      investorName: "",
      spvName: doc.legalEntityName || "",
      investmentAmount: "",
      defaultFeeRate: doc.defaultFeeRate || "0.02",
      closePeriodDays: doc.defaultClosePeriodDays || "30"
    });

    // Fetch SPV list and Investors list
    setSpvLoading(true);
    setInvestorLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setSpvLoading(false);
        setInvestorLoading(false);
        setShowSendModal(true);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

      // Fetch SPV list
      const spvEndpoint = `${API_URL.replace(/\/$/, "")}/documents/spvs/`;
      const spvResponse = await axios.get(spvEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      console.log("SPV list API response:", spvResponse.data);

      // Map SPV list from API response
      const mappedSPVs = (spvResponse.data?.results || []).map(spv => ({
        id: spv.id,
        displayName: spv.display_name,
        portfolioCompanyName: spv.portfolio_company_name,
        status: spv.status
      }));

      setSpvList(mappedSPVs);

      // Fetch Investors list
      const investorEndpoint = `${API_URL.replace(/\/$/, "")}/documents/investors/`;
      const investorResponse = await axios.get(investorEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      console.log("Investors list API response:", investorResponse.data);

      // Map investors from API response
      const mappedInvestors = (investorResponse.data?.results || []).map(investor => ({
        id: investor.id,
        name: investor.name || investor.username || `${investor.first_name} ${investor.last_name}`.trim() || investor.email,
        email: investor.email,
        username: investor.username,
        firstName: investor.first_name,
        lastName: investor.last_name,
        spvs: investor.spvs || [] // Array of SPVs this investor is associated with
      }));

      setInvestorList(mappedInvestors);

      // If there's a matching SPV by name, pre-select it and filter investors
      if (doc.legalEntityName && mappedSPVs.length > 0) {
        const matchingSpv = mappedSPVs.find(spv =>
          spv.displayName.toLowerCase() === doc.legalEntityName.toLowerCase() ||
          spv.portfolioCompanyName?.toLowerCase() === doc.legalEntityName.toLowerCase()
        );
        if (matchingSpv) {
          setFormData(prev => ({
            ...prev,
            spvName: matchingSpv.displayName
          }));
          // Filter investors for this SPV (now that investor list is loaded)
          const filtered = mappedInvestors.filter(investor =>
            investor.spvs.some(spv => spv.id === matchingSpv.id)
          );
          setFilteredInvestors(filtered);
        } else {
          setFilteredInvestors([]);
        }
      } else {
        setFilteredInvestors([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Continue even if data fails to load
    } finally {
      setSpvLoading(false);
      setInvestorLoading(false);
    }

    setShowSendModal(true);
  };

  // Filter investors based on selected SPV
  const filterInvestorsBySPV = (spvId) => {
    if (!spvId || investorList.length === 0) {
      setFilteredInvestors([]);
      return;
    }

    // Filter investors who have this SPV in their spvs array
    const filtered = investorList.filter(investor =>
      investor.spvs && investor.spvs.some(spv => spv.id === spvId)
    );

    setFilteredInvestors(filtered);
    console.log(`Filtered ${filtered.length} investors for SPV ${spvId}`);
  };

  const handleCloseModal = () => {
    setShowSendModal(false);
    setSelectedDocument(null);
    setFormData({
      investorName: "",
      spvName: "",
      investmentAmount: "",
      defaultFeeRate: "",
      closePeriodDays: ""
    });
    setFilteredInvestors([]);
    setSpvList([]);
    setInvestorList([]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If SPV Name changed, filter investors for that SPV
    if (name === "spvName") {
      const selectedSpv = spvList.find(spv => spv.displayName === value);
      if (selectedSpv) {
        filterInvestorsBySPV(selectedSpv.id);
        // Clear investor name when SPV changes
        setFormData(prev => ({
          ...prev,
          investorName: ""
        }));
      } else {
        setFilteredInvestors([]);
      }
    }
  };

  const handleUseTemplate = async () => {
    // Validate required fields
    if (!formData.spvName) {
      alert("SPV Name is required");
      return;
    }

    setSubmitting(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Authentication required. Please log in again.");
        setSubmitting(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const apiEndpoint = `${API_URL.replace(/\/$/, "")}/documents/generate-from-template/`;

      // Prepare field_data object from form data
      const fieldData = {
        spv_name: formData.spvName,
        default_close_period_days: formData.closePeriodDays || selectedDocument.defaultClosePeriodDays || "30",
      };

      // Add optional fields if provided
      if (formData.investorName) {
        fieldData.investor_name = formData.investorName;
      }
      if (formData.investmentAmount) {
        // Convert to number if it's a valid number
        const amount = parseFloat(formData.investmentAmount);
        if (!isNaN(amount)) {
          fieldData.investment_amount = amount;
        } else {
          fieldData.investment_amount = formData.investmentAmount;
        }
      }
      if (formData.defaultFeeRate) {
        fieldData.default_fee_rate = formData.defaultFeeRate;
      }
      if (selectedDocument.legalEntityName) {
        fieldData.legal_entity_name = selectedDocument.legalEntityName;
      }

      // Prepare request payload
      const payload = {
        template_id: selectedDocument.templateId,
        field_data: fieldData
      };

      console.log("Generating document for investor:", payload);

      // Make API call
      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      console.log("Document generated successfully:", response.data);

      // Refresh the documents list
      window.dispatchEvent(new Event('generatedDocumentsUpdated'));

      alert("Document generated and sent to investor successfully!");
      handleCloseModal();
    } catch (error) {
      console.error('Error generating document:', error);

      // Handle error response
      let errorMessage = 'Failed to generate document. Please try again.';
      if (error.response) {
        const errorData = error.response.data;
        errorMessage = errorData?.detail || errorData?.error || errorData?.message ||
          (typeof errorData === 'string' ? errorData : errorMessage);
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">SPV Generated Documents</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage documents generated from templates</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search documents..."
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
        <div className="text-sm text-gray-600">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
            <p className="text-sm text-gray-600">Loading documents...</p>
          </div>
        </div>
      )}

      {/* Documents List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 text-gray-400 mb-4">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-600">No template documents found</p>
              <p className="text-sm text-gray-500 mt-2">Generate your first document template from a template</p>
              <button
                onClick={() => navigate('/manager-panel/document-template-engine?tab=generate')}
                className="mt-4 bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go to Generate Documents
              </button>
            </div>
          ) : (
            filteredDocuments.map((doc) => {
              const statusInfo = getStatusInfo(doc.status);
              return (
                <div key={doc.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                          {doc.title || doc.templateName || "Untitled Document"}
                        </h3>

                        {/* Metadata with icons */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
                          {doc.legalEntityName && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>{doc.legalEntityName}</span>
                            </div>
                          )}
                          {doc.defaultFeeRate && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Fee: {doc.defaultFeeRate}</span>
                            </div>
                          )}
                          {doc.defaultClosePeriodDays && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{doc.defaultClosePeriodDays} days</span>
                            </div>
                          )}
                          {doc.createdAt && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(doc.createdAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* Document ID */}
                        {doc.documentId && (
                          <div className="text-xs text-gray-500 mb-2">
                            Document ID: {doc.documentId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${statusInfo.statusColor}`}>
                        {statusInfo.status}
                      </span>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="p-2 bg-gray-100 rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors"
                          title="Preview"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 bg-gray-100 rounded-lg text-[#01373D] hover:bg-gray-200 transition-colors"
                          title="Download"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 bg-gray-100 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleSendToInvestor(doc)}
                          className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors text-sm"
                          title="Send to Investor"
                        >
                          Send to Investor
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

      {/* Send to Investor Modal */}
      {showSendModal && selectedDocument && (
        <div className="fixed inset-0 bg-[#01373DB2] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Template Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Template General Information */}
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Template Name</label>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.templateName}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Version</label>
                        <p className="text-base font-medium text-gray-900">{selectedDocument.templateVersion}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Category</label>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {selectedDocument.templateType}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Scope</label>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {selectedDocument.scope === "spv" ? "SPV- Level Reference Document" : selectedDocument.scope}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Jurisdiction</label>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {selectedDocument.jurisdiction === "global" ? "Global" : selectedDocument.jurisdiction === "us" ? "US Only" : selectedDocument.jurisdiction}
                        </span>
                      </div>
                    </div>
                    {selectedDocument.description && (
                      <div>
                        <label className="text-sm text-gray-500">Description</label>
                        <p className="text-base text-gray-700 mt-1">{selectedDocument.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fields Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required Fields */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Required Fields</h3>
                  <p className="text-sm text-gray-500 mb-4">(For Generation)</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investor Name
                      </label>
                      {!formData.spvName ? (
                        <div className="w-full px-3 py-2 border border-[#0A2A2E] bg-gray-100 rounded-lg text-sm text-gray-500">
                          Please select an SPV first
                        </div>
                      ) : filteredInvestors.length > 0 ? (
                        <select
                          name="investorName"
                          value={formData.investorName}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                          disabled={submitting}
                        >
                          <option value="">Select Investor</option>
                          {filteredInvestors.map((investor) => (
                            <option key={investor.id} value={investor.name}>
                              {investor.name} {investor.email ? `(${investor.email})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            name="investorName"
                            value={formData.investorName}
                            onChange={handleFormChange}
                            placeholder="Enter Investor Name"
                            className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                            disabled={submitting}
                          />
                          <p className="text-xs text-gray-500">No investors found for this SPV. Enter manually.</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SPV Name <span className="text-red-500">*</span>
                      </label>
                      {spvLoading ? (
                        <div className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span className="text-sm text-gray-500">Loading SPVs...</span>
                        </div>
                      ) : spvList.length > 0 ? (
                        <select
                          name="spvName"
                          value={formData.spvName}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                          required
                          disabled={submitting}
                        >
                          <option value="">Select SPV</option>
                          {spvList.map((spv) => (
                            <option key={spv.id} value={spv.displayName}>
                              {spv.displayName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="spvName"
                          value={formData.spvName}
                          onChange={handleFormChange}
                          placeholder="Enter SPV Name"
                          className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                          required
                          disabled={submitting}
                        />
                      )}
                      {spvList.length === 0 && !spvLoading && (
                        <p className="text-xs text-gray-500 mt-1">No SPVs available. Please enter SPV name manually.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investment amount
                      </label>
                      <input
                        type="text"
                        name="investmentAmount"
                        value={formData.investmentAmount}
                        onChange={handleFormChange}
                        placeholder="Enter amount (number)"
                        className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Configurable Fields */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Configurable Fields</h3>
                  <p className="text-sm text-gray-500 mb-4">(For Defaults)</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Fee Rate
                      </label>
                      <input
                        type="text"
                        name="defaultFeeRate"
                        value={formData.defaultFeeRate}
                        onChange={handleFormChange}
                        placeholder="0.02"
                        className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Close Periods Days
                      </label>
                      <input
                        type="text"
                        name="closePeriodDays"
                        value={formData.closePeriodDays}
                        onChange={handleFormChange}
                        placeholder="30"
                        className="w-full px-3 py-2 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUseTemplate}
                disabled={submitting}
                className="px-6 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Use Template"}
              </button>
            </div>
          </div>
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

export default ManageTemplates;
