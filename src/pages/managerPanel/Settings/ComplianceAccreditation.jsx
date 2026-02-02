import React, { useState, useEffect } from "react";

// --- Inline Icons (No dependencies required) ---

const DocIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const SavesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const ExclamationTriangleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ComsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const PdfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

// --- Main Component ---

const ComplianceAccreditation = () => {
  // --- Configuration ---
  const API_URL = "http://72.61.251.114/blockchain-backend/api/compliance-documents/";

  // Updated Token from your specific Curl command
  const TEST_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzI5Njg3LCJpYXQiOjE3NjQzMTE2ODcsImp0aSI6Ijk5NzA1NzUyNGY5ZjQ2OTU5MTIzOTQyMWEwOWI1YjY4IiwidXNlcl9pZCI6IjY0In0.gt2lL5WVEjTHsEudojWQhP0APayBtG8CfwWgLpH6bA0";

  // --- State ---
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [jurisdictionOptions, setJurisdictionOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State for API parameters
  const [formData, setFormData] = useState({
    document_type: "COI",
    jurisdiction: "", // Initialize as empty
    expiry_date: new Date().toISOString().split('T')[0] // Default to today YYYY-MM-DD
  });

  // --- Effects ---

  // Fetch documents and options on component mount
  useEffect(() => {
    fetchDocuments();
    fetchFormOptions();
  }, []);

  const fetchFormOptions = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_AUTH_TOKEN;

    try {
      // Endpoint updated to jurisdictions/ as per request
      const response = await fetch(`${API_URL}jurisdictions/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.jurisdictions)) {
          setJurisdictionOptions(data.jurisdictions);
          if (data.jurisdictions.length > 0) {
            setFormData(prev => ({ ...prev, jurisdiction: data.jurisdictions[0].value }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching form options:", error);
    }
  };

  const fetchDocuments = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_AUTH_TOKEN;

    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.documents)) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_AUTH_TOKEN;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      console.log(`Document ${id} deleted successfully`);

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document: " + error.message);
    }
  };

  const removePendingFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Only adds file to state, does NOT upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      progress: 0,
      status: "ready", // 'ready' means waiting for user to click Save
      fileRaw: file
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const processUpload = async (fileItem) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_AUTH_TOKEN;

    if (!token) {
      alert("Authentication token not found. Please log in.");
      return;
    }

    // Update status to uploading
    setUploadedFiles(prev => prev.map(f =>
      f.id === fileItem.id ? { ...f, status: "uploading" } : f
    ));

    const apiPayload = new FormData();
    apiPayload.append('document_name', fileItem.name);
    apiPayload.append('document_type', formData.document_type);
    apiPayload.append('jurisdiction', formData.jurisdiction);
    apiPayload.append('expiry_date', formData.expiry_date);
    apiPayload.append('file', fileItem.fileRaw);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f =>
          f.id === fileItem.id && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
        ));
      }, 100);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: apiPayload
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
      }

      // Success
      setUploadedFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, progress: 100, status: "complete" } : f
      ));

      return true; // Indicate success

    } catch (error) {
      console.error("Upload Failed for file:", fileItem.name, error);
      setUploadedFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, status: "error" } : f
      ));
      return false; // Indicate failure
    }
  };

  const handleSave = async () => {
    // 1. Identify files that need uploading
    const filesToUpload = uploadedFiles.filter(f => f.status === "ready");

    if (filesToUpload.length === 0) {
      alert("No new files selected to upload.");
      return;
    }

    if (!formData.jurisdiction) {
      alert("Please select a jurisdiction before saving.");
      return;
    }

    setIsSaving(true);

    // 2. Upload files one by one (or Promise.all if you prefer parallel)
    let successCount = 0;
    for (const fileItem of filesToUpload) {
      const success = await processUpload(fileItem);
      if (success) successCount++;
    }

    setIsSaving(false);

    // 3. Refresh list if any succeeded
    if (successCount > 0) {
      fetchDocuments();
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === 'approved' || normalizedStatus === 'ok') {
      return <CheckIcon className="w-4 h-4 text-green-500" />;
    } else if (normalizedStatus === 'expired' || normalizedStatus === 'rejected') {
      return <XMarkIcon className="w-4 h-4 text-red-500" />;
    } else if (normalizedStatus === 'pending' || normalizedStatus === 'missing') {
      return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
    }
    return <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === 'approved' || normalizedStatus === 'ok') return 'text-green-700 bg-green-50';
    if (normalizedStatus === 'pending') return 'text-orange-700 bg-orange-50';
    if (normalizedStatus === 'rejected' || normalizedStatus === 'expired') return 'text-red-700 bg-red-50';
    return 'text-gray-700 bg-gray-50';
  };

  return (
    <div className="w-full max-w-full p-2 sm:p-4 overflow-x-hidden font-sans text-slate-800 box-border">
      <div className="bg-white rounded-lg p-3 sm:p-4 space-y-4 shadow-sm border border-slate-100 w-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
          <ComsIcon />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#01373D]">Compliance & Accreditation</h2>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 w-full">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Document Details (Applied to all uploads)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select
                name="document_type"
                value={formData.document_type}
                onChange={handleInputChange}
                className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-[#00F0C3] focus:border-[#00F0C3] bg-white"
              >
                <option value="COI">Certificate of Incorporation (COI)</option>
                <option value="Tax">Tax Document</option>
                <option value="Attest.">Attestation</option>
                <option value="License">Operating License</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Jurisdiction</label>
              <select
                name="jurisdiction"
                value={formData.jurisdiction}
                onChange={handleInputChange}
                disabled={jurisdictionOptions.length === 0}
                className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-[#00F0C3] focus:border-[#00F0C3] disabled:bg-gray-100 disabled:text-gray-400 bg-white"
              >
                {jurisdictionOptions.length === 0 ? (
                  <option>Loading options...</option>
                ) : (
                  <>
                    <option value="" disabled>Select Jurisdiction</option>
                    {jurisdictionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleInputChange}
                className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-[#00F0C3] focus:border-[#00F0C3] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Upload Area + Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">

          {/* Upload Drop Zone */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document File</label>
            <div className="border-2 border-dashed border-violet-200 bg-[#F9F8FF] rounded-lg p-6 text-center hover:border-violet-300 transition-colors relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-violet-400">
                  <DocIcon />
                </div>
                <p className="text-sm text-gray-600">
                  Drag and Drop file here or{" "}
                  <button
                    onClick={() => document.getElementById('file-upload').click()}
                    className="font-medium text-violet-600 hover:text-violet-800"
                  >
                    choose file
                  </button>
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] sm:text-xs text-gray-500">Supported: .pdf, .docx, .jpg</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Max: 25MB</span>
            </div>
          </div>

          {/* Upload Queue List */}
          <div className="w-full">
            {uploadedFiles.length > 0 && (
              <div className="h-full flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Files to Upload ({uploadedFiles.filter(f => f.status === 'ready').length})
                </h3>
                <div className="space-y-2 max-h-[180px] overflow-y-auto flex-1 pr-1">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border ${file.status === 'error' ? 'bg-red-50 border-red-200' :
                          file.status === 'complete' ? 'bg-green-50 border-green-200' :
                            'bg-[#F9F8FF] border-violet-100'
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <PdfIcon />
                        <span className="text-xs font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[140px]">
                          {file.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-end">
                        {/* Status Logic */}
                        {file.status === 'ready' && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                            <ClockIcon className="w-3 h-3" />
                            <span className="hidden sm:inline">Pending</span>
                          </div>
                        )}

                        {file.status === 'uploading' && (
                          <div className="flex items-center gap-2 flex-1 max-w-[80px]">
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-[#9889FF] transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {file.status === 'complete' && (
                          <span className="text-[10px] text-green-600 font-medium px-1">Done</span>
                        )}

                        {file.status === 'error' && (
                          <span className="text-[10px] text-red-600 font-medium px-1">Err</span>
                        )}

                        <button
                          onClick={() => removePendingFile(file.id)}
                          className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
                          title="Remove from queue"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document List Table */}
        <div className="mb-4 w-full">
          <div className="rounded-lg border border-gray-200 overflow-hidden w-full">
            <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Document Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Jurisdiction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-xs text-gray-500">
                        Loading documents...
                      </td>
                    </tr>
                  ) : documents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-xs text-gray-500">
                        No documents found. Upload one to get started.
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc, index) => (
                      <tr key={doc.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <PdfIcon />
                            <span className="truncate max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm" title={doc.document_name}>
                              {doc.document_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          {doc.document_type}
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          {doc.jurisdiction}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {getStatusIcon(doc.status)}
                            <span>{doc.status_display || doc.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                            title="Delete Document"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-medium shadow-sm text-sm ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <SavesIcon />
            <span>{isSaving ? 'Uploading...' : 'Save changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAccreditation;