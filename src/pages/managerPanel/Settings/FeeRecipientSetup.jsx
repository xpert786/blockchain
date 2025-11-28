import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Inline Icons (Replacements for external imports) ---
const FreeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const Upload2Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SavechangesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const AddFeeRecipient = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the passed state
  
  // Check if an ID was passed in navigation state (indicates Edit Mode)
  const editId = location.state?.id;

  // --- Configuration ---
  const BASE_API_URL = "http://168.231.121.7/blockchain-backend/api/syndicate/settings/fee-recipient/";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzM4NzY1LCJpYXQiOjE3NjQzMjA3NjUsImp0aSI6ImY2NWE0ZDFkNzRkZTRhMzlhNDViNmI2ZDAxNjgyODIwIiwidXNlcl9pZCI6IjY0In0.JW7CC4OenVaSkb7odrdxQ2TaXHlsACl7hO0G680XOU8";

  // --- State ---
  const [recipientType, setRecipientType] = useState("Individual");
  const [entityName, setEntityName] = useState(""); 
  const [residence, setResidence] = useState(""); 
  const [file, setFile] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState(null); // To display existing file in UI
  const [referenceCode, setReferenceCode] = useState(""); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(!!editId); // Start loading state if we have an ID
  const [error, setError] = useState(null);
  
  // --- Fetch Data on Mount (If Editing) ---
  useEffect(() => {
    if (editId) {
      fetchRecipientDetails(editId);
    }
  }, [editId]);

  const fetchRecipientDetails = async (id) => {
    setIsFetching(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    try {
      const response = await fetch(`${BASE_API_URL}${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          // GET requests typically don't need Content-Type, but keeping if API requires strict headers
          'Content-Type': 'application/json', 
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result; // Handle potential nested { data: ... } structure

        // --- Pre-fill Form Fields ---
        if (data.recipient_type) {
            // Ensure capitalization matches select options (e.g., 'individual' -> 'Individual')
            const type = data.recipient_type.charAt(0).toUpperCase() + data.recipient_type.slice(1);
            setRecipientType(type);
        }
        
        // Handle name mapping (API might return entity_name or first_name)
        setEntityName(data.entity_name || data.first_name || "");
        
        // Handle residence mapping
        setResidence(data.residence || data.jurisdiction || "");
        
        setReferenceCode(data.tax_id || "");

        // Handle File Display
        if (data.id_document_url || data.id_document) {
            setExistingFileUrl(data.id_document_url || data.id_document);
        }

      } else {
        console.error("Failed to fetch recipient details");
        setError("Failed to load recipient details.");
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      setError("Network error.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append("recipient_type", recipientType.toLowerCase()); 
    formData.append("entity_name", entityName);
    formData.append("residence", residence);
    formData.append("tax_id", referenceCode);
    
    // Only append file if a new one is selected
    if (file) {
      formData.append("id_document", file);
    }

    // Determine Method (POST for Create, PATCH for Update)
    const method = editId ? 'PATCH' : 'POST';
    // Determine URL (Append ID for Update)
    const url = editId ? `${BASE_API_URL}${editId}/` : BASE_API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Content-Type is left undefined so browser sets boundary for multipart/form-data
        },
        body: formData
      });

      if (response.ok) {
        const msg = editId ? "Fee recipient updated successfully!" : "Fee recipient saved successfully!";
        console.log(msg);
        alert(msg);
        navigate(-1); // Go back to the previous page (List)
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to save fee recipient", errorData);
        setError(errorData.message || errorData.detail || "Failed to save. Please check your inputs.");
      }
    } catch (err) {
      console.error("Error saving fee recipient:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back
  };

  // Show loading spinner while fetching edit details
  if (isFetching) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F6F5]">
             <div className="w-8 h-8 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Header Card */}
      <div className="bg-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center sm:justify-start">
            <div className="p-2 bg-[#F4F6F5] rounded-full">
                <FreeIcon />
            </div>
        </div>
        <div>
          <h4 className="text-base sm:text-[18px] text-[#001D21] font-semibold">
            {editId ? "Edit Fee Recipient" : "Fee Recipient Setup"}
          </h4>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 w-full space-y-8 shadow-sm border border-gray-100">
        
        {/* Error Message */}
        {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
            </div>
        )}

        {/* Recipient Type */}
        <div className="mb-6 flex flex-col items-start w-full md:w-2/5">
          <label className="block text-sm text-[#001D21] font-medium mb-2">
            Recipient Type
          </label>
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none text-[#001D21] focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-white"
          >
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
            <option value="Trust">Trust</option>
          </select>
        </div>

        {/* Entity Name */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full">
            <label className="block text-sm text-[#001D21] font-medium mb-2">
             Entity name
            </label>
            <div className="relative">
              <input
                className="w-full border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-2.5 pr-8 outline-none focus:ring-1 focus:ring-[#00F0C3]"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Entity"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#0A2A2E" strokeWidth="1.5" fill="none"/>
                  <path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" stroke="#0A2A2E" strokeWidth="1.5" fill="none"/>
                </svg>
              </span>
            </div>
          </div>
          
        </div>

        {/* Residence */}
        <div className="mb-6 mt-10 flex flex-col md:flex-row md:items-center gap-2">
          <label className="block text-sm text-[#001D21] font-medium mb-2 md:mb-0 md:mr-2 whitespace-nowrap">
          Tax residence
          </label>
          <select
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            className="border border-[#E2E2FB] rounded-lg p-2.5 outline-none w-full md:w-2/5 text-[#001D21] focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-white"
          >
            <option value="">Select Tax residence</option>
            <option value="Delaware">Delaware</option>
            <option value="Wyoming">Wyoming</option>
            <option value="BVI">BVI</option>
            <option value="Cayman Islands">Cayman Islands</option>
            <option value="Singapore">Singapore</option>
          </select>
        </div>

        {/* Upload Section */}
        <div className="mb-6 mt-10">
          <label className="block text-sm text-[#001D21] font-medium mb-2">
            Upload ID Or Incorporation Documents
          </label>
          <div className="border border-dashed border-[#E2E2FB] rounded-lg p-6 sm:p-8 bg-[#F8FAFE] w-full md:w-1/2 mt-3 transition-colors hover:bg-[#F0F4FA]">
            <input
              type="file"
              accept=".pdf,.docx,.jpg,.png"
              className="hidden"
              id="fileUpload"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="fileUpload"
              className="flex items-center cursor-pointer text-[#2F595C] font-medium"
            >
              <span className="mr-2"><Upload2Icon/></span>
              <span className="text-[13px]">Upload Documents File</span>
              <span className="text-[#748A91] underline ml-2 text-[13px]">choose file</span>
            </label>
            
            {/* Display newly selected file */}
            {file && (
              <div className="mt-3 flex items-center text-sm text-[#001D21] bg-white p-2 rounded border border-gray-100 shadow-sm w-fit">
                <span className="mr-2">📄</span>
                {file.name}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="ml-3 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Display existing file from API */}
            {!file && existingFileUrl && (
                <div className="mt-3 flex items-center text-sm text-[#001D21] bg-white p-2 rounded border border-gray-100 shadow-sm w-fit">
                    <span className="mr-2">📄</span>
                    <a 
                        href={existingFileUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline truncate max-w-xs block"
                    >
                        View Existing Document
                    </a>
                </div>
            )}

          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between w-full md:w-1/2 mt-2 text-xs text-gray-400 gap-1 sm:gap-0">
            <span>Supported file type: .pdf, .docx, .jpg</span>
            <span className="sm:text-right">Maximum Size: 25MB</span>
          </div>
        </div>

        {/* Reference Code / Tax ID */}
        <div className="mb-6 mt-10">
          <label className="block text-sm text-[#001D21] font-medium mb-2">
            Tax ID Or Entity Reference Code (Optional)
          </label>
          <input
            className="w-full md:w-1/3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-[#00F0C3]"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder="Enter Tax ID Or Reference Code"
          />
        </div>

        {/* Note Section */}
        <div className="bg-[#FFFDD080] border border-[#FFC65B] rounded-xl p-6 w-full md:w-1/2">
          <div className="text-[13px] font-semibold text-[#FFC65B] mb-2">Note*</div>
          <ul className="list-disc pl-5 m-0">
            <li className="text-[13px] text-[#748A91]">IRA And Fund-Based Options Can Be Added In Future Phases.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FDECEC] border border-[#FFCFCF] text-[#01373D] text-sm rounded-lg font-semibold cursor-pointer hover:bg-[#FCD8D8] transition-colors disabled:opacity-50"
          >
            <CloseIcon />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00F0C3] text-black text-sm rounded-lg font-medium cursor-pointer shadow-sm hover:shadow-md transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#00D4A8]'}`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SavechangesIcon />
            )}
            {isSaving ? 'Saving...' : (editId ? 'Update & Continue' : 'Save & Continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFeeRecipient;