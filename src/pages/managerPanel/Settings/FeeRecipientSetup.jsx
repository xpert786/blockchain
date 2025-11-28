import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- Inline Icons ---
const FreeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const FeeRecipientSetup = () => {
  const navigate = useNavigate();
  const [feeRecipients, setFeeRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Configuration ---
  const API_URL = "http://168.231.121.7/blockchain-backend/api/syndicate/settings/fee-recipient/";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzIyMjg0LCJpYXQiOjE3NjQzMDQyODQsImp0aSI6IjkyMDRhMGY3ODhjNDRlMDQ5MWE4NjkzZWY3NzlmYTljIiwidXNlcl9pZCI6IjIifQ.6h81mnprtOjPpn2-_mkasbrXSwKwbr7wHkhEC-j6_ag";

  useEffect(() => {
    fetchRecipients();
  }, []);

  const getToken = () => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;
  };

  const fetchRecipients = async () => {
    setIsLoading(true);
    const token = getToken();

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Debug log to check structure
        
        let results = [];
        
        // Handle specific structure: { success: true, data: { ... } }
        if (data.data && !Array.isArray(data.data) && typeof data.data === 'object') {
             results = [data.data];
        } 
        // Handle if 'data' is an array: { success: true, data: [ ... ] }
        else if (data.data && Array.isArray(data.data)) {
             results = data.data;
        }
        // Case 1: API returns a direct array [{}, {}]
        else if (Array.isArray(data)) {
            results = data;
        } 
        // Case 2: API returns paginated object { count: 1, results: [] }
        else if (data.results && Array.isArray(data.results)) {
            results = data.results;
        } 
        // Case 3: API returns a single object at the root (Singleton resource)
        else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            results = [data];
        }

        setFeeRecipients(results);
      } else {
        console.error("Failed to fetch recipients");
        setError("Failed to load recipients.");
      }
    } catch (err) {
      console.error("Error fetching recipients:", err);
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeeRecipients = () => {
    navigate("/manager-panel/settings/AddFeeRecipient");
  };

  const handleDelete = async (id) => {
    if (!id) return;
    
    const confirmDelete = window.confirm("Are you sure you want to delete this fee recipient?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    const token = getToken();

    try {
      // Construct URL: .../fee-recipient/1/
      // Ensure existing API_URL ends with slash or handle it
      const deleteUrl = API_URL.endsWith('/') ? `${API_URL}${id}/` : `${API_URL}/${id}/`;

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Standard for APIs, though curl suggested text/plain, usually APIs accept JSON or empty body for DELETE
        },
      });

      if (response.ok) {
        // Remove from local state to update UI immediately
        setFeeRecipients(prevRecipients => prevRecipients.filter(recipient => recipient.id !== id));
      } else {
        alert("Failed to delete recipient. Please try again.");
        console.error("Delete failed status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting recipient:", error);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full border border-gray-100">
        <div className="flex items-center justify-center sm:justify-start">
            <div className="p-2 bg-[#F4F6F5] rounded-full">
                <FreeIcon />
            </div>
        </div>
        <div>
          <h4 className="text-base sm:text-lg text-[#001D21] font-semibold">Fee Recipient</h4>
          <p className="text-xs sm:text-[13px] text-[#748A91] mt-0.5">Who receives carry and/or management fees</p>
        </div>
      </div>

      {/* Add Fee Recipients Section - White Card */}
      <div className="bg-white rounded-xl p-6 mb-8 w-full border border-gray-100 shadow-sm">
        <h3 className="text-lg text-[#001D21] mb-3 font-semibold">Add Fee Recipients</h3>
        <p className="text-[#748A91] mb-4 text-[13px] leading-relaxed max-w-3xl">
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
        </p>
        
        <div className="flex flex-col items-start gap-2">
            <button
            onClick={handleAddFeeRecipients}
            disabled={feeRecipients.length > 0}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors ${
                feeRecipients.length > 0 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                : "bg-[#00F0C3] text-black hover:bg-[#00D4A8] cursor-pointer"
            }`}
            >
            <PlusIcon />
            <span>Add Fee Recipients</span>
            </button>
            
            {feeRecipients.length > 0 && (
                <p className="text-xs text-orange-600 font-medium ml-1">
                    Recipient already exists.
                </p>
            )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h3 className="text-lg text-[#001D21] font-semibold ml-1">Existing Recipients</h3>
        
        {isLoading ? (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
                {error}
            </div>
        ) : feeRecipients.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 italic">
                No fee recipients found.
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {feeRecipients.map((recipient, index) => (
                    <div key={recipient.id || index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h5 className="text-[#001D21] font-semibold text-base">
                                {recipient.entity_name || recipient.first_name || "Unknown Entity"}
                            </h5>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-[#748A91]">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C3]"></span>
                                    {recipient.recipient_type_display || recipient.recipient_type || "Individual"}
                                </span>
                                {recipient.residence && (
                                    <span className="flex items-center gap-1">
                                        <span className="text-gray-300">|</span>
                                        {recipient.residence}
                                    </span>
                                )}
                                {recipient.tax_id && (
                                    <span className="flex items-center gap-1">
                                        <span className="text-gray-300">|</span>
                                        ID: {recipient.tax_id}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Status / Actions */}
                        <div className="flex items-center gap-3">
                             <div className="px-3 py-1 bg-[#F4F6F5] text-[#001D21] text-xs rounded-full font-medium">
                                Active
                             </div>
                             
                             <button 
                                onClick={() => handleDelete(recipient.id)}
                                disabled={isDeleting}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors cursor-pointer group"
                                title="Delete Recipient"
                             >
                                <TrashIcon />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default FeeRecipientSetup;